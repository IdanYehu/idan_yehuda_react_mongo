import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, userApi } from '@services/api.js';

export const useAuthStore = create(persist((set, get) => ({
        // state
        user: null,
        token: null,
        isLoading: false,
        succeses: false,
        error: null,

        setIsLoading: (isLoading) => set({ isLoading }),
        setSuccess: (success) => set({ succeses: success }),
        setError: (error) => set({ error }),

        login: async (email, password) => {
            set({ isLoading: true, error: null })
            try {


                const response = await authApi.login(email, password) 
              
                        
                const { user, token } = response.data
                console.log('Login successful for user:', user?.email);
                
                set({
                    user,
                    token,
                    isLoading: false,
                    succeses: true,
                    error: null
                })

                return { succeses: true }

            } catch (error) {
                let errorMessage = 'Login failed';
                if(error.status === 401) {
                   errorMessage = 'invalid email or password';
                } else {
                   errorMessage = error?.message || 'Login failed';
                }
                set({ isLoading: false, error: errorMessage });
                return { success: false, error: errorMessage };
            }
        },
        register: async (userData) => {
            set({ isLoading: true, error: null });
            try {
                const response = await authApi.register(userData);

                const { user, token } = response.data;
                set({
                    user,
                    token,
                    isLoading: false,
                    succeses: true,
                    error: null
                });

                return { success: true };

            } catch (error) {
                const errorMessage = error.response?.message || 'Registration failed';
                set({ isLoading: false, error: errorMessage });
                return { success: false, error: errorMessage };
            }

        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('auth-storage');
            sessionStorage.removeItem('auth-storage');
            
            set({
                user: null,
                token: null,
                isLoading: false,
                succeses: false,
                error: null,
            })
        },
        updateUser: async (userData) => {
            set({ isLoading: true, error: null });
            try {
                const { user } = get();
                console.log(`Updating user with data:${user._id}`, userData);

                const response = await userApi.updateProfile(userData);
                console.log('Update response:', response);
                
                const updatedUser = response.user || response.data?.user;
                
                if (!updatedUser) {
                    throw new Error('No user data received from server');
                }
                
                set({
                    user: updatedUser,
                    isLoading: false,
                    succeses: true,
                    error: null
                });

                return { success: true };

            } catch (error) {
                const errorMessage = error.response?.message || 'Update failed';
                set({ isLoading: false, error: errorMessage });
                return { success: false, error: errorMessage };
            }
        },

        clearError: () => {
            set({ error: null })
        },
        isAuthenticated: () => {
            const { user, token } = get()
            return user && token
        }

}), {
    name: 'auth-storage',
    getStorage: () => localStorage,
    partialize: (state) => ({ user: state.user, token: state.token }),
}));