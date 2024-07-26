import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-800 text-white hover:text-gray-50 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">YouTube Uploader</h1>
        <nav className='flex items-center justify-center flex-wrap gap-2'>
          <Link to="/" className="bg-white text-gray-800 px-3 py-2 rounded">Home</Link>
          <Link to="/youtuber-dashboard" className="bg-white text-gray-800 px-3 py-2 rounded">YouTuber Dashboard</Link>
          <Link to="/editor-dashboard" className="bg-white text-gray-800 px-3 py-2 rounded">Editor Dashboard</Link>
        </nav>
      </div>  
    </header>
  );
}

export default Header;
