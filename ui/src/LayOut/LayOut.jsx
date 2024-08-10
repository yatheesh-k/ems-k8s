import React, { useEffect, useState } from 'react';
import SideNav from './SideNav';
import Header from './Header';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { CompanyImageGetApi, EmployeeGetApiById } from '../Utils/Axios';

const LayOut = ({ children }) => {
  const name = localStorage.getItem("name");
  const {authData,isInitialized}=useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoFileName, setLogoFileName] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    if (!isInitialized) return; // Wait until initialization is complete
    if (!authData) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("userId:",authData.userId)
        const response = await EmployeeGetApiById(authData.userId);
        console.log("userId@:",authData.userId)
        const companyId = response.data.companyId;
        await fetchCompanyLogo(companyId);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    const fetchCompanyLogo = async (companyId) => {
      try {
        const logoResponse = await CompanyImageGetApi(companyId);
        if (logoResponse && logoResponse.data && logoResponse.data.data) {
          const logoPath = logoResponse.data.data;
          const fileName = logoPath.split('\\').pop();
          setLogoFileName(fileName);
          console.log("fileName:",fileName)
        } else {
          console.error("Response or data is missing");
          setError("Logo not found");
        }
      } catch (err) {
        console.error("Error fetching company logo:", err);
        setError("Error fetching logo");
      }
    };

    fetchData();
  }, [authData, isInitialized]);

  return (
    <div className='wrapper'>
      <div className={`fixed-sideNav ${isSidebarVisible ? '' : 'hidden'}`}>
        <SideNav />
      </div>
      <div className={`main ${isSidebarVisible ? '' : 'full-width'}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main className='content'>
          {children}
        </main>
        <footer>
          <footer className="footer">
            <div className="container-fluid">
              <div className="row text-muted">
                <div className="col-6 text-start">
                  <p className="mb-0">
                    <Link className="text-muted" target="_blank"><strong>{name} </strong></Link>
                  </p>
                </div>
                <div className="col-6 text-end">
                  <p>
                    Powered By <Link className='text-muted'>PathBreaker Technologies Pvt.Ltd</Link>
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </footer>
      </div>
    </div>
  );
};

export default LayOut;




















// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { company } from "../Utils/Auth";
// import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
// import Reset from "./Reset";
// import { useAuth } from "../Context/AuthContext";
// import { EmployeeGetApiById } from "../Utils/Axios";
// import { jwtDecode } from "jwt-decode";

// const Header = ({ toggleSidebar }) => {
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [roles, setRoles] = useState([]);
//   const { authData, isInitialized } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [logoFileName, setLogoFileName] = useState(null);
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
//   const [companyName, setCompanyName] = useState(company);
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const profileDropdownRef = useRef(null);

//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!isInitialized) return; // Wait until initialization is complete
//     if (!authData) return;

//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await EmployeeGetApiById(authData.userId);
//         const companyId = response.data.companyId;
//         const { firstName, lastName } = response.data;
//         setFirstName(firstName);
//         setLastName(lastName);
//         // await fetchCompanyLogo(companyId);
//       } catch (error) {
//         console.log(error);
//         setError("Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [authData, isInitialized]);

//   useEffect(() => {
//     if (token) {
//       const decodedToken = jwtDecode(token);

//       // Extract roles and firstName from the decoded token
//       const roles = decodedToken?.roles || [];
//       const firstName = decodedToken?.firstName || "";
//       setRoles(roles);
//       setFirstName(firstName);

//       const currentTime = Date.now() / 1000; // Current time in seconds
//       const remainingTime = decodedToken.exp - currentTime;

//       if (remainingTime > 0) {
//         const timeoutId = setTimeout(() => {
//           handleLogOut();
//         }, remainingTime * 1000); // Convert remaining time to milliseconds

//         return () => clearTimeout(timeoutId); // Cleanup timeout if component unmounts
//       } else {
//         // Token is already expired, perform logout immediately
//         handleLogOut();
//       }
//     }
//   }, [token]);

//   const toggleNotification = () => {
//     setIsNotificationOpen(!isNotificationOpen);
//     setIsProfileOpen(false);
//   };

//   const toggleProfile = () => {
//     setIsProfileOpen(!isProfileOpen);
//     setIsNotificationOpen(false);
//   };

//   const handleClickOutside = (event) => {
//     if (
//       profileDropdownRef.current &&
//       !profileDropdownRef.current.contains(event.target)
//     ) {
//       setIsProfileOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleLogOut = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   const closeModal = () => {
//     setShowErrorModal(false);
//     navigate("/");
//   };

//   const handleResetPasswordClick = () => {
//     setShowResetPasswordModal(true);
//   };

//   return (
//     <nav className="navbar navbar-expand navbar-light navbar-bg">
//       <a
//         className="sidebar-toggle js-sidebar-toggle"
//         onClick={toggleSidebar}
//         href=""
//       >
//         <i className="hamburger align-self-center"></i>
//       </a>
//       <div className="navbar-collapse collapse">
//         <ul className="navbar-nav navbar-align">
//           <li className="nav-item dropdown position-relative">
//             <a
//               className="nav-icon dropdown-toggle"
//               href=""
//               id="alertsDropdown"
//               onClick={toggleNotification}
//             >
//               <div className="position-relative">
//                 <span className="align-middle">
//                   <i className="bi bi-bell-fill"></i>
//                 </span>
//                 <span className="indicator">0</span>
//               </div>
//             </a>
//             {isNotificationOpen && (
//               <div
//                 className="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0 show"
//                 aria-labelledby="alertsDropdown"
//                 style={{ left: "auto", right: "50%" }}
//               >
//                 <div className="dropdown-menu-header">0 New Notifications</div>
//                 <div className="list-group">Loading .....</div>
//                 <div className="dropdown-menu-footer">
//                   <a href="" className="text-muted">
//                     Show all notifications
//                   </a>
//                 </div>
//               </div>
//             )}
//           </li>
//           {roles.includes("ems_admin") && (
//             <li className="nav-item">
//               <a
//                 className="nav-link dropdown-toggle d-none d-sm-inline-block text-center"
//                 href=""
//                 onClick={toggleProfile}
//               >
//                 <i className="bi bi-person-circle" style={{ fontSize: "22px" }}></i>
//               </a>
//               {isProfileOpen && (
//                 <div
//                   ref={profileDropdownRef}
//                   className="dropdown-menu dropdown-menu-end py-0 show"
//                   aria-labelledby="profileDropdown"
//                   style={{ left: "auto", right: "2%" }}
//                 >
//                   <a className="dropdown-item" href="" onClick={handleResetPasswordClick}>
//                     <i className="align-middle me-1 bi bi-key"></i> Reset Password
//                   </a>
//                   <div className="dropdown-divider"></div>
//                   <a className="dropdown-item" onClick={handleLogOut} href="/#">
//                     Log out
//                   </a>
//                 </div>
//               )}
//             </li>
//           )}
//           {roles.includes("company_admin") && (
//             <li className="nav-item dropdown position-relative">
//               <a
//                 className="nav-link dropdown-toggle d-none d-sm-inline-block text-center"
//                 href=""
//                 onClick={toggleProfile}
//               >
//                 <span className="text-dark p-2 mb-3">{companyName}</span>
//                 <i className="bi bi-person-circle" style={{ fontSize: "22px" }}></i>
//               </a>
//               {isProfileOpen && (
//                 <div
//                   ref={profileDropdownRef}
//                   className="dropdown-menu dropdown-menu-end py-0 show"
//                   aria-labelledby="profileDropdown"
//                   style={{ left: "auto", right: "2%" }}
//                 >
//                   <a className="dropdown-item" href="/profile">
//                     <i className="align-middle me-1 bi bi-person"></i> Profile
//                   </a>
//                   <a className="dropdown-item" href="" onClick={handleResetPasswordClick}>
//                     <i className="align-middle me-1 bi bi-key"></i> Reset Password
//                   </a>
//                   <div className="dropdown-divider"></div>
//                   <a className="dropdown-item" onClick={handleLogOut} href="">
//                     Log out
//                   </a>
//                 </div>
//               )}
//             </li>
//           )}
//           {roles.includes("Employee") && (
//             <li className="nav-item dropdown position-relative">
//               <a
//                 className="nav-link dropdown-toggle d-none d-sm-inline-block text-center"
//                 href=""
//                 onClick={toggleProfile}
//               >
//                 <span className="text-dark p-2 mb-3">{firstName} {lastName}</span>
//                 <i className="bi bi-person-circle" style={{ fontSize: "22px" }}></i>
//               </a>
//               {isProfileOpen && (
//                 <div
//                   ref={profileDropdownRef}
//                   className="dropdown-menu dropdown-menu-end py-0 show"
//                   aria-labelledby="profileDropdown"
//                   style={{ left: "auto", right: "2%" }}
//                 >
//                   <a className="dropdown-item" href="/profile">
//                     <i className="align-middle me-1 bi bi-person"></i> Profile
//                   </a>
//                   <a className="dropdown-item" href="" onClick={handleResetPasswordClick}>
//                     <i className="align-middle me-1 bi bi-key"></i> Reset Password
//                   </a>
//                   <div className="dropdown-divider"></div>
//                   <a className="dropdown-item" onClick={handleLogOut} href="">
//                     Log out
//                   </a>
//                 </div>
//               )}
//             </li>
//           )}
//         </ul>
//       </div>
//       <Modal show={showErrorModal} onHide={closeModal}>
//         <ModalHeader closeButton>
//           <ModalTitle>Error</ModalTitle>
//         </ModalHeader>
//         <ModalBody>
//           <p>{error}</p>
//         </ModalBody>
//       </Modal>
//       <Reset
//         show={showResetPasswordModal}
//         onHide={() => setShowResetPasswordModal(false)}
//       />
//     </nav>
//   );
// };

// export default Header;
