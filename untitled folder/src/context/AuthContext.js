import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

// Create the authentication context
export const AuthContext = createContext();

// Provider component that wraps your app and makes auth object available via context
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setToken('');
        });
    }
  }, [token]);

  // Logs in user and stores token
  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token } = res.data;
    localStorage.setItem('token', token);
    setToken(token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const profile = await api.get('/auth/me');
    setUser(profile.data);
    return token;
  };

  // Logs out user and clears token
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
    setUser(null);
    setToken('');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access auth context values
export function useAuth() {
  return useContext(AuthContext);
}
