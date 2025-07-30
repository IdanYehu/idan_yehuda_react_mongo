import { useEffect, useState } from 'react';
import { FaWrench, FaUser, FaEnvelope } from 'react-icons/fa';
import { useAuthStore } from '@store/authStore';
import { toolService } from '@services/toolService';
import { useRefresh } from '../contexts/PendingRequestsContext';

const ToolsForLoanPage = () => {
    const [availableTools, setAvailableTools] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { user } = useAuthStore();
    const { refresh } = useRefresh();

    // פונקציה לטעינת כלים זמינים להשאלה
    const loadAvailableTools = async () => {
        try {
            const response = await toolService.getAvailableTools();
            if (response.success) {
                setAvailableTools(response.data);
            }
        } catch (err) {
            console.error('Error loading available tools:', err);
        }
    };

    useEffect(() => {
        if (user) {
            loadAvailableTools();
        }
    }, [user]); // הוסף user כתלות כדי לרענן כשהמשתמש משתנה

    // פילטור כלים לפי חיפוש וקטגוריה
    const filteredTools = availableTools.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tool.brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || tool.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // קבלת קטגוריות ייחודיות
    const categories = [...new Set(availableTools.map(tool => tool.category))];

    const handleContactOwner = (tool) => {
        const ownerEmail = tool.owner?.email || 'משתמש לא ידוע';
        alert(`ליצירת קשר עם הבעלים לגבי ${tool.name}:\nאימייל: ${ownerEmail}`);
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

    const isToolDisabled = (tool) => {
        return tool.status === 'pending_borrow' || tool.status === 'borrowed' || tool.status === 'pending_return';
    };

    const handleBorrowTool = async (tool) => {
        if (!user?.email) {
            alert('יש להתחבר כדי לשאול כלי');
            return;
        }

        try {
            const response = await toolService.requestBorrowTool(tool._id);
            if (response.success) {
                // רענון הרשימה לראות את הסטטוס החדש
                await loadAvailableTools();
                refresh(); // רענון מונה ההתראות
                setSuccessMessage(`בקשת השאלה נשלחה לבעלים של "${tool.name}"`);
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                alert(response.message || 'שגיאה בשליחת בקשת השאלה');
            }
        } catch (err) {
            console.error('Error requesting borrow tool:', err);
            alert('שגיאה בשליחת בקשת השאלה');
        }
    };

    return (
        <div className="p-6 text-black max-w-7xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">כלים פנויים להשאלה</h1>
                    <p className="text-lg text-gray-600">גלה כלי עבודה זמינים להשאלה מהקהילה</p>
                </div>
            </div>

            {/* הודעת הצלחה */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                    {successMessage}
                </div>
            )}

            {/* חיפוש ופילטרים */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="חפש כלי או מותג..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 min-w-48"
                >
                    <option value="">כל הקטגוריות</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-orange-100 p-4 rounded-lg text-center">
                    <h3 className="text-2xl font-bold text-orange-700">{availableTools.filter(tool => tool.status === 'available').length}</h3>
                    <p className="text-orange-600">כלים זמינים</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                    <h3 className="text-2xl font-bold text-green-700">{categories.length}</h3>
                    <p className="text-green-600">קטגוריות</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                    <h3 className="text-2xl font-bold text-blue-700">{filteredTools.length}</h3>
                    <p className="text-blue-600">תוצאות</p>
                </div>
            </div>


            {filteredTools.length === 0 ? (
                <div className="text-center py-12">
                    <FaWrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">אין כלים זמינים</h3>
                    <p className="text-gray-500">נסה לשנות את הפילטרים או תחזור מאוחר יותר</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.map(tool => {
                        const disabled = isToolDisabled(tool);
                        return (
                            <div key={tool._id} className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow ${disabled ? 'opacity-75 bg-gray-50' : ''}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <FaWrench className="w-8 h-8 text-orange-600" />
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(tool.status)}`}>
                                        {getStatusText(tool.status)}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{tool.name}</h3>
                                
                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    <p><span className="font-semibold">קטגוריה:</span> {tool.category}</p>
                                    <p><span className="font-semibold">מותג:</span> {tool.brand}</p>
                                    <p><span className="font-semibold">דירוג:</span> {'⭐'.repeat(tool.rating)}</p>
                                    {tool.notes && (
                                        <p><span className="font-semibold">תיאור:</span> {tool.notes}</p>
                                    )}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FaUser className="w-4 h-4" />
                                            <span>{tool.owner?.email?.split('@')[0] || 'משתמש'}</span>
                                        </div>
                                    </div>
                                
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleBorrowTool(tool)}
                                        disabled={disabled}
                                        className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                                            disabled 
                                                ? 'bg-gray-400 cursor-not-allowed text-white' 
                                                : 'bg-green-600 hover:bg-green-700 text-white'
                                        }`}
                                    >
                                        <FaWrench className="w-4 h-4" />
                                        {disabled ? 'לא זמין' : 'שאל עכשיו'}
                                    </button>
                                    <button
                                        onClick={() => handleContactOwner(tool)}
                                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <FaEnvelope className="w-4 h-4" />
                                        צור קשר
                                    </button>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ToolsForLoanPage;
