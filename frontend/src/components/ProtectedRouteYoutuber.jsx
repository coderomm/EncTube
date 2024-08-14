import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader'

const ProtectedRouteYouTuber = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  if (!user || user.role !== 'YouTuber') {
    return <Navigate to="/youtuber/login" />;
  }

  return children;
};

export default ProtectedRouteYouTuber;
