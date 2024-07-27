import { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function EditorRegister() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(() => {
        const emailParam = searchParams.get('email');
        const tokenParam = searchParams.get('token');
        if (emailParam) setEmail(emailParam);
        if (tokenParam) setToken(tokenParam);
    }, [searchParams]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await register(token, username, email, password);
            if (response.status === 201) {
                console.log('editor register res:', response)
                alert(response.message)
                navigate('/login-editor')
            }
            else {
                alert('Editor Registration failed')
                console.error('editor register res:', response)
            }
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Editor Register</h2>
                <form>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                        disabled
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />
                    <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded-lg" onClick={handleRegister}>Register</button>
                </form>
            </div>
        </div>
    );
}

export default EditorRegister;
