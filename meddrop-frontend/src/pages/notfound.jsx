import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className='min-h-screen flex flex-col justify-center items-center bg-gray-100'> 
            <h1 className='text-4xl font-bold mb-4 text-red-500'>404 - Page Not Found</h1>
            <p className='text-lg text-gray-700 mb-6'>The page you are looking for does not exist.</p>

            <Link to="/" className='text-blue-500 hover:underline'>
                Go back to Home
            </Link>
        </div>
    );
};

export default NotFound