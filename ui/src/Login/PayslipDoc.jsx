import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CompanyImageGetApi, companyViewByIdApi, EmployeeGetApiById, EmployeePaySlipDownloadById, EmployeePayslipGetById } from "../Utils/Axios"; // Ensure these functions are correctly defined in your Utils/Axios file
import { toast } from "react-toastify";
import LayOut from "../LayOut/LayOut";
import { userId } from "../Utils/Auth";
import { Download } from "react-bootstrap-icons";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

const PayslipDoc = () => {
  const [companyData, setCompanyData] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const employeeId = queryParams.get("employeeId");
  const payslipId = queryParams.get("payslipId");
  const { employeeDetails } = location.state || {};
  const [payslipData, setPayslipData] = useState(null);
  //const [logoFileName, setLogoFileName] = useState([]);
  const {  logoFileName} = useAuth();

  // const fetchCompanyLogo = async (companyId) => {
  //   try {
  //     const logoResponse = await CompanyImageGetApi(companyId);
  //     console.log("Full logo response:", logoResponse.data.data);
  //     if (logoResponse && logoResponse.data && logoResponse.data.data) {
  //       const logoPath = logoResponse.data.data;
  //       // Extracting filename from path
  //       const fileName = logoPath.split('\\').pop();
  //       // Set state with filename
  //       setLogoFileName(fileName);
  //       console.log("fileName", fileName);
  //     } else {
  //       console.error("Response or data is missing");
  //     }
  //   } catch (err) {
  //     console.error("Error fetching company logo:", err);
  //   }
  // };

  const fetchCompanyData = async (companyId) => {
    try {
      const response = await companyViewByIdApi(companyId)
      setCompanyData(response.data);

    } catch (err) {
      console.log(err)
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await EmployeeGetApiById(userId);
        // Extract companyId from response
        console.log(response.data.companyId)
        const companyId = response.data.companyId;
        console.log(companyId);
        fetchCompanyData(companyId)
      } catch (error) {
        // handleApiErrors(error);
      }
    };
    fetchData();
  }, [userId]);


  useEffect(() => {
    const fetchPayslipData = async () => {
      if (!employeeId || !payslipId) return;

      try {
        const response = await EmployeePayslipGetById(employeeId, payslipId);
        setPayslipData(response.data.data);
      } catch (error) {
        // handleApiErrors(error)
      }
    };
    if (employeeId && payslipId) {
      fetchPayslipData();
    }
  }, [employeeId, payslipId]);
  const handleDownload = async () => {
    if (employeeId && payslipId) {
      try {
        await EmployeePaySlipDownloadById(employeeId, payslipId);
      } catch (error) {
        console.error('Error downloading payslip:', error);
      }
    } else {
      console.error('Employee ID or Payslip ID is missing');
    }
  };

  if (!payslipData) {
    return <div>Loading...</div>;
  }


  const handleApiErrors = (error) => {
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
      const errorMessage = error.response.data.error.message;
      toast.error(errorMessage);
    } else {
      toast.error("Network Error !");
    }
    console.error(error.response);
  };

  const maskPanNumber = (panNumber) => {
    if (!panNumber || panNumber.length < 4) return panNumber;
    const maskedPart = panNumber.slice(0, -4).replace(/./g, '*');
    const visiblePart = panNumber.slice(-4);
    return maskedPart + visiblePart;
  };

  return (
    <LayOut>
      <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
        <div className="col">
          <h1 className="h3 mb-3">
            <strong>PaySlip</strong>
          </h1>
        </div>
        <div className="col-auto" style={{ paddingBottom: '20px' }}>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/main">Home</a>
              </li>
              <li className="breadcrumb-item"><a href="/payslipsList">Payslip View</a></li>
              <li className="breadcrumb-item active">PaySlipForm</li>
            </ol>
          </nav>
        </div>
      </div>
      <div className="container mt-2" style={{ pointerEvents: "none" }}>
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
                  PaySlip for the month of : <b>
                    {payslipData.month} {" "}
                    {payslipData.year}
                  </b>
                </p>
                <p>Employee Name: <b>{employeeDetails.firstName} {employeeDetails.lastName}</b></p>
              </div>
              <div>
                {logoFileName ? (
                  <img
                    className="align-middle"
                    src={`${logoFileName}`} // Dynamic source based on logoFileName
                    alt="Logo"
                    style={{ height: "80px", width: "180px" }}
                  />
                ) : (
                  <p>Logo</p>
                )}
              </div>
            </div>
          </div>
          <div className="card-body m-0 p-2">
            <div
              className="payslip-details"
              style={{ border: "1px solid black" }}
            >
              <div style={{ padding: "20px" }}>
                <table
                  style={{
                    borderCollapse: "collapse",
                    border: "1px solid black",
                    width: "100%",
                  }}
                  className="hover-none"
                >
                  <tbody>
                    <tr>
                      <th
                        style={{
                          padding: "4px",
                          width: "150px",
                          textAlign: "left"
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
                          textAlign: "left"
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
                        }}
                      >
                        Department
                      </th>
                      <td style={{ padding: "4px", textAlign: "left" }}>
                        {employeeDetails.departmentName}
                      </td>
                      <th
                        style={{
                          padding: "4px",
                          width: "150px",
                          textAlign: "left",
                        }}
                      >
                        Designation
                      </th>
                      <td style={{ padding: "4px", textAlign: "left" }}>
                        {employeeDetails.designationName}
                      </td>
                    </tr>
                    <tr>
                      <th
                        style={{
                          padding: "4px",
                          width: "150px",
                          textAlign: "left",
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
                        }}
                      >
                        Account Number
                      </th>
                      <td style={{ padding: "4px", textAlign: "left" }}>
                      {maskPanNumber(employeeDetails.accountNo)}
                      </td>
                    </tr>
                    <tr>
                      <th
                        style={{
                          padding: "4px",
                          width: "150px",
                          textAlign: "left",
                        }}
                      >
                        UAN Number
                      </th>
                      <td style={{ padding: "4px", textAlign: "left" }}>
                        {maskPanNumber(employeeDetails.uanNo)}
                      </td>
                      <th
                        style={{
                          padding: "4px",
                          width: "150px",
                          textAlign: "left",
                        }}
                      >
                        PAN Number
                      </th>
                      <td
                        style={{
                          padding: "4px",
                          textAlign: "left"
                        }}>
                        {maskPanNumber(employeeDetails.panNo)}
                      </td>
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
                        }}
                      >
                        Total Working Days
                      </th>
                      <td style={{ padding: "4px", textAlign: "left" }}> {payslipData.attendance.totalWorkingDays || 0}</td>{" "}
                      {/**{totalWorkingDays} */}
                      <th
                        style={{
                          padding: "4px",
                          width: "180px",
                          textAlign: "left",
                        }}
                      >
                        Working Days
                      </th>
                      <td style={{ padding: "4px", textAlign: "left" }}>{payslipData.attendance.noOfWorkingDays || 0}</td>{" "}
                      {/**{workingDays} */}
                      <th
                        style={{
                          padding: "4px",
                          width: "180px",
                          textAlign: "left",
                        }}
                      >
                        Total Leaves
                      </th>
                      <td style={{ padding: "4px", textAlign: "left" }}>{payslipData.attendance.totalWorkingDays - payslipData.attendance.noOfWorkingDays || 0}</td>
                      {/**{lop} */}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="salary-details" style={{ display: "flex", padding: "20px", paddingTop: "10px", paddingBottom: "10px" }}>
                <table style={{ borderCollapse: "collapse", border: "1px solid black", width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "4px", width: "300px", textAlign: "center" }}>Earnings (A)</th>
                      <th style={{ padding: "4px", width: "300px", textAlign: "center" }}>Amount</th>
                      <th style={{ padding: "4px", width: "300px", textAlign: "center" }}>Deductions (B)</th>
                      <th style={{ padding: "4px", width: "300px", textAlign: "center" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="earnings" style={{ padding: "4px", textAlign: "center" }}>Basic Salary</td>
                      <td className="earnings">{payslipData.salary.basicSalary || 0}</td>
                      <td className="deductions" style={{ padding: "4px", textAlign: "center" }}>PF Employer</td>
                      <td className="deductions">{payslipData.salary.deductions.pfEmployer || 0}</td>
                    </tr>
                    <tr>
                      <td className="earnings" style={{ padding: "4px", textAlign: "center" }}>HRA</td>
                      <td className="earnings">{payslipData.salary.allowances.hra || 0}</td>
                      <td className="deductions" style={{ padding: "4px", textAlign: "center" }}>PF Employee</td>
                      <td className="deductions">{payslipData.salary.deductions.pfEmployee || 0}</td>
                    </tr>
                    <tr>
                      <td className="earnings" style={{ padding: "4px", textAlign: "center" }}>Special Allowance</td>
                      <td className="earnings">{payslipData.salary.allowances.specialAllowance || 0}</td>
                      <td className="deductions" style={{ padding: "4px", textAlign: "center" }}>LOP</td>
                      <td className="deductions">{payslipData.salary.deductions.lop || 0}</td>
                    </tr>
                    <tr>
                      <td className="earnings" style={{ padding: "4px", textAlign: "center" }}>Travel Allowance</td>
                      <td className="earnings">{payslipData.salary.allowances.travelAllowance || 0}</td>
                      <td className="deductions" style={{ padding: "4px", textAlign: "center" }}>Total Deductions (B)</td>
                      <td className="deductions">{payslipData.salary.deductions.totalDeductions || 0}</td>
                    </tr>
                    <tr>
                      <td className="earnings" style={{ padding: "4px", textAlign: "center" }}>Other Allowance</td>
                      <td className="earnings">{payslipData.salary.allowances.otherAllowances || 0}</td>
                      <th style={{ padding: "4px", width: "300px", textAlign: "center" }}>Taxes (C)</th>
                      <th style={{ padding: "4px", width: "300px", textAlign: "center" }}>Amount</th>
                    </tr>
                    <tr>
                      <td className="earnings" style={{ padding: "4px", textAlign: "center" }}>PF Contribution Employee</td>
                      <td className="earnings">{payslipData.salary.allowances.pfContributionEmployee || 0}</td>
                      <td className="taxes" style={{ padding: "4px", textAlign: "center" }}>Income Tax</td>
                      <td className="taxes">{payslipData.salary.deductions.incomeTax || 0}</td>
                    </tr>
                    <tr>
                      <td className="earnings" style={{ padding: "4px", textAlign: "center" }}>Total Earnings (A)</td>
                      <td className="earnings">{payslipData.salary.totalEarnings || 0}</td>
                      <td className="taxes" style={{ padding: "4px", textAlign: "center" }}>Professional Tax</td>
                      <td className="taxes">{payslipData.salary.deductions.pfTax || 0}</td>
                    </tr>
                    <tr>
                      <td className="earnings" style={{ padding: "4px", textAlign: "center" }}></td>
                      <td className="earnings"></td>
                      <td className="taxes" style={{ padding: "4px", textAlign: "center" }}>Total Tax (C)</td>
                      <td className="taxes">{payslipData.salary.deductions.totalTax || 0}</td>
                    </tr>
                    <tr>
                      <td className="earnings" style={{ padding: "4px", textAlign: "center" }}></td>
                      <td className="earnings"></td>
                      <td className="taxes" style={{ padding: "4px", textAlign: "center" }}> Net Salary (A-B-C){" "}</td>
                      <td className="taxes">{payslipData.salary.netSalary}</td>
                    </tr>
                    <tr>
                      <td className="earnings" colSpan={1} style={{ padding: "4px", textAlign: "center" }}> Net Pay (in words):</td>
                      <td className="earnings" colSpan={3}><b>{payslipData.inWords || ""}</b></td>
                     
                    </tr>
                    {/* Include other earnings, taxes, and deductions as needed */}
                  </tbody>
                </table>
              </div>
               <span className="ms-4"><em>This is computer-generated payslip and does not require authentication</em></span>
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

              </div>
              {/* <p style={{ textAlign: "end"}}>This is a computer-generated payslip.</p> */}
              {/* <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "40px" }}>
              <h5>
                Stamp & Sign
              </h5>
            </div> */}

              <div className="bottom"
                style={{
                  marginLeft: "50px",
                  marginRight: "50px",
                  marginTop: "20px",
                  paddingBottom: "2px",
                }}>
                <div className="line">
                  {/* <hr /> */}
                </div>
                <div className="company-details text-center" style={{ padding: "2px" }}>
                  <p> {companyData.companyAddress},</p>
                  <p>Contact No: {companyData.mobileNo}, Mail Id: {companyData.emailId}.</p>
                  <p> </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end align-items-center me-4">
        <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleDownload}
        >
          <span className="m-2">Download</span> <Download size={18}  className="ml-1" />
        </button>
              </div>
    </LayOut>
  );
};

export default PayslipDoc;
