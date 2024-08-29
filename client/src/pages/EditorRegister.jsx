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

        // Frontend validation
        if (username.length < 4) {
            setMessage('Username must be at least 4 characters long.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(password)) {
            setMessage('Password must be at least 6 characters long and include at least one letter and one number.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        setLoading(true);
        const response = await register(token, username, email, password);
        setLoading(false);

        setMessage(response.message);
        if (response.status === 201) {
            navigate('/editor/login');
        }

        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center my-8 container mx-auto px-4 md:px-0 bg-img rounded-3xl text-white">
            <div className="p-1 md:p-8 rounded-[30px] drop-shadow-2xl w-full md:w-2/3 lg:w-[35%]">
                <h2 className="text-3xl mb-8 text-center tracking-wider font-lowballRegular">Create Your Account</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        className="w-full mb-4 px-4 py-2 border rounded-lg border-[#3f3f3f] bg-transparent outline-none text-lg"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full mb-4 px-4 py-2 border rounded-lg border-[#3f3f3f] bg-transparent outline-none text-lg"
                        disabled
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full mb-4 px-4 py-2 border rounded-lg border-[#3f3f3f] bg-transparent outline-none text-lg"
                    />
                    <button type="submit" className={`brandBtn text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 ${loading ? 'cursor-not-allowed' : ''}`} disabled={loading}>
                        {loading ? 'Processing...' : 'Signup'} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                        </svg>
                    </button>
                    {message && <p className="text-white my-2 text-center">{message}</p>}
                    <div className="flex items-center flex-wrap mt-3">
                        <Link to={'/editor/login'} className='flex-1 my-3 underline hover:text-white text-[#999999] transition-colors duration-200 ease-out text-center mx-auto block'>Already have an account?</Link>
                        <Link to={'/editor/forgot-password'} className='flex-1 my-3 underline hover:text-white text-[#999999] transition-colors duration-200 ease-out text-center mx-auto block'>Forgot Password?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditorRegister;
