import React, { useState } from "react";


const Header = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false);
  };

  return (
    <nav className="navbar navbar-expand navbar-light navbar-bg">
      <a className="sidebar-toggle js-sidebar-toggle" href>
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
          <li className="nav-item dropdown position-relative">
            <a
              className="nav-link dropdown-toggle d-none d-sm-inline-block text-center"
              href
              onClick={toggleProfile}
            >
              <i className="bi bi-person-circle" style={{fontSize:"22px"}}></i>
            </a>
            {isProfileOpen && (
              <div
                className="dropdown-menu dropdown-menu-end py-0 show"
                aria-labelledby="profileDropdown"
                style={{ left: "auto", right: "50%" }}
              >
                <a className="dropdown-item" href="pages-profile.html">
                  <i className="align-middle me-1 bi bi-person"></i> Profile
                </a>
                <a className="dropdown-item" href="index.html">
                  <i className="align-middle me-1 bi bi-gear"></i> Settings
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href>
                  Log out
                </a>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
