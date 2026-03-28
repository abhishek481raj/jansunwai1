import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem('jansunwai_token');
    const savedUser = localStorage.getItem('jansunwai_user');
    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // ignore parse error
        }
      }
      authAPI.getMe(savedToken)
        .then((u) => {
          setUser(u);
          localStorage.setItem('jansunwai_user', JSON.stringify(u));
        })
        .catch(() => {
          localStorage.removeItem('jansunwai_token');
          localStorage.removeItem('jansunwai_user');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (phone, password) => {
    const { token: t, user: u } = await authAPI.login(phone, password);
    localStorage.setItem('jansunwai_token', t);
    localStorage.setItem('jansunwai_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const { token: t, user: u } = await authAPI.register(data);
    localStorage.setItem('jansunwai_token', t);
    localStorage.setItem('jansunwai_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('jansunwai_token');
    localStorage.removeItem('jansunwai_user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
