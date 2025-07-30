import { createContext, useContext, useState } from 'react';

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
    const [count, setCount] = useState(0);

    const refresh = () => {
        setCount(prev => prev + 1);
    };

    return (
        <RefreshContext.Provider value={{ count, refresh }}>
            {children}
        </RefreshContext.Provider>
    );
};

export const useRefresh = () => {
    const context = useContext(RefreshContext);
    if (!context) {
        throw new Error('useRefresh must be used within RefreshProvider');
    }
    return context;
};
