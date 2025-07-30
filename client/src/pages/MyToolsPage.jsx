import { useEffect, useState } from 'react';
import { FaPlus, FaWrench, FaEdit, FaTrash } from 'react-icons/fa';

import Loader from '@components/Reusables/Loader';
import Error from '@components/Reusables/Error';

import { useAuthStore } from '@store/authStore';
import { toolService } from '@services/toolService';
import { useRefresh } from '../contexts/PendingRequestsContext';

const MyToolsPage = () => {
    const [myTools, setMyTools] = useState([]);
    const [borrowedTools, setBorrowedTools] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingTool, setEditingTool] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState('myTools'); // 'myTools' או 'borrowed'
    const [newTool, setNewTool] = useState({
        name: '',
        category: 'כלים חשמליים',
        brand: '',
        rating: 0,
        notes: ''
    });

    const { user } = useAuthStore();
    const { refresh } = useRefresh();

    // קטגוריות קבועות
    const categories = [
        'כלים חשמליים',
        'כלים ידניים', 
        'כלי מדידה',
        'כלים נטענים'
    ];

    // Debug - בדיקת מצב האימות
    useEffect(() => {
        console.log('User state:', user);
        const token = localStorage.getItem('token');
        console.log('Token in localStorage:', token);
    }, [user]);

    // טעינת כלים מהשרת
    useEffect(() => {
        if (user) {
            loadMyTools();
            loadBorrowedTools();
        }
    }, [user]);

    const loadMyTools = async () => {
        try {
            setIsLoading(true);
            const response = await toolService.getMyTools();
            if (response.success) {
                setMyTools(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('שגיאה בטעינת הכלים');
            console.error('Error loading tools:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const loadBorrowedTools = async () => {
        try {
            const response = await toolService.getBorrowedTools();
            if (response.success) {
                setBorrowedTools(response.data);
            }
        } catch (err) {
            console.error('Error loading borrowed tools:', err);
        }
    };

    const handleAddTool = async () => {
        console.log('מנסה להוסיף כלי:', newTool);
        console.log('User:', user);
        console.log('Token from localStorage:', localStorage.getItem('token'));
        
        if (!user) {
            setError('עליך להתחבר כדי להוסיף כלי');
            return;
        }
        
        if (newTool.name && newTool.category) {
            try {
                setIsLoading(true);
                console.log('שולח בקשה לשרת...');
                const response = await toolService.createTool(newTool);
                console.log('תגובה מהשרת:', response);
                if (response.success) {
                    setMyTools([response.data, ...myTools]);
                    setNewTool({ name: '', category: 'כלים חשמליים', brand: '', rating: 0, notes: '' });
                    setShowAddForm(false);
                    setSuccessMessage('הכלי נוסף בהצלחה!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                console.error('שגיאה מפורטת:', err);
                if (err.response?.status === 401) {
                    setError('אינך מחובר למערכת. אנא התחבר שוב.');
                } else {
                    setError('שגיאה בהוספת הכלי: ' + err.message);
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            setError('נא למלא את השדות החובה');
        }
    };

    const handleDeleteTool = async (id) => {
        try {
            const response = await toolService.deleteTool(id);
            if (response.success) {
                setMyTools(myTools.filter(tool => tool._id !== id));
                setSuccessMessage('הכלי נמחק בהצלחה!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('שגיאה במחיקת הכלי');
            console.error('Error deleting tool:', err);
        }
    };

    const handleEditTool = (tool) => {
        setEditingTool({ ...tool });
        setShowEditForm(true);
    };

    const handleUpdateTool = async () => {
        if (editingTool.name && editingTool.category) {
            try {
                const response = await toolService.updateTool(editingTool._id, editingTool);
                if (response.success) {
                    const updatedTools = myTools.map(tool => 
                        tool._id === editingTool._id ? response.data : tool
                    );
                    setMyTools(updatedTools);
                    setShowEditForm(false);
                    setEditingTool(null);
                    setSuccessMessage('הכלי עודכן בהצלחה!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError('שגיאה בעדכון הכלי');
                console.error('Error updating tool:', err);
            }
        }
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditingTool(null);
    };

    const handleReturnBorrowedTool = async (toolId) => {
        try {
            const response = await toolService.requestReturnTool(toolId);
            if (response.success) {
                // רענון רשימת הכלים השאולים לראות את הסטטוס החדש
                await loadBorrowedTools();
                refresh(); // רענון מונה ההתראות
                setSuccessMessage('בקשת החזרה נשלחה לבעלים!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('שגיאה בשליחת בקשת החזרה');
            console.error('Error requesting return:', err);
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
            case 'available':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-green-100 text-green-800 border-green-300';
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
                return 'זמין';
        }
    };

    return (
        <div className="p-6 text-black max-w-6xl mx-auto">
            {/* בדיקה אם המשתמש מחובר */}
            {!user ? (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">עליך להתחבר למערכת</h2>
                    <p className="text-gray-600 mb-6">כדי לגשת לדף הכלים שלך, עליך להתחבר תחילה</p>
                    <a href="/" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg inline-block">
                        עבור לדף התחברות
                    </a>
                </div>
            ) : (
                <>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">ניהול כלים</h1>
                    <p className="text-lg text-gray-600">כלי העבודה שלך וכלים שאולים</p>
                </div>
                {activeTab === 'myTools' && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <FaPlus className="w-4 h-4" />
                        הוסף כלי חדש
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <div className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('myTools')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'myTools'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        הכלים שלי ({myTools.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('borrowed')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'borrowed'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        כלים שאולים ({borrowedTools.length})
                    </button>
                </div>
            </div>

            {/* הודעת הצלחה */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                    {successMessage}
                </div>
            )}

            {/* טופס הוספת כלי חדש */}
            {showAddForm && activeTab === 'myTools' && (
                <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">הוסף כלי חדש</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="שם הכלי"
                            value={newTool.name}
                            onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <select
                            value={newTool.category}
                            onChange={(e) => setNewTool({...newTool, category: e.target.value})}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        >
                            <option value="">בחר קטגוריה</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="מותג"
                            value={newTool.brand}
                            onChange={(e) => setNewTool({...newTool, brand: e.target.value})}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <select
                            value={newTool.rating}
                            onChange={(e) => setNewTool({...newTool, rating: parseInt(e.target.value)})}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        >
                            <option value={0}>בחר דירוג</option>
                            <option value={1}>⭐</option>
                            <option value={2}>⭐⭐</option>
                            <option value={3}>⭐⭐⭐</option>
                            <option value={4}>⭐⭐⭐⭐</option>
                            <option value={5}>⭐⭐⭐⭐⭐</option>
                        </select>
                    </div>
                    <textarea
                        placeholder="הערות"
                        value={newTool.notes}
                        onChange={(e) => setNewTool({...newTool, notes: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-4"
                        rows="3"
                    />
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleAddTool}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                            שמור
                        </button>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                        >
                            בטל
                        </button>
                    </div>
                </div>
            )}
            
            {/* טופס עריכת כלי */}
            {showEditForm && editingTool && activeTab === 'myTools' && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">ערוך כלי</h2>
                    <input
                        type="text"
                        placeholder="שם הכלי"
                        value={editingTool.name}
                        onChange={(e) => setEditingTool({...editingTool, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                    />
                    <select
                        value={editingTool.category}
                        onChange={(e) => setEditingTool({...editingTool, category: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="מותג"
                        value={editingTool.brand}
                        onChange={(e) => setEditingTool({...editingTool, brand: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                    />
                    <input
                        type="number"
                        min="0"
                        max="5"
                        placeholder="דירוג (0-5)"
                        value={editingTool.rating}
                        onChange={(e) => setEditingTool({...editingTool, rating: parseInt(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                    />
                    <textarea
                        placeholder="הערות"
                        value={editingTool.notes}
                        onChange={(e) => setEditingTool({...editingTool, notes: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-4"
                        rows="3"
                    />
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleUpdateTool}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            עדכן
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                        >
                            בטל
                        </button>
                    </div>
                </div>
            )}
            
            {/* רשימת הכלים */}
            {isLoading ? (
                <Loader text="טוען כלים..." />
            ) : error ? (
                <Error title={"שגיאה בטעינת הכלים"} text={error} className="mt-6" />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* טאב הכלים שלי */}
                    {activeTab === 'myTools' && (
                        myTools.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <FaWrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">אין כלים עדיין</h3>
                                <p className="text-gray-500">התחל בהוספת הכלי הראשון שלך</p>
                            </div>
                        ) : (
                            myTools.map(tool => (
                                <div key={tool._id} className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow ${!tool.isAvailable ? 'opacity-75' : ''}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <FaWrench className="w-8 h-8 text-orange-600" />
                                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                tool.isAvailable 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {tool.isAvailable ? 'זמין' : 'לא זמין'}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEditTool(tool)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FaEdit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTool(tool._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{tool.name}</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p><span className="font-semibold">קטגוריה:</span> {tool.category}</p>
                                        <p><span className="font-semibold">מותג:</span> {tool.brand}</p>
                                        <p><span className="font-semibold">דירוג:</span> {'⭐'.repeat(tool.rating)}</p>
                                        {tool.notes && <p><span className="font-semibold">הערות:</span> {tool.notes}</p>}
                                    </div>
                                </div>
                            ))
                        )
                    )}

                    {/* טאב כלים שאולים */}
                    {activeTab === 'borrowed' && (
                        borrowedTools.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <FaWrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">אין כלים שאולים</h3>
                                <p className="text-gray-500">כלים שתשאל יופיעו כאן</p>
                            </div>
                        ) : (
                            borrowedTools.map(tool => (
                                <div key={tool._id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <FaWrench className="w-8 h-8 text-orange-600" />
                                            <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(tool.status)}`}>
                                                {getStatusText(tool.status)}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleReturnBorrowedTool(tool._id)}
                                            disabled={tool.status === 'pending_return'}
                                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                                tool.status === 'pending_return' 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                            title={tool.status === 'pending_return' ? 'בקשת החזרה נשלחה' : 'החזר כלי'}
                                        >
                                            {tool.status === 'pending_return' ? 'נשלח לאישור' : 'החזר'}
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{tool.name}</h3>
                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <p><span className="font-semibold">קטגוריה:</span> {tool.category}</p>
                                        <p><span className="font-semibold">מותג:</span> {tool.brand}</p>
                                        <p><span className="font-semibold">דירוג:</span> {'⭐'.repeat(tool.rating)}</p>
                                        {tool.notes && <p><span className="font-semibold">תיאור:</span> {tool.notes}</p>}
                                        <p><span className="font-semibold">בעלים:</span> {tool.owner?.email}</p>
                                        {tool.borrowedDate && (
                                            <p><span className="font-semibold">תאריך השאלה:</span> {new Date(tool.borrowedDate).toLocaleDateString('he-IL')}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            )}
            </>
            )}
        </div>
    );
}

export default MyToolsPage


