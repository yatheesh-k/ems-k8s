import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { PencilSquare, XSquareFill } from 'react-bootstrap-icons';
import { Bounce, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DeletePopup from '../../Utils/DeletePopup';
import { ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap';
import LayOut from '../../LayOut/LayOut';


const Department = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm('');
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [post, setPost] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();
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


  const onSubmit = (data) => {
    setPending(true); // Set pending state to true before making the API call
    if (editingUserId) {
      axios.put(`http://192.168.1.163:8092/department/${editingUserId}`, data)
        .then((res) => {
          if (res.status === 200) {
            toast.success("Department Updated Successfully", {
              position: 'top-right',
              transition: Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000, // Close the toast after 3 seconds
            });
            setEditingUserId(null); // Reset the editing user ID after successful update
          }
          console.log(res.data);
          setPost(res.data);
          fetchUsers();
          reset(); // Reset the form after successful update
          setPending(false); // Set pending state to false after the API call is completed
        })
        .catch((errors) => {
          if (errors.response) {
            const status = errors.response.status;
            let errorMessage = '';

            switch (status) {
              case 400:
                errorMessage = ' Data Already Exist';
                break;
              case 403:
                errorMessage = 'Session TImeOut !';
                navigate('/')
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
          console.log(errors);
          setPending(false);
        });
    } else {
      axios.post('http://192.168.1.163:8092/department/add', data)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Department Created Successfully", {
              position: 'top-right',
              transition: Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000, // Close the toast after 3 seconds
            });
          }
          console.log(response.data);
          setPost(response.data); // Set the post state with the response data
          fetchUsers();
          reset(); // Reset the form after successful submission
          setPending(false); // Set pending state to false after the API call is completed
        })
        .catch((errors) => {
          if (errors.response) {
            const status = errors.response.status;
            let errorMessage = '';

            switch (status) {
              case 400:
                errorMessage = ' Data Already Exist';
                break;
              case 403:
                errorMessage = 'Session TImeOut !';
                navigate('/')
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
          console.log(errors);
          setPending(false);
        });
    }
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers();
      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const handleEdit = (id) => {
    // Set the user data to the form for editing
    const userToEdit = users.find(user => user.id === id);
    if (userToEdit) {
      setValue('departmentTitle', userToEdit.departmentTitle);
      setEditingUserId(id);
    }
    const formElement = document.getElementById('depatmentForm');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConfirmDelete = async (id) => {
    if (selectedItemId) {
      try {
        await axios.delete(`http://192.168.1.163:8092/department/${id}`)
          .then((response) => {
            if (response.status === 200) {
              toast.success("Department Deleted Succesfully", {
                position: 'top-right',
                transition: Bounce,
                hideProgressBar: true,
                theme: "colored",
                autoClose: 3000, // Close the toast after 3 seconds

              })
            }
          })
        fetchUsers(); // Refresh data after successful operation
        handleCloseDeleteModal();
        reset();
      } catch (error) {
        if (error.response && error.response.data && error.response.status === 401) {
          toast.error("Session TimeOut", {  //Notification status
            position: 'top-right',
            transition: Bounce,
            hideProgressBar: true,
            theme: "colored",
            autoClose: 1000, // Close the toast after 1 seconds
          });
          console.error('Server Error Message:', error.response.data);
        }
        console.error('Error:', error);
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.1.163:8092/department/all');
      setUsers(response.data);
      setFilteredData(response.data);
      setPending(false); // Set pending state to false to hide the loading indicator
    } catch (error) {

      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    // Fetch initial user data (Read operation)
    fetchUsers();
  }, []);



  const paginationComponentOptions = {
    noRowsPerPage: true,
  }

  const columns = [
    {
      name: <h5><b>S No</b></h5>,
      selector: (row, index) => <div className='ml-5' style={{ marginLeft: "10px" }}>{index + 1}</div>,
    },
    // {
    //   name: "ID",
    //   selector: (row) => row.id,
    // },
    {
      name: <h5><b>Department Name</b></h5>,
      selector: (row) => row.departmentTitle,
    },
    {
      name: <h5><b>Action</b></h5>,
      cell: (row) => (
        <div>
          <button className="btn btn-sm " style={{ backgroundColor: "transparent", border: "none", padding: "0", marginRight: "10px" }} onClick={() => handleEdit(row.id)}>
            <PencilSquare size={22} color='#2255a4' />
          </button>
          <button className="btn btn-sm " style={{ backgroundColor: "transparent", border: "none", padding: "0", marginLeft: "5px" }} onClick={() => handleShowDeleteModal(row.id)}>
            <XSquareFill size={22} color='#da542e' />
          </button>
        </div>
      )
    }
  ]

  const getFilteredList = async (searchData) => {
    setSearch(searchData)
    const result = users.filter((data) => {
      return (
        (data.id && data.id.toString().includes(searchData)) ||
        (data.departmentTitle.toLowerCase().match(search.toLowerCase()))
      );
    });
    setFilteredData(result);
  }



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
                  <div className="card-header ">
                    <div className='row'>
                      <div className='col-12 col-md-6 col-lg-4' >
                        <button onClick={() => setAddDepartment(true)} className={editingUserId ? "btn btn-danger" : "btn btn-primary"} type='submit'>{editingUserId ? "Update Department" : "Add Department"}</button>
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
                    columns={columns} c
                    data={filteredData}
                    // progressPending={pending} 
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                  />

                </div>
              </div>
            </div>
            <DeletePopup
              show={showDeleteModal}
              handleClose={handleCloseDeleteModal}
              handleConfirm={(id) => handleConfirmDelete(id) / console.log(id)} // Pass the id to handleConfirmDelete
              id={selectedItemId} // Pass the selectedItemId to DeletePopup
              pageName="Department"
            />
            {addDepartment && (
              <div role='dialog' aria-modal="true" className='fade modal show' tabIndex="-1" style={{ zIndex: "9999", display: "block" }} >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <ModalHeader>
                      <ModalTitle >{editingUserId ? "Update Department" : "Add Department"}</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                      <form onSubmit={handleSubmit(onSubmit)} id='designationForm'>
                        <div className="card-body" style={{ width: "1060px", paddingBottom: "0px" }}>
                          <div className='row'>
                            <div className='col-12 col-md-6 col-lg-4 mb-2'>
                              <input type="text" className="form-control" placeholder="Enter Department"
                                name='departmentTitle' id='departmentTitle' autoComplete='off'
                                onInput={toInputTitleCase}
                                onKeyDown={handleEmailChange}
                                {...register("departmentTitle", {
                                  required: "Department Required",
                                  pattern: {
                                    value: /^[A-Za-z ]+$/,
                                    message: "This Field accepts only Alphabetic Characters",
                                  }
                                })}
                              />
                              {errors.departmentTitle && (<p className='errorMsg'>{errors.departmentTitle.message}</p>)}
                            </div>
                            <div className='modal-footer'>
                              <button className={editingUserId ? "btn btn-danger" : "btn btn-primary"} type='submit'>{editingUserId ? "Update Department" : "Add Department"}</button>
                              <button type='button' className="btn btn-secondary" onClick={() => setAddDepartment(false)}>Cancel</button>
                            </div>
                          </div>
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
