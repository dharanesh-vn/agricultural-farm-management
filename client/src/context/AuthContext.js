import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/api';
import io from 'socket.io-client';

// Create one single, shared socket instance for the entire application
const socket = io('http://localhost:5001');

const AuthContext = createContext();

// Create a new custom hook to provide easy access to the single socket instance
export const useSocket = () => {
    return socket;
};

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
            // Immediately identify this connection with the loaded user's ID
            socket.emit('identify', parsedUser._id);
        }
        setLoading(false);

        // Re-identify if the socket ever reconnects (e.g., due to temporary network loss)
        const handleConnect = () => {
            const currentUser = localStorage.getItem('user');
            if (currentUser) {
                socket.emit('identify', JSON.parse(currentUser)._id);
            }
        };
        socket.on('connect', handleConnect);
        
        return () => {
            socket.off('connect', handleConnect);
        };
    }, []);

    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        // Identify the user to the socket server immediately on login
        socket.emit('identify', data._id);
        window.location.href = '/app/dashboard'; // Force full reload for clean state
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        socket.disconnect(); // Disconnect old session
        socket.connect();     // Start a new, fresh anonymous connection
        window.location.href = '/';
    };

    const register = async (name, email, password, role) => {
        return await API.post('/auth/register', { name, email, password, role });
    };

    const value = { user, loading, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};