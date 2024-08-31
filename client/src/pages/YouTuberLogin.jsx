import { useEffect } from 'react';
import Loader from '../components/Loader';

function YouTuberLogin() {
  useEffect(() => {
    // window.location.href = 'http://localhost:5000/api/v1/auth/youtuber';
    // window.location.href = 'https://enctube.onrender.com/api/v1/auth/youtuber';
    window.location.href = 'https://api.youlayer.tech/api/v1/auth/youtuber';
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-img">
      <Loader />
    </div>
  );
}

export default YouTuberLogin;