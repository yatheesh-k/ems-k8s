import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useForm } from 'react-hook-form'
import { PencilSquare, XSquareFill } from 'react-bootstrap-icons';
import DataTable from 'react-data-table-component';
import { Bounce, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DeletePopup from '../../Utils/DeletePopup';
import { ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap';
import LayOut from '../../LayOut/LayOut';
import { DesignationDeleteApiById, DesignationGetApi, DesignationPostApi, DesignationPutApiById } from '../../Utils/Axios';


const Designation = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm('')
  const [user, setUser] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState([]);
  const [post, setPost] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();
  const [addDesignation, setAddDesignation] = useState(false);
  const [designations, setDesignations] = useState([]);
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

  const toInputTitleCase = e => {
    let value = e.target.value;
    // Split the value into an array of words
    const words = value.split(' ');
    // Capitalize the first letter of each word
    const capitalizedWords = words.map(word => {
      // Capitalize the first letter of the word
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    // Join the capitalized words back into a single string
    value = capitalizedWords.join(' ');
    // Set the modified value to the input field
    e.target.value = value;
  };

  const company=sessionStorage.getItem("company");



// Function to handle form submission (Add or Update designation)
const onSubmit = async (data) => {
  setPending(true);
  try {
    const formData = {
      companyName: sessionStorage.getItem("company"),
      name: data.name
    };
    if (editingUserId) {
      await DesignationPutApiById(editingUserId, formData);
      toast.success("Department updated successfully");
    } else {
      await DesignationPostApi(formData);
      toast.success("Department created successfully");
    }
    
    // After CRUD operation, fetch designations again to update the list
    fetchDesignation(); 
    setEditingUserId(null);
    setAddDesignation(false);
    reset();
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error("Failed to perform operation");
  } finally {
    setPending(false);
  }
};

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);


  const handleEdit = (id) => {
    const userToEdit = designations.find(user => user.id === id);
    if (userToEdit) {
      setValue('name', userToEdit.name);
      setEditingUserId(id);
      setAddDesignation(true);
    }
  };

  // Function to handle deletion of a designation
  const handleConfirmDelete = async () => {
    if (selectedItemId) {
      try {
        await DesignationDeleteApiById(selectedItemId);
        toast.success("Department Deleted Successfully");
        fetchDesignation(); // After deletion, fetch designations again to update the list
        handleCloseDeleteModal(); // Close delete confirmation modal
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to delete department');
      }
    }
  };

  const fetchDesignation = async () => {
    try {
      const designations = await DesignationGetApi();
      setDesignations(designations);
      setFilteredData(designations);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    } 
  };
  useEffect(() => {
  fetchDesignation();
}, []); // Dependency array is empty to run only once on mount

  const handleEmailChange = (e) => {
    // Get the current value of the input field
    const value = e.target.value;

    // Check if the value is empty
    if (value.trim() !== '') { 
      return; // Allow space button
    }

    // Prevent space character entry if the value is empty
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  const paginationComponentOptions = {
    noRowsPerPage: true,
  }

  const columns = [
    {
      name: <h5><b>S No</b></h5>,
      selector: (row, index) => index + 1,

    },
    {
      name: <h5><b>Designation</b></h5>,
      selector: (row) => row.name,

    },
    {
      name: <h5><b>Action</b></h5>,
      cell: (row) => <div> <button className="btn btn-sm " style={{ backgroundColor: "transparent", border: "none", padding: "0", marginRight: "10px" }} onClick={() => handleEdit(row.id)}><PencilSquare size={22} color='#2255a4' /></button>
        <button className="btn btn-sm " style={{ backgroundColor: "transparent", border: "none", padding: "0", marginLeft: "5px" }} onClick={() => handleShowDeleteModal(row.id)}><XSquareFill size={22} color='#da542e' /></button>
      </div>
    }
  ]

  const getFilteredList = (searchData) => {
    setSearch(searchData);
    const filtered = user.filter((item) => {
      // Convert all fields to lowercase for case-insensitive search
      const searchTerm = searchData.toLowerCase();
      const id = item.id.toString().toLowerCase(); // Convert id to string and then to lowercase
      const name = item.name.toLowerCase();
      // Check if any field contains the search term
      return id.includes(searchTerm) || name.includes(searchTerm);
    });
    setFilteredData(filtered);
  };



  return (
    <LayOut>
      <div className="container-fluid p-0">
        <div className="row d-flex align-items-center justify-content-between mt-1">
          <div className="col">
            <h1 className="h3 mb-3"><strong>Designation</strong> </h1>
          </div>
          <div className="col-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="/main">Home</a>
                </li>

                <li className="breadcrumb-item active">
                  Designation
                </li>
              </ol>
            </nav>
          </div>
        </div>
        {/* <form onSubmit={handleSubmit(onSubmit)} id='designationForm'>
                    <div className="card-body">
                      <div className='row'>
                        <div className='col-12 col-md-6 col-lg-4 mb-2'>
                          <input type="text" className="form-control" placeholder="Enter Designation"
                            name='name' id='designation'
                            onInput={toInputTitleCase} autoComplete='off' 
                            onKeyDown={handleEmailChange}
                            {...register("name", {
                              required: "Designation Required",
                              pattern: {
                                value: /^[A-Za-z ]+$/,
                                message: "This Field accepts only Alphabetic Characters",
                              }
                            })}
                          />
                          {errors.name && (<p className='errorMsg'>{errors.name.message}</p>)}
                        </div>
                        <div className='col-12 col-md-6 col-lg-4' >

                          <button className={editingUserId ? "btn btn-danger" : "btn btn-primary"} type='submit'>{editingUserId ? "Update Designation" : "Add Designation"}</button>
                        </div>
                      </div>
                    </div>
                  </form>*/}
        {/**designation View TableForm */}
        <div className="row">
          <div className="col-12 col-lg-12 col-xxl-12 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <div className='row mb-2'>
                  <div className='col-12 col-md-6 col-lg-4' >
                    <button onClick={() => setAddDesignation(true)} className={editingUserId ? "btn btn-danger" : "btn btn-primary"} type='submit'>{editingUserId ? "Update Designation" : "Add Designation"}</button>
                  </div>
                  <div className='col-12 col-md-6 col-lg-4'></div>
                  <div className='col-12 col-md-6 col-lg-4' >
                    <input type='search' className="form-control" placeholder='Search....'
                      value={search}
                      onChange={(e) => getFilteredList(e.target.value)}
                    />
                  </div>
                </div>
                <div className="dropdown-divider" style={{ borderTopColor: "#d7d9dd" }} />
              </div>
              <DataTable
                columns={columns}
                data={filteredData}
                // progressPending={pending}
                pagination
                paginationComponentOptions={paginationComponentOptions}

              />
              {/* <table className="table table-hover my-0">
                    <thead>
                      <tr>
                        <th >S No</th>
                        <th className="d-none d-xl-table-cell">Designation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Project Manager</td>
                      </tr>
                      <tr>
                      <td>2</td>
                        <td>DataScience</td>
                      </tr>
                      <tr>
                      <td>3</td>
                        <td>Project Coordinator</td>
                      </tr>
                      <tr>
                      <td>4</td>
                        <td>Hr designation</td>
                      </tr>
                      <tr>
                      <td>5</td>
                        <td>Software</td>
                      </tr>
                    </tbody>
                  </table> */}
            </div>
            <DeletePopup
              show={showDeleteModal}
              handleClose={handleCloseDeleteModal}
              handleConfirm={(id) => handleConfirmDelete(id) / console.log(id)} // Pass the id to handleConfirmDelete
              pageName="Designation"
              id={selectedItemId} // Pass the selectedItemId to DeletePopup
            />
            {addDesignation && (
              <div role='dialog' aria-modal="true" className='fade modal show' tabIndex="-1" style={{ zIndex: "9999", display: "block" }} >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <ModalHeader>
                      <ModalTitle>{editingUserId ? "Update Designation" : "Add Designation"}</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                      <form onSubmit={handleSubmit(onSubmit)} id='designationForm'>
                        <div className="card-body" style={{ width: "1060px", paddingBottom: "0px" }}>
                          <div className='row'>
                            <div className='col-12 col-md-6 col-lg-4 mb-2'>
                              <input type="text" className="form-control" placeholder="Enter Designation"
                                name='name' id='designation'
                                onInput={toInputTitleCase} autoComplete='off'
                                onKeyDown={handleEmailChange}
                                {...register("name", {
                                  required: "Designation Required",
                                  pattern: {
                                    value: /^[A-Za-z ]+$/,
                                    message: "This Field accepts only Alphabetic Characters",
                                  }
                                })}
                              />
                              {errors.name && (<p className='errorMsg'>{errors.name.message}</p>)}
                            </div>

                          </div>
                        </div>
                        <div className='modal-footer'>
                          <button className={editingUserId ? "btn btn-danger" : "btn btn-primary"} type='submit'>{editingUserId ? "Update Designation" : "Add Designation"}</button>
                          <button type='button' className="btn btn-secondary" onClick={() => setAddDesignation(false)}>Cancel</button>
                        </div>
                      </form>
                    </ModalBody>

                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </LayOut>
  )
}

export default Designation



// useEffect(() => {
//   const fetchEmployeeData = async () => {
//     try {
//       const employees = await EmployeeGetApi();
//       setEmployees(employees);
//       setFilteredData(employees);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       toast.error('Failed to fetch departments');
//     } 
//   };

//   fetchEmployeeData();
// }, [company, token]);