import toolService from '../services/tool.service.js';
import { controllerTryCatch } from '../utils/tryCatch.js';

// קבלת כלים של המשתמש
const getUserTools = controllerTryCatch(async (req, res) => {
    const result = await toolService.getUserTools(req.user._id);
    
    if (result.success) {
        return {
            success: true,
            data: result.data
        };
    } else {
        throw new Error(result.message || 'Failed to get user tools');
    }
});

// קבלת כלים זמינים להשאלה
const getAvailableTools = controllerTryCatch(async (req, res) => {
    const result = await toolService.getAvailableTools(req.user._id);
    
    if (result.success) {
        return {
            success: true,
            data: result.data
        };
    } else {
        throw new Error(result.message || 'Failed to get available tools');
    }
});

// קבלת כלים שאולים
const getBorrowedTools = controllerTryCatch(async (req, res) => {
    const result = await toolService.getBorrowedTools(req.user._id);
    
    if (result.success) {
        return {
            success: true,
            data: result.data
        };
    } else {
        throw new Error(result.message || 'Failed to get borrowed tools');
    }
});

// קבלת בקשות ממתינות לאישור
const getPendingRequests = controllerTryCatch(async (req, res) => {
    const result = await toolService.getPendingRequests(req.user._id);
    
    if (result.success) {
        return {
            success: true,
            data: result.data
        };
    } else {
        throw new Error(result.message || 'Failed to get pending requests');
    }
});

// קבלת מספר בקשות ממתינות לאישור
const getPendingRequestsCount = controllerTryCatch(async (req, res) => {
    const result = await toolService.getPendingRequestsCount(req.user._id);
    
    if (result.success) {
        return {
            success: true,
            data: result.data
        };
    } else {
        throw new Error(result.message || 'Failed to get pending requests count');
    }
});

// יצירת כלי חדש
const createTool = controllerTryCatch(async (req, res) => {
    const { name, category, brand, rating, notes } = req.body;
    
    if (!name || !category) {
        throw new Error('שם הכלי וקטגוריה הם שדות חובה');
    }

    const result = await toolService.createTool({
        name,
        category,
        brand,
        rating: parseInt(rating) || 0,
        notes
    }, req.user._id);
    
    if (result.success) {
        return result;
    } else {
        throw new Error(result.message || 'Failed to create tool');
    }
}, 201);

// עדכון כלי
const updateTool = controllerTryCatch(async (req, res) => {
    const { id } = req.params;
    const { name, category, brand, rating, notes } = req.body;
    
    const result = await toolService.updateTool(id, req.user._id, {
        name,
        category,
        brand,
        rating: parseInt(rating) || 0,
        notes
    });
    
    if (result.success) {
        return result;
    } else {
        throw new Error(result.message || 'Failed to update tool');
    }
});

// מחיקת כלי
const deleteTool = controllerTryCatch(async (req, res) => {
    const { id } = req.params;
    
    const result = await toolService.deleteTool(id, req.user._id);
    
    if (result.success) {
        return result;
    } else {
        throw new Error(result.message || 'Failed to delete tool');
    }
});

// השאלת כלי
const borrowTool = controllerTryCatch(async (req, res) => {
    const { id } = req.params;
    
    const result = await toolService.borrowTool(id, req.user._id);
    
    if (result.success) {
        return result;
    } else {
        throw new Error(result.message || 'Failed to borrow tool');
    }
});

// החזרת כלי
const returnTool = controllerTryCatch(async (req, res) => {
    const { id } = req.params;
    
    const result = await toolService.returnTool(id, req.user._id);
    
    if (result.success) {
        return result;
    } else {
        throw new Error(result.message || 'Failed to return tool');
    }
});

// שינוי זמינות כלי
const toggleToolAvailability = controllerTryCatch(async (req, res) => {
    const { id } = req.params;
    
    const result = await toolService.toggleToolAvailability(id, req.user._id);
    
    if (result.success) {
        return result;
    } else {
        throw new Error(result.message || 'Failed to toggle tool availability');
    }
});

// בקשת השאלת כלי
const requestBorrowTool = controllerTryCatch(async (req, res) => {
    const { id } = req.params;
    
    const result = await toolService.requestBorrowTool(id, req.user._id);
    
    if (result.success) {
        return result;
    } else {
        throw new Error(result.message || 'Failed to request borrow tool');
    }
});

// אישור בקשת השאלה
const approveBorrowRequest = controllerTryCatch(async (req, res) => {
    const { id } = req.params;
    
    console.log('approveBorrowRequest - Tool ID:', id);
    console.log('approveBorrowRequest - User ID:', req.user._id);
    
    const result = await toolService.approveBorrowRequest(id, req.user._id);
    
    console.log('approveBorrowRequest - Result:', result);
    
    if (result.success) {
        return result;
    } else {
        throw new Error(result.message || 'Failed to approve borrow request');
    }
});

// דחיית בקשת השאלה
const rejectBorrowRequest = controllerTryCatch(async (req, res) => {
    const { id } = req.params;
    
    const result = await toolService.rejectBorrowRequest(id, req.user._id);
    
    if (result.success) {
        return result;
    } else {
        throw new Error(result.message || 'Failed to reject borrow request');
    }
});

// בקשת החזרת כלי
const requestReturnTool = controllerTryCatch(async (req, res) => {
    const { id } = req.params;
    
    console.log('requestReturnTool Controller - Tool ID:', id);
    console.log('requestReturnTool Controller - User ID:', req.user._id);
    
    const result = await toolService.requestReturnTool(id, req.user._id);
    
    console.log('requestReturnTool Controller - Result:', result);
    
    if (result.success) {
        return result;
    } else {
        throw new Error(result.message || 'Failed to request return tool');
    }
});

// אישור בקשת החזרה
const approveReturnRequest = controllerTryCatch(async (req, res) => {
    const { id } = req.params;
    
    const result = await toolService.approveReturnRequest(id, req.user._id);
    
    if (result.success) {
        return result;
    } else {
        throw new Error(result.message || 'Failed to approve return request');
    }
});

export {
    getUserTools,
    getAvailableTools,
    getBorrowedTools,
    getPendingRequests,
    getPendingRequestsCount,
    createTool,
    updateTool,
    deleteTool,
    borrowTool,
    returnTool,
    toggleToolAvailability,
    requestBorrowTool,
    approveBorrowRequest,
    rejectBorrowRequest,
    requestReturnTool,
    approveReturnRequest
};
