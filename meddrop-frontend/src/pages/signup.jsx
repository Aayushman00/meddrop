import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
        setError('All fields are required.');
        return;
    }

    if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
    }

    if (!strongPasswordRegex.test(password)) {
        setError('Password must be at least 8 characters and include an uppercase letter, number, and special character.');
        return;
    }

    try {
        setLoading(true);
        setError('');

        const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/auth/signup`,
            { name, email, password }
        );

        if (response.status === 201 || response.status === 200) {
            navigate('/login');
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Signup failed.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <input
                type="text"
                placeholder="Name"
                className="w-full p-3 mb-4 border border-gray-300 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="email"
                placeholder="Email"
                className="w-full p-3 mb-4 border border-gray-300 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                className="w-full p-3 mb-4 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 mb-6 border border-gray-300 rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
                type="submit"
                disabled={loading || !name || !email || !password || password !== confirmPassword}
                className={`w-full p-3 text-white rounded ${
                    loading || !name || !email || !password || password !== confirmPassword
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
                {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            <p className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                    Log in
                </Link>
            </p>
        </form>
    </div>
  );
};

export default Signup;
