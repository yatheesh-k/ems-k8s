import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement

// Create a context for authentication
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(null); // Use null until data is loaded
    const [isInitialized, setIsInitialized] = useState(false); // Initialization state
  
    useEffect(() => {
      const initializeAuth = async () => {
        const token = sessionStorage.getItem('token');
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            setAuthData({
              userId: decodedToken.sub || null,
              userRoles: decodedToken.roles || null,
              company: decodedToken.company || null,
              employeeId: decodedToken.employee || null,
            });
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
        setIsInitialized(true); // Mark initialization as complete
      };
  
      initializeAuth();
    }, []);
  
    // Function to set token and synchronize across tabs
    const setToken = (token) => {
      sessionStorage.setItem('token', token);
      localStorage.setItem('authTokenUpdated', Date.now()); // Trigger storage event
      // Update authData
      try {
        const decodedToken = jwtDecode(token);
        setAuthData({
          userId: decodedToken.sub || null,
          userRoles: decodedToken.roles || null,
          company: decodedToken.company || null,
          employeeId: decodedToken.employee || null,
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
  
    // Function to clear token
    const clearToken = () => {
      sessionStorage.removeItem('token');
      localStorage.setItem('authTokenUpdated', Date.now()); // Trigger storage event
      setAuthData(null); // Clear authData
    };
  
    useEffect(() => {
      const handleStorageChange = (event) => {
        if (event.key === 'authTokenUpdated') {
          const updatedToken = sessionStorage.getItem('token');
          if (updatedToken) {
            try {
              const decodedToken = jwtDecode(updatedToken);
              setAuthData({
                userId: decodedToken.sub || null,
                userRoles: decodedToken.roles || null,
                company: decodedToken.company || null,
                employeeId: decodedToken.employee || null,
              });
            } catch (error) {
              console.error("Error decoding token:", error);
            }
          } else {
            setAuthData(null);
          }
        }
      };
  
      window.addEventListener('storage', handleStorageChange);
  
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }, []);
  
    return (
      <AuthContext.Provider value={{ authData, isInitialized, setToken, clearToken }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  // Custom hook to use the AuthContext
  export const useAuth = () => useContext(AuthContext);
