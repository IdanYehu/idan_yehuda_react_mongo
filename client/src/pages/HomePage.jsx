import { useState, useEffect } from 'react';
import { useAuthStore } from '@store/authStore';
import { useSearchParams } from 'react-router-dom';
import LoginForm from '@components/Auth/LoginForm';
import RegisterForm from '@components/Auth/RegisterForm';

const HomePage = () => {
    const [activeTab, setActiveTab] = useState('login');
    const { user } = useAuthStore();
    const [searchParams] = useSearchParams();
    
    
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'register' || tab === 'login') {
            setActiveTab(tab);
        }
    }, [searchParams]);
    
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] bg-gray-100 p-4">
            {/* הריבוע הכחול - תוכן משתנה לפי סטטוס התחברות */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-500 text-white p-6 rounded-lg shadow-lg mb-8 w-full max-w-4xl text-center">
                {!user ? (
                    <>
                        <h1 className="text-3xl font-bold font-handwriting">כלבויניק - הפלטפורמה לשיתוף והכוונה לכלי עבודה ומכשירים</h1>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold mb-2">ברוך הבא, {user.firstName || user.name}!</h1>
                        <p className="text-lg">אתה כעת מחובר לאפליקצית כלבויניק</p>
                    </>
                )}
            </div>
            
            {/* תוכן עיקרי - ריבועים עם מידע על האתר או טפסים */}
            {!user ? (
                <>
                    {/* אם יש פרמטר tab ב-URL, הצג טפסים */}
                    {searchParams.get('tab') ? (
                        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                            {/* Form */}
                            {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
                        </div>
                    ) : (
                        /* אחרת הצג ריבועי מידע */
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                            {/* ריבוע ראשון */}
                            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                                <img 
                                    src="/src/assets/tools1.png" 
                                    alt="כלי עבודה מקצועיים" 
                                    className="w-24 h-24 mx-auto mb-4 object-contain"
                                />
                                <h3 className="text-xl font-bold text-orange-700 mb-3">כלים מקצועיים</h3>
                                <p className="text-gray-600 text-sm">
                                    גלה מגוון רחב של כלי עבודה איכותיים. קרא ביקורות, השווה מחירים וקבל המלצות מאנשי מקצוע
                                </p>
                            </div>

                            {/* ריבוע שני */}
                            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                                <img 
                                    src="/src/assets/tools2.png" 
                                    alt="דירוגים וביקורות" 
                                    className="w-24 h-24 mx-auto mb-4 object-contain"
                                />
                                <h3 className="text-xl font-bold text-orange-700 mb-3">דירוגים וביקורות</h3>
                                <p className="text-gray-600 text-sm">
                                    קרא ביקורות אמיתיות מאנשי מקצוע, דרג כלים שעבדת איתם ועזור לאחרים לבחור נכון
                                </p>
                            </div>

                            {/* ריבוע שלישי */}
                            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                                <img 
                                    src="/src/assets/tools3.png" 
                                    alt="קהילת מקצועיים" 
                                    className="w-24 h-24 mx-auto mb-4 object-contain"
                                />
                                <h3 className="text-xl font-bold text-orange-700 mb-3">קהילת מקצועיים</h3>
                                <p className="text-gray-600 text-sm">
                                    הצטרף לקהילה של אנשי מקצוע, שתף ידע, קבל עצות והמלצות על הכלים הטובים ביותר
                                </p>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* אותם ריבועים כמו לפני התחברות */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                        {/* ריבוע ראשון */}
                        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                            <img 
                                src="/src/assets/tools1.png" 
                                alt="כלי עבודה מקצועיים" 
                                className="w-24 h-24 mx-auto mb-4 object-contain"
                            />
                            <h3 className="text-xl font-bold text-orange-700 mb-3">כלים מקצועיים</h3>
                            <p className="text-gray-600 text-sm">
                                גלה מגוון רחב של כלי עבודה איכותיים. קרא ביקורות, השווה מחירים וקבל המלצות מאנשי מקצוע
                            </p>
                        </div>

                        {/* ריבוע שני */}
                        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                            <img 
                                src="/src/assets/tools2.png" 
                                alt="דירוגים וביקורות" 
                                className="w-24 h-24 mx-auto mb-4 object-contain"
                            />
                            <h3 className="text-xl font-bold text-orange-700 mb-3">דירוגים וביקורות</h3>
                            <p className="text-gray-600 text-sm">
                                קרא ביקורות אמיתיות מאנשי מקצוע, דרג כלים שעבדת איתם ועזור לאחרים לבחור נכון
                            </p>
                        </div>

                        {/* ריבוע שלישי */}
                        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                            <img 
                                src="/src/assets/tools3.png" 
                                alt="קהילת מקצועיים" 
                                className="w-24 h-24 mx-auto mb-4 object-contain"
                            />
                            <h3 className="text-xl font-bold text-orange-700 mb-3">קהילת מקצועיים</h3>
                            <p className="text-gray-600 text-sm">
                                הצטרף לקהילה של אנשי מקצוע, שתף ידע, קבל עצות והמלצות על הכלים הטובים ביותר
                            </p>
                        </div>
                    </div>
                </>
            )}
            
            <div className="mt-8 text-gray-600 max-w-xl text-center mx-auto">
                <h2 className="text-xl font-bold mb-2">הצטרפו לקהילת כלבויניק</h2>
                <p className="mb-4">קבלו מידע מקצועי על כלי עבודה, ביקורות ודירוגים מאנשי מקצוע</p>
            </div>
        </div>
    );
}

export default HomePage;