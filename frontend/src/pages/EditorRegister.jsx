import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
        try {
            const response = await register(token, username, email, password);
            if (response.status === 201) {
                setMessage(response.message);
                navigate('/editor/login');
            } else {
                setMessage(response.message);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setMessage('Registration failed. Please try again.');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000)
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center my-8 container mx-auto px-4 md:px-0 bg-[#101010]">
            <div className="login-bg-shadow p-8 rounded-[30px] drop-shadow-2xl w-full md:w-2/3 lg:w-[35%]">
                <h2 className="text-3xl mb-8 text-center tracking-wider font-lowballRegular">Create Your Account</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        className="w-full mb-4 px-5 border rounded-lg border-[#3f3f3f] bg-transparent h-14 text-[#999] outline-none"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full mb-4 px-5 border rounded-lg border-[#3f3f3f] bg-transparent h-14 text-[#999] outline-none"
                        disabled
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full mb-4 px-5 border rounded-lg border-[#3f3f3f] bg-transparent h-14 text-[#999] outline-none"
                    />
                    <button type="submit" className={`brandBtn text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 ${loading ? 'cursor-not-allowed' : ''}`} disabled={loading}>
                        {loading ? 'Processing...' : 'Signup'} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                        </svg>
                    </button>
                    {message && <p className="text-red-600 my-2 text-center">{message}</p>}
                    <div className="flex items-center flex-wrap mt-3">
                        <Link to={'/editor/login'} className='flex-1 my-3 underline font-semibold text-white hover:text-[#999999] transition-colors duration-200 ease-out text-center mx-auto block'>Already have an account?</Link>
                        <Link to={'/editor/forgot-password'} className='flex-1 my-3 underline font-semibold text-white hover:text-[#999999] transition-colors duration-200 ease-out text-center mx-auto block'>Forgot Password?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditorRegister;
