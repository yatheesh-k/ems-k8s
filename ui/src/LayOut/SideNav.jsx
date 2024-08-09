  import { jwtDecode } from "jwt-decode";
  import React, { useEffect, useState } from "react";
  import {
    Receipt,
    Speedometer2,
  } from "react-bootstrap-icons";
  import { Link, useLocation } from "react-router-dom";
import { CompanyImageGetApi, EmployeeGetApiById } from "../Utils/Axios";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";

  const SideNav = () => {
    const {authData,isInitialized}=useAuth();
    const [isPayrollOpen, setIsPayrollOpen] = useState(false); // State for managing PayRoll dropdown
    const [isAttendanceOpen, setIsAttendanceOpen] = useState(false); // State for managing Attendance dropdown
    const [isCompanyOpen, setIsCompanyOpen] = useState(false); // State for managing Company dropdown
    const [roles,setRoles]=useState([]);
    const [logoFileName, setLogoFileName] = useState(null);
    const [id,setId]=useState([]);
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = sessionStorage.getItem("token");

    useEffect(() => {
      if (token) {
        const decodedToken = jwtDecode(token);
        setRoles(decodedToken.roles || []);
      }
    }, [token]);
 
  useEffect(() => {
    if (
      location.pathname === "/companyRegistration" ||
      location.pathname.startsWith("/companyView")
    ) {
      setIsCompanyOpen(true);
    } else {
      setIsCompanyOpen(false);
    }
  }, [location]);

  useEffect(() => {
    if (
      location.pathname === "/companySalaryStructure" ||
      location.pathname === "/employeeSalaryStructure" ||
      location.pathname === "/employeeSalaryList" ||
      location.pathname === "/payslipGeneration" ||
      location.pathname === "/payslipsList"||
      location.pathname === "/increment" ||
      location.pathname === "/incrementList"
    ) {
      setIsPayrollOpen(true);
    } else {
      setIsPayrollOpen(false);
    }
  }, [location]);

  useEffect(() => {
    if (
      location.pathname === "/addAttendance" ||
      location.pathname === "/attendanceList" ||
      location.pathname === "/attendanceReport"
    ) {
      setIsAttendanceOpen(true);
    } else {
      setIsAttendanceOpen(false);
    }
  }, [location]);
  
  useEffect(() => {
    if (
      location.pathname === "/companyRegistration" ||
      location.pathname.startsWith("/companyView")
    ) {
      setIsCompanyOpen(true);
    } else {
      setIsCompanyOpen(false);
    }
  }, [location]);

  useEffect(() => {
    if (
      location.pathname === "/companySalaryStructure" ||
      location.pathname === "/employeeSalaryStructure" ||
      location.pathname === "/employeeSalaryList" ||
      location.pathname === "/payslipGeneration" ||
      location.pathname === "/payslipsList"||
      location.pathname === "/increment" ||
      location.pathname === "/incrementList"
    ) {
      setIsPayrollOpen(true);
    } else {
      setIsPayrollOpen(false);
    }
  }, [location]);

  useEffect(() => {
    if (
      location.pathname === "/addAttendance" ||
      location.pathname === "/attendanceList" ||
      location.pathname === "/attendanceReport"
    ) {
      setIsAttendanceOpen(true);
    } else {
      setIsAttendanceOpen(false);
    }
  }, [location]);

    useEffect(() => {
      if (
        location.pathname === "/companyRegistration" ||
        location.pathname.startsWith("/companyView")
      ) {
        setIsCompanyOpen(true);
      } else {
        setIsCompanyOpen(false);
      }
    }, [location]);

    useEffect(() => {
      if (
        location.pathname === "/companySalaryStructure" ||
        location.pathname === "/employeeSalaryStructure" ||
        location.pathname === "/employeeSalaryList" ||
        location.pathname === "/payslipGeneration" ||
        location.pathname === "/payslipsList"||
        location.pathname === "/increment" ||
        location.pathname === "/incrementList" 
      ) {
        setIsPayrollOpen(true);
      } else {
        setIsPayrollOpen(false);
      }
    }, [location]);

    useEffect(() => {
      if (
        location.pathname === "/addAttendance" ||
        location.pathname === "/attendanceList" ||
        location.pathname === "/attendanceReport"
      ) {
        setIsAttendanceOpen(true);
      } else {
        setIsAttendanceOpen(false);
      }
    }, [location]);

    useEffect(() => {
      if (
        location.pathname === "/companyRegistration" ||
        location.pathname.startsWith("/companyView")
      ) {
        setIsCompanyOpen(true);
      } else {
        setIsCompanyOpen(false);
      }
    }, [location]);

    useEffect(() => {
      if (
        location.pathname === "/companySalaryStructure" ||
        location.pathname === "/employeeSalaryStructure" ||
        location.pathname === "/employeeSalaryList" ||
        location.pathname === "/payslipGeneration" ||
        location.pathname === "/payslipsList"||
        location.pathname === "/increment" ||
        location.pathname === "/incrementList" 
      ) {
        setIsPayrollOpen(true);
      } else {
        setIsPayrollOpen(false);
      }
    }, [location]);

    useEffect(() => {
      if (
        location.pathname === "/addAttendance" ||
        location.pathname === "/attendanceList" ||
        location.pathname === "/attendanceReport"
      ) {
        setIsAttendanceOpen(true);
      } else {
        setIsAttendanceOpen(false);
      }
    }, [location]);

    const togglePayroll = (e) => {
      e.preventDefault(); // Prevent default anchor behavior
      setIsPayrollOpen(!isPayrollOpen);
      setIsCompanyOpen(false);
      setIsAttendanceOpen(false);
    };

    const toggleCompany = (e) => {
      e.preventDefault();
      setIsCompanyOpen(!isCompanyOpen);
      setIsAttendanceOpen(false);
      setIsPayrollOpen(false);
    };

    const toggleAttendance = (e) => {
      e.preventDefault(); // Prevent default anchor behavior
      setIsAttendanceOpen(!isAttendanceOpen);
      setIsCompanyOpen(false);
      setIsPayrollOpen(false);
    };

    if (!isInitialized) {
      return <div>Loading context...</div>; // Show a loading message or spinner until context is initialized
    }

    const emsAdminLogoPath = "assets/img/pathbreaker_logo.png";
    
    return (
      <nav id="sidebar" className="sidebar js-sidebar">
        <div className="sidebar-content js-simplebar">
          <a className="sidebar-brand" href="/main">
          {loading ? (
        <img
          className="align-middle"
          src=""
          alt="Loading Logo"
          style={{ height: "80px", width: "180px",color:"black" }}
        />
      ):(
        <span>
          {roles.includes("ems_admin") ? (
            <imgx
              className="align-middle"
              src={emsAdminLogoPath}
              alt="EMS Admin Logo"
              style={{ height: "80px", width: "180px" }}
            />
          ) : (
            logoFileName && (
              <img
                className="align-middle"
                src={`CompanyLogos/${logoFileName}`} // Dynamic source based on logoFileName
                alt="Company Logo"
                style={{ height: "80px", width: "180px" }}
              />
            )
          )}
        </span>
      )}
          </a>
          <ul className="sidebar-nav mt-2">
            {roles.includes("ems_admin") && (
              <>
                <li
                  className={`sidebar-item ${
                    location.pathname === "/main" ? "active" : ""
                  }`}
                >
                  <Link className="sidebar-link" to={"/main"}>
                    <i
                      className="bi bi-grid-1x2-fill"
                      style={{ fontSize: "large" }}
                    ></i>
                    <span className="align-middle" style={{ fontSize: "large" }}>
                      Dashboard
                    </span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <a
                    className="sidebar-link collapsed d-flex justify-content-between align-items-center"
                    href
                    onClick={toggleCompany}
                    data-bs-target="#company"
                    data-bs-toggle="collapse"
                  >
                    <span className="align-middle">
                      <i className="bi bi-building" style={{ fontSize: "large" }}></i>
                    </span>{" "}
                    <span className="align-middle" style={{ fontSize: "medium" }}>
                      Employer
                    </span>
                    <i
                      className={`bi ${
                        isCompanyOpen ? "bi-chevron-up" : "bi-chevron-down"
                      } ms-auto`}
                    ></i>
                  </a>
                  <ul
                    id="company"
                    className={`sidebar-dropDown list-unstyled collapse ${
                      isCompanyOpen ? "show" : ""
                    }`}
                    data-bs-parent="#sidebar"
                  >
                    <li
                      style={{ paddingLeft: "40px" }}
                      className={`sidebar-item ${
                        location.pathname === "/companyRegistration"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link className="sidebar-link" to={"/companyRegistration"}>
                        Registration
                      </Link>
                    </li>
                    <li
                      style={{ paddingLeft: "40px" }}
                      className={`sidebar-item ${
                        location.pathname.startsWith("/companyView")
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link className="sidebar-link" to={"/companyView"}>
                        Summary
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}
            {roles.includes("company_admin") && (
            <>
              <li
                className={`sidebar-item ${
                  location.pathname === "/main" ? "active" : ""
                }`}
              >
                <Link className="sidebar-link" to={"/main"}>
                  <i
                    className="bi bi-grid-1x2-fill"
                    style={{ fontSize: "large" }}
                  ></i>
                  <span className="align-middle" style={{ fontSize: "large" }}>
                    Dashboard
                  </span>
                </Link>
              </li>
              <li
                className={`sidebar-item ${
                  location.pathname === "/department" ? "active" : ""
                }`}
              >
                <Link className="sidebar-link" to={"/department"}>
                  <i
                    className="bi bi-diagram-3-fill"
                    style={{ fontSize: "large" }}
                  ></i>
                  <span className="align-middle" style={{ fontSize: "large" }}>
                    Department
                  </span>
                </Link>
              </li>
              <li
                className={`sidebar-item ${
                  location.pathname === "/designation" ? "active" : ""
                }`}
              >
                <Link className="sidebar-link" to={"/designation"}>
                  <i
                    className="bi bi-file-earmark-medical-fill"
                    style={{ fontSize: "large" }}
                  ></i>
                  <span className="align-middle" style={{ fontSize: "large" }}>
                    Designation
                  </span>
                </Link>
              </li>
              <li
                className={`sidebar-item ${
                  location.pathname.startsWith("/employee") ? "active" : ""
                }`}
              >
                <Link className="sidebar-link" to={"/employeeview"}>
                  <i
                    className="bi bi-person-plus-fill"
                    style={{ fontSize: "large" }}
                  ></i>
                  <span className="align-middle" style={{ fontSize: "large" }}>
                    Employees
                  </span>
                </Link>
              </li>
              {/* <li
                            className={`sidebar-item ${
                              location.pathname.startsWith("/payslip") ? "active" : ""
                            }`}
                          >
                            <Link className="sidebar-link" to={"/payslipview"}>
                              <Receipt color="orange" size={25} />{" "}
                              <i className="bi bi-file-earmark-medical-fill" style={{ fontSize: "large" }}></i>
          
                              <span
                                className="align-middle"
                                style={{ fontSize: "large" }}
                              >
                                PaySlips
                              </span>
                            </Link>
                          </li> */}
              {/* <li
                className={`sidebar-item ${
                  location.pathname.startsWith("/existing") ? "active" : ""
                }`}
              >
                <Link className="sidebar-link" to={"/existingList"}>
                  <i
                    className="bi bi-person-x-fill"
                    style={{ fontSize: "large" }}
                  ></i>
                  <span className="align-middle" style={{ fontSize: "large" }}>
                    Exit Process
                  </span>
                </Link>
              </li> */}
              {/* <li
                            className={`sidebar-item ${
                              location.pathname.startsWith("/users") ? "active" : ""
                            }`}
                          >
                            <Link className="sidebar-link" to={"/usersView"}>
                              <i className="bi bi-person-circle" style={{ fontSize: "large" }}></i>
                              <span
                                className="align-middle"
                                style={{ fontSize: "large" }}
                              >
                                Users Summary
                              </span>
                            </Link>
                          </li> */}

              <li className="sidebar-item">
                <a
                  className="sidebar-link collapsed d-flex justify-content-between align-items-center"
                  href
                  onClick={togglePayroll}
                  data-bs-target="#payroll"
                  data-bs-toggle="collapse"
                >
                  <span className="align-middle">
                    <i
                      className="bi bi-receipt-cutoff"
                      style={{ fontSize: "large" }}
                    ></i>
                  </span>{" "}
                  <span className="align-middle" style={{ fontSize: "large" }}>
                    PayRoll
                  </span>
                  <i
                    className={`bi ${
                      isPayrollOpen ? "bi-chevron-up" : "bi-chevron-down"
                    } ms-auto`}
                  ></i>
                  {/* Add dropdown here */}
                </a>
                <ul
                  id="payroll"
                  className={`sidebar-dropDown list-unstyled collapse ${
                    isPayrollOpen ? "show" : ""
                  }`}
                  data-bs-parent="#sidebar"
                >
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${
                      location.pathname === "/employeeSalaryStructure"
                        ? "active"
                        : ""
                    }`}
                  >
                    <Link
                      className="sidebar-link"
                      to={"/employeeSalaryStructure"}
                    >
                      Manage Salary
                    </Link>
                  </li>
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${
                      location.pathname === "/payslipGeneration" ? "active" : ""
                    }`}
                  >
                    <Link className="sidebar-link" to={"/payslipGeneration"}>
                      Generate PaySlips
                    </Link>
                  </li>
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${
                      location.pathname.startsWith("/payslipsList")
                        ? "active"
                        : ""
                    }`}
                  >
                    <Link className="sidebar-link" to={"/payslipsList"}>
                      PaySlips
                    </Link>
                  </li>
                  
                  {/* <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${
                      location.pathname === "/companySalaryStructure"
                        ? "active"
                        : ""
                    }`}
                  >
                    <Link className="sidebar-link" to={"/companySalaryStructure"}>
                      Salary Structure
                    </Link>
                  </li>
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${
                      location.pathname === "/employeeSalaryList" ? "active" : ""
                    }`}
                  >
                    <Link className="sidebar-link" to={"/employeeSalaryList"}>
                      Salary List
                    </Link>
                  </li> */}
                  {/* <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${
                      location.pathname === "/increment" ? "active" : ""
                    }`}
                  >
                    <Link className="sidebar-link" to={"/increment"}>
                      Increments
                    </Link>
                  </li>
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${
                      location.pathname === "/incrementList" ? "active" : ""
                    }`}
                  >
                    <Link className="sidebar-link" to={"/incrementList"}>
                      Increment List
                    </Link>
                  </li> */}
                </ul>
              </li>
              <li className="sidebar-item has-dropdown">
                <a
                  className="sidebar-link collapsed d-flex justify-content-between align-items-center"
                  data-bs-target="#attendenceManagement"
                  data-bs-toggle="collapse"
                  href
                  onClick={toggleAttendance}
                >
                  <span className="align-middle">
                    <i
                      className="bi bi-calendar-check-fill"
                      style={{ fontSize: "medium" }}
                    ></i>
                  </span>{" "}
                  <span className="align-middle" style={{ fontSize: "large" }}>
                    Attendance
                  </span>
                  <i
                    className={`bi ${
                      isAttendanceOpen ? "bi-chevron-up" : "bi-chevron-down"
                    } ms-auto`}
                  ></i>
                </a>
                <ul
                  id="attendenceManagement"
                  className={`sidebar-dropDown list-unstyled collapse ${
                    isAttendanceOpen ? "show" : ""
                  }`}
                >
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${
                      location.pathname === "/addAttendance" ? "active" : ""
                    }`}
                  >
                    <Link className="sidebar-link" to={"/addAttendance"}>
                      Manage Attendance
                    </Link>
                  </li>
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${
                      location.pathname === "/attendanceReport" ? "active" : ""
                    }`}
                  >
                    <Link className="sidebar-link" to={"/attendanceReport"}>
                      Attendance Report
                    </Link>
                  </li>
                  {/* <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${
                      location.pathname === "/attendanceList" ? "active" : ""
                    }`}
                  >
                    <Link className="sidebar-link" to={"/attendanceList"}>
                      Attendance List
                    </Link>
                  </li> */}
                </ul>
              </li>
            </>
          )}

          {/* {roles === "Employee" && (

            <>
              <li
                className={`sidebar-item ${
                  location.pathname === "/main" ? "active" : ""
                }`}
              >
                <Link className="sidebar-link" to={"/main"}>
                  <Speedometer2 color="orange" size={25} />{" "}
                  <span className="align-middle" style={{ fontSize: "large" }}>
                    Dashboard
                  </span>
                </Link>
              </li>
              <li
                className={`sidebar-item ${
                  location.pathname === "/department" ? "active" : ""
                }`}
              >
                <Link className="sidebar-link" to={"/department"}>
                  <Diagram3Fill color="orange" size={25} />{" "}
                  <span className="align-middle" style={{ fontSize: "large" }}>
                    Departments
                  </span>
                </Link>
              </li>
              <li
                className={`sidebar-item ${
                  location.pathname === "/designation" ? "active" : ""
                }`}
              >
                <Link className="sidebar-link" to={"/designation"}>
                  <FileMedicalFill color="orange" size={25} />{" "}
                  <span className="align-middle" style={{ fontSize: "large" }}>
                    Designation
                  </span>
                </Link>
              </li>
              <li
                className={`sidebar-item ${
                  location.pathname.startsWith("/employee") ? "active" : ""
                }`}
              >
                <Link className="sidebar-link" to={"/employeeview"}>
                  <PersonVcardFill color="orange" size={25} />{" "}
                  <span className="align-middle" style={{ fontSize: "large" }}>
                    Employees
                  </span>
                </Link>
              </li>
              <li
                className={`sidebar-item ${
                  location.pathname.startsWith("/payslip") ? "active" : ""
                }`}
              >
                <Link className="sidebar-link" to={"/payslipview"}>
                  <Receipt color="orange" size={25} />{" "}
                  <span className="align-middle" style={{ fontSize: "large" }}>
                    PaySlips
                  </span>
                </Link>
              </li>
              <li
                className={`sidebar-item ${
                  location.pathname.startsWith("/relieving") ? "active" : ""
                }`}
              >
                <Link className="sidebar-link" to={"/relievingview"}>
                  <EraserFill color="orange" size={25} />{" "}
                  <span className="align-middle" style={{ fontSize: "large" }}>
                    Relieved Summary
                  </span>
                </Link>
              </li>
            </>
          )} */}

          {(roles.includes("Employee") || roles.includes("HR") || roles.includes("Manager") || roles.includes("Accountant")) && (

            <>
              <li
                className={`sidebar-item ${
                  location.pathname === "/main" ? "active" : ""
                }`}
              >
                <Link className="sidebar-link" to={"/main"}>
                  <Speedometer2 color="orange" size={25} />{" "}
                  <span className="align-middle" style={{ fontSize: "large" }}>
                    Dashboard
                  </span>
                </Link>
              </li>

              <li
                className={`sidebar-item ${
                  location.pathname.startsWith("/payslip") ? "active" : ""
                }`}
              >
                <Link className="sidebar-link" to={"/employeeSalary"}>
                  {/* < color="orange" size={25} />{" "} */}
                  <i
                      className="bi bi-card-list"
                      style={{ size: "25", color:"orange" }}
                    ></i>
                  <span className="align-middle " style={{ fontSize: "large" }}>
                    SalaryList
                  </span>
                </Link>
              </li>
              <li
                className={`sidebar-item ${
                  location.pathname.startsWith("/payslip") ? "active" : ""
                }`}
              >
                <Link className="sidebar-link" to={"/employeePayslip"}>
                  <Receipt color="orange" size={25} />{" "}
                  <span className="align-middle " style={{ fontSize: "large" }}>
                    PaySlips
                  </span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

  export default SideNav;
