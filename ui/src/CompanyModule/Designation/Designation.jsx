import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { PencilSquare, XSquareFill } from 'react-bootstrap-icons';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap';
import { Bounce, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DeletePopup from '../../Utils/DeletePopup';
import LayOut from '../../LayOut/LayOut';
import {
  DesignationDeleteApiById,
  DesignationGetApi,
  DesignationPostApi,
  DesignationPutApiById
} from '../../Utils/Axios';

const Designation = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm('');
  const [designations, setDesignations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [pending, setPending] = useState(true);
  const [addDesignation, setAddDesignation] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null); // State to store the ID of the item to be deleted
  const company = sessionStorage.getItem("company");

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedItemId(null); // Reset the selected item ID
  };

  const handleShowDeleteModal = (id) => {
    setSelectedItemId(id); // Set the ID of the item to be deleted
    setShowDeleteModal(true);
  };

  const fetchDesignation = async () => {
    try {
      const designations = await DesignationGetApi();
      setDesignations(designations);
      setFilteredData(designations);
    } catch (error) {
      handleApiErrors(error);
    }
  };
  
  useEffect(() => {
    fetchDesignation();
  }, []);

  const onSubmit = async (data) => {
    setPending(true);
    try {
      const formData = {
        companyName: company,
        name: data.name
      };
      if (editingUserId) {
        await DesignationPutApiById(editingUserId, formData);
        setTimeout(() => {
          toast.success('Designation updated successfully');
            fetchDesignation(); // Fetch updated list of departments after delay
            setAddDesignation(false);
          }, 900);
      
      } else {
        await DesignationPostApi(formData);
       
        setTimeout(() => {
          toast.success('Designation created successfully');
          fetchDesignation(); // Fetch updated list of departments after delay
          setAddDesignation(false);
          }, 1000);
      }
      console.log("data:",designations);
      reset();
      setEditingUserId(null);
      reset();
    } catch (error) {
      handleApiErrors(error);
    } finally {
      setPending(false);
    }
  };

  const handleConfirmDelete = async (id) => {
    if (id) {
      try {
        await DesignationDeleteApiById(id)
        setTimeout(() => {
          toast.success("Designation Deleted Successfully");
            fetchDesignation(); // Fetch updated list of departments after delay
          }, 900);

        handleCloseDeleteModal(); // Close the delete confirmation modal
      } catch (error) {
        handleApiErrors(error);
      }
    } 
  };

  const handleApiErrors = (error) => {
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
      const errorMessage = error.response.data.error.message;
      toast.error(errorMessage);
    } else {
      toast.error("Network Error !");
    }
    console.error(error.response);
  };
  

  const getFilteredList = (searchData) => {
    setSearch(searchData);
    const filtered = designations.filter((item) => {
      // Convert all fields to lowercase for case-insensitive search
      const searchTerm = searchData.toLowerCase();
      const id = item.id.toString().toLowerCase(); // Convert id to string and then to lowercase
      const name = item.name.toLowerCase();
      // Check if any field contains the search term
      return id.includes(searchTerm) || name.includes(searchTerm);
    });
    setFilteredData(filtered);
  };
  const paginationComponentOptions = {
    noRowsPerPage: true,
  };

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
      cell: (row) => (
        <div>
          <button
            className="btn btn-sm"
            style={{ backgroundColor: "transparent", border: "none", padding: "0", marginRight: "10px" }}
            onClick={() => handleEdit(row.id)}
            title='Edit'
          >
            <PencilSquare size={22} color='#2255a4' />
          </button>
          <button
            className="btn btn-sm"
            style={{ backgroundColor: "transparent", border: "none", padding: "0", marginLeft: "5px" }}
            onClick={() => handleShowDeleteModal(row.id)}
            title='Delete'
          >
            <XSquareFill size={22} color='#da542e' />
          </button>
        </div>
      )
    }
  ];

  const handleEdit = (id) => {
    const userToEdit = designations.find(user => user.id === id);
    if (userToEdit) {
      setValue('name', userToEdit.name);
      setEditingUserId(id);
      setAddDesignation(true);
    }
  };

  const toInputTitleCase = (e) => {
    let value = e.target.value;
    const titleCaseValue = value.replace(/^\s+/g, ''); // Remove leading spaces
    e.target.value = titleCaseValue;
    // Split the value into an array of words
    const words = value.split(" ");
    // Capitalize the first letter of each word
    const capitalizedWords = words.map((word) => {
      // Capitalize the first letter of the word
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    // Join the capitalized words back into a single string
    value = capitalizedWords.join(" ");
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

        <div className="row">
          <div className="col-12 col-lg-12 col-xxl-12 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <div className='row mb-2'>
                  <div className='col-12 col-md-6 col-lg-4'>
                    <button
                      onClick={() => setAddDesignation(true)}
                      className={editingUserId ? "btn btn-danger" : "btn btn-primary"}
                      type='submit'
                    >
                   {editingUserId ? "Update Designation" : "Add Designation"}
                    </button>
                  </div>
                  <div className='col-12 col-md-6 col-lg-4'></div>
                  <div className='col-12 col-md-6 col-lg-4'>
                    <input
                      type='search'
                      className="form-control"
                      placeholder='Search....'
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
                pagination
                paginationComponentOptions={{paginationComponentOptions}}
              />
            </div>

            <DeletePopup
              show={showDeleteModal}
              handleClose={handleCloseDeleteModal}
              handleConfirm={() => handleConfirmDelete(selectedItemId)}
              id={selectedItemId} 
               pageName="Designation"
            />

            {addDesignation && (
              <div
                role='dialog'
                aria-modal="true"
                className='fade modal show'
                tabIndex="-1"
                style={{ zIndex: "9999", display: "block" }}
              >
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
                              <input 
                                type="text"
                                className="form-control"
                                placeholder="Enter Designation"
                                name='name'
                                id='designation'
                                onInput={toInputTitleCase}
                                onKeyDown={handleEmailChange}
                                autoComplete='off'
                                {...register("name", {
                                  required: "Designation Required",
                                  pattern: {
                                    value: /^[A-Za-z ]+$/,
                                    message: "This Field accepts only Alphabetic Characters",
                                  },
                                  minLength:{
                                    value:2,
                                    message:"Designation must be at least 2 characters long"
                                  },
                                  maxLength:{
                                    value:20,
                                    message:"Designation must be at most 20 characters long"
                                  }
                                })}
                              />
                              {errors.name && (<p className='errorMsg'>{errors.name.message}</p>)}
                            </div>
                          </div>
                        </div>
                        <div className='modal-footer'>
                          <button
                            className={editingUserId ? "btn btn-danger" : "btn btn-primary"}
                            type='submit'
                          >
                            {editingUserId ? "Update Designation" : "Add Designation"}
                          </button>
                          <button
                            type='button'
                            className="btn btn-secondary"
                            onClick={() => setAddDesignation(false)}
                          >
                            Cancel
                          </button>
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
  );
};

export default Designation;
