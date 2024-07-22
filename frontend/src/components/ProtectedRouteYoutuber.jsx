import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRouteYoutuber = ({ children }) => {
    const { youtuber } = useContext(AuthContext);

    if (!youtuber) {
        return <Navigate to="/login-youtuber" />;
    }

    return children;
};

export default ProtectedRouteYoutuber;
