import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const PublicRoute = ({ children }) => {
    const { user } = useAuth();

    return user ? <Navigate to="/medicines" /> : children;
};

export default PublicRoute;
