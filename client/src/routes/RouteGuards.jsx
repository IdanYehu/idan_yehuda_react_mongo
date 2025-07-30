import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";
import toolsGif from '@assets/toolsgif.gif';

export const PublicRoute = ({ children }) => {
   
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <img 
                    src={toolsGif} 
                    alt="טוען..." 
                    className="h-32 w-32 object-contain mb-4"
                />
                <p className="text-gray-600 text-lg">טוען...</p>
            </div>
        ); 
    }

    // דף הבית זמין גם למשתמשים מחוברים וגם לא מחוברים
    return children;
};
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <img 
                    src={toolsGif} 
                    alt="טוען..." 
                    className="h-32 w-32 object-contain mb-4"
                />
                <p className="text-gray-600 text-lg">מאמת התחברות...</p>
            </div>
        ); 
    }

    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return children;
};
