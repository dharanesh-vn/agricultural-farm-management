import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This effect runs once when the app loads
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            // If we have user data, use it immediately for a fast UI response
            setUser(JSON.parse(userData));
            setLoading(false);
        } else if (token) {
            // If we only have a token, fetch the user profile to verify it
            API.get('/users/profile').then(res => {
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data)); // Re-sync local storage
            }).catch(() => {
                // If the token is invalid, clear everything
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }).finally(() => setLoading(false));
        } else {
            // No token, not logged in
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data)); // Store full user object
        setUser(data);
    };

    const register = async (name, email, password, role) => {
        return await API.post('/auth/register', { name, email, password, role });
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        // Force a reload to the homepage to clear all state
        window.location.href = '/';
    };

    const value = { user, loading, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};