import React, { useState } from "react";
import {
  ChevronDown,
  Diagram3Fill,
  EraserFill,
  FileMedicalFill,
  PersonCircle,
  PersonVcardFill,
  Receipt,
  Speedometer2,
} from "react-bootstrap-icons";
import { Link, useLocation } from "react-router-dom";

const SideNav = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isPayrollOpen, setIsPayrollOpen] = useState(false); // State for managing PayRoll dropdown
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false); // State for managing Attendance dropdown

  const location = useLocation();
  const role = sessionStorage.getItem("role");
  const userImageBase64 = sessionStorage.getItem("imageFile"); // Assuming the base64 image is stored in sessionStorage

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const togglePayroll = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsPayrollOpen(!isPayrollOpen);
  };


  const toggleAttendance = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsAttendanceOpen(!isAttendanceOpen);
  };

   


  const getImageSrc = () => {
    if (role === "Super Admin") {
      return "assets/img/pathbreaker_logo.png";
    }
    return userImageBase64 ? `data:image/png;base64,${userImageBase64}` : "assets/img/pathbreaker_logo.png"; // Fallback to a default image if base64 is not available
  };


  return (
    <>
      <nav
        id="sidebar"
        className={`sidebar js-sidebar ${
          isSidebarMinimized ? "minimized" : ""
        }`}
      >
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
                        location.pathname === "/attendanceManagement"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        className="sidebar-link"
                        to={"/attendanceManagement"}
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
          </ul>
        </div>
      </nav>
    </>
  );
};

export default SideNav;
