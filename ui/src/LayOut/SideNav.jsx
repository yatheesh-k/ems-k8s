import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Diagram3Fill, EraserFill, FileMedicalFill, PersonCircle, PersonVcardFill, Receipt, Speedometer2 } from 'react-bootstrap-icons'
import { Link, useLocation } from 'react-router-dom'

const SideNav = () => {
    const [isPayrollOpen, setIsPayrollOpen] = useState(false); // State for managing PayRoll dropdown
    const [isAttendanceOpen, setIsAttendanceOpen] = useState(false); // State for managing Attendance dropdown
    const [isCompanyOpen, setIsCompanyOpen] = useState(false); // State for managing Company dropdown


  const location = useLocation();
  const role = sessionStorage.getItem("role");
  const userImageBase64 = sessionStorage.getItem("imageFile"); // Assuming the base64 image is stored in sessionStorage



    const togglePayroll = (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        setIsPayrollOpen(!isPayrollOpen);
        setIsCompanyOpen(false);
        setIsAttendanceOpen(false);
      };

    const toggleCompany =(e)=>{
       e.preventDefault();
       setIsCompanyOpen(!isCompanyOpen);
       setIsAttendanceOpen(false);
       setIsPayrollOpen(false);
    }
    
    
      const toggleAttendance = (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        setIsAttendanceOpen(!isAttendanceOpen);
        setIsCompanyOpen(false);
        setIsPayrollOpen(false);
      };
    
       
    
    
      const getImageSrc = () => {
        if (role === "Super Admin") {
          return "assets/img/pathbreaker_logo.png";
        }
        return userImageBase64 ? `data:image/png;base64,${userImageBase64}` : "assets/img/pathbreaker_logo.png"; // Fallback to a default image if base64 is not available
      };
  return (
    <nav id="sidebar" class="sidebar js-sidebar">
          <div className="sidebar-content js-simplebar">
          <a className="sidebar-brand" href="/main">
            <span>
              <img
                className="align-middle"
                src={getImageSrc()}
                alt="VeganText"
                style={{ height: "80px", width: "180px" }}
              />
            </span>
          </a>
          <ul className="sidebar-nav mt-2">
            {role === "Super Admin" && (
              <>
                <li
                  className={`sidebar-item ${
                    location.pathname === "/main" ? "active" : ""
                  }`}
                >
                  <Link className="sidebar-link" to={"/main"}>
                    <Speedometer2 color="orange" size={25} />{" "}
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
                      Dashboard
                    </span>
                  </Link>
                </li>

                <li className="sidebar-item">
                  <a
                    className="sidebar-link collapsed"
                    href=" "
                    onClick={togglePayroll}
                    data-bs-target="#company"
                    data-bs-toggle="collapse"
                  >
                    <span className="align-middle">
                      <Receipt color="orange" size={25} />
                    </span>{" "}
                    <span
                      className="align-middle"
                      style={{ fontSize: "medium" }}
                    >
                      Company Management
                    </span>
                  </a>
                  <ul
                    id="company"
                    className={`sidebar-dropDown list-unstyled collapse ${
                      isPayrollOpen ? "show" : ""
                    }`}
                    data-bs-parent="#sidebar"
                  >
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/companyRegistration"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        className="sidebar-link"
                        to={"/companyRegistration"}
                      >
                        Register Company
                      </Link>
                    </li>
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/companyview" ? "active" : ""
                      }`}
                    >
                      <Link className="sidebar-link" to={"/companyview"}>
                        View Company
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}
            {role === "Company" && (
              <>
                <li
                  className={`sidebar-item ${
                    location.pathname === "/main" ? "active" : ""
                  }`}
                >
                  <Link className="sidebar-link" to={"/main"}>
                    <Speedometer2 color="orange" size={25} />{" "}
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
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
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
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
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
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
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
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
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
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
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
                      Relieved Summary
                    </span>
                  </Link>
                </li>
                <li
                  className={`sidebar-item ${
                    location.pathname.startsWith("/users") ? "active" : ""
                  }`}
                >
                  <Link className="sidebar-link" to={"/usersView"}>
                    <PersonCircle color="orange" size={25} />{" "}
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
                      Users Summary
                    </span>
                  </Link>
                </li>
          
                <li className="sidebar-item">
                  <a
                    className="sidebar-link collapsed"
                    href=" "
                    onClick={togglePayroll}
                    data-bs-target="#payroll"
                    data-bs-toggle="collapse"
                  >
                    <span className="align-middle">
                      <Receipt color="orange" size={25} />
                    </span>{" "}
                    <span
                      className="align-middle"
                      style={{ fontSize: "medium" }}
                    >
                      PayRoll Management
                    </span>
                  </a>
                  <ul
                    id="payroll"
                    className={`sidebar-dropDown list-unstyled collapse ${
                      isPayrollOpen ? "show" : ""
                    }`}
                    data-bs-parent="#sidebar"
                  >
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/manageSalary" ? "active" : ""
                      }`}
                    >
                      <Link className="sidebar-link" to={"/manageSalary"}>
                        Manage Salary
                      </Link>
                    </li>
                    
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/generatePaySlips"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        className="sidebar-link"
                        to={"/generatePaySlip"}
                      >
                        Generate PaySlip
                      </Link>
                    </li>
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/salaryList" ? "active" : ""
                      }`}
                    >
                      <Link className="sidebar-link" to={"/salaryList"}>
                        Salary List
                      </Link>
                    </li>
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/newIncrement" ? "active" : ""
                      }`}
                    >
                      <Link className="sidebar-link" to={"/newIncrement"}>
                        New Increment
                      </Link>
                    </li>
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/incrementList" ? "active" : ""
                      }`}
                    >
                      <Link className="sidebar-link" to={"/incrementList"}>
                        Increment List
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="sidebar-item has-dropdown">
                  <a
                    className="sidebar-link"
                    data-bs-target="#attendenceManagement"
                    data-bs-toggle="collapse"
                    href=" "
                    onClick={toggleAttendance}
                  >
                    <span className="align-middle">
                      <Diagram3Fill color="orange" size={25} />
                    </span>{" "}
                    <span
                      className="align-middle"
                      style={{ fontSize: "medium" }}
                    >
                      Attendance Management
                    </span>
                  </a>
                  <ul
                    id="attendenceManagement"
                    className={`sidebar-dropDown list-unstyled collapse ${
                      isAttendanceOpen ? "show" : ""
                    }`}
                  >
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/addAttendance"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        className="sidebar-link"
                        to={"/addAttendance"}
                      >
                        Manage Attendance
                      </Link>
                    </li>
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/attendanceReport"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link className="sidebar-link" to={"/attendanceReport"}>
                        Attendance Report
                      </Link>
                    </li>
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/attendanceList" ? "active" : ""
                      }`}
                    >
                      <Link className="sidebar-link" to={"/attendanceList"}>
                        Attendance List
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}

            {role === "User" && (
              <>
                <li
                  className={`sidebar-item ${
                    location.pathname === "/main" ? "active" : ""
                  }`}
                >
                  <Link className="sidebar-link" to={"/main"}>
                    <Speedometer2 color="orange" size={25} />{" "}
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
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
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
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
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
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
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
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
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
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
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
                      Relieved Summary
                    </span>
                  </Link>
                </li>
              </>
            )}
            {role === "Employee" && (
              <>
                <li
                  className={`sidebar-item ${
                    location.pathname === "/main" ? "active" : ""
                  }`}
                >
                  <Link className="sidebar-link" to={"/main"}>
                    <Speedometer2 color="orange" size={25} />{" "}
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
                      Dashboard
                    </span>
                  </Link>
                </li>

                <li
                  className={`sidebar-item ${
                    location.pathname.startsWith("/payslip") ? "active" : ""
                  }`}
                >
                  <Link className="sidebar-link" to={"/emppayslip"}>
                    <Receipt color="orange" size={25} />{" "}
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
                      PaySlips
                    </span>
                  </Link>
                </li>
              </>
            )}
             <>
                <li
                  className={`sidebar-item ${
                    location.pathname === "/main" ? "active" : ""
                  }`}
                >
                  <Link className="sidebar-link" to={"/main"}>
                  <i class="bi bi-grid-1x2-fill" style={{ fontSize: "large" }}></i>
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
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
                  <i class="bi bi-diagram-3-fill" style={{ fontSize: "large" }}></i>
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
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
                    <i class="bi bi-file-earmark-medical-fill" style={{ fontSize: "large" }}></i>
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
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
                    <i class="bi bi-person-plus-fill" style={{ fontSize: "large" }}></i>
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
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
                    <i class="bi bi-file-earmark-medical-fill" style={{ fontSize: "large" }}></i>

                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
                      PaySlips
                    </span>
                  </Link>
                </li> */}
                <li
                  className={`sidebar-item ${
                    location.pathname.startsWith("/existing") ? "active" : ""
                  }`}
                >
                  <Link className="sidebar-link" to={"/existingList"}>
                    <i class="bi bi-person-x-fill" style={{ fontSize: "large" }}></i>
                    <span
                      className="align-middle"
                      style={{ fontSize: "large" }}
                    >
                      Existing Process
                    </span>
                  </Link>
                </li>
                {/* <li
                  className={`sidebar-item ${
                    location.pathname.startsWith("/users") ? "active" : ""
                  }`}
                >
                  <Link className="sidebar-link" to={"/usersView"}>
                    <i class="bi bi-person-circle" style={{ fontSize: "large" }}></i>
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
                      <i class="bi bi-receipt-cutoff" style={{ fontSize: "large" }}></i>
                    </span>{" "}
                    <span className="align-middle" style={{ fontSize: "medium" }}>
                      PayRoll
                    </span>
                    <i className={`bi ${isPayrollOpen ? "bi-chevron-up" : "bi-chevron-down"} ms-auto`}>
                    </i>
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
                      className={`sidebar-item ${location.pathname === "/employeeSalaryStructure" ? "active" : ""
                        }`}
                    >
                      <Link className="sidebar-link" to={"/employeeSalaryStructure"}>
                        Manage Salary
                      </Link>
                    </li>
                    <li
                      style={{ paddingLeft: "40px" }}
                      className={`sidebar-item ${location.pathname.startsWith("/payslipsList") ? "active" : ""
                        }`}
                    >
                      <Link className="sidebar-link" to={"/payslipsList"}>
                        PaySlips
                      </Link>
                    </li>
                    <li
                      style={{ paddingLeft: "40px" }}
                      className={`sidebar-item ${location.pathname === "/payslipGeneration" ? "active" : ""
                        }`}
                    >
                      <Link className="sidebar-link" to={"/payslipGeneration"}>
                        Generate PaySlips
                      </Link>
                    </li><li
                      style={{ paddingLeft: "40px" }}
                      className={`sidebar-item ${location.pathname === "/companySalaryStructure" ? "active" : ""
                        }`}
                    >
                      <Link className="sidebar-link" to={"/companySalaryStructure"}>
                        Salary Structure
                      </Link>
                    </li>
                    <li
                      style={{ paddingLeft: "40px" }}
                      className={`sidebar-item ${location.pathname === "/employeeSalaryList" ? "active" : ""
                        }`}
                    >
                      <Link className="sidebar-link" to={"/employeeSalaryList"}>
                        Salary List
                      </Link>
                    </li>
                    <li
                      style={{ paddingLeft: "40px" }}
                      className={`sidebar-item ${location.pathname === "/increment" ? "active" : ""
                        }`}
                    >
                      <Link className="sidebar-link" to={"/increment"}>
                        Increments
                      </Link>
                    </li>
                    <li
                      style={{ paddingLeft: "40px" }}
                      className={`sidebar-item ${location.pathname === "/incrementList" ? "active" : ""
                        }`}
                    >
                      <Link className="sidebar-link" to={"/incrementList"}>
                        Increment List
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="sidebar-item has-dropdown">
                  <a
                    className="sidebar-link collapsed d-flex justify-content-between align-items-center"
                    data-bs-target="#attendenceManagement"
                    data-bs-toggle="collapse"
                    href=" "
                    onClick={toggleAttendance}
                  >
                    <span className="align-middle">
                      <i class="bi bi-calendar-check-fill" style={{ fontSize: "medium" }}></i>
                    </span>{" "}
                    <span className="align-middle" style={{ fontSize: "medium" }}>
                      Attendance
                    </span>
                    <i className={`bi ${isAttendanceOpen ? "bi-chevron-up" : "bi-chevron-down"} ms-auto`}>
                    </i>
                  </a>
                  <ul
                    id="attendenceManagement"
                    className={`sidebar-dropDown list-unstyled collapse ${isAttendanceOpen ? "show" : ""
                      }`}
                  >
                    <li
                      style={{ paddingLeft: "40px" }}
                      className={`sidebar-item ${location.pathname === "/addAttendance"
                          ? "active"
                          : ""
                        }`}
                    >
                      <Link className="sidebar-link" to={"/addAttendance"}>
                        Manage Attendance
                      </Link>
                    </li>
                    <li
                      style={{ paddingLeft: "40px" }}
                      className={`sidebar-item ${location.pathname === "/attendanceReport" ? "active" : ""
                        }`}
                    >
                      <Link className="sidebar-link" to={"/attendanceReport"}>
                        Attendance Report
                      </Link>
                    </li>
                    <li
                      style={{ paddingLeft: "40px" }}
                      className={`sidebar-item ${location.pathname === "/attendanceList" ? "active" : ""
                        }`}
                    >
                      <Link className="sidebar-link" to={"/attendanceList"}>
                        Attendance List
                      </Link>
                    </li>
                 
                  </ul>
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
                      <i class="bi bi-building" style={{ fontSize: "large" }}></i>
                    </span>{" "}
                    <span className="align-middle" style={{ fontSize: "medium" }}>
                      Company
                    </span>
                    <i className={`bi ${isCompanyOpen ? "bi-chevron-up" : "bi-chevron-down"} ms-auto`}>
                    </i>
                    {/* Add dropdown here */}
                  </a>
                  <ul
                    id="company"
                    className={`sidebar-dropDown list-unstyled collapse ${isCompanyOpen ? "show" : ""
                      }`}
                    data-bs-parent="#sidebar"
                  >
                    <li
                      style={{ paddingLeft: "40px" }}
                      className={`sidebar-item ${location.pathname === "/companyRegistration" ? "active" : ""
                        }`}
                    >
                      <Link className="sidebar-link" to={"/companyRegistration"}>
                        Company Registration
                      </Link>
                    </li>
                    <li
                      style={{ paddingLeft: "40px" }}
                      className={`sidebar-item ${location.pathname.startsWith("/companyView") ? "active" : ""
                        }`}
                    >
                      <Link className="sidebar-link" to={"/companyView"}>
                        Company View
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
          </ul>
        </div>
    </nav>
  )
}

export default SideNav