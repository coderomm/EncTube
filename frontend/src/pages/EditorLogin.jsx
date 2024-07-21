// src/pages/EditorLogin.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const EditorLogin = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Editor Login</h2>
        <form onSubmit={handleSubmit}>
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
};

export default EditorLogin;
