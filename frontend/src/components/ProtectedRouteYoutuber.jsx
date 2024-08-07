import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRouteYouTuber = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'YouTuber') {
    return <Navigate to="/youtuber/login" />;
  }

  return children;
};

export default ProtectedRouteYouTuber;
