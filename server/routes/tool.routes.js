import express from 'express';
import { auth } from '../utils/token.js';
import {
    getUserTools,
    getAvailableTools,
    getBorrowedTools,
    getPendingRequests,
    getPendingRequestsCount,
    createTool,
    updateTool,
    deleteTool,
    toggleToolAvailability,
    borrowTool,
    returnTool,
    requestBorrowTool,
    approveBorrowRequest,
    rejectBorrowRequest,
    requestReturnTool,
    approveReturnRequest
} from '../controllers/tool.controller.js';

const router = express.Router();

// כל הנתיבים דורשים אימות
router.use(auth);

// נתיבי כלים
router.get('/my-tools', getUserTools);                  // הכלים שלי
router.get('/available', getAvailableTools);           // כלים זמינים להשאלה
router.get('/borrowed', getBorrowedTools);              // כלים שאולים שלי
router.get('/pending-requests', getPendingRequests);   // בקשות ממתינות לאישור
router.get('/pending-count', getPendingRequestsCount); // מספר בקשות ממתינות

router.post('/', createTool);                           // הוספת כלי
router.put('/:id', updateTool);                         // עדכון כלי
router.delete('/:id', deleteTool);                      // מחיקת כלי
router.patch('/:id/toggle-availability', toggleToolAvailability); // שינוי זמינות

// נתיבי השאלה חדשים
router.post('/:id/request-borrow', requestBorrowTool);              // בקשת השאלה
router.post('/:id/approve-borrow', approveBorrowRequest);           // אישור השאלה
router.post('/:id/reject-borrow', rejectBorrowRequest);             // דחיית השאלה

// נתיבי החזרה חדשים  
router.post('/:id/request-return', requestReturnTool);              // בקשת החזרה
router.post('/:id/approve-return', approveReturnRequest);           // אישור החזרה

// נתיבים ישנים (לתאימות לאחור)
router.post('/:id/borrow', borrowTool);                 // השאלת כלי ישן
router.post('/:id/return', returnTool);                 // החזרת כלי

export default router;
