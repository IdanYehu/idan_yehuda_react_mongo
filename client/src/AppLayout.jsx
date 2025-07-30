// src/AppLayout.jsx
import React, { useEffect } from 'react';
import NavBar from '@components/Nav/NavBar';
import { Outlet } from 'react-router-dom';
import { RefreshProvider } from '@src/contexts/PendingRequestsContext';

const AppLayout = () => {
  // Add event listener to clear auth data when window closes
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear authentication data when browser/tab closes
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('auth-storage');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <RefreshProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Navbar */}
        <NavBar />
        
        {/* Main Content */}
        <main className="flex justify-center py-8 flex-1">
          <div className="w-[95%] max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </RefreshProvider>
  );
};

export default AppLayout;
