import axios from 'axios';

const BASE_URL = 'http://localhost:8092/ems';
const Login_URL = 'http://localhost:9090/ems';


const token=sessionStorage.getItem("token");

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization':`Bearer ${token}`,
        'Content-Type': 'application/json',
    }
});

// Interceptor to add the token to headers
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = sessionStorage.getItem('token');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return Promise.resolve(config);
//     },
//     () => {
//         return Promise.reject();
//     }
// );


export const loginApi = (data) => {
    return axios.post(`${Login_URL}/emsadmin/login`, data)
        .then(response => {
            const { token, refreshToken } = response.data.data;
            // Store the token and refresh token in sessionStorage
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('refreshToken', refreshToken);

            // Update the token in the axios instance
            axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
            
            return response.data;
        })
        .catch(error=>{
            console.log(error);
        });
};
export const CompanyloginApi = (data) => {
    return axios.post(`${Login_URL}/company/login`, data)
        .then(response => {
            return response.data;
        })
        .catch(error=>{
            console.log(error);
        });
};

// Export your other APIs using the axiosInstance
export const companyRegistationApi = () => axiosInstance.post('/company/');

export const companyViewApi=()=>axiosInstance.get('/company/all')


export const departmentApi = () => axiosInstance.get('/department/all');

export const designationApi = () =>axiosInstance.get('/designation/all');

export const roleApi = () => axiosInstance.get('/role/all');

export const updateEmployeeApi = (employeeId) =>axiosInstance.put(`/employee/${employeeId}`);

export const employeeRegistrationApi = () =>axiosInstance.post('/employee/registration');

export const employeeIdApi = (employeeId) =>axiosInstance.get(`/employee/${employeeId}`)

