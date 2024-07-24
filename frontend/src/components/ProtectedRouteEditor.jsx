import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRouteEditor = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'Editor') {
    return <Navigate to="/login-editor" />;
  }

  return children;
};

export default ProtectedRouteEditor;
