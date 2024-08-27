import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader'

const ProtectedRouteEditor = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  if (!user || user.role !== 'Editor') {
    return <Navigate to="/editor/login" />;
  }

  return children;
};

export default ProtectedRouteEditor;
