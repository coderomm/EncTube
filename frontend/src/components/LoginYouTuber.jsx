// src/components/LoginYouTuber.jsx
import React from 'react';
import axios from 'axios';

const LoginYouTuber = () => {
  const handleLogin = async () => {
    window.location.href = 'http://localhost:5000/api/v1/auth/youtuber';
  }
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">YouTuber Login</h2>
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">Login with Google</button>
    </div>
  );
};

export default LoginYouTuber;
