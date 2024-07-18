import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Editor'); // or 'YouTuber'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/register', { username, email, password, role });
      setMessage('Registration successful');
    } catch (error) {
      setMessage('Registration failed');
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="block w-full p-2 border"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="block w-full p-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="block w-full p-2 border"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="block w-full p-2 border">
          <option value="Editor">Editor</option>
          <option value="YouTuber">YouTuber</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Register</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Register;
