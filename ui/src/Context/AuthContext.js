import React, { createContext, useContext, useEffect, useState } from 'react';
import { EmployeeGetApiById, CompanyImageGetApi } from '../Utils/Axios'; // Import your API functions
import { jwtDecode } from "jwt-decode";

// Create a context for authentication
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: null,
    userRole: null,
    companyName: null,
    employeeId: null,
  });
  const [logoFileName, setLogoFileName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({
          userId: decodedToken.sub,
          userRole: decodedToken.roles,
          company: decodedToken.company,
          employeeId: decodedToken.employeeId,
     
        });
       
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const setAuthUser = (userData) => {
    setUser(userData);
  };
  useEffect(() => {
    if (!user.userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching employee data for userId:", user.userId);
        const response = await EmployeeGetApiById(user.userId);
        const companyId = response.data.companyId; 
        setUser(prevUser => ({ ...prevUser, companyId }));
        await fetchCompanyLogo(companyId);
      } catch (error) {
        console.log("Error fetching employee data:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    const fetchCompanyLogo = async (companyId) => {
      try {
        const logoResponse = await CompanyImageGetApi(companyId);
        if (logoResponse?.data?.data) {
          const logoPath = logoResponse.data.data;
          setLogoFileName(logoPath);
        } else {
          console.error("Response or data is missing");
          setError("Logo not found");
        }
      } catch (err) {
        console.error("Error fetching company logo:", err);
        setError("Error fetching logo");
      }
    };

    fetchData();
  }, [user.userId]); // Re-run when user.userId changes

  useEffect(() => {
    console.log("Current user:", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, logoFileName, loading, error,setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);