import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function EditorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await login(email, password);
    setLoading(false);
    if (response.status === 200) {
      setMessage(response.message);
      navigate('/editor/dashboard');
    } else {
      setMessage(response.message);
    }
    setTimeout(() => {
      setMessage('')
      setEmail('')
    }, 3000)
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center my-8 container mx-auto px-4 md:px-0 bg-[#101010]">
      <div className="login-bg-shadow p-8 rounded-[30px] drop-shadow-2xl w-full md:w-2/3 lg:w-[35%]">
        <h2 className="text-3xl mb-8 text-center tracking-wider font-lowballRegular text-white">Login in to your account</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-4 px-5 border rounded-lg border-[#3f3f3f] bg-transparent h-14 text-[#999] outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-4 px-5 border rounded-lg border-[#3f3f3f] bg-transparent h-14 text-[#999] outline-none"
          />
          <button type="submit" className={`brandBtn font-lowballBold text-xl tracking-wider text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 ${loading ? 'cursor-not-allowed' : ''}`} disabled={loading}>
            {loading ? 'Processing...' : 'Login'} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
            </svg>
          </button>
          {message && <p className="text-red-600 my-2 text-center">{message}</p>}
          <div className="flex items-center flex-wrap mt-3">
            <Link to={'/editor/signup'} className='flex-1 my-3 underline font-semibold text-white hover:text-[#999999] transition-colors duration-200 ease-out text-center mx-auto block'>Don&apos;t have an account?</Link>
            <Link to={'/editor/forgot-password'} className='flex-1 my-3 underline font-semibold text-white hover:text-[#999999] transition-colors duration-200 ease-out text-center mx-auto block'>Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditorLogin;
