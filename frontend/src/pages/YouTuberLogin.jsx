import { useEffect } from 'react';
import Loader from '../components/Loader';

function YouTuberLogin() {
  useEffect(() => {
    window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL}/auth/youtuber`;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-img">
      <Loader />
    </div>
  );
}

export default YouTuberLogin;
