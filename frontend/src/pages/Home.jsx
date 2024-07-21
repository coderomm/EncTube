// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleYouTuberLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/youtuber'; // URL for YouTuber OAuth login
  };

  const handleEditorLogin = () => {
    navigate('/editor-login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to YT Manager</h1>
        <p className="mb-6">Manage your YouTube channel with ease</p>
        <div className="flex space-x-4">
          <button 
            onClick={handleYouTuberLogin} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Login as YouTuber
          </button>
          <button 
            onClick={handleEditorLogin} 
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Login as Editor
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
