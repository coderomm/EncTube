import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">YouTube Uploader</h1>
        <nav>
          <Link to="/" className="mr-4 text-white">Home</Link>
          <Link to="/login-youtuber" className="mr-4 text-white">YouTuber Login</Link>
          <Link to="/login-editor" className="mr-4 text-white">Editor Login</Link>
        </nav>
      </div>  
    </header>
  );
}

export default Header;
