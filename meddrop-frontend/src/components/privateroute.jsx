import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    // console.log("PrivateRoute check: user =", user);


    // If user is authenticated, render the children components
    // Otherwise, redirect to the login page


    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;