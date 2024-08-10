// authUtils.js
import { jwtDecode } from 'jwt-decode';

// Check if token exists in localStorage
const token = localStorage.getItem('token');

// Decode the token using jwt-decode
const decodedToken = token ? jwtDecode(token) : null;

// Extract specific fields only if token exists
export const userId = decodedToken ? decodedToken.sub : null;
export const userRoles = decodedToken ? decodedToken.roles : null;
export const company = decodedToken ? decodedToken.company : null;
export const employeeId = decodedToken ? decodedToken.employee : null;

console.log('Token:', token);
console.log('Decoded Token:', decodedToken);
console.log('User ID:', userId);
console.log('User Roles:', userRoles);
console.log('Company:', company);
console.log('Employee ID:', employeeId);
