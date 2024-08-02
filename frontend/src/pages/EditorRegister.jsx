import { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function EditorRegister() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
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
        setLoading(true);
        const response = await register(token, username, email, password);
        setLoading(false);
        if (response.status === 201) {
            setMessage(response.message);
            navigate('/login-editor');
        } else {
            setMessage(response.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
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
                    <button type="submit" className="bg-gray-800 text-white w-full py-2 rounded-lg" onClick={handleRegister}>
                        {loading ? 'Processing...' : 'Signup'}
                    </button>
                    {message && <p className="text-red-600 mt-4">{message}</p>}
                </form>
            </div>
        </div>
    );
}

export default EditorRegister;
