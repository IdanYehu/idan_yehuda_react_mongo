import Tool from '../models/tool.model.js';

// קבלת כלים של משתמש ספציפי
const getUserTools = async (userId) => {
    try {
        return await Tool.find({ owner: userId }).populate('borrowedBy', 'name email');
    } catch (error) {
        throw error;
    }
};

// קבלת כלים זמינים (ללא כים של המשתמש הנוכחי)
const getAvailableTools = async (currentUserId) => {
    try {
        return await Tool.find({ 
            owner: { $ne: currentUserId },
            isAvailable: true 
        }).populate('owner', 'name email');
    } catch (error) {
        throw error;
    }
};

// קבלת כלים שאולים על ידי משתמש
const getBorrowedTools = async (userId) => {
    try {
        return await Tool.find({ borrowedBy: userId }).populate('owner', 'name email');
    } catch (error) {
        throw error;
    }
};

// יצירת כלי חדש
const createTool = async (toolData) => {
    try {
        const tool = new Tool(toolData);
        return await tool.save();
    } catch (error) {
        throw error;
    }
};

// עדכון כלי
const updateTool = async (toolId, userId, updateData) => {
    try {
        return await Tool.findOneAndUpdate(
            { _id: toolId, owner: userId },
            updateData,
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};

// מחיקת כלי
const deleteTool = async (toolId, userId) => {
    try {
        return await Tool.findOneAndDelete({ _id: toolId, owner: userId });
    } catch (error) {
        throw error;
    }
};

// השאלת כלי
const borrowTool = async (toolId, borrowerId) => {
    try {
        return await Tool.findByIdAndUpdate(
            toolId,
            {
                isAvailable: false,
                borrowedBy: borrowerId,
                borrowedDate: new Date()
            },
            { new: true }
        ).populate('owner', 'name email');
    } catch (error) {
        throw error;
    }
};

// החזרת כלי
const returnTool = async (toolId, borrowerId) => {
    try {
        return await Tool.findOneAndUpdate(
            { _id: toolId, borrowedBy: borrowerId },
            {
                isAvailable: true,
                borrowedBy: null,
                borrowedDate: null
            },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};

// שינוי זמינות כלי (רק בעלים)
const toggleToolAvailability = async (toolId, userId) => {
    try {
        const tool = await Tool.findOne({ _id: toolId, owner: userId });
        if (!tool) {
            throw new Error('Tool not found or not owned by user');
        }
        
        tool.isAvailable = !tool.isAvailable;
        if (!tool.isAvailable) {
            tool.borrowedBy = null;
            tool.borrowedDate = null;
        }
        
        return await tool.save();
    } catch (error) {
        throw error;
    }
};

// קבלת כלי לפי מזהה
const getToolById = async (toolId) => {
    try {
        return await Tool.findById(toolId).populate('owner', 'name email').populate('borrowedBy', 'name email').populate('borrowRequest.userId', 'name email');
    } catch (error) {
        throw error;
    }
};

// עדכון סטטוס כלי
const updateToolStatus = async (toolId, status, additionalData = {}) => {
    try {
        return await Tool.findByIdAndUpdate(
            toolId,
            { 
                status,
                ...additionalData
            },
            { new: true }
        ).populate('owner', 'name email').populate('borrowedBy', 'name email').populate('borrowRequest.userId', 'name email');
    } catch (error) {
        throw error;
    }
};

export default {
    getUserTools,
    getAvailableTools,
    getBorrowedTools,
    createTool,
    updateTool,
    deleteTool,
    borrowTool,
    returnTool,
    toggleToolAvailability,
    getToolById,
    updateToolStatus
};
