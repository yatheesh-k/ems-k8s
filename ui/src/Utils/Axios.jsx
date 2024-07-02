import axios from "axios";
const BASE_URL = "http://localhost:8092/ems";
const Login_URL = "http://localhost:9090/ems";
const token = sessionStorage.getItem("token");
// Create an Axios instance
const axiosInstance = axios.create({

    baseURL: BASE_URL,
    headers:{
      Authorization:`Bearer ${token}`,
      'Access-Control-Allow-Origin':'*/*',
      'Content-Type':'application/json',
      crossDomain:true
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
             // Store the token and refresh token in sessionStorage
             sessionStorage.setItem('token', token);
            //  sessionStorage.setItem('refreshToken', reToken);
            return response.data;
        })
        .catch(error=>{
            console.log(error);
        });
};


      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;  // It is good practice to throw the error after logging it
    });
};
export const CompanyRegistrationApi = (data) => {
  return axiosInstance.post("/company", data);
};

export const companyViewApi = async () => {
  return axiosInstance.get("/company");
};

export const companyViewByIdApi = (id) => {
  return axiosInstance.get(`/company/${id}`)
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.error('Error fetching company by ID:', error);
      throw error; 
    });
};

export const companyDeleteByIdApi = async (companyId) => {
  return axiosInstance.delete(`/company/${companyId}`);
};

export const companyUpdateByIdApi = async (companyId,data) => {
  axiosInstance.patch(`/company/${companyId}`,data);
};

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
  const company=sessionStorage.getItem("company")
    return axiosInstance.post(`${company}/department`,data);
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
const config = {
  headers: { 
    Authorization: `Bearer ${token}`,
  },
};

export const DepartmentPutApiById = (departmentId, data) => {
  const company = sessionStorage.getItem("company");
  return axiosInstance.patch(`${company}/department/${departmentId}`, data,config)
};

export const DesignationGetApi = () => {
  const company=sessionStorage.getItem("company")
    return axiosInstance.get(`${company}/designation`)
    .then(response => {
      return response.data.data; 
    })
    .catch(error => {
      console.error('Error fetching company by ID:', error);
      throw error; 
    });
}

export const DesignationPostApi = (data) => {
  const company=sessionStorage.getItem("company")
    return axiosInstance.post('/designation',data);
}

export const DesignationGetApiById = (designationId) => {
  const company=sessionStorage.getItem("company")
    return axiosInstance.get(`/designation/${designationId}`)
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
  return axiosInstance.get(`/employee/${company}`)
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
    return axiosInstance.get(`/employee/${company}/${employeeId}`)
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
    return axiosInstance.delete(`/employee/${company}/${employeeId}`)
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.error('Error fetching company by ID:', error);
      throw error; 
    });
}

export const EmployeePutApiById = (employeeId, data) => {
  const company = sessionStorage.getItem("company");
  return axios.patch(`/employee/${company}/${employeeId}`, data,config)
};

export const roleApi = () =>{
  return axiosInstance.get("/role/all");
}

export const updateEmployeeApi = (employeeId) =>
  axiosInstance.patch(`/employee/${employeeId}`);
export const employeeRegistrationApi = () =>
  axiosInstance.post("/employee/registration");
export const employeeIdApi = (employeeId) =>
  axiosInstance.get(`/employee/${employeeId}`);
