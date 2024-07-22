import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function EditorRegister() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const { register } = useContext(AuthContext);

    useEffect(() => {
        const emailParam = searchParams.get('email');
        const tokenParam = searchParams.get('token');
        if (emailParam) setEmail(emailParam);
        if (tokenParam) setToken(tokenParam);
    }, [searchParams]);

    const handleRegister = async () => {
        try {
            await register(token, username, email, password);
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
                className="input mb-2"
            />
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="input mb-2"
                disabled
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="input mb-2"
            />
            <button className="btn" onClick={handleRegister}>Register</button>
        </div>
    );
}

export default EditorRegister;
