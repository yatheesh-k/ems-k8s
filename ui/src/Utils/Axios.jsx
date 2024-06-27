import axios from 'axios';

const BASE_URL = 'http://localhost:8092/ems';
const Login_URL = 'http://localhost:9090/ems';


const token=sessionStorage.getItem("token");

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// Intercept requests to add JWT token to headers
axiosInstance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  

export const loginApi = (data) => {
    return axios.post(`${Login_URL}/emsadmin/login`, data)
        .then(response => {
            const { token, refreshToken } = response.data.data;
            // Store the token and refresh token in sessionStorage
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('refreshToken', refreshToken);
            return response.data;
        })
        .catch(error=>{
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const { path, error: { message } } = error.response.data;
                console.log(`Error at ${path}: ${message}`);
                return Promise.reject(message); // Optionally, you can reject with the message
              } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
              }
            console.log(error);
        });
};
export const CompanyloginApi = (data) => {
    return axios.post(`${Login_URL}/company/login`, data)
        .then(response => {
             // Store the token and refresh token in sessionStorage
             sessionStorage.setItem('token', token);
            //  sessionStorage.setItem('refreshToken', reToken);
            return response.data;
        })
        .catch(error=>{
            console.log(error);
        });
};

// Export your other APIs using the axiosInstance
export const CompanyRegistrationApi = async (data) => {
    try {
      const response = await axiosInstance.post('/company', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
export const companyViewApi= async () => {
    try {
      const response = await axiosInstance.get('/company/all');
      return response.data;
    } catch (error) {
      throw error;
    } 
  };

  export const companyViewByIdApi= async (companyId) => {
    try {
      const response = await axiosInstance.get(`/company/${companyId}`);
      return response.data;
    } catch (error) {
      throw error;
    } 
  };

  export const companyDeleteByIdApi= async (companyId) => {
    try {
      const response = await axiosInstance.delete(`/company/${companyId}`);
      return response.data;
    } catch (error) {
      throw error;
    } 
  };

  export const companyUpdateByIdApi= async (companyId) => {
    try {
      const response = await axiosInstance.put(`/company/${companyId}`);
      return response.data;
    } catch (error) {
      throw error;
    } 
  };


  export const employeeAddApi= async (data) => {
    try {
      const response = await axiosInstance.post('/employee', data);
      return response.data;
    } catch (error) {
      throw error;
    } 
  };

  export const employeeViewApi= async () => {
    try {
      const response = await axiosInstance.get('/employee/all');
      return response.data;
    } catch (error) {
      throw error;
    } 
  };

  export const employeeViewById= async (employeeId) => {
    try {
      const response = await axiosInstance.get(`/company/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error;
    } 
  };

  export const employeeUpdateByIdApi= async (employeeId) => {
    try {
      const response = await axiosInstance.put(`/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error;
    } 
  };

  export const employeeDeleteByIdApi= async (employeeId) => {
    try {
      const response = await axiosInstance.delete(`/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error;
    } 
  };

  











export const departmentApi = () => axiosInstance.get('/department/all');

export const designationApi = () =>axiosInstance.get('/designation/all');

export const roleApi = () => axiosInstance.get('/role/all');

export const updateEmployeeApi = (employeeId) =>axiosInstance.put(`/employee/${employeeId}`);

export const employeeRegistrationApi = () =>axiosInstance.post('/employee/registration');

export const employeeIdApi = (employeeId) =>axiosInstance.get(`/employee/${employeeId}`)

