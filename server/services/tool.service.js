import toolDAL from '../dal/tool.dal.js';

// שירות קבלת כלים של משתמש
const getUserTools = async (userId) => {
    try {
        const tools = await toolDAL.getUserTools(userId);
        return {
            success: true,
            data: tools
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// שירות קבלת כלים זמינים
const getAvailableTools = async (currentUserId) => {
    try {
        const tools = await toolDAL.getAvailableTools(currentUserId);
        return {
            success: true,
            data: tools
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// שירות קבלת כלים שאולים
const getBorrowedTools = async (userId) => {
    try {
        const tools = await toolDAL.getBorrowedTools(userId);
        return {
            success: true,
            data: tools
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// קבלת בקשות ממתינות לאישור (עבור הבעלים)
const getPendingRequests = async (userId) => {
    try {
        const userTools = await toolDAL.getUserTools(userId);
        const pendingBorrowRequests = userTools.filter(tool => tool.status === 'pending_borrow');
        const pendingReturnRequests = userTools.filter(tool => tool.status === 'pending_return');
        
        return {
            success: true,
            data: {
                borrowRequests: pendingBorrowRequests,
                returnRequests: pendingReturnRequests
            }
        };
    } catch (error) {
        return {
            success: false,
            message: 'שגיאה בקבלת בקשות ממתינות: ' + error.message
        };
    }
};

// קבלת מספר הבקשות הממתינות (עבור התראה)
const getPendingRequestsCount = async (userId) => {
    try {
        const userTools = await toolDAL.getUserTools(userId);
        const pendingBorrowCount = userTools.filter(tool => tool.status === 'pending_borrow').length;
        const pendingReturnCount = userTools.filter(tool => tool.status === 'pending_return').length;
        const totalPendingCount = pendingBorrowCount + pendingReturnCount;
        
        return {
            success: true,
            data: {
                borrowCount: pendingBorrowCount,
                returnCount: pendingReturnCount,
                totalCount: totalPendingCount
            }
        };
    } catch (error) {
        return {
            success: false,
            message: 'שגיאה בקבלת מספר בקשות ממתינות: ' + error.message
        };
    }
};

// שירות יצירת כלי חדש
const createTool = async (toolData, userId) => {
    try {
        const newTool = await toolDAL.createTool({
            ...toolData,
            owner: userId
        });
        return {
            success: true,
            data: newTool,
            message: 'הכלי נוסף בהצלחה'
        };
    } catch (error) {
        return {
            success: false,
            message: 'שגיאה ביצירת הכלי: ' + error.message
        };
    }
};

// שירות עדכון כלי
const updateTool = async (toolId, userId, updateData) => {
    try {
        const updatedTool = await toolDAL.updateTool(toolId, userId, updateData);
        if (!updatedTool) {
            return {
                success: false,
                message: 'כלי לא נמצא או שאינך הבעלים'
            };
        }
        return {
            success: true,
            data: updatedTool,
            message: 'הכלי עודכן בהצלחה'
        };
    } catch (error) {
        return {
            success: false,
            message: 'שגיאה בעדכון הכלי: ' + error.message
        };
    }
};

// שירות מחיקת כלי
const deleteTool = async (toolId, userId) => {
    try {
        const deletedTool = await toolDAL.deleteTool(toolId, userId);
        if (!deletedTool) {
            return {
                success: false,
                message: 'כלי לא נמצא או שאינך הבעלים'
            };
        }
        return {
            success: true,
            message: 'הכלי נמחק בהצלחה'
        };
    } catch (error) {
        return {
            success: false,
            message: 'שגיאה במחיקת הכלי: ' + error.message
        };
    }
};

// שירות בקשת השאלת כלי
const requestBorrowTool = async (toolId, borrowerId) => {
    try {
        const tool = await toolDAL.getToolById(toolId);
        if (!tool) {
            return {
                success: false,
                message: 'כלי לא נמצא'
            };
        }
        
        if (tool.owner.toString() === borrowerId.toString()) {
            return {
                success: false,
                message: 'לא ניתן לשאול כלי משלך'
            };
        }
        
        if (tool.status !== 'available') {
            return {
                success: false,
                message: 'הכלי לא זמין כרגע'
            };
        }

        const updatedTool = await toolDAL.updateToolStatus(toolId, 'pending_borrow', {
            borrowRequest: {
                userId: borrowerId,
                requestDate: new Date()
            }
        });
        
        return {
            success: true,
            data: updatedTool,
            message: 'בקשת השאלה נשלחה לבעלים'
        };
    } catch (error) {
        return {
            success: false,
            message: 'שגיאה בשליחת בקשת השאלה: ' + error.message
        };
    }
};

// שירות אישור השאלת כלי (על ידי הבעלים)
const approveBorrowRequest = async (toolId, ownerId) => {
    try {
        console.log('approveBorrowRequest Service - Tool ID:', toolId);
        console.log('approveBorrowRequest Service - Owner ID:', ownerId);
        
        const tool = await toolDAL.getToolById(toolId);
        console.log('approveBorrowRequest Service - Found tool:', tool ? 'Yes' : 'No');
        
        if (!tool) {
            return {
                success: false,
                message: 'כלי לא נמצא'
            };
        }
        
        console.log('Tool owner:', tool.owner);
        console.log('Current user:', ownerId);
        console.log('Tool owner ID:', tool.owner._id || tool.owner);
        console.log('Are they equal?', (tool.owner._id || tool.owner).toString() === ownerId.toString());
        
        // התיקון: אם tool.owner הוא אובייקט עם _id, נשתמש ב-_id
        const ownerIdToCompare = tool.owner._id || tool.owner;
        
        if (ownerIdToCompare.toString() !== ownerId.toString()) {
            return {
                success: false,
                message: 'רק הבעלים יכול לאשר השאלה'
            };
        }
        
        console.log('Tool status:', tool.status);
        
        if (tool.status !== 'pending_borrow') {
            return {
                success: false,
                message: 'אין בקשת השאלה ממתינה'
            };
        }

        const updatedTool = await toolDAL.updateToolStatus(toolId, 'borrowed', {
            borrowedBy: tool.borrowRequest.userId,
            borrowedDate: new Date(),
            isAvailable: false,
            borrowRequest: {
                userId: null,
                requestDate: null
            }
        });
        
        return {
            success: true,
            data: updatedTool,
            message: 'בקשת השאלה אושרה'
        };
    } catch (error) {
        return {
            success: false,
            message: 'שגיאה באישור השאלה: ' + error.message
        };
    }
};

// שירות דחיית בקשת השאלה
const rejectBorrowRequest = async (toolId, ownerId) => {
    try {
        const tool = await toolDAL.getToolById(toolId);
        if (!tool) {
            return {
                success: false,
                message: 'כלי לא נמצא'
            };
        }
        
        // התיקון: אם tool.owner הוא אובייקט עם _id, נשתמש ב-_id
        const ownerIdToCompare = tool.owner._id || tool.owner;
        
        if (ownerIdToCompare.toString() !== ownerId.toString()) {
            return {
                success: false,
                message: 'רק הבעלים יכול לדחות השאלה'
            };
        }
        
        if (tool.status !== 'pending_borrow') {
            return {
                success: false,
                message: 'אין בקשת השאלה ממתינה'
            };
        }

        const updatedTool = await toolDAL.updateToolStatus(toolId, 'available', {
            borrowRequest: {
                userId: null,
                requestDate: null
            }
        });
        
        return {
            success: true,
            data: updatedTool,
            message: 'בקשת השאלה נדחתה'
        };
    } catch (error) {
        return {
            success: false,
            message: 'שגיאה בדחיית השאלה: ' + error.message
        };
    }
};

// שירות בקשת החזרת כלי
const requestReturnTool = async (toolId, borrowerId) => {
    try {
        console.log('requestReturnTool Service - Tool ID:', toolId);
        console.log('requestReturnTool Service - Borrower ID:', borrowerId);
        
        const tool = await toolDAL.getToolById(toolId);
        console.log('requestReturnTool Service - Found tool:', tool ? 'Yes' : 'No');
        
        if (!tool) {
            return {
                success: false,
                message: 'כלי לא נמצא'
            };
        }
        
        console.log('Tool borrowedBy:', tool.borrowedBy);
        console.log('Current user:', borrowerId);
        console.log('Tool borrowedBy ID:', tool.borrowedBy._id || tool.borrowedBy);
        
        // התיקון: אם tool.borrowedBy הוא אובייקט עם _id, נשתמש ב-_id
        const borrowedByIdToCompare = tool.borrowedBy._id || tool.borrowedBy;
        
        if (borrowedByIdToCompare.toString() !== borrowerId.toString()) {
            return {
                success: false,
                message: 'לא שאלת כלי זה'
            };
        }
        
        console.log('Tool status:', tool.status);
        
        if (tool.status !== 'borrowed') {
            return {
                success: false,
                message: 'הכלי לא נמצא בהשאלה'
            };
        }

        const updatedTool = await toolDAL.updateToolStatus(toolId, 'pending_return', {
            returnRequest: {
                requestDate: new Date()
            }
        });
        
        return {
            success: true,
            data: updatedTool,
            message: 'בקשת החזרה נשלחה לבעלים'
        };
    } catch (error) {
        return {
            success: false,
            message: 'שגיאה בשליחת בקשת החזרה: ' + error.message
        };
    }
};

// שירות אישור החזרת כלי (על ידי הבעלים)
const approveReturnRequest = async (toolId, ownerId) => {
    try {
        const tool = await toolDAL.getToolById(toolId);
        if (!tool) {
            return {
                success: false,
                message: 'כלי לא נמצא'
            };
        }
        
        // התיקון: אם tool.owner הוא אובייקט עם _id, נשתמש ב-_id
        const ownerIdToCompare = tool.owner._id || tool.owner;
        
        if (ownerIdToCompare.toString() !== ownerId.toString()) {
            return {
                success: false,
                message: 'רק הבעלים יכול לאשר החזרה'
            };
        }
        
        if (tool.status !== 'pending_return') {
            return {
                success: false,
                message: 'אין בקשת החזרה ממתינה'
            };
        }

        const updatedTool = await toolDAL.updateToolStatus(toolId, 'available', {
            borrowedBy: null,
            borrowedDate: null,
            isAvailable: true,
            returnRequest: {
                requestDate: null
            }
        });
        
        return {
            success: true,
            data: updatedTool,
            message: 'בקשת החזרה אושרה'
        };
    } catch (error) {
        return {
            success: false,
            message: 'שגיאה באישור החזרה: ' + error.message
        };
    }
};

// שירות החזרת כלי (פונקציה ישנה - נשמור לתאימות לאחור)
const returnTool = async (toolId, borrowerId) => {
    try {
        const returnedTool = await toolDAL.returnTool(toolId, borrowerId);
        if (!returnedTool) {
            return {
                success: false,
                message: 'כלי לא נמצא או שלא שאלת אותו'
            };
        }
        return {
            success: true,
            data: returnedTool,
            message: 'הכלי הוחזר בהצלחה'
        };
    } catch (error) {
        return {
            success: false,
            message: 'שגיאה בהחזרת הכלי: ' + error.message
        };
    }
};

// שירות שינוי זמינות כלי
const toggleToolAvailability = async (toolId, userId) => {
    try {
        const updatedTool = await toolDAL.toggleToolAvailability(toolId, userId);
        return {
            success: true,
            data: updatedTool,
            message: `הכלי סומן כ${updatedTool.isAvailable ? 'זמין' : 'לא זמין'}`
        };
    } catch (error) {
        return {
            success: false,
            message: 'שגיאה בשינוי זמינות: ' + error.message
        };
    }
};

export default {
    getUserTools,
    getAvailableTools,
    getBorrowedTools,
    getPendingRequests,
    getPendingRequestsCount,
    createTool,
    updateTool,
    deleteTool,
    requestBorrowTool,
    approveBorrowRequest,
    rejectBorrowRequest,
    requestReturnTool,
    approveReturnRequest,
    returnTool, // שמירה לתאימות לאחור
    toggleToolAvailability
};
