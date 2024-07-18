import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadVideo from './components/UploadVideo';
import ApproveVideos from './components/ApproveVideos';
import Register from './components/Register';
import Login from './components/Login';
import LoginYouTuber from './components/LoginYouTuber';
import ApproveAction from './components/ApproveAction';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <header className='border m-3 p-3'>
            <nav>
              <ul className='flex gap-4 items-center flex-wrap'>
                <li className='border bg-[#646cff] px-3 py-2 rounded'><a className='text-white hover:text-[#f0f0f0]' href="/upload">Upload Video</a></li>
                <li className='border bg-[#646cff] px-3 py-2 rounded'><a className='text-white hover:text-[#f0f0f0]' href="/approve">Approve Videos</a></li>
                <li className='border bg-[#646cff] px-3 py-2 rounded'><a className='text-white hover:text-[#f0f0f0]' href="/register">Register</a></li>
                <li className='border bg-[#646cff] px-3 py-2 rounded'><a className='text-white hover:text-[#f0f0f0]' href="/login">Login</a></li>
                <li className='border bg-[#646cff] px-3 py-2 rounded'><a className='text-white hover:text-[#f0f0f0]' href="/login-youtuber">YouTuber Login</a></li>
              </ul>
            </nav>
          </header>
          <main className='border m-3'>
            <Routes>
              <Route path="/upload" element={<ProtectedRoute><UploadVideo /></ProtectedRoute>} />
              <Route path="/approve" element={<ProtectedRoute><ApproveVideos /></ProtectedRoute>} />
              <Route path="/approve" element={<ProtectedRoute><ApproveAction /></ProtectedRoute>} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login-youtuber" element={<LoginYouTuber />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
