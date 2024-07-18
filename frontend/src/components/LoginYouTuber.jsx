import React from 'react';

const LoginYouTuber = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth';
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">YouTuber Login</h2>
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">Login with Google</button>
    </div>
  );
};

export default LoginYouTuber;