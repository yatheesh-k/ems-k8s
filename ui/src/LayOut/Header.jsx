import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {company } from "../Utils/Auth";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";

const Header = ({ toggleSidebar }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [roles,setRoles]=useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      
      // Extract roles from the decoded token
      const roles = decodedToken?.roles || [];
      setRoles(roles);

      const currentTime = Date.now() / 1000; // Current time in seconds
      const remainingTime = decodedToken.exp - currentTime;

      if (remainingTime > 0) {
        const timeoutId = setTimeout(() => {
          handleLogOut();
        }, remainingTime * 1000); // Convert remaining time to milliseconds

        return () => clearTimeout(timeoutId); // Cleanup timeout if component unmounts
      } else {
        // Token is already expired, perform logout immediately
        handleLogOut();
      }
    }
  }, [token]);


  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false);
  };

  const handleLogOut = () => {
    sessionStorage.clear();
    setShowErrorModal(true);
  };

  const closeModal = () => {
    setShowErrorModal(false);
    navigate("/");
  };

  const companyName = company;

  return (
    <nav className="navbar navbar-expand navbar-light navbar-bg">
      <a
        className="sidebar-toggle js-sidebar-toggle"
        onClick={toggleSidebar}
        href
      >
        <i className="hamburger align-self-center"></i>
      </a>
      <div className="navbar-collapse collapse">
        <ul className="navbar-nav navbar-align">
          <li className="nav-item dropdown position-relative">
            <a
              className="nav-icon dropdown-toggle"
              href
              id="alertsDropdown"
              onClick={toggleNotification}
            >
              <div className="position-relative">
                <span className="align-middle">
                  <i className="bi bi-bell-fill"></i>
                </span>
                <span className="indicator">0</span>
              </div>
            </a>
            {isNotificationOpen && (
              <div
                className="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0 show"
                aria-labelledby="alertsDropdown"
                style={{ left: "auto", right: "50%" }}
              >
                <div className="dropdown-menu-header">0 New Notifications</div>
                <div className="list-group">
                  Loading .....
                  {/* Add your notifications here */}
                </div>
                <div className="dropdown-menu-footer">
                  <a href className="text-muted">
                    Show all notifications
                  </a>
                </div>
              </div>
            )}
          </li>
          {roles.includes("ems_admin") ? ( 
          <li className="nav-item">
            <a
              className="nav-link dropdown-toggle d-none d-sm-inline-block text-center"
              href
              onClick={toggleProfile}
            >
              <i 
                className="bi bi-person-circle"
                style={{ fontSize: "22px" }}
              ></i>
            </a>
            {isProfileOpen && (
              <div
                className="dropdown-menu dropdown-menu-end py-0 show"
                aria-labelledby="profileDropdown"
                style={{ left: "auto", right: "2%" }}
              >
                <a className="dropdown-item" href="/reset">
                  <i className="align-middle me-1 bi bi-key"></i> Reset Password
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" onClick={handleLogOut} href="/">
                  Log out
                </a>
              </div>
            )}
          </li> 
          ):(
          <li className="nav-item dropdown position-relative">
         
            <a 
              className="nav-link dropdown-toggle d-none d-sm-inline-block text-center"
              href
              onClick={toggleProfile}
            >
              <span class="text-dark p-2 mb-3">{companyName}</span>
              <i
                className="bi bi-person-circle"
                style={{ fontSize: "22px" }}
              ></i>
            
            </a>
            {isProfileOpen && (
              <div
                className="dropdown-menu dropdown-menu-end py-0 show"
                aria-labelledby="profileDropdown"
                style={{ left: "auto", right: "50%" }}
              >
                <a className="dropdown-item" href="/profile">
                  <i className="align-middle me-1 bi bi-person"></i> Profile
                </a>
                <a className="dropdown-item" href="/reset">
                  <i className="align-middle me-1 bi bi-key"></i> Reset Password
                </a>
                {/* <a className="dropdown-item" href="/payslip">
                  <i className="align-middle me-1 bi bi-gear"></i> Settings
                </a> */}
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" onClick={handleLogOut} href="/">
                  Log out
                </a>
              </div>
              // )}
            )}
          </li>
          )}
        </ul>
      </div>
      <Modal show={showErrorModal} onHide={closeModal} centered style={{zIndex:"1050"}}>
        <ModalHeader closeButton>
          <ModalTitle className="text-center">Error</ModalTitle>
        </ModalHeader>
        <ModalBody className="text-center fs-bold">
          Session Timeout! Please log in.
        </ModalBody>
      </Modal>
    </nav>
  );
};

export default Header;
