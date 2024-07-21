// src/pages/InvitationRegister.js
import React, { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { useNavigate, useSearchParams } from 'react-router-dom';

const InvitationRegister = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/auth/register', { token, username, password });
            setMessage('Registration successful!');
            navigate('/login');
        } catch (error) {
            setMessage('Registration failed.');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Register as Editor</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />
                    <button type="submit" className="bg-green-500 text-white w-full py-2 rounded-lg">
                        Register
                    </button>
                </form>
                {message && <p className="mt-4 text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default InvitationRegister;
