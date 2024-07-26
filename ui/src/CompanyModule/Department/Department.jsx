import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DataTable from 'react-data-table-component';
import { PencilSquare, XSquareFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import LayOut from '../../LayOut/LayOut';
import DeletePopup from '../../Utils/DeletePopup';
import { ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap';
import { DepartmentDeleteApiById, DepartmentGetApi, DepartmentPostApi, DepartmentPutApiById } from '../../Utils/Axios';

const Department = () => {
  const { register, handleSubmit, reset, setValue,formState:{errors} } = useForm();
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [addDepartment, setAddDeparment] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null); 
  const [search, setSearch] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const company = sessionStorage.getItem("company");

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedItemId(null); // Reset the selected item ID
  };

  const handleShowDeleteModal = (id) => {
    setSelectedItemId(id); // Set the ID of the item to be deleted
    setShowDeleteModal(true);
  };
  const fetchDepartments = async () => {
    try {
      const response = await DepartmentGetApi();
      setDepartments(response.data.data);
    } catch (error) {
      handleApiErrors(error);
    }
  };
  useEffect(() => {
    fetchDepartments();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true); 
    try {
      const formData = {
        companyName: company,
        name: data.name
      };
      if (editingId) {
        await DepartmentPutApiById(editingId, formData);
        setTimeout(() => {
          toast.success('Department updated successfully');
            fetchDepartments(); // Fetch updated list of departments after delay
            setAddDeparment(false);
          }, 800);
      
      } else {
        await DepartmentPostApi(formData);
       
        setTimeout(() => {
          toast.success('Department created successfully');
          fetchDepartments();
          }, 1000);
          setAddDeparment(false);
          }, 1000);
      }
      reset();
      setEditingId(null);
      reset();
    } catch (error) {
      handleApiErrors(error);
    } finally {
      setLoading(false); 
    }
  };

  const handleConfirmDelete = async (id) => {
    if (id) {
      try {
        await DepartmentDeleteApiById(id)
        setTimeout(() => {
          toast.success("Department Deleted Successfully");
            fetchDepartments(); // Fetch updated list of departments after delay
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

  useEffect(()=>{
    fetchDepartments();
  },[])
  
  useEffect(() => {
    setFilteredDepartments(departments);
  }, [departments]);

  const handleEdit = (id) => {
    const userToEdit = departments.find(user => user.id === id);
    if (userToEdit) {
      setValue('name', userToEdit.name);
      setEditingId(id);
      setAddDeparment(true);
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



  const getFilteredList = (searchTerm) => {
    setSearch(searchTerm);
    if (searchTerm === '') {
      console.log(departments)
      setFilteredDepartments(departments); 
    } else {
      const filteredList = departments.filter(department =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDepartments(filteredList);
    }
  };

  console.log(filteredDepartments);
  


  const columns = [
    {
      name: <h5><b>S No</b></h5>,
      selector: (row, index) => index + 1,
    },
    {
      name: <h5><b>Department Name</b></h5>,
      selector: (row) => row.name,
    },
    {
      name: <h5><b>Action</b></h5>,
      cell: (row) => (
        <div>
          <button
            className="btn btn-sm"
            style={{ backgroundColor: "transparent", border: "none", padding: "0", marginRight: "10px" }}
            onClick={() => handleEdit(row.id, row.name)}
          >
            <PencilSquare size={22} color='#2255a4' />
          </button>
          <button
            className="btn btn-sm"
            style={{ backgroundColor: "transparent", border: "none", padding: "0", marginLeft: "5px" }}
            onClick={() => handleShowDeleteModal(row.id)}
            disabled={loading}
          >
            <XSquareFill size={22} color='#da542e' />
          </button>
        </div>
      )
    }
  ];

  return (

     <LayOut>
     <div className="container-fluid p-0">
       <div className="row d-flex align-items-center justify-content-between mt-1">
         <div className="col">
           <h1 className="h3 mb-3"><strong>Department</strong> </h1>
         </div>
         <div className="col-auto">
           <nav aria-label="breadcrumb">
             <ol className="breadcrumb mb-0">
               <li className="breadcrumb-item">
                 <a href="/main">Home</a>
               </li>
               <li className="breadcrumb-item active">
                 Department
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
                     onClick={() => setAddDeparment(true)}
                     className={editingId ? "btn btn-danger" : "btn btn-primary"}
                     type='submit'
                   >
                     {loading ? "Loading..." : (editingId ? "Update Department" : "Add Department")}

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
        data={filteredDepartments}
        pagination
        highlightOnHover
        striped
        noHeader
      />
           </div>

           <DeletePopup
             show={showDeleteModal}
             handleClose={handleCloseDeleteModal}
             handleConfirm={() => handleConfirmDelete(selectedItemId)}
             id={selectedItemId} 
              pageName="Department"
           />

           {addDepartment && (
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
                     <ModalTitle>{editingId ? "Update Department" : "Add Department"}</ModalTitle>
                   </ModalHeader>
                   <ModalBody>
                     <form onSubmit={handleSubmit(onSubmit)} id='designationForm'>
                       <div className="card-body" style={{ width: "1060px", paddingBottom: "0px" }}>
                         <div className='row'>
                           <div className='col-12 col-md-6 col-lg-4 mb-2'>
                             <input 
                               type="text"
                               className="form-control"
                               placeholder="Enter Department"
                               name='name'
                               id='designation'
                               onInput={toInputTitleCase}
                               autoComplete='off'
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
                         <button
                           className={editingId ? "btn btn-danger" : "btn btn-primary"}
                           type='submit'
                           disabled={loading}
                         >
                           {loading ? "Loading..." : (editingId ? "Update Department" : "Add Department")}
                         </button>
                         <button
                           type='button'
                           className="btn btn-secondary"
                           onClick={() => setAddDeparment(false)}
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

export default Department;
