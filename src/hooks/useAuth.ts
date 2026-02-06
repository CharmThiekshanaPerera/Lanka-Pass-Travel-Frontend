import { useState, useEffect } from 'react';
import { authService, User } from '../services/supabaseService';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login({ email, password });
            setUser(response.user);
            return { success: true, data: response };
        } catch (error: any) {
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name: string, email: string, password: string, role: string = 'user') => {
        try {
            const response = await authService.register({ name, email, password, role });
            setUser(response.user);
            return { success: true, data: response };
        } catch (error: any) {
            return { success: false, error: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: authService.isAuthenticated()
    };
};