import { jwtDecode } from "jwt-decode";

// Function to get decoded token data
const getDecodedToken = () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    return jwtDecode(token);
  }
  return null;
};

// Get user ID and roles from decoded token
const decodedToken = getDecodedToken();
export const userId = decodedToken ? decodedToken.sub : null;
export const userRoles = decodedToken ? decodedToken.roles : null;
export const company = decodedToken ? decodedToken.company: null;
