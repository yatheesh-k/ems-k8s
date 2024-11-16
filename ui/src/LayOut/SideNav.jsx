import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const SideNav = () => {
  const [isPayrollOpen, setIsPayrollOpen] = useState(false); // State for managing PayRoll dropdown
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false); // State for managing Attendance dropdown
  const [isCompanyOpen, setIsCompanyOpen] = useState(false); // State for managing Company dropdown
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLettresOpen, setIsLettersOpen] = useState(false);
  const location = useLocation();
  const { user = {}, logoFileName, loading } = useAuth();

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
      location.pathname === "/employeeSalaryStructure" ||
      location.pathname === "/employeeSalaryList" ||
      location.pathname === "/payslipGeneration" ||
      location.pathname === "/payslipsList" ||
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
      location.pathname === "/offerLetters" ||
      location.pathname === "/experienceForm" ||
      location.pathname === "/appraisalLetter" ||
      location.pathname === "/relievingSummary" ||
      location.pathname === "/internsLetter"
    ) {
      setIsLettersOpen(true);
    } else {
      setIsLettersOpen(false);
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
      location.pathname === "/companySalaryView" ||
      location.pathname === "/companySalaryStructure"||
      location.pathname === "/relievingTemplates"||
      location.pathname==="/appraisalLetter"||
      location.pathname==="/internsTemplates"
    ) {
      setIsSettingsOpen(true);
    } else {
      setIsSettingsOpen(false);
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
      location.pathname === "/employeeSalaryStructure" ||
      location.pathname === "/employeeSalaryList" ||
      location.pathname === "/payslipGeneration" ||
      location.pathname === "/payslipsList" ||
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
      location.pathname === "/employeeSalaryStructure" ||
      location.pathname === "/employeeSalaryList" ||
      location.pathname === "/payslipGeneration" ||
      location.pathname === "/payslipsList" ||
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
      location.pathname === "/employeeSalaryStructure" ||
      location.pathname === "/employeeSalaryList" ||
      location.pathname === "/payslipGeneration" ||
      location.pathname === "/payslipsList" ||
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
      location.pathname === "/companySalaryView" ||
      location.pathname === "/offerLetters" ||
      location.pathname === "/experienceLetter" ||
      location.pathname === "/payslipTemplates"
    ) {
      setIsSettingsOpen(true);
    } else {
      setIsSettingsOpen(false);
    }
  }, [location]);

  const togglePayroll = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsPayrollOpen(!isPayrollOpen);
    setIsCompanyOpen(false);
    setIsAttendanceOpen(false);
    setIsLettersOpen(false);
  };

  const toggleCompany = (e) => {
    e.preventDefault();
    setIsCompanyOpen(!isCompanyOpen);
    setIsAttendanceOpen(false);
    setIsPayrollOpen(false);
    setIsLettersOpen(false);
  };

  const toggleAttendance = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsAttendanceOpen(!isAttendanceOpen);
    setIsCompanyOpen(false);
    setIsPayrollOpen(false);
    setIsLettersOpen(false);
  };

  const toggleSettings = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsSettingsOpen(!isSettingsOpen);
    setIsCompanyOpen(false);
    setIsAttendanceOpen(false);
    setIsPayrollOpen(false);
    setIsLettersOpen(false);
  }; 

  const toggleLetters = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsSettingsOpen(false);
    setIsCompanyOpen(false);
    setIsAttendanceOpen(false);
    setIsPayrollOpen(false);
    setIsLettersOpen(!isLettresOpen);
  }; 


  // if (!isInitialized) {
  //   return <div>Loading context...</div>; // Show a loading message or spinner until context is initialized
  // }

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
              style={{ height: "80px", width: "200px", color: "black" }}
            />
          ) : (
            <span>
              {user && user.userRole && user.userRole.includes("ems_admin") ? (
                <img
                  className="align-middle"
                  src='assets/img/pathbreaker_logo.png'
                  alt="EMS Admin Logo"
                  style={{ height: "55px", width: "160px" }}
                />
              ) : (
                logoFileName && (
                  <img
                    className="align-middle text-center"
                    src={`${logoFileName}`}
                    alt="Company Logo"
                    style={{ height: "55px", width: "160px" }}
                  />
                )
              )}
            </span>
          )}
        </a>
        <ul className="sidebar-nav mt-2">
          {user && user.userRole && user.userRole.includes("ems_admin") && (
            <>
              <li
                className={`sidebar-item ${location.pathname === "/main" ? "active" : ""
                  }`}
              >
                <a className="sidebar-link" href={"/main"}>
                  <i
                    className="bi bi-grid-1x2-fill"
                    
                  ></i>
                  <span className="align-middle">
                    Dashboard
                  </span>
                </a>
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
                    <i className="bi bi-building" ></i>
                  </span>{" "}
                  <span className="align-middle">
                    Employer
                  </span>
                  <i
                    className={`bi ${isCompanyOpen ? "bi-chevron-up" : "bi-chevron-down"
                      } ms-auto`}
                  ></i>
                </a>
                <ul
                  id="company"
                  className={`sidebar-dropDown list-unstyled collapse ${isCompanyOpen ? "show" : ""
                    }`}
                  data-bs-parent="#sidebar"
                >
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/companyRegistration"
                      ? "active"
                      : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/companyRegistration"}>
                      Registration
                    </a>
                  </li>
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname.startsWith("/companyView")
                      ? "active"
                      : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/companyView"}>
                      Summary
                    </a>
                  </li>
                </ul>
              </li>
            </>
          )}
          {user && user.userRole && user.userRole.includes("company_admin") && (
            <>
              <li
                className={`sidebar-item ${location.pathname === "/main" ? "active" : ""
                  }`}
              >
                <a className="sidebar-link" href={"/main"}>
                  <i
                    className="bi bi-grid-1x2-fill"
                    
                  ></i>
                  <span className="align-middle" >
                    Dashboard
                  </span>
                </a>
              </li>
              <li
                className={`sidebar-item ${location.pathname === "/department" ? "active" : ""
                  }`}
              >
                <a className="sidebar-link" href={"/department"}>
                  <i
                    className="bi bi-diagram-3-fill"
                    
                  ></i>
                  <span className="align-middle" >
                    Department
                  </span>
                </a>
              </li>
              <li
                className={`sidebar-item ${location.pathname === "/designation" ? "active" : ""
                  }`}
              >
                <a className="sidebar-link" href={"/designation"}>
                  <i
                    className="bi bi-file-earmark-medical-fill"
                    
                  ></i>
                  <span className="align-middle" >
                    Designation
                  </span>
                </a>
              </li>
              <li
                className={`sidebar-item ${location.pathname.startsWith("/employee") ? "active" : ""
                  }`}
              >
                <a className="sidebar-link" href={"/employeeview"}>
                  <i
                    className="bi bi-person-plus-fill"
                    
                  ></i>
                  <span className="align-middle" >
                    Employees
                  </span>
                </a>
              </li>
              <li className="sidebar-item has-dropdown">
                <a
                  className="sidebar-link collapsed d-flex justify-content-between align-items-center"
                  data-bs-target="#letterManagement"
                  data-bs-toggle="collapse"
                  href
                  onClick={toggleLetters}
                >
                  <span className="align-middle">
                    <i
                      className="bi bi-files"

                      style={{ fontSize: "medium" }}
                    ></i>
                  </span>{" "}
                  <span className="align-middle" >
                    Letters
                  </span>
                  <i
                    className={`bi ${isLettresOpen ? "bi-chevron-up" : "bi-chevron-down"
                      } ms-auto`}
                  ></i>
                </a>
                <ul
                  id="letterManagement"
                  className={`sidebar-dropDown list-unstyled collapse ${isLettresOpen ? "show" : ""
                    }`}
                >
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/offerLetters" ? "active" : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/offerLetters"}>
                      Offer Letter
                    </a>
                  </li>
                  <li
                    style={{ paddingLeft: "40px" }}

                    className={`sidebar-item ${location.pathname === "/experieneSummary" ? "active" : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/experienceForm"}>
                     Experience
                    </a>
                  </li>
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/relievingSummary" ? "active" : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/relievingSummary"}>
                     Relieving
                    </a>
                  </li>
                  <li
                    style={{ paddingLeft: "40px" }}

                    className={`sidebar-item ${
                      location.pathname === "/appraisalLetter" ? "active" : ""
                    }`}
                  >
                    <Link className="sidebar-link" to={"/appraisalLetter"}>
                      Appraisal
                    </Link>
                  </li>
                </ul>
                <ul
                  id="letterManagement"
                  className={`sidebar-dropDown list-unstyled collapse ${isLettresOpen ? "show" : ""
                    }`}
                >
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/internsLetter" ? "active" : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/internsLetter"}>
                      Interns
                    </a>
                  </li>
                </ul>
              </li>
              {/* <li
                            className={`sidebar-item ${
                              location.pathname.startsWith("/payslip") ? "active" : ""
                            }`}
                          >
                            <Link className="sidebar-link" to={"/payslipview"}>
                              <Receipt color="orange" size={25} />{" "}
                              <i className="bi bi-file-earmark-medical-fill" ></i>
          
                              <span
                                className="align-middle"
                                
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
                    
                  ></i>
                  <span className="align-middle" >
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
                              <i className="bi bi-person-circle" ></i>
                              <span
                                className="align-middle"
                                
                              >
                                Users Summary
                              </span>
                            </Link>
                          </li> */}
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
                  <span className="align-middle" >
                    Attendance
                  </span>
                  <i
                    className={`bi ${isAttendanceOpen ? "bi-chevron-up" : "bi-chevron-down"
                      } ms-auto`}
                  ></i>
                </a>
                <ul
                  id="attendenceManagement"
                  className={`sidebar-dropDown list-unstyled collapse ${isAttendanceOpen ? "show" : ""
                    }`}
                >
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/addAttendance" ? "active" : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/addAttendance"}>
                      Manage Attendance
                    </a>
                  </li>
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/attendanceReport" ? "active" : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/attendanceReport"}>
                      Attendance Report
                    </a>
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
                      
                    ></i>
                  </span>{" "}
                  <span className="align-middle" >
                    Payroll
                  </span>
                  <i
                    className={`bi ${isPayrollOpen ? "bi-chevron-up" : "bi-chevron-down"
                      } ms-auto`}
                  ></i>
                  {/* Add dropdown here */}
                </a>
                <ul
                  id="payroll"
                  className={`sidebar-dropDown list-unstyled collapse ${isPayrollOpen ? "show" : ""
                    }`}
                  data-bs-parent="#sidebar"
                >
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/employeeSalaryStructure"
                      ? "active"
                      : ""
                      }`}
                  >
                    <a
                      className="sidebar-link"
                      href={"/employeeSalaryStructure"}
                    >
                      Manage Salary
                    </a>
                  </li>
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/payslipGeneration" ? "active" : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/payslipGeneration"}>
                      Generate Payslips
                    </a>
                  </li>
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname.startsWith("/payslipsList")
                      ? "active"
                      : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/payslipsList"}>
                      Payslips
                    </a>
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
                  data-bs-target="#settingsManagement"
                  data-bs-toggle="collapse"
                  href
                  onClick={toggleSettings}
                >
                  <span className="align-middle">
                    <i
                      className="bi bi-gear-fill"
                      style={{ fontSize: "medium" }}
                    ></i>
                  </span>{" "}
                  <span className="align-middle" >
                    Settings
                  </span>
                  <i
                    className={`bi ${isSettingsOpen ? "bi-chevron-up" : "bi-chevron-down"
                      } ms-auto`}
                  ></i>
                </a>
                <ul
                  id="settingsManagement"
                  className={`sidebar-dropDown list-unstyled collapse ${isSettingsOpen ? "show" : ""
                    }`}
                >
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/companySalaryView" ? "active" : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/companySalaryView"}>
                      Company Salary Structure
                    </a>
                  </li>
                </ul>
                <ul
                  id="settingsManagement"
                  className={`sidebar-dropDown list-unstyled collapse ${isSettingsOpen ? "show" : ""
                    }`}
                >
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/offerLetters" ? "active" : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/offerLetters"}>
                      Offer Letter Templates
                    </a>
                  </li>
                </ul>
                <ul
                  id="settingsManagement"
                  className={`sidebar-dropDown list-unstyled collapse ${isSettingsOpen ? "show" : ""
                    }`}
                >
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/appraisalTemplates" ? "active" : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/appraisalTemplates"}>
                      Appraisal Templates
                    </a>
                  </li>
                </ul>
                <ul
                  id="settingsManagement"
                  className={`sidebar-dropDown list-unstyled collapse ${isSettingsOpen ? "show" : ""
                    }`}
                >
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/experienceLetter" ? "active" : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/experienceLetter"}>
                      Experience Templates
                    </a>
                  </li>
                </ul>
                <ul
                  id="settingsManagement"
                  className={`sidebar-dropDown list-unstyled collapse ${isSettingsOpen ? "show" : ""
                    }`}
                >
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/relievingTemplates" ? "active" : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/relievingTemplates"}>
                      Relieving Templates

                    </a>
                  </li>
                </ul>
                <ul
                  id="settingsManagement"
                  className={`sidebar-dropDown list-unstyled collapse ${isSettingsOpen ? "show" : ""
                    }`}
                >
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/internsTemplates" ? "active" : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/internsTemplates"}>
                      Interns Templates
                    </a>
                  </li>
                </ul>
                <ul
                  id="settingsManagement"
                  className={`sidebar-dropDown list-unstyled collapse ${isSettingsOpen ? "show" : ""
                    }`}
                >
                  <li
                    style={{ paddingLeft: "40px" }}
                    className={`sidebar-item ${location.pathname === "/payslipTemplates" ? "active" : ""
                      }`}
                  >
                    <a className="sidebar-link" href={"/payslipTemplates"}>
                      Payslip Templates
                    </a>
                  </li>
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
                  <span className="align-middle" >
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
                  <span className="align-middle" >
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
                  <span className="align-middle" >
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
                  <span className="align-middle" >
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
                  <span className="align-middle" >
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
                  <span className="align-middle" >
                    Relieved Summary
                  </span>
                </Link>
              </li>
            </>
          )} */}

          {(!user || !(user.userRole && (user.userRole.includes("company_admin") || user.userRole.includes("ems_admin")))) && (
            <>
              <li
                className={`sidebar-item ${location.pathname === "/main" ? "active" : ""}`}
              >
                <a className="sidebar-link" href={"/main"}>
                  <i
                    className="bi bi-grid-1x2-fill"
                    
                  ></i>
                  <span className="align-middle" >
                    Dashboard
                  </span>
                </a>
              </li>
              <li
                className={`sidebar-item ${location.pathname === "/employeeSalary" ? "active" : ""}`}
              >
                <a className="sidebar-link" href={"/employeeSalary"}>
                  <i
                    className="bi bi-card-list"
                    
                  ></i>
                  <span className="align-middle" >
                    Salary List
                  </span>
                </a>
              </li>
              <li
                className={`sidebar-item ${location.pathname === "/employeePayslip" ? "active" : ""}`}
              >
                <a className="sidebar-link" href={"/employeePayslip"}>
                  <i
                    className="bi bi-file-earmark-medical-fill"
                    
                  ></i>
                  <span className="align-middle" >
                    Payslips
                  </span>
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}


export default SideNav;
