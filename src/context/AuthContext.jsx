'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from '@/lib/axios';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const redirectChecked = useRef(false);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData && userData !== 'undefined' && userData !== 'null') {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/login', { username, password });

      const payload = response.data;

      if (payload?.status === 'success') {
        let token = null;
        let user = null;

        if (payload?.admin?.token && payload?.admin?.user) {
          token = payload.admin.token;
          user = payload.admin.user;
        } else if (payload?.data?.token && payload?.data?.user) {
          token = payload.data.token;
          user = payload.data.user;
        } else if (payload?.token && payload?.user) {
          token = payload.token;
          user = payload.user;
        }

        if (!token || !user) {
          console.error('Unexpected login response shape:', payload);
          return { success: false, message: payload?.message || 'Unexpected login response' };
        }

        // Atur LocalStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Atur State
        setUser(user);

        return { success: true };
      } else {
        return { success: false, message: payload?.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/login');
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await axios.put('/update-profile', data);
      
      if (response.data.status === 'success') {
        const userResponse = await axios.get('/me');
        const payload = userResponse.data;
        
        let updatedUser = null;
        if (payload?.data?.user) {
          updatedUser = payload.data.user;
        } else if (payload?.user) {
          updatedUser = payload.user;
        } else if (payload?.admin?.user) {
          updatedUser = payload.admin.user;
        }
        
        if (!updatedUser) {
          console.error('Unexpected /me response shape:', payload);
          return { success: false, message: 'Failed to get updated user data' };
        }
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Update failed' 
      };
    }
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    loading
  };

  useEffect(() => {
    redirectChecked.current = false;
  }, [pathname]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
