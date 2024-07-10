import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { companyViewByIdApi, EmployeePayslipGetById} from "../Utils/Axios"; // Ensure these functions are correctly defined in your Utils/Axios file
import { jwtDecode } from "jwt-decode";

const PayslipDoc = () => {
  const [companyData,setCompanyData]=useState([])
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const employeeId = queryParams.get("employeeId");
  const payslipId = queryParams.get("payslipId");
  const { employeeDetails } = location.state || {};

  const [payslipData, setPayslipData] = useState(null);
  useEffect(()=>{
  const fetchCompanyData = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const decodedToken = jwtDecode(token);
      const companyId = decodedToken.sub;
      const response = await companyViewByIdApi(companyId)
      setCompanyData(response.data);
      
    } catch (err) {
      console.log(err)
    }
  };
  console.log(companyData);
    fetchCompanyData();
  },[])

  useEffect(() => {
    const fetchPayslipData = async () => {
      try {
        const response = await EmployeePayslipGetById(employeeId, payslipId);
        setPayslipData(response.data.data);
      } catch (error) {
        console.error("Error fetching payslip data", error);
      }
    };
    if (employeeId && payslipId) {
      fetchPayslipData();
    }
  }, [employeeId, payslipId]);
console.log(payslipData);

  if (!payslipData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-2"  >
      <div className="card">
        <div className="card-header mt-2">
          <div
            className="header-content "
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
             
            }}
          >
            <div>
              <p>
                Pay Slip for the month of : {payslipData.month},{" "}
                {payslipData.year}
              </p>
              <p>Employee Name: {employeeDetails.firstName} {employeeDetails.lastName}</p>
            </div>
            <div>
              <img
                src="/path/to/your/logo.png"
                alt="Company Logo"
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
            </div>
          </div>
        </div>
        <div className="card-body m-0 p-2">
          <div
            className="payslip-details"
            style={{ border: "1px solid black" }}
          >
            <div className="employee-details" style={{ padding: "20px"}}>
              <table
                style={{
                  borderCollapse: "collapse",
                  border: "1px solid black",
                  width: "100%",
                }}
              >
                <tbody>
                  <tr>
                    <th
                      style={{
                        padding: "4px",
                        width: "150px",
                        textAlign: "left",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      Employee ID
                    </th>
                    <td style={{ padding: "4px", textAlign: "left" }}>
                      {employeeDetails.employeeId}
                    </td>
                    <th
                      style={{
                        padding: "4px",
                        width: "150px",
                        textAlign: "left",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      Date of Hiring
                    </th>
                    <td style={{ padding: "4px", textAlign: "left" }}>
                      {employeeDetails.dateOfHiring}
                    </td>
                  </tr>
                  <tr>
                    <th
                      style={{
                        padding: "4px",
                        width: "150px",
                        textAlign: "left",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      Department
                    </th>
                    <td style={{ padding: "4px", textAlign: "left" }}>
                      {employeeDetails.department}
                    </td>
                    <th
                      style={{
                        padding: "4px",
                        width: "150px",
                        textAlign: "left",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      Designation
                    </th>
                    <td style={{ padding: "4px", textAlign: "left" }}>
                      {employeeDetails.designation}
                    </td>
                  </tr>
                  <tr>
                    <th
                      style={{
                        padding: "4px",
                        width: "150px",
                        textAlign: "left",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      Bank Name
                    </th>
                    <td style={{ padding: "4px", textAlign: "left" }}>
                      {employeeDetails.bankName}
                    </td>
                    <th
                      style={{
                        padding: "4px",
                        width: "150px",
                        textAlign: "left",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      Account Number
                    </th>
                    <td style={{ padding: "4px", textAlign: "left" }}>
                      {employeeDetails.accountNo}
                    </td>
                  </tr>
                  <tr>
                    <th
                      style={{
                        padding: "4px",
                        width: "150px",
                        textAlign: "left",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      UAN Number
                    </th>
                    <td style={{ padding: "4px", textAlign: "left" }}>
                      {employeeDetails.uanNo}
                    </td>
                    <th
                      style={{
                        padding: "4px",
                        width: "150px",
                        textAlign: "left",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    ></th>
                    <td
                      style={{
                        padding: "4px",
                        textAlign: "left",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    ></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="lop" style={{ padding: "20px" }}>
              <table
                style={{
                  borderCollapse: "collapse",
                  border: "1px solid black",
                  width: "100%",
                }}
              >
                <tbody>
                  <tr>
                    <th
                      style={{
                        padding: "4px",
                        width: "180px",
                        textAlign: "left",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      Total Working Days
                    </th>
                    <td style={{ padding: "4px", textAlign: "left" }}>0</td>{" "}
                    {/**{totalWorkingDays} */}
                    <th
                      style={{
                        padding: "4px",
                        width: "180px",
                        textAlign: "left",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      Working Days
                    </th>
                    <td style={{ padding: "4px", textAlign: "left" }}>0</td>{" "}
                    {/**{workingDays} */}
                    <th
                      style={{
                        padding: "4px",
                        width: "180px",
                        textAlign: "left",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      LOP
                    </th>
                    <td style={{ padding: "4px", textAlign: "left" }}>0</td>
                    {/**{lop} */}
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              className="line"
              style={{ marginLeft: "50px", marginRight: "50px" }}
            >
              <hr />
            </div>
            <div
              className="salary-details"
              style={{
                display: "flex",
                padding: "20px",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  border: "1px solid black",
                  width: "100%",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "4px",
                        width: "300px",
                        textAlign: "center",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      Earnings (A)
                    </th>
                    <th
                      style={{
                        padding: "4px",
                        width: "300px",
                        textAlign: "center",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        padding: "4px",
                        width: "300px",
                        textAlign: "center",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      Deductions (B)
                    </th>
                    <th
                      style={{
                        padding: "4px",
                        width: "300px",
                        textAlign: "center",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      className="earnings"
                      style={{ padding: "4px", textAlign: "center" }}
                    >
                      Basic Salary
                    </td>
                    <td className="earnings">{payslipData.salary.basicSalary || 0}</td>
                    <td
                      className="deductions"
                      style={{ padding: "4px", textAlign: "center" }}
                    >
                      Income Tax
                    </td>
                    <td className="deductions">{payslipData.salary.deductions.incomeTax || 0}</td>
                  </tr>
                  <tr>
                    <td
                      className="earnings"
                      style={{ padding: "4px", textAlign: "center" }}
                    >
                      HRA
                    </td>
                    <td className="earnings">{payslipData.salary.allowances.hra || 0}</td>
                    <td
                      className="deductions"
                      style={{ padding: "4px", textAlign: "center" }}
                    >
                      PF Tax
                    </td>
                    <td className="deductions">{payslipData.salary.deductions.pfEmployee || 0}</td>
                  </tr>
                  <tr>
                    <td
                      className="earnings"
                      style={{ padding: "4px", textAlign: "center" }}
                    >
                      Special Allowance
                    </td>
                    <td className="earnings">
                      {payslipData.salary.allowances.specialAllowance || 0}
                    </td>
                    <td
                      className="deductions"
                      style={{ padding: "4px", textAlign: "center" }}
                    >
                      PF
                    </td>
                    <td className="deductions">{payslipData.salary.deductions.pfEmployer || 0}</td>
                  </tr>
                  <tr>
                    <td
                      className="earnings"
                      style={{ padding: "4px", textAlign: "center" }}
                    >
                      Other Allowances
                    </td>
                    <td className="earnings">
                      {payslipData.salary.allowances.otherAllowances || 0}
                    </td>
                    <td
                      className="deductions"
                      style={{ padding: "4px", textAlign: "center" }}
                    >
                      Lop
                    </td>
                    <td className="deductions">{payslipData.salary.deductions.lop || 0}</td>
                  </tr>
                  <tr>
                    <td
                      className="earnings"
                      style={{ padding: "4px", textAlign: "center" }}
                    >
                      Travel Allowance
                    </td>
                    <td className="earnings">
                      {payslipData.salary.allowances.travelAllowance || 0}
                    </td>
                    <td
                      className="deductions"
                      style={{ padding: "4px", textAlign: "center" }}
                    >
                      Total Deductions
                    </td>
                    <td className="deductions">
                      {payslipData.salary.deductions.totalDeductions || 0}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              className="line"
              style={{ marginLeft: "50px", marginRight: "50px" }}
            >
              <hr />
            </div>
            <div
              className="details"
              style={{
                display: "flex",
                paddingLeft: "40px",
                paddingRight: "40px",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  border: "1px solid black",
                  width: "100%",
                }}
              >
                <tbody>
                  <tr>
                    <th
                      className="gross-earnings"
                      style={{
                        padding: "4px",
                        width: "300px",
                        textAlign: "center",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      Gross Earnings
                    </th>
                    <td className="gross-earnings">
                      {payslipData.salary.grossAmount || 0}
                    </td>
                    <th
                      className="total-deductions"
                      style={{
                        padding: "4px",
                        width: "300px",
                        textAlign: "center",
                        backgroundColor: "rgb(230, 230, 230)",
                      }}
                    >
                      Net Salary (A-B){" "}
                    </th>
                    <td className="total-deductions">
                      {payslipData.salary.netSalary}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              className="bottom"
              style={{
                marginLeft: "50px",
                marginRight: "50px",
                marginTop: "20px",
                paddingBottom: "0px",
              }}
            >
             
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h5>
                  Net Pay (in words): {payslipData?.netSalaryInWords || ""}
                </h5>
              </div>
            </div>
            <div
              className="bottom"
              style={{
                marginLeft: "50px",
                marginRight: "50px",
                marginTop: "1px",
                paddingBottom: "30px",
              }}
            >
             
             <div className="line">
                <hr />
              </div>
               &nbsp;
               &nbsp;
               &nbsp;
               
            </div>
            {/* <p style={{ textAlign: "end"}}>This is a computer-generated payslip.</p> */}
            <div style={{ display: "flex", justifyContent:"flex-end",marginRight:"40px"}}>
                <h5>
                  Stamp & Sign
                </h5>
              </div>
            
           <div  className="bottom"
              style={{
                marginLeft: "50px",
                marginRight: "50px",
                marginTop: "20px",
                paddingBottom: "3px",
              }}>
                 <div className="line">
                <hr />
              </div>
            <div className="company-details text-center" style={{ padding: "3px" }}>
          <p> {companyData.companyName},</p>
          <p> {companyData.companyAddress},</p>
          <p>Contact No: {companyData.mobileNo}, Mail ID :{companyData.emailId}.</p>
          <p> </p>
        </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipDoc;
