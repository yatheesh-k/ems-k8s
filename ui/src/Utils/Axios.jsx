import axios from "axios";

const protocol = window.location.protocol;
const hostname = window.location.hostname;

const BASE_URL = `${protocol}//${hostname}:8092/ems`;
const Login_URL = `${protocol}//${hostname}:9090/ems`;

console.log('BASE_URL:', BASE_URL);
console.log('Login_URL:', Login_URL);


const token = sessionStorage.getItem("token");
// const decodedToken = jwtDecode(token);
// const companyId = decodedToken.sub;

// console.log('Decoded Token:', decodedToken);
// console.log('Company ID:', companyId);

const axiosInstance = axios.create({

    baseURL: BASE_URL,
    headers:{
      Authorization:`Bearer ${token}`,
      // 'Access-Control-Allow-Origin':'*/*',
      // 'Content-Type':'application/json',
      // crossDomain:true
    }

});

export const loginApi = (data) => {
  return axios
    .post(`${Login_URL}/emsadmin/login`, data)
    .then((response) => {
      const { token, refreshToken } = response.data.data;
      // Store the token and refresh token in sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("refreshToken", refreshToken);
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const {
          path,
          error: { message },
        } = error.response.data;
        console.log(`Error at ${path}: ${message}`);
        return Promise.reject(message); // Optionally, you can reject with the message
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error);
    });
};
export const CompanyloginApi = (data) => {

    return axios.post(`${Login_URL}/company/login`, data)
        .then(response => {
          const { token, refreshToken } = response.data.data;
          // Store the token and refresh token in sessionStorage
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("refreshToken", refreshToken);
            return response.data;
        })
        .catch(error=>{
            console.log(error);
        });
};

export const ValidateOtp=(data)=>{
   return axiosInstance.post(`${Login_URL}/validate`,data);
}

export const forgotPasswordStep1=(data)=>{
  return axios.post(`${Login_URL}/forgot/password`, data);
}

export const forgotPasswordStep2=(data)=>{
  return axios.post(`${Login_URL}/update/password`, data);
}

export const resetPassword=(data,companyId)=>{
  return axiosInstance.patch(`/company/password/${companyId}`, data);
}

export const CompanyRegistrationApi = (data) => {
  return axiosInstance.post("/company", data);
};

export const companyViewApi = async () => {
  return axiosInstance.get("/company");
};

export const companyViewByIdApi = (companyId) => {
  return axiosInstance.get(`/company/${companyId}`)
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.error('Error fetching company by ID:', error);
      throw error; 
    });
};


export const companyDetailsByIdApi = async (companyId) => {
  return axiosInstance.get(`/company/${companyId}`);
}

export const companyDeleteByIdApi = async (companyId) => {
  return axiosInstance.delete(`/company/${companyId}`);
};

export const companyUpdateByIdApi = async (companyId,data) => {
  axiosInstance.patch(`/company/${companyId}`,data);
};

export const companyPasswordUpdateById = async (companyId) => {
  axiosInstance.path(`/company/password/${companyId}`);
}

export const DepartmentGetApi = () => {
  const company=sessionStorage.getItem("company")
    return axiosInstance.get(`${company}/department`)
    .then(response => {
      return response.data.data; 
    })
    .catch(error => {
      console.error('Error fetching company by ID:', error);
      throw error; 
    });
}
export const DepartmentPostApi = (data) => {
    return axiosInstance.post("/department",data);
}
export const DepartmentGetApiById = (departmentId) => {
  const company=sessionStorage.getItem("company")
    return axiosInstance.get(`${company}/department/${departmentId}`)
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.error('Error fetching company by ID:', error);
      throw error; 
    });
}

export const DepartmentDeleteApiById = (departmentId) => {
  const company=sessionStorage.getItem("company")
    return axiosInstance.delete(`${company}/department/${departmentId}`)
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.error('Error fetching company by ID:', error);
      throw error; 
    });
}

export const DepartmentPutApiById = (departmentId, data) => {
  const company = sessionStorage.getItem("company");
  return axiosInstance.patch(`${company}/department/${departmentId}`, data)
};

export const DesignationGetApi = () => {
  const company=sessionStorage.getItem("company")
    return axiosInstance.get(`${company}/designations`)
    .then(response => {
      return response.data.data;  
    })
    .catch(error => {
      console.error('Error fetching company by ID:', error);
      throw error; 
    });
}

export const DesignationPostApi = (data) => {
    return axiosInstance.post('/designation',data);
}

