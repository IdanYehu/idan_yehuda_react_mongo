import { useState, useEffect } from 'react';
import { toolService } from '../services/toolService';
import { useAuthStore } from '../store/authStore';

export const usePendingRequestsCount = (refreshTrigger = null) => {
    const [pendingCount, setPendingCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthStore();

    const fetchPendingCount = async () => {
        if (!user) {
            setPendingCount(0);
            return;
        }

        try {
            setIsLoading(true);
            const response = await toolService.getPendingRequestsCount();
            if (response.success) {
                setPendingCount(response.data.totalCount);
            } else {
                setPendingCount(0);
            }
        } catch (error) {
            console.error('Error fetching pending requests count:', error);
            setPendingCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingCount();
        
        // רענון כל 30 שניות
        const interval = setInterval(fetchPendingCount, 30000);
        
        return () => clearInterval(interval);
    }, [user, refreshTrigger]);

    return { pendingCount, isLoading, refreshCount: fetchPendingCount };
};
