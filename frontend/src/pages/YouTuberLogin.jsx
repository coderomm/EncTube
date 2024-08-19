import { useEffect } from 'react';
import Loader from '../components/Loader';

function YouTuberLogin() {
  useEffect(() => {
    window.location.href = 'https://enctube.onrender.com/api/v1/auth/oauth2callback';
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-img">
      <Loader />
    </div>
  );
}

export default YouTuberLogin;
