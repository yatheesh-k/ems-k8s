import axios from 'axios';
import React from 'react';

const BASE_URL = 'http://192.168.1.163:8092';

export const sendOtpApi = () => {
    return axios.post(`${BASE_URL}/login/ems`)
        .then(response => response.json());
};

export const verifyOtpAndLoginApi = () => {
    return axios.post(`${BASE_URL}/login/validate`)
        .then(response => response.json());
};
 
export const companyRegistationApi = () => {
    return axios.post(`${BASE_URL}/login/`, FormData)
        .then(response => response.json());
};
export const departmentApi = () => {
    return axios.get(`${BASE_URL}/department/all`)
        .then(response => response.json());
};

export const designationApi = () => {
    return axios.get(`${BASE_URL}/designation/all`)
        .then(response => response.json());
};

export const statusApi = () => {
    return axios.get(`${BASE_URL}/status/all`)
        .then(response => response.json());
};

export const roleApi = () => {
    return axios.get(`${BASE_URL}/role/all`)
        .then(response => response.json());
};

export const updateEmployeeApi = (employeeId,data) => {
    return axios.put(`${BASE_URL}/employee/${employeeId}`, data)
        .then(response => response.data());
};

export const employeeRegistrationApi = (data) => {
    return axios.post(`${BASE_URL}/employee/registration`, data)
        .then(response => response.data());
};

export const employeeIdApi = (employeeId) => {
    return axios.get(`${BASE_URL}/employee/${employeeId}`)
        .then(response => response.json());
};