import axios from "axios";
const BASE_URL = "http://localhost:8092/ems";
const Login_URL = "http://localhost:9090/ems";
const token = sessionStorage.getItem("token");
// Create an Axios instance
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


export const companyDetailsByIdApi = async (companyId) => {
  return axiosInstance.get(`/company/${companyId}`);
}

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
  return axiosInstance.get(`${company}/employee`)
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

export const EmployeePutApiById = (employeeId, data) => {
  const company = sessionStorage.getItem("company");
  return axios.patch(`/employee/${employeeId}`, data)
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








// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { EmployeePayslipGetById, EmployeeGetApiById } from '../Utils/Axios'; // Ensure these functions are correctly defined in your Utils/Axios file

// const numberToWords = (number) => {
//   const words = [
//     '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
//     'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
//   ];

//   const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

//   const convertLessThanThousand = (num) => {
//     if (num === 0) {
//       return '';
//     }
//     if (num < 20) {
//       return words[num];
//     }
//     if (num < 100) {
//       return tens[Math.floor(num / 10)] + ' ' + words[num % 10];
//     }
//     return words[Math.floor(num / 100)] + ' Hundred ' + convertLessThanThousand(num % 100);
//   };

//   if (number === 0) {
//     return 'Zero';
//   }

//   const billions = Math.floor(number / 1000000000);
//   const millions = Math.floor((number % 1000000000) / 1000000);
//   const thousands = Math.floor((number % 1000000) / 1000);
//   const hundreds = Math.floor(number % 1000);

//   let result = '';
//   if (billions > 0) {
//     result += convertLessThanThousand(billions) + ' Billion ';
//   }
//   if (millions > 0) {
//     result += convertLessThanThousand(millions) + ' Million ';
//   }
//   if (thousands > 0) {
//     result += convertLessThanThousand(thousands) + ' Thousand ';
//   }
//   if (hundreds > 0) {
//     result += convertLessThanThousand(hundreds);
//   }

//   return result.trim();
// };

// const PayslipDoc = () => {
//   const [employeeSalaryView, setEmployeeSalaryView] = useState([]);
//   const [employeeDetails, setEmployeeDetails] = useState({});
//   const location = useLocation();
//   const { id, payslipId } = location.state || {};

//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       if (id && payslipId) {
//         try {
//           const [salaryResponse, detailsResponse] = await Promise.all([
//             EmployeePayslipGetById(id, payslipId),
//             EmployeeGetApiById(id)
//           ]);

//           console.log('Salary data received:', salaryResponse.data);
//           setEmployeeSalaryView(salaryResponse.data.data);

//           console.log('Employee details received:', detailsResponse.data);
//           setEmployeeDetails(detailsResponse.data);
//         } catch (error) {
//           console.error('Error fetching employee data:', error);
//         }
//       }
//     };

//     fetchEmployeeData();
//   }, [id, payslipId]);

//   const netPayInWords = (netPay) => {
//     return numberToWords(netPay);
//   };

//   return (
//     <div className="container-fluid p-0">
//       <div className="container">
//         {employeeSalaryView.length > 0 && (
//           employeeSalaryView.map((item, index) => (
//             <div key={index}>
//               <div className="main" style={{ backgroundColor: 'rgb(216, 213, 213)', backgroundSize: 'cover' }}>
//                 <div className="pdfPage" style={{ backgroundColor: 'white', height: 'auto', width: '100%', borderColor: 'black' }}>
//                   <div className="top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '50px' }}>
//                     <table style={{ border: 'none', marginTop: '60px' }}>
//                       <tbody>
//                         <tr>
//                           <td style={{ width: '50%', border: 'none' }}>
//                             <h4 id="monthYear" style={{ padding: '2px', textAlign: "left" }}>Month/ Year: {item.month} {item.year}</h4>
//                             <h4 id="employeeName" style={{ padding: '2px', textAlign: "left" }}>Employee Name: {employeeDetails.firstName} {employeeDetails.lastName}</h4>
//                           </td>
//                           <td className='col-4 border-0'>
//                             <img src="assets/pathbreakertech-logo.png" alt="Logo" style={{ marginRight: "60px", height: '100px' }} />
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                   <div className="line" style={{ marginLeft: '50px', marginRight: '50px' }}>
//                     <hr />
//                   </div>
//                   <div className="details" style={{ display: 'flex', paddingLeft: '40px', paddingRight: '40px', paddingTop: '10px', paddingBottom: '10px' }}>
//                     <table style={{ borderCollapse: 'collapse', border: '1px solid black', width: '100%' }}>
//                       <tbody>
//                         <tr>
//                           <th colSpan={4} className="employee-details" style={{ backgroundColor: 'rgb(230, 230, 235)', fontWeight: 'bold', padding: '4px', textAlign: 'center' }}>Employee Details</th>
//                         </tr>
//                         <tr>
//                           <th style={{ padding: '4px', width: '160px', backgroundColor: 'white' }}>EmployeeId</th>
//                           <td>{employeeDetails.employeeId}</td>
//                           <th style={{ padding: '4px', width: '160px', backgroundColor: 'white' }}>Joining Date</th>
//                           <td>{employeeDetails.dateOfHiring}</td>
//                         </tr>
//                         <tr>
//                           <th style={{ padding: '4px', width: '160px', backgroundColor: 'white' }}>Date Of Birth</th>
//                           <td>{employeeDetails.dateOfBirth}</td>
//                           <th style={{ padding: '4px', width: '160px', backgroundColor: 'white' }}>PAN</th>
//                           <td>{employeeDetails.panNo}</td>
//                         </tr>
//                         <tr>
//                           <th style={{ padding: '4px', width: '160px', backgroundColor: 'white' }}>Department</th>
//                           <td>{employeeDetails.department}</td>
//                           <th style={{ padding: '4px', width: '160px', backgroundColor: 'white' }}>UAN</th>
//                           <td>{employeeDetails.uanNo}</td>
//                         </tr>
//                         <tr>
//                           <th style={{ padding: '4px', width: '160px', backgroundColor: 'white' }}>Designation</th>
//                           <td>{employeeDetails.designation}</td>
//                           <th style={{ padding: '4px', width: '160px', backgroundColor: 'white' }}>Location</th>
//                           <td>{employeeDetails.location}</td>
//                         </tr>
//                         <tr>
//                           <td colSpan={4} className="employee-details" style={{ padding: '4px', textAlign: 'center' }}>
//                             Bank ACC No: {employeeDetails.accountNo}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; IFSC: {employeeDetails.ifscCode}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Bank: {employeeDetails.bankName}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                   <div className="details" style={{ display: 'flex', paddingLeft: '40px', paddingRight: '40px', paddingTop: '10px', paddingBottom: '10px' }}>
//                     <table style={{ borderCollapse: 'collapse', border: '1px solid black', width: '100%' }}>
//                       <tbody>
//                         <tr>
//                           <th style={{ padding: '4px', width: '160px', backgroundColor: 'rgb(230, 230, 230)' }}>Total Working Days</th>
//                           <td>{item.totalWorkingDays}</td>
//                           <th style={{ padding: '4px', width: '160px', backgroundColor: 'rgb(230, 230, 230)' }}>Working Days</th>
//                           <td>{item.workingDays}</td>
//                           <th style={{ padding: '4px', width: '160px', backgroundColor: 'rgb(230, 230, 230)' }}>Lop</th>
//                           <td>{item.salary.deductions.lop}</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                   <div className="details" style={{ display: 'flex', paddingLeft: '40px', paddingRight: '40px', paddingTop: '10px', paddingBottom: '10px' }}>
//                     <table style={{ borderCollapse: 'collapse', border: '1px solid black', width: '100%' }}>
//                       <tbody>
//                         <tr>
//                           <th className="earnings" style={{ backgroundColor: 'rgb(230, 230, 230)', fontWeight: 'bold', padding: '4px', textAlign: 'center' }}>Earnings</th>
//                           <th className="deductions" style={{ backgroundColor: 'rgb(230, 230, 230)', fontWeight: 'bold', padding: '4px', textAlign: 'center' }}>Deductions</th>
//                         </tr>
//                         <tr>
//                           <td>
//                             <table style={{ borderCollapse: 'collapse', border: 'none', width: '100%' }}>
//                               <tbody>
//                                 {Object.entries(item.salary.earnings).map(([key, value]) => (
//                                   <tr key={key}>
//                                     <td style={{ padding: '4px', width: '50%', backgroundColor: 'white' }}>{key}</td>
//                                     <td style={{ padding: '4px', width: '50%', backgroundColor: 'white' }}>{value}</td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </td>
//                           <td>
//                             <table style={{ borderCollapse: 'collapse', border: 'none', width: '100%' }}>
//                               <tbody>
//                                 {Object.entries(item.salary.deductions).map(([key, value]) => (
//                                   <tr key={key}>
//                                     <td style={{ padding: '4px', width: '50%', backgroundColor: 'white' }}>{key}</td>
//                                     <td style={{ padding: '4px', width: '50%', backgroundColor: 'white' }}>{value}</td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </td>
//                         </tr>
//                         <tr>
//                           <td style={{ padding: '4px', width: '50%', backgroundColor: 'rgb(230, 230, 230)' }}>Gross Salary: {item.salary.grossSalary}</td>
//                           <td style={{ padding: '4px', width: '50%', backgroundColor: 'rgb(230, 230, 230)' }}>Total Deductions: {item.salary.totalDeductions}</td>
//                         </tr>
//                         <tr>
//                           <td style={{ padding: '4px', width: '50%', backgroundColor: 'rgb(230, 230, 230)' }}>Net Pay: {item.salary.netPay}</td>
//                           <td style={{ padding: '4px', width: '50%', backgroundColor: 'rgb(230, 230, 230)' }}>Net Pay in Words: {netPayInWords(item.salary.netPay)}</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                   <div className="details" style={{ display: 'flex', paddingLeft: '40px', paddingRight: '40px', paddingTop: '10px', paddingBottom: '10px' }}>
//                     <table style={{ borderCollapse: 'collapse', border: '1px solid black', width: '100%' }}>
//                       <tbody>
//                         <tr>
//                           <th className="issued-by" style={{ backgroundColor: 'rgb(230, 230, 230)', fontWeight: 'bold', padding: '4px', textAlign: 'center' }}>Issued By</th>
//                           <th className="issued-on" style={{ backgroundColor: 'rgb(230, 230, 230)', fontWeight: 'bold', padding: '4px', textAlign: 'center' }}>Issued On</th>
//                           <th className="authorized-by" style={{ backgroundColor: 'rgb(230, 230, 230)', fontWeight: 'bold', padding: '4px', textAlign: 'center' }}>Authorized By</th>
//                         </tr>
//                         <tr>
//                           <td style={{ padding: '4px', width: '33%', backgroundColor: 'white' }}>{item.issuedBy}</td>
//                           <td style={{ padding: '4px', width: '33%', backgroundColor: 'white' }}>{item.issuedOn}</td>
//                           <td style={{ padding: '4px', width: '33%', backgroundColor: 'white' }}>{item.authorizedBy}</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default PayslipDoc;

