import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData, token) => {
        setToken(token);
        setUser(userData);

        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);

        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);