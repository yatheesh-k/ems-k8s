import React, { useState, useEffect } from "react";
import { PencilSquare, XSquareFill } from "react-bootstrap-icons";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import DeletePopup from "../../Utils/DeletePopup";
import LayOut from "../../LayOut/LayOut";
import { EmployeeDeleteApiById, EmployeeGetApi } from "../../Utils/Axios";

const EmployeeView = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
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

  const getMonthNames = () => {
    return Array.from({ length: 12 }, (_, i) =>
      (i + 1).toLocaleString("en-US", { minimumIntegerDigits: 2 })
    );
  };

  const getRecentYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 10; i--) {
      years.push(i.toString());
    }
    return years;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // Ensure two-digit month and day
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  const token =sessionStorage.getItem("token")
    useEffect(() => {
      EmployeeGetApi().then(data => {
        const filteredData = data
          .filter(employee => employee.employeeId !== null) // Exclude employees with null employeeId
          .map(({ referenceId, ...rest }) => rest); // Exclude referenceId
        setEmployees(filteredData);
        setFilteredData(filteredData);
      });
    }, []);
    

  const handleSalary=(id)=>{
    Navigate('/employeeSalaryList',{ state: { id } })
  }

  const handleEdit = (id) => {
    console.log(id);
    Navigate(`/employeeRegistration`, { state: { id } }); //deleteuser/
  };

  const handleConfirmDelete = async () => {
    if (selectedItemId) {
      try {
      await  EmployeeDeleteApiById(selectedItemId)
          .then((response) => {
           
              toast.success("Employee Deleted Succesfully", {
                position: "top-right",
                transition: Bounce,
                hideProgressBar: true,
                theme: "colored",
                autoClose: 3000, // Close the toast after 3 seconx  ds
              });
         
            //getEmployees()
            handleCloseDeleteModal();
            console.log(response.data);
          });
      } catch (error) {
        if (error.response) {
          const status = error.response.status;
          let errorMessage = "";

          switch (status) {
            case 403:
              errorMessage = "Session TImeOut !";
              Navigate("/");
              break;
            case 404:
              errorMessage = "Resource Not Found !";
              break;
            case 406:
              errorMessage = "Invalid Details !";
              break;
            case 500:
              errorMessage = "Server Error !";
              break;
            default:
              errorMessage = "An Error Occurred !";
              break;
          }

          toast.error(errorMessage, {
            position: "top-right",
            transition: Bounce,
            hideProgressBar: true,
            theme: "colored",
            autoClose: 3000,
          });
        } else {
          toast.error("Network Error !", {
            position: "top-right",
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

  const statusMappings = {
    0: {
      label: (
        <b
          style={{
            backgroundColor: "green",
            color: "white",
            borderRadius: "5px",
            padding: "2px",
          }}
        >
          Active
        </b>
      ),
    },
    1: {
      label: (
        <b
          style={{
            backgroundColor: "orange",
            color: "white",
            borderRadius: "5px",
            padding: "2px",
          }}
        >
          InActive
        </b>
      ),
    },
    2: {
      label: (
        <b
          style={{
            backgroundColor: "yellow",
            color: "white",
            borderRadius: "5px",
            padding: "2px",
          }}
        >
          Notice Period
        </b>
      ),
      color: "orange",
    },
    3: {
      label: (
        <b
          style={{
            backgroundColor: "red",
            color: "white",
            borderRadius: "5px",
            padding: "2px",
          }}
        >
          Relieved
        </b>
      ),
      color: "red",
    },
    // Add more mappings as needed
  };

  const paginationComponentOptions = {
    noRowsPerPage: true,
  };


  const columns = [
    {
      name: <h6><b>S No</b></h6>,
      selector: (row, index) => index + 1,
      width: "75px",
    },
    {
      name: <h6><b>Name</b></h6>,
      selector: row => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: <h6><b>Email Id</b></h6>,
      selector:row=> row.emailId,
      sortable: true,
    },
    {
      name: <h6><b>DepartMent</b></h6>,
      selector: row =>row.department,
      sortable: true,
    },

    {
      name: <h6><b>Date of Hiring</b></h6>,
      selector:row=> row.dateOfHiring,
      sortable: true,
      format: row => new Date(row.dateOfHiring).toLocaleDateString(),
    },
    {
      name: <h6><b>Status</b></h6>,
      selector: row =>row.status,
      sortable: true,
      cell: (row) => statusMappings[row.status]?.label || "Unknown",
    },
    {
      name: <h5><b>Salary</b></h5>,
      cell: (row) => (
        <div>
          <button className="btn btn-sm btn-primary" onClick={() => handleSalary(row.id)}>
           Salary
          </button>
         
        </div>
      )
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
  


  const dateFormatting = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Pad month with leading zero if needed
    const day = date.getDate().toString().padStart(2, "0"); // Pad day with leading zero if needed

    return `${year}-${month}-${day}`;
  };

  const getFilteredList = (searchTerm) => {
    setSearch(searchTerm);
    const filtered = employees.filter((item) => {
      const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
      const email = item.emailId.toLowerCase();
      const dateOfHiring = new Date(item.dateOfHiring)
        .toLocaleDateString()
        .toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        dateOfHiring.includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(filtered);
  };

  const filterByMonthYear = (selectedMonth, selectedYear) => {
    setSelectedMonth(selectedMonth);
    setSelectedYear(selectedYear);
    const result = employees.filter((data) => {
      const resignDate = new Date(data.dateOfHiring);
      const resignMonth = resignDate.getMonth() + 1;
      const resignYear = resignDate.getFullYear();
      return (
        (resignMonth === parseInt(selectedMonth) || !selectedMonth) &&
        (resignYear === parseInt(selectedYear) || !selectedYear)
      );
    });
    setFilteredData(result);
  };


  return (
    <LayOut>
      <div className="container-fluid p-0">
      <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
              <div className="col">
              <h1 className="h3 mb-3"><strong>Employees</strong> </h1>
              </div>
              <div className="col-auto">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <a href="/main">Home</a>
                    </li>
                   
                    <li className="breadcrumb-item active">
                      Employees Summary
                    </li>
                  </ol>
                </nav>
              </div>
            </div>

        {/**Department View TableForm */}
        <div className="row">
          <div className="col-12 col-lg-12 col-xxl-12 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-4">
                    <Link to={"/employeeRegistration"}>
                      {" "}
                      <button className="btn btn-primary">Add Employee</button>
                    </Link>
                  </div>
                  <div className="row col-12 mb-2">
                 
                  <div className="col-md-4 mt-2 ">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search...."
                      value={search}
                      onChange={(e) => getFilteredList(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 mt-2">
                    <select
                      className="form-select"
                      value={selectedYear}
                      onChange={(e) =>
                        filterByMonthYear(selectedMonth, e.target.value)
                      }
                    >
                      <option value="">Select Year</option>
                      {getRecentYears().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mt-2">
                    <select
                      className="form-select"
                      value={selectedMonth}
                      onChange={(e) =>
                        filterByMonthYear(e.target.value, selectedYear)
                      }
                    >
                      <option value="">Select Month</option>
                      {getMonthNames().map((month, index) => (
                        <option key={index} value={(index + 1).toString()}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  </div>

                  <div
                    className="dropdown-divider"
                    style={{ borderTopColor: "#d7d9dd" }}
                  />
                </div>
              </div>
              <DataTable
                columns={columns}
                data={filteredData}
               
              />
            </div>
          </div>
          <DeletePopup
            show={showDeleteModal}
            handleClose={handleCloseDeleteModal}
            handleConfirm={(id) =>
              handleConfirmDelete(id) / console.log(id)
            } // Pass the id to handleConfirmDelete
            id={selectedItemId} // Pass the selectedItemId to DeletePopup
            pageName="Employee"
          />
        </div>
      </div>
    </LayOut>
  );
};

export default EmployeeView;
