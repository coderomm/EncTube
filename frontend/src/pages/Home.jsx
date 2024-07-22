import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Welcome to YouTube Uploader</h2>
      <div className="flex">
        <Link to="/login-youtuber" className="btn">YouTuber Login</Link>
        <Link to="/login-editor" className="btn ml-4">Editor Login</Link>
      </div>
    </div>
  );
}

export default Home;
