import api from './api.js';

const toolService = {
    // קבלת הכלים שלי
    getMyTools: async () => {
        const response = await api.get('/tools/my-tools');
        return response.data;
    },

    // קבלת כלים זמינים להשאלה
    getAvailableTools: async () => {
        const response = await api.get('/tools/available');
        return response.data;
    },

    // קבלת כלים שאולים
    getBorrowedTools: async () => {
        const response = await api.get('/tools/borrowed');
        return response.data;
    },

    // קבלת בקשות ממתינות
    getPendingRequests: async () => {
        const response = await api.get('/tools/pending-requests');
        return response.data;
    },

    // קבלת מספר בקשות ממתינות
    getPendingRequestsCount: async () => {
        const response = await api.get('/tools/pending-count');
        return response.data;
    },

    // הוספת כלי חדש
    createTool: async (toolData) => {
        const response = await api.post('/tools', toolData);
        return response.data;
    },

    // עדכון כלי
    updateTool: async (toolId, toolData) => {
        const response = await api.put(`/tools/${toolId}`, toolData);
        return response.data;
    },

    // מחיקת כלי
    deleteTool: async (toolId) => {
        const response = await api.delete(`/tools/${toolId}`);
        return response.data;
    },

    // בקשת השאלת כלי
    requestBorrowTool: async (toolId) => {
        const response = await api.post(`/tools/${toolId}/request-borrow`);
        return response.data;
    },

    // אישור בקשת השאלה
    approveBorrowRequest: async (toolId) => {
        const response = await api.post(`/tools/${toolId}/approve-borrow`);
        return response.data;
    },

    // דחיית בקשת השאלה
    rejectBorrowRequest: async (toolId) => {
        const response = await api.post(`/tools/${toolId}/reject-borrow`);
        return response.data;
    },

    // בקשת החזרת כלי
    requestReturnTool: async (toolId) => {
        const response = await api.post(`/tools/${toolId}/request-return`);
        return response.data;
    },

    // אישור בקשת החזרה
    approveReturnRequest: async (toolId) => {
        const response = await api.post(`/tools/${toolId}/approve-return`);
        return response.data;
    }
};

export { toolService };
