import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../services/api'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from token
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Set default headers for all axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const res = await axios.get(`${API_URL}/users/me`);
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);


  const register = async (userData) => {
    try {
      setError(null);
      console.log('Registering user with');
      
      // Make sure userData contains all required fields
      if (!userData.username) {
        console.error('Username is missing from userData');
        setError('Username is required');
        throw new Error('Username is required');
      }
      
      // Create a new object with explicit properties to ensure they're sent correctly
      const registrationData = {
        username: userData.username,
        email: userData.email,
        password: userData.password
      };
      
      console.log('Sending registration data');
      
      // Set the content type explicitly
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const response = await axios.post(`${API_URL}/users/register`, JSON.stringify(registrationData), config);
      //console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };  

  // Login user
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Get user data
      const userResponse = await axios.get(`${API_URL}/users/me`);
      setUser(userResponse.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
