import React, { useState, useEffect } from 'react';
import { toolService } from '../services/toolService';
import { useAuthStore } from '../store/authStore';
import { useRefresh } from '../contexts/PendingRequestsContext';
import { Card } from '../components/Reusables/Card';
import Loader from '../components/Reusables/Loader';

const PendingRequestsPage = () => {
    const [pendingRequests, setPendingRequests] = useState({ borrowRequests: [], returnRequests: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuthStore();
    const { refresh } = useRefresh();

    useEffect(() => {
        loadPendingRequests();
    }, []);

    const loadPendingRequests = async () => {
        try {
            setIsLoading(true);
            const response = await toolService.getPendingRequests();
            if (response.success) {
                setPendingRequests(response.data);
            } else {
                setError(response.message || 'שגיאה בטעינת בקשות ממתינות');
            }
        } catch (err) {
            console.error('Error loading pending requests:', err);
            setError('שגיאה בטעינת בקשות ממתינות');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproveBorrow = async (toolId) => {
        try {
            const response = await toolService.approveBorrowRequest(toolId);
            if (response.success) {
                await loadPendingRequests(); // רענון הרשימה
                refresh(); // רענון מונה ההתראות
            } else {
                setError(response.message || 'שגיאה באישור בקשת השאלה');
            }
        } catch (err) {
            console.error('Error approving borrow request:', err);
            setError('שגיאה באישור בקשת השאלה');
        }
    };

    const handleRejectBorrow = async (toolId) => {
        try {
            const response = await toolService.rejectBorrowRequest(toolId);
            if (response.success) {
                await loadPendingRequests(); // רענון הרשימה
                refresh(); // רענון מונה ההתראות
            } else {
                setError(response.message || 'שגיאה בדחיית בקשת השאלה');
            }
        } catch (err) {
            console.error('Error rejecting borrow request:', err);
            setError('שגיאה בדחיית בקשת השאלה');
        }
    };

    const handleApproveReturn = async (toolId) => {
        try {
            const response = await toolService.approveReturnRequest(toolId);
            if (response.success) {
                await loadPendingRequests(); // רענון הרשימה
                refresh(); // רענון מונה ההתראות
            } else {
                setError(response.message || 'שגיאה באישור בקשת החזרה');
            }
        } catch (err) {
            console.error('Error approving return request:', err);
            setError('שגיאה באישור בקשת החזרה');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending_borrow':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'pending_return':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'borrowed':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending_borrow':
                return 'ממתין לאישור השאלה';
            case 'pending_return':
                return 'ממתין לאישור החזרה';
            case 'borrowed':
                return 'מושאל';
            case 'available':
                return 'זמין';
            default:
                return status;
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">בקשות ממתינות לאישור</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* בקשות השאלה */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">בקשות השאלה</h2>
                {pendingRequests.borrowRequests.length === 0 ? (
                    <Card>
                        <p className="text-gray-500 text-center py-4">אין בקשות השאלה ממתינות</p>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pendingRequests.borrowRequests.map((tool) => (
                            <Card key={tool._id} className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-lg text-gray-800">{tool.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(tool.status)}`}>
                                        {getStatusText(tool.status)}
                                    </span>
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                    <p><span className="font-medium">קטגוריה:</span> {tool.category}</p>
                                    {tool.brand && <p><span className="font-medium">מותג:</span> {tool.brand}</p>}
                                    {tool.borrowRequest?.userId && (
                                        <p><span className="font-medium">מבקש:</span> {tool.borrowRequest.userId.name || tool.borrowRequest.userId.email}</p>
                                    )}
                                    <p><span className="font-medium">תאריך בקשה:</span> {new Date(tool.borrowRequest?.requestDate).toLocaleDateString('he-IL')}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApproveBorrow(tool._id)}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                                    >
                                        אישור
                                    </button>
                                    <button
                                        onClick={() => handleRejectBorrow(tool._id)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                                    >
                                        דחייה
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* בקשות החזרה */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">בקשות החזרה</h2>
                {pendingRequests.returnRequests.length === 0 ? (
                    <Card>
                        <p className="text-gray-500 text-center py-4">אין בקשות החזרה ממתינות</p>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pendingRequests.returnRequests.map((tool) => (
                            <Card key={tool._id} className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-lg text-gray-800">{tool.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(tool.status)}`}>
                                        {getStatusText(tool.status)}
                                    </span>
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                    <p><span className="font-medium">קטגוריה:</span> {tool.category}</p>
                                    {tool.brand && <p><span className="font-medium">מותג:</span> {tool.brand}</p>}
                                    {tool.borrowedBy && (
                                        <p><span className="font-medium">מוחזר על ידי:</span> {tool.borrowedBy.name || tool.borrowedBy.email}</p>
                                    )}
                                    <p><span className="font-medium">תאריך בקשת החזרה:</span> {new Date(tool.returnRequest?.requestDate).toLocaleDateString('he-IL')}</p>
                                    <p><span className="font-medium">תאריך השאלה:</span> {new Date(tool.borrowedDate).toLocaleDateString('he-IL')}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApproveReturn(tool._id)}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                                    >
                                        אישור החזרה
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingRequestsPage;
