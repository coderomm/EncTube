import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/AxiosInstance';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get('/auth/checkAuth');
      if (response.data.user) setUser(response.data.user);
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  const register = async (username, email, password, role) => {
    try {
      await axiosInstance.post('/auth/editor/register', { username, email, password, role });
      await login(email, password);
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/editor/login', { email, password });
      setUser(response.data.user);
      if (response.data.user.role === 'YouTuber') {
        navigate('/youtuber-dashboard');
      } else {
        navigate('/editor-dashboard');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/editor/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, checkAuth, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
