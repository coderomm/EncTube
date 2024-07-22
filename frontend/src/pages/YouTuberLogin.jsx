import React, { useEffect } from 'react';

function YouTuberLogin() {
  useEffect(() => {
    window.location.href = 'http://localhost:5000/api/v1/auth/youtuber';
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button className="btn">Redirecting to Google Login...</button>
    </div>
  );
}

export default YouTuberLogin;
