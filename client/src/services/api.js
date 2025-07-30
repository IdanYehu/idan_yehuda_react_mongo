import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';


const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    try {
        const authData = localStorage.getItem('auth-storage');
        if (authData) {
            const token = JSON.parse(authData).state?.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    } catch (error) {
        console.error('Error parsing token from localStorage:', error);
    }
    
    return config;
});

export const authApi = {
    login: async (email, password) => {
        console.log('Attempting login with email:', email);
        console.log('API URL:', apiUrl);
        const response = await api.post('/auth/login', { email, password });
        return response;
    },
    register: async (userData) => {
        console.log('Registering user with email:', userData.email, 'name:', userData.name);
        console.log('API URL:', apiUrl);
        
        const response = await api.post('/auth/register', userData);
        return response;
    },
};

export const userApi = {
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },
    
    updateProfile: async (userData) => {
        // נקבל את ה-user ID מהטוקן או מה-localStorage
        const userStr = localStorage.getItem('auth-storage');
        if (!userStr) throw new Error('No user data found');
        
        const authData = JSON.parse(userStr);
        const userId = authData.state?.user?._id;
        
        if (!userId) throw new Error('User ID not found');
        
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    },
};

export default api;
