import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if we have a stored token and validate it
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('em_token');
        if (token) {
          try {
            const res = await api.get('/auth/profile');
            setUser(res.data);
          } catch (error) {
            console.error('Session expired or invalid token');
            localStorage.removeItem('em_token');
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, ...userData } = res.data;

    localStorage.setItem('em_token', token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, role = 'user', profileState, profileCity, profileCollege) => {
    const res = await api.post('/auth/register', { name, email, password, role, profileState, profileCity, profileCollege });
    const { token, ...userData } = res.data;

    localStorage.setItem('em_token', token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('em_token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium animate-pulse">Connecting to server...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
