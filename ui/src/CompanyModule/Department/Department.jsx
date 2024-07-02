import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DataTable from 'react-data-table-component';
import { PencilSquare, XSquareFill } from 'react-bootstrap-icons';
import { Bounce, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import DeletePopup from '../../Utils/DeletePopup';
import { ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap';
import LayOut from '../../LayOut/LayOut';
import { DepartmentDeleteApiById, DepartmentGetApi, DepartmentPostApi, DepartmentPutApiById } from '../../Utils/Axios';

const Department = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [departments, setDepartments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();
  const [addDepartment, setAddDepartment] = useState(false);
  const location = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedItemId(null);
  };

  const handleShowDeleteModal = (id) => {
    setSelectedItemId(id);
    setShowDeleteModal(true);
  };

  const toInputTitleCase = (e) => {
    let value = e.target.value;
    const words = value.split(' ');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    value = capitalizedWords.join(' ');
    e.target.value = value;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.trim();
    if (value !== '') return;
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  const onSubmit = async (data) => {
    try {
      setPending(true);
  
      if (editingUserId) {
        const response = await DepartmentPutApiById(editingUserId, data);
        toast.success("Department updated successfully");
      } else {
        const response = await DepartmentPostApi(data);
        toast.success("Department created successfully");
      }
  
      fetchDepartments(); // Update departments after submit
      reset();
      setEditingUserId(null);
      setAddDepartment(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    } finally {
      setPending(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const departments = await DepartmentGetApi();
      setDepartments(departments);
      setFilteredData(departments); // Optionally, you can keep filteredData updated as well
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    } finally {
      setPending(false); // Assuming you manage loading state with 'pending'
    }
  };
  

  useEffect(() => {
    fetchDepartments();
  }, [selectedItemId]);

  const handleEdit = (id) => {
    const userToEdit = departments.find(user => user.id === id);
    if (userToEdit) {
      setValue('name', userToEdit.name);
      setEditingUserId(id);
      setAddDepartment(true);
    }
  };

  const handleConfirmDelete = async (id) => {
    if (selectedItemId) {
      try {
        await DepartmentDeleteApiById(id);
        toast.success("Department Deleted Successfully");
        fetchDepartments(); // Update departments after delete
        handleCloseDeleteModal();
        reset();
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to delete department');
      }
    }
  };

  const getFilteredList = (searchData) => {
    setSearch(searchData);
    const result = departments.filter((data) => (
      (data.id && data.id.toString().includes(searchData)) ||
      (data.name.toLowerCase().includes(searchData.toLowerCase()))
    ));
    setFilteredData(result);
  };

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
            <PencilSquare size={22} color='#2255a4' />
          </button>
          <button className="btn btn-sm " style={{ backgroundColor: "transparent", border: "none", padding: "0", marginLeft: "5px" }} onClick={() => handleShowDeleteModal(row.id)}>
            <XSquareFill size={22} color='#da542e' />
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
                <div className='row'>
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
                <div className="dropdown-divider" style={{ borderTopColor: "#d7d9dd" }} />
              </div>
              <DataTable
                columns={columns}
                data={departments}
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
