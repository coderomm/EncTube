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
      console.log('response.data.user: ', response.data.user)
      if (response.data.user) {
        setUser(response.data.user);
        return response.data.user;
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
      const registerResponse = await axiosInstance.post('/auth/editor/register', { token, username, email, password });
      console.log('Editor Registration Successful', registerResponse)
      const loginResponse = await login(email, password);
      console.log('loginResponse', loginResponse)
      return loginResponse;
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
    <AuthContext.Provider value={{ user, loading, checkAuth, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };