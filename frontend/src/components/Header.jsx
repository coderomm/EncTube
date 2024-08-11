import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-800 text-white hover:text-gray-50 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href='/' className="text-xl font-bold">EncTube</a>
        <nav className='flex items-center justify-center flex-wrap gap-2'>
          <Link to="/" className="bg-white text-gray-800 px-2 py-1 rounded">Home</Link>
          <Link to="/youtuber/dashboard" className="bg-white text-gray-800 px-2 py-1 rounded">YouTuber</Link>
          <Link to="/editor/dashboard" className="bg-white text-gray-800 px-2 py-1 rounded">Editor</Link>
        </nav>
      </div>  
    </header>
  );
}

export default Header;
