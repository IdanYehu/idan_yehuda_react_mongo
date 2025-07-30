
import handymanImage from '@assets/handyman.png'
import NavButton from '@components/Nav/NavButton.jsx'
import { Link } from 'react-router-dom'
import { FaUserCircle, FaBars, FaTools, FaExchangeAlt, FaClipboardCheck, FaTimes } from "react-icons/fa";
import { useAuthStore } from '@src/store/authStore.js'
import { usePendingRequestsCount } from '@src/hooks/usePendingRequestsCount.js'
import { useRefresh } from '@src/contexts/PendingRequestsContext.jsx'
import { useState, useEffect, useRef } from 'react'

const NavBar = () => {
    const { user, logout } = useAuthStore();
    const { count } = useRefresh();
    const { pendingCount } = usePendingRequestsCount(count);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    
    // סגירת התפריט בלחיצה מחוץ לו
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);
    
    return (
        <header className="bg-gradient-to-r from-slate-700 to-slate-600 text-white p-3 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between relative">
                {/* צד שמאל - כפתור תפריט */}
                <div className="flex items-center w-1/4">
                    {user && (
                        // כפתור תפריט למשתמש מחובר
                        <div className="flex items-center" ref={menuRef}>
                            {/* כפתור תפריט */}
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 hover:bg-slate-800 relative"
                            >
                                {isMenuOpen ? (
                                    <FaTimes className="h-5 w-5" />
                                ) : (
                                    <FaBars className="h-5 w-5" />
                                )}
                                <span>תפריט</span>
                            </button>
                            
                            {/* תפריט נפתח */}
                            {isMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 bg-white text-gray-800 rounded-xl shadow-2xl py-3 min-w-64 z-50 border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm text-gray-500">שלום,</p>
                                        <p className="font-semibold text-gray-800">{user.firstName || user.name}</p>
                                    </div>
                                    
                                    <div className="py-2">
                                        <Link 
                                            to="/my-tools" 
                                            onClick={() => setIsMenuOpen(false)} 
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors duration-200 group"
                                        >
                                            <FaTools className="h-5 w-5 text-orange-600 group-hover:text-orange-700" />
                                            <div>
                                                <span className="font-medium">הכלים שלי</span>
                                                <p className="text-xs text-gray-500">ניהול הכלים שלך</p>
                                            </div>
                                        </Link>
                                        
                                        <Link 
                                            to="/tools-for-loan" 
                                            onClick={() => setIsMenuOpen(false)} 
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors duration-200 group"
                                        >
                                            <FaExchangeAlt className="h-5 w-5 text-orange-600 group-hover:text-orange-700" />
                                            <div>
                                                <span className="font-medium">כלים להשאלה</span>
                                                <p className="text-xs text-gray-500">חפש כלים לשאילה</p>
                                            </div>
                                        </Link>
                                        
                                        <Link 
                                            to="/pending-requests" 
                                            onClick={() => setIsMenuOpen(false)} 
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors duration-200 group relative"
                                        >
                                            <div className="relative">
                                                <FaClipboardCheck className="h-5 w-5 text-orange-600 group-hover:text-orange-700" />
                                                {pendingCount > 0 && (
                                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 font-bold">
                                                        {pendingCount}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-medium">בקשות לאישור</span>
                                                <p className="text-xs text-gray-500">אשר בקשות השאלה</p>
                                                {pendingCount > 0 && (
                                                    <p className="text-xs text-red-600 font-medium">{pendingCount} בקשות ממתינות</p>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* מרכז - לוגו ושם האפליקציה */}
                <div className="flex items-center justify-center w-1/2">
                    <Link to="/" className="flex items-center space-x-4 group">
                        <img
                            src={handymanImage}
                            alt="כלבויניק לוגו"
                            className="h-16 w-16 object-contain transform transition-transform group-hover:scale-110"
                        />
                        <span className="text-4xl font-handwriting hidden sm:block text-orange-300" style={{fontSize: '3rem'}}>כלבויניק</span>
                    </Link>
                </div>

                {/* צד ימין - כפתורי התחברות/התנתקות */}
                <div className="flex items-center gap-3 w-1/4 justify-end">
                    {user ? (
                        // כפתור התנתקות למשתמש מחובר
                        <div className="flex items-center gap-3">
                            <Link to="/profile" className="flex items-center gap-2 hover:bg-slate-800 px-3 py-2 rounded-md transition-all duration-300 relative">
                                <div className="relative">
                                    <FaUserCircle className="h-6 w-6" />
                                    {pendingCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-4 h-4 flex items-center justify-center px-1 font-bold text-[10px]">
                                            {pendingCount}
                                        </span>
                                    )}
                                </div>
                                <span className="hidden sm:block">{user.firstName || user.name}</span>
                            </Link>
                            <button 
                                onClick={logout}
                                className="px-4 py-2 rounded-md font-medium transition-all duration-300 bg-orange-600 text-white hover:bg-orange-700"
                            >
                                התנתק
                            </button>
                        </div>
                    ) : (
                        // כפתורי התחברות והרשמה למשתמש לא מחובר
                        <div className="flex items-center gap-3">
                            <Link to="/?tab=login" className="px-4 py-2 rounded-md font-medium transition-all duration-300 bg-white text-slate-700 hover:bg-gray-100">
                                התחברות
                            </Link>
                            <Link to="/?tab=register" className="px-4 py-2 rounded-md font-medium transition-all duration-300 bg-orange-600 text-white hover:bg-orange-700">
                                הרשמה
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
export default NavBar