import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  // Function to log in a user
  const login = async (userData, isLogin) => {
    const endpoint = `http://150.136.47.221:5000/${isLogin ? 'login' : 'register'}`;
    const response = await axios.post(endpoint, userData);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      setIsAuthenticated(true);
      setUser(userData);
    } else {
      throw new Error('Failed to authenticate');
    }
  };

  // Function to check if the user is authenticated
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
      try {
        // Assuming you have a route to validate tokens
        const response = await axios.get('http://150.136.47.221:5000/validate_token', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        console.log('Error validating token:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  };

  // Function to log out a user
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Expose the context values
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
