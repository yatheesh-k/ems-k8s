import React, { useState } from 'react';
import { PersonCircle, Power,ChevronDown } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    console.log("toggleDropdown called");
    setIsOpen(!isOpen);
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  // const role = sessionStorage.getItem('role');
  const userName = sessionStorage.getItem('name');
  const logout = (e) => {
    e.preventDefault();
    sessionStorage.clear('name');
    sessionStorage.clear('role');
    sessionStorage.clear('id');
    sessionStorage.clear('imageFile');

    navigate('/login');
  }
  

  return (
    <>
      <nav className="navbar navbar-expand navbar-light navbar-bg"> 
        <div className="sidebar-toggle js-sidebar-toggle"/>
        <div className="nav-item dropdown">
        <div className="profile-dropdown">
          <div className="profile-icon" onClick={toggleDropdown}  >
            <b>{userName}</b> &nbsp;  <PersonCircle size={24} color="#222e3c" />
            <span className='p-2' ><ChevronDown  /></span>
          </div>
          {isOpen && (
            <div className="dropdown-content mt-2" style={{marginLeft:"30px"}}>
              <Link onClick={logout} ><span>Logout</span>&nbsp;<Power size={20} color='orange' style={{marginBottom:"5px"}} /></Link>
            </div>
          )}
          {console.log("isOpen:", isOpen)}
        </div>
      </div>
      </nav>

    </>
  )
}

export default Header