import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DataTable from 'react-data-table-component';
import { PencilSquare, XSquareFill } from 'react-bootstrap-icons';
import {Bounce, toast } from 'react-toastify';
import DeletePopup from '../../Utils/DeletePopup';
import { ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap';
import LayOut from '../../LayOut/LayOut';
import { DepartmentDeleteApiById, DepartmentGetApi, DepartmentPostApi, DepartmentPutApiById } from '../../Utils/Axios';
import { company } from '../../Utils/Auth';

const Department = () => {
//   const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
// const [depts, setDepts] = useState([]);
// const [filteredData, setFilteredData] = useState([]);
// const [search, setSearch] = useState('');
// const [editingUserId, setEditingUserId] = useState(null);
// const [pending, setPending] = useState(true);
// const [addDepartment, setAddDepartment] = useState(false);
// const [showDeleteModal, setShowDeleteModal] = useState(false);
// const [selectedItemId, setSelectedItemId] = useState(null);

// const handleCloseDeleteModal = () => {
//   setShowDeleteModal(false);
//   setSelectedItemId(null);
// };

// const handleShowDeleteModal = (id) => {
//   setSelectedItemId(id);
//   setShowDeleteModal(true);
// };

// const toInputTitleCase = (e) => {
//   let value = e.target.value;
//   const words = value.split(' ');
//   const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
//   value = capitalizedWords.join(' ');
//   e.target.value = value;
// };

// const handleEmailChange = (e) => {
//   const value = e.target.value.trim();
//   if (value !== '') return;
//   if (e.keyCode === 32) {
//     e.preventDefault();
//   }
// };
// const company = sessionStorage.getItem("company");

// const onSubmit = async (data) => {
//   const postData = {
//     companyName: company,
//     ...data
//   };
//   try {
//     setPending(true);
//     if (editingUserId) {
//       await DepartmentPutApiById(editingUserId, postData);
//       toast.success("Department updated successfully");
//     } else {
//       await DepartmentPostApi(postData);
//       toast.success("Department created successfully");
//     }
//     reset();  
//     await fetchDepartments(); 
//     setEditingUserId(null); 
//     setAddDepartment(false); 
//   } catch (error) {
//     console.error("Error submitting form:", error);
//     toast.error("Failed to submit form");
//   } finally {
//     setPending(false);
//   }
// };

// const fetchDepartments = async () => {
//   try {
//     const departments = await DepartmentGetApi();
//     setDepts(departments);
//     setFilteredData(departments);
//   } catch (error) {
//     console.error('Error fetching departments:', error);
//     toast.error('Failed to fetch departments');
//   } finally {
//     setPending(false);
//   }
// };

// useEffect(() => {
//   fetchDepartments();
// }, []);

// const handleEdit = (id) => {
//   const departmentToEdit = depts.find(dept => dept.id === id);
//   if (departmentToEdit) {
//     setValue('name', departmentToEdit.name);
//     setEditingUserId(id);
//     setAddDepartment(true); // Display the modal form for editing
//   }
// };

// const handleConfirmDelete = async () => {
//   if (selectedItemId) {
//     try {
//       await DepartmentDeleteApiById(selectedItemId);
//       toast.success("Department Deleted Successfully");
//       await fetchDepartments(); // Refresh departments after delete
//       handleCloseDeleteModal(); // Close the delete confirmation modal
//       reset(); // Reset form if necessary
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to delete department');
//     }
//   }
// };

// const getFilteredList = (searchData) => {
//   setSearch(searchData);
//   const filtered = depts.filter((item) => {
//     // Convert all fields to lowercase for case-insensitive search
//     const searchTerm = searchData.toLowerCase();
//     const id = item.id.toString().toLowerCase(); // Convert id to string and then to lowercase
//     const name = item.name.toLowerCase();
//     // Check if any field contains the search term
//     return id.includes(searchTerm) || name.includes(searchTerm);
//   });
//   setFilteredData(filtered);
// };

const { register, handleSubmit, formState: { errors }, reset ,setValue} = useForm('');
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [post,setPost]=useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [pending, setPending] = useState(true);
  const [addDepartment, setAddDepartment] = useState(false);
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


const onSubmit = async (data) => {
  setPending(true);
  const postData = {
    companyName: company,
    ...data
  };

  try {
    let response;
    if (editingUserId) {
      response = await DepartmentPutApiById(editingUserId, postData);
      toast.success("Department Updated Successfully", {
        position: 'top-right',
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 3000,
      });
    } else {
      response = await DepartmentPostApi(postData);
      toast.success("Department Created Successfully", {
        position: 'top-right',
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 3000,
      });
    }

    // Update users state with the new data
    const updatedUsers = editingUserId
      ? users.map(user => (user.id === editingUserId ? { ...user, ...response.data } : user))
      : [...users, response.data];

    setUsers(updatedUsers);
    setFilteredData(updatedUsers); // Update filteredData if needed
    reset();
    setPending(false);
    setAddDepartment(false);

  } catch (error) {
    handleErrors(error);
    setPending(false);
  }
};


const handleErrors = (errors) => {
  if (errors.response) {
    const errorMessage = errors.response.data.error;
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
  console.log(errors);
  setPending(false);
};

const handleEdit = (id) => {
  const userToEdit = users.find(user => user.id === id);
  if (userToEdit) {
    setValue('name', userToEdit.name);
    setEditingUserId(id);
    setAddDepartment(true);
  }
  const formElement = document.getElementById('depatmentForm');
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleConfirmDelete = async () => {
  if (selectedItemId) {
    try {
      await DepartmentDeleteApiById(selectedItemId);
      toast.success("Department Deleted Successfully", {
        position: 'top-right',
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 3000,
      });
      fetchUsers();
      handleCloseDeleteModal();
    } catch (error) {
      handleErrors(error);
    }
  }
};

const fetchUsers = async () => {
  try {
    const response = await DepartmentGetApi();
    setUsers(response);
    setFilteredData(response);
    setPending(false);
  } catch (error) {
    console.error('Error fetching users:', error);
    setPending(false);
  }
};

useEffect(() => {
  fetchUsers();
}, []);


  const getFilteredList = async (searchData) => {
    setSearch(searchData)
    const result = filteredData.filter((data) => {
      return (
        (data.id && data.id.toString().includes(searchData)) ||
        (data.name.toLowerCase().match(search.toLowerCase()))
      );
    });
    setFilteredData(result);
  }


const paginationComponentOptions = {
  noRowsPerPage: true,
};

const columns = [
  {
    name: <h5><b>S No</b></h5>,
    selector: (row, index) => <div className='ml-5' style={{ marginLeft: "10px" }}>{index + 1}</div>,
  },
  {
    name: <h5><b>Department Name</b></h5>,
    selector: (row) => row.name,
  },
  {
    name: <h5><b>Action</b></h5>,
    cell: (row) => (
      <div>
        <button className="btn btn-sm " style={{ backgroundColor: "transparent", border: "none", padding: "0", marginRight: "10px" }} onClick={() => handleEdit(row.id)}>
          <PencilSquare size={22} color='#2255A4' />
        </button>
        <button className="btn btn-sm " style={{ backgroundColor: "transparent", border: "none", padding: "0", marginLeft: "5px" }} onClick={() => handleShowDeleteModal(row.id)}>
          <XSquareFill size={22} color='#DA542E' />
        </button>
      </div>
    )
  }
];

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
          <div className="col">
            <h1 className="h3 mb-3"><strong>Departments</strong> </h1>
          </div>
          <div className="col-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="/main">Home</a>
                </li>
                <li className="breadcrumb-item active">
                  Departments
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-12 col-xxl-12 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <div className='row mb-2'>
                  <div className='col-12 col-md-6 col-lg-4'>
                    <button onClick={() => setAddDepartment(true)} className={editingUserId ? "btn btn-danger" : "btn btn-primary"} type='button'>{editingUserId ? "Update Department" : "Add Department"}</button>
                  </div>
                  <div className='col-12 col-md-6 col-lg-4'></div>
                  <div className='col-12 col-md-6 col-lg-4'>
                    <input type='search' className="form-control" placeholder='Search....'
                      value={search}
                      onChange={(e) => getFilteredList(e.target.value)}
                    />
                  </div>
                </div>
                <div className="dropdown-divider" style={{ borderTopColor: "#D7D9DD" }} />
              </div>
              <DataTable
                columns={columns}
                data={filteredData}
                paginationComponentOptions={paginationComponentOptions}
              />
            </div>
          </div>
        </div>
        <DeletePopup
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleConfirm={() => handleConfirmDelete(selectedItemId)}
          id={selectedItemId}
          pageName="Department"
        />
        {addDepartment && (
          <div className='modal show' tabIndex="-1" style={{ zIndex: "9999", display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <ModalHeader>
                  <ModalTitle>{editingUserId ? "Update Department" : "Add Department"}</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <form onSubmit={handleSubmit(onSubmit)} id='designationForm'>
                    <div className="card-body" style={{ width: "1060px", paddingBottom: "0px" }}>
                      <div className='row'>
                        <div className='col-12 col-md-6 col-lg-4 mb-2'>
                          <input type="text" className="form-control" placeholder="Enter Department"
                            name='name' id='name' autoComplete='off'
                            onInput={toInputTitleCase}
                            onKeyDown={handleEmailChange}
                            {...register("name", {
                              required: "Department Required",
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
                      <button className={editingUserId ? "btn btn-danger" : "btn btn-primary"} type='submit'>{editingUserId ? "Update Department" : "Add Department"}</button>
                      <button type='button' className="btn btn-secondary" onClick={() => setAddDepartment(false)}>Cancel</button>
                    </div>
                  </form>
                </ModalBody>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayOut>
  );
};
export default Department;