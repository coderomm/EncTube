import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/AxiosInstance';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get('/auth/checkAuth');
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (token, username, email, password) => {
    try {
      const response = await axiosInstance.post('/editor/register', { token, username, email, password });
      return { status: response.status, message: response.data.message };
    } catch (error) {
      console.error('Editor Registration failed', error);
      return { status: error.response?.status || 500, message: error.response?.data?.message || 'Editor Registration failed' };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/editor/login', { email, password });
      if (response.status === 200) {
        setUser(response.data.user)
        return { status: response.status, message: response.data.message };
      } else {
        return { status: response.data.status, message: 'Editor Login failed' };
      }
    } catch (error) {
      console.error('Editor Login failed', error);
      return { status: error.response?.status || 500, message: error.response?.data?.message || 'Editor Login failed' };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/editor/logout');
      setUser(null);
      navigate('/home');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };