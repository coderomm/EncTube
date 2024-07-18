import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      setUser(user);
    }
  }, []);

  const register = (token) => {
    localStorage.setItem('token', token);
    const user = JSON.parse(atob(token.split('.')[1]));
    setUser(user);
    navigate('/');
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    const user = JSON.parse(atob(token.split('.')[1]));
    setUser(user);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
