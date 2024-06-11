import React, { useState, useEffect } from 'react'
import Footer from '../ScreenPages/Footer';
import Header from '../ScreenPages/Header';
import SideNav from '../ScreenPages/SideNav';
import { PencilSquare, XSquareFill } from 'react-bootstrap-icons';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
import DeletePopup from './DeletePopup';

const UsersView = () => {
  const [view, setView] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [search, setSearch] = useState('')
  const Navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null); // State to store the ID of the item to be deleted

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedItemId(null); // Reset the selected item ID
  };

  const handleShowDeleteModal = (id) => {
    setSelectedItemId(id); // Set the ID of the item to be deleted
    setShowDeleteModal(true);
  };

  const getUser = () => {
    axios.get("http://192.168.1.163:8092/user/all")
      .then((response) => {
        console.log(response.data);
        setView(response.data);
        setFilteredData(response.data);
      })
      .catch((errors) => {

        console.log(errors)

      });
  }
  useEffect(() => {
    getUser(); 
  }, []);

  const statusMappings = {
    1: { label: <b style={{ backgroundColor: "green", color: "white", borderRadius: "5px", padding: "2px" }}>Active</b>, },
    4: { label: <b style={{ backgroundColor: "red", color: "white", borderRadius: "5px", padding: "2px" }}>InActive</b>, color: "orange" },
    // 3: { label: <b style={{ backgroundColor: "orange", color: "white", borderRadius: "5px", padding: "2px" }}>Noti</b>, color: "red" },
    // Add more mappings as needed
  };

  const getData = (userId) => {
    console.log(userId)
    Navigate(`/usersRegistration`, { state: { userId } })  //deleteuser/
  }
  const handleConfirmDelete = async (userId) => {
    if(selectedItemId){
    try {
      // Make a DELETE request to the API with the given ID
      await axios.delete(`http://192.168.1.163:8092/user/${userId}`)
        .then((response) => {
          if (response.status === 200) {
            toast.success("User Deleted Successfully", {
              position: 'top-right',
              transition: Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000, // Close the toast after 3 seconds

            })
          }
          getUser();
          handleCloseDeleteModal();
          console.log(response.data);
        })
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        let errorMessage = '';

        switch (status) {
          case 403:
            errorMessage = 'Session TImeOut !';
            Navigate('/')
            break;
          case 404:
            errorMessage = 'Resource Not Found !';
            break;
          case 406:
            errorMessage = 'Invalid Details !';
            break;
          case 500:
            errorMessage = 'Server Error !';
            break;
          default:
            errorMessage = 'An Error Occurred !';
            break;
        }

        toast.error(errorMessage, {
          position: 'top-right',
          transition: Bounce,
          hideProgressBar: true,
          theme: "colored",
          autoClose: 3000,
        });
      } else {
        toast.error('Network Error !', {
          position: 'top-right',
          transition: Bounce,
          hideProgressBar: true,
          theme: "colored",
          autoClose: 3000,
        });
      }
      // Log any errors that occur
      console.error(error.response);
    }
  }
};

  const paginationComponentOptions = {
    noRowsPerPage: true,
  }

  const columns = [
    {
      name: <h5><b>S No</b></h5>,
      selector: (row,index) => index+1,
      width:"100px"

    },
    
    {
      name: <h5><b>User Id</b></h5>,
      selector: (row) => row.userId,

    },
    {
      name: <h5><b>User Name</b></h5>,
      selector: (row) => row.userName,

    },
    {
      name: <h5><b>Email ID</b></h5>,
      selector: (row) => row.emailId,
      minWidth:"200px",
      maxWidth:"250px",
      wrap:true

    },
    {
      name: <h5><b>Role</b></h5>,
      selector: (row) => row.role,
      width:"100px"

    },
    {
      name: <h5><b>Status</b></h5>,
      selector: (row) => <div style={{ color: statusMappings[row.status]?.color || "black" }}>
        {statusMappings[row.status]?.label || "Unknown"}
      </div>

    },

    {
      name: <h5><b>Action</b></h5>,
      cell: (row) => <div> <button className="btn btn-sm " style={{ backgroundColor: "transparent", border: "none", padding: "0",marginRight:"10px" }} onClick={() => getData(row.userId)} ><PencilSquare size={22} color='#2255a4' /></button>
        <button className="btn btn-sm " style={{ backgroundColor: "transparent", border: "none", padding: "0", marginLeft: "5px" }}><XSquareFill size={22} color='#da542e' onClick={() => handleShowDeleteModal(row.userId)} /></button>
      </div>

    }
  ]

  
  const getFilteredList = async (searchData) => {
    setSearch(searchData);
    const result = view.filter((data) => {
      return (
        (data.userId && data.userId.toString().includes(searchData)) ||
        (data.userId && data.userId.toLowerCase().includes(searchData.toLowerCase())) ||
        (data.userName && data.userName.toLowerCase().includes(searchData.toLowerCase())) ||
        (data.emailId && data.emailId.toLowerCase().includes(searchData.toLowerCase())) ||
        (data.role && data.role.toLowerCase().includes(searchData.toLowerCase()))
      //  (data.status && statusMappings[data.status]?.label && statusMappings[data.status].label.toLowerCase().includes(searchData.toLowerCase()))
      );
    });
    setFilteredData(result);
  };
  
  
  return (
    <div className='wrapper'>
      <SideNav />
      <div className='main'>
        <Header />
        <main className="content">
          <div className="container-fluid p-0">
            <h1 className="h3 mb-3"><strong>Users Summary</strong> </h1>
            {/**Department View TableForm */}
            <div className="row">
              <div className="col-12 col-lg-12 col-xxl-12 d-flex">
                <div className="card flex-fill">
                  <div className="card-header">
                    <div className='row'>
                      <div className='col-12 col-md-6 col-lg-4' >
                        <Link to={'/usersRegistration'}> <button className="btn btn-primary">Add User</button></Link>
                      </div>
                      <div className='col-12 col-md-6 col-lg-4'></div>
                      <div className='col-12 col-md-6 col-lg-4' >
                        <input type='search' className="form-control" placeholder='Search....'
                          value={search}
                          onChange={(e) => getFilteredList(e.target.value)}
                        />
                      </div>
                      <div className="dropdown-divider" style={{ borderTopColor: "#d7d9dd" }} />
                    </div>
                  </div>
                  <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                  />
                </div>
              </div>
              <DeletePopup
                  show={showDeleteModal}
                  handleClose={handleCloseDeleteModal}
                  handleConfirm={(userId) => handleConfirmDelete(userId)} // Pass the id to handleConfirmDelete
                  id={selectedItemId} // Pass the selectedItemId to DeletePopup
                  pageName='User'
                
                />
            </div>

          </div>
        </main>
        <Footer />
      </div>

    </div>
  )
}

export default UsersView
