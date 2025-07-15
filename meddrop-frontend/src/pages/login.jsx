import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/authContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isValidEmail = /^\S+@\S+\.\S+$/;

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!isValidEmail.test(email)) {
            setError('Enter a valid email.');
            return;
        }
        if(!email || !password) {
            setError('Both fields are required');
            return;
        }

        try {
            setLoading(true);
            setError('');

            console.log('Sending login request to:', `${process.env.REACT_APP_API_BASE_URL}/auth/login`);
            console.log('Email:', email, 'Password:', password);

            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
                { email, password }
            );

            const { token, user } = response.data;
            login(user, token);        
            // localStorage.setItem('authToken', token);
            navigate('/medicines');

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex justify-center items-center bg-gray-100'>
            <form
                onSubmit={handleSubmit}
                className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'
            >
                <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <input
                    type = 'email'
                    placeholder= 'Email'
                    className='w-full p-3 mb-4 border border-gray-300 rounded'
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type = 'password'
                    placeholder='Password'
                    className='w-full p-3 mb-6 border border-gray-300 rounded'
                    value = {password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type = "submit"
                    disabled = {loading || !email || !password}
                    className={`w-full p-3 text-white rounded ${
                        loading || !email || !password
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {loading ? 'Loggin in ...': 'Login'}
                </button>   

                <p className='mt-4 text-center text-sm'>
                    Don't have an account? {' '}    
                    <Link to = '/signup' className='text-blue-600 hover: underline'>
                        Sign Up
                    </Link>
                </p> 
            </form>
        </div>
    )
}

export default Login;