// src/pages/EditorLogin.js
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
      navigate('/editor-dashboard');
    } else {
      setMessage(response.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center my-8 container mx-auto px-4 md:px-0">
      <div className="bg-white p-4 rounded-lg drop-shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Editor Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" className={`bg-gray-800 drop-shadow-2xl text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 ${loading ? 'cursor-not-allowed' : ''}`} disabled={loading}>
            {loading ? 'Processing...' : 'Login'} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
            </svg>
          </button>
          {message && <p className="text-red-600 mt-4 text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default EditorLogin;
