
// Check if token exists in sessionStorage
const token = sessionStorage.getItem('token');

// Function to decode JWT token
const decodeToken = (token) => {
  if (!token) {
    return null; // or handle as needed if token is not present
  }

  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((char) => {
        return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
};

// Decode the token
const decodedToken = decodeToken(token);

// Extract specific fields only if token exists
export const userId = decodedToken ? decodedToken.sub : null;
export const userRoles = decodedToken ? decodedToken.roles : null;
export const company = decodedToken ? decodedToken.company : null;
export const employeeId = decodedToken ? decodedToken.employee : null;
