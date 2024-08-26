import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/AxiosInstance';
import Loader from '../components/Loader';

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
      const { status, data } = await axiosInstance.post('/editor/register', { token, username, email, password });
      return { status, message: data.message };
    } catch (error) {
      console.error('Editor Registration failed:', error);

      const validationErrors = error.response?.data.errors;
      const message = validationErrors ? validationErrors.map(err => err.message).join(', ') : error.response?.data?.message || 'Editor signup failed';

      return {
        status: error.response?.status || 500,
        message
      };
    }
  };

  const login = async (email, password) => {
    try {
      const { status, data } = await axiosInstance.post('/editor/login', { email, password });
      if (status === 200) {
        setUser(data.user);
        return { status, message: data.message };
      } else {
        return { status, message: 'Editor login failed' };
      }
    } catch (error) {
      console.error('Editor Login failed:', error);

      const validationErrors = error.response?.data.errors;
      const message = validationErrors ? validationErrors.map(err => err.message).join(', ') : error.response?.data?.message || 'Editor login failed';

      return {
        status: error.response?.status || 500,
        message
      };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      setUser(null);
      console.log('user after logout:', user)
      navigate('/home');
    } catch (error) {
      console.error('Error fetching pending videos:', error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };