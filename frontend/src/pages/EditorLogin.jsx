// src/pages/EditorLogin.js
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function EditorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (response.status === 200) {
        console.log('editor login res:', response)
        alert(response.message)
        navigate('/editor-dashboard')
      }
      else {
        alert('Editor Registration failed')
        console.error('editor login res:', response)
      }
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
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
          <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded-lg">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditorLogin;
