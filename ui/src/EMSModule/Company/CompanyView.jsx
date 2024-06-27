import React, { useState, useEffect } from "react";
import { PencilSquare, XSquareFill } from "react-bootstrap-icons";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import DeletePopup from "../../Utils/DeletePopup";
import LayOut from "../../LayOut/LayOut";
import { companyViewApi } from "../../Utils/Axios";

const CompanyView = () => {
  const [view, setView] = useState([]);
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

  const getUser = async () => {
    try {
      const result = await companyViewApi();
      setView(result);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  console.log(view);
  useEffect(() => {
    getUser();
  }, []);

  const getData = (companyId) => {
    console.log(companyId);
    Navigate(`/companyRegistration`, { state: { companyId } }); //deleteuser/
  };
  const handleConfirmDelete = async (companyId) => {
    if (selectedItemId) {
      try {
        // Make a DELETE request to the API with the given ID
        await axios
          .delete(`http://192.168.1.163:8092/company/${companyId}`)
          .then((response) => {
            if (response.status === 200) {
              toast.success("Employee Deleted Succesfully", {
                position: "top-right",
                transition: Bounce,
                hideProgressBar: true,
                theme: "colored",
                autoClose: 3000, // Close the toast after 3 seconds
              });
            }
            getUser();
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
    1: {
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
    2: {
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
      color: "orange",
    },
    3: {
      label: (
        <b
          style={{
            backgroundColor: "orange",
            color: "white",
            borderRadius: "5px",
            padding: "2px",
          }}
        >
          Notice Period
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
      name: (
        <h5>
          <b>S No</b>
        </h5>
      ),
      selector: (row, index) => index + 1,
      width: "75px",
    },
    {
      name: (
        <h5 style={{ paddingLeft: "0px" }}>
          <b>Company Id</b>
        </h5>
      ),
      selector: (row) => row.companyId,
      minWidth: "100px",
      maxWidth: "150px",
    },
    {
      name: (
        <h5>
          <b>Company Name</b>
        </h5>
      ),
      selector: (row) => row.companyName,
      minWidth: "150px",
      maxWidth: "300px",
      wrap: true,
    },
    {
      name: (
        <h5>
          <b>EmailId</b>
        </h5>
      ),
      selector: (row) => row.emailId,
      width: "200px",
      wrap: true,
    },
    {
      name: (
        <h5>
          <b>MobileNO</b>
        </h5>
      ),
      selector: (row) => row.mobileNo,
      width: "150px",
      wrap: true,
    },
    {
      name: (
        <h5>
          <b>Action</b>
        </h5>
      ),
      cell: (row) => (
        <div>
          {" "}
          <button
            className="btn btn-sm "
            style={{
              backgroundColor: "transparent",
              border: "none",
              padding: "0",
              marginRight: "10px",
            }}
            onClick={() => getData(row.companyId)}
          >
            <PencilSquare size={22} color="#2255A4" />
          </button>
          <button
            className="btn btn-sm "
            style={{
              backgroundColor: "transparent",
              border: "none",
              padding: "0",
              marginLeft: "5px",
            }}
            onClick={() => handleShowDeleteModal(row.companyId)}
          >
            <XSquareFill size={22} color="#DA542E" />
          </button>
        </div>
      ),
    },
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
    const filtered = view.filter((item) => {
      // Convert all fields to lowercase for case-insensitive search
      const lowerCasedSearchTerm = searchTerm.toLowerCase();
      const companyId = item.companyId.toString().toLowerCase();
      const fullName = item.firstName.toLowerCase();
      const lastName = item.lastName.toLowerCase();
      const email = item.emailId.toLowerCase();
      const department = item.department.toLowerCase();
      const designation = item.designation.toLowerCase();
      // const statusLabel = statusMappings[item.status]?.label?.toLowerCase();
      const manager = item.manager.toLowerCase();
      const dateOfHiring = formatDate(item.dateOfHiring).toLowerCase(); // Check if any field contains the search term
      return (
        companyId.includes(lowerCasedSearchTerm) ||
        fullName.includes(lowerCasedSearchTerm) ||
        lastName.includes(lowerCasedSearchTerm) ||
        email.includes(lowerCasedSearchTerm) ||
        department.includes(lowerCasedSearchTerm) ||
        designation.includes(lowerCasedSearchTerm) ||
        // (statusLabel && statusLabel.includes(searchTerm)) ||
        manager.includes(lowerCasedSearchTerm) ||
        dateOfHiring.includes(lowerCasedSearchTerm)
      );
    });
    setFilteredData(filtered);
  };
  const filterByMonthYear = (selectedMonth, selectedYear) => {
    setSelectedMonth(selectedMonth);
    setSelectedYear(selectedYear);
    const result = view.filter((data) => {
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
        <h1 className="h3 mb-3">
          <strong>Company List</strong>{" "}
        </h1>
        <div className="row">
          <div className="col-12 col-lg-12 col-xxl-12 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <h6>Search filters</h6>
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-3 mt-3">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search...."
                      value={search}
                      onChange={(e) => getFilteredList(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3 mt-3">
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
                  <div className="col-12 col-md-6 col-lg-3 mt-3">
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
                  <div className="col-12 col-md-6 col-lg-3 mt-3">
                    <button className="btn btn-primary" type="button">
                      Search
                    </button>
                  </div>
                  <div
                    className="dropdown-divider"
                    style={{ borderTopColor: "#D7D9DD" }}
                  />
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
            handleConfirm={() => handleConfirmDelete(selectedItemId)} // Pass the id to handleConfirmDelete
            id={selectedItemId}
            pageName="Company"
          />
        </div>
      </div>
    </LayOut>
  );
};
export default CompanyView;
