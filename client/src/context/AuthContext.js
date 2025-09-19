import React, { createContext, useState, useEffect } from 'react';
import API from '../api/api';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
        setLoading(false);
    }, []);
    const login = async (email, password) => {
        const response = await API.post('/auth/login', { email, password });
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data);
        return response.data;
    };
    const register = async (name, email, password, role) => {
        return await API.post('/auth/register', { name, email, password, role });
    };
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthContext;