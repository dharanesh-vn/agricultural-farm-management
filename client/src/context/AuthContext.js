import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/api';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');
const AuthContext = createContext();

export const useSocket = () => socket;
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            socket.emit('identify', parsedUser._id);
        }
        setLoading(false);
        const handleConnect = () => {
            const currentUser = localStorage.getItem('user');
            if (currentUser) {
                socket.emit('identify', JSON.parse(currentUser)._id);
            }
        };
        socket.on('connect', handleConnect);
        return () => socket.off('connect', handleConnect);
    }, []);

    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        socket.emit('identify', data._id);
        window.location.href = '/app/dashboard';
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        socket.disconnect();
        socket.connect();
        window.location.href = '/';
    };
    
    const register = async (name, email, password, role) => {
        return await API.post('/auth/register', { name, email, password, role });
    };

    const value = { user, loading, login, register, logout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};