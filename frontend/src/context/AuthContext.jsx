import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/AxiosInstance';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [youtuber, setYoutuber] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    checkYoutuber();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get('/auth/checkAuth');
      if (response.data.user) setUser(response.data.user);
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  const checkYoutuber = async () => {
    try {
      const response = await axiosInstance.get('/auth/me/youtuber');
      if (response.data.user) setYoutuber(response.data.user);
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  const register = async (token, username, email, password) => {
    try {
      await axiosInstance.post('/auth/editor/register', { token, username, email, password });
      alert('Editor Registration Successful')
      await login(email, password);
    } catch (error) {
      console.error('Editor Registration failed', error);
      alert('Editor Registration failed', error)
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/editor/login', { email, password });
      if (response.data.user) setUser(response.data.user);
      alert('Editor Login Successful')
      navigate('/editor-dashboard');
    } catch (error) {
      console.error('Editor Login failed', error);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/editor/logout');
      setUser(null);
      alert('Editor logout successful')
      navigate('/home');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, checkAuth, youtuber, checkYoutuber, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