export const DesignationGetApiById = (designationId) => {
  const company=sessionStorage.getItem("company")
    return axiosInstance.get(`${company}/designation/${designationId}`)
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.error('Error fetching company by ID:', error);
      throw error; 
    });
}

export const DesignationDeleteApiById = (designationId) => {
  const company=sessionStorage.getItem("company")
    return axiosInstance.delete(`${company}/designation/${designationId}`)
}

export const DesignationPutApiById = (designationId, data) => {
  const company = sessionStorage.getItem("company");
  return axiosInstance.patch(`${company}/designation/${designationId}`, data  )
};


export const EmployeeGetApi = () => {
  const company = sessionStorage.getItem("company");
  return axiosInstance.get(`/${company}/employee`)
    .then(response => response.data.data) // Assuming response.data.data contains your employee data
    .catch(error => {
      console.error('Error fetching employee data:', error);
      return []; // Return empty array or handle error as needed
    });
}

export const EmployeePostApi = (data) => {
  const company=sessionStorage.getItem("company")
    return axiosInstance.post('/employee',data);
}

export const EmployeeGetApiById = (employeeId) => {
  const company=sessionStorage.getItem("company")
    return axiosInstance.get(`/${company}/employee/${employeeId}`)
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.error('Error fetching company by ID:', error);
      throw error; 
    });
}

export const EmployeeDeleteApiById = (employeeId) => {
  const company=sessionStorage.getItem("company")
    return axiosInstance.delete(`/${company}/employee/${employeeId}`)
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.error('Error fetching company by ID:', error);
      throw error; 
    });
}

export const EmployeePatchApiById = (employeeId, data) => {
  const company = sessionStorage.getItem("company");
  return axiosInstance.patch(`/${company}/employee/${employeeId}`, data)
};

export const roleApi = () =>{
  return axiosInstance.get("/role/all");
}


export const EmployeeSalaryPostApi=(employeeId,data)=>{
  return axiosInstance.post(`/${employeeId}/salary`,data);
}

export const EmployeeSalaryGetApi=(employeeId)=>{
  const company = sessionStorage.getItem("company")
  return axiosInstance.get(`/${company}/employee/${employeeId}/salaries`);
}

export const EmployeeSalaryGetApiById=(employeeId,salaryId)=>{
  const company = sessionStorage.getItem("company")
  return axiosInstance.get(`/${company}/employee/${employeeId}/salary/${salaryId}`);
}

export const EmployeeSalaryPatchApiById=(employeeId,salaryId,data)=>{
  const company = sessionStorage.getItem("company")
  return axiosInstance.patch(`/employee/${employeeId}/salary/${salaryId}`,data);
}

export const EmployeeSalaryDeleteApiById=(employeeId,salaryId)=>{
  const company = sessionStorage.getItem("company")
  return axiosInstance.delete(`/${company}/employee/${employeeId}/salary/${salaryId}`);
}

export const EmployeePayslipGenerationPostById=(employeeId,salaryId,data) =>{
  return axiosInstance.post(`/${employeeId}/salary/${salaryId}`,data);
}

export const EmployeePayslipGeneration=(data) =>{
  return axiosInstance.post("/salary",data);
}

export const EmployeePayslipGetById=(employeeId,paysliId)=>{
  const company = sessionStorage.getItem("company")
    return axiosInstance.get(`/${company}/employee/${employeeId}/payslip/${paysliId}`);
  
}

export const EmployeePayslipsGet=(employeeId)=>{
  const company = sessionStorage.getItem("company")
  return axiosInstance.get(`/${company}/employee/${employeeId}/payslips`);
}

export const EmployeePayslipDeleteById=(employeeId,payslipId)=>{
  const company = sessionStorage.getItem("company")
  return axiosInstance.delete(`/${company}/employee/${employeeId}/payslip/${payslipId}`);
}

export const AttendanceManagementApi=(formData)=>{
  const company = sessionStorage.getItem("company")
  return axiosInstance.post(`/${company}/employee/attendance`,formData);
}

export const AttendanceReportApi=(employeeId,month,year)=>{
  const company = sessionStorage.getItem("company")
  return axiosInstance.get(`/${company}/employee/${employeeId}/attendance`,{
    params:{month,year}
  });
}

export const AttendancePatchById=(employeeId,attendanceId,data)=>{
  const company = sessionStorage.getItem("company")
  return axiosInstance.patch(`/${company}/employee/${employeeId}/attendance/${attendanceId}`,data);
}

export const AttendanceDeleteById=(employeeId,attendanceId)=>{
  const company= sessionStorage.getItem("company")
  return axiosInstance.delete(`/${company}/employee/${employeeId}/attendance/${attendanceId}`);
}






