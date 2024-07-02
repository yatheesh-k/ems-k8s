import React, { useState, useEffect } from "react";
import { PencilSquare, XSquareFill } from "react-bootstrap-icons";
import DataTable from "react-data-table-component";
import { Bounce, toast } from "react-toastify";
import DeletePopup from "../../Utils/DeletePopup";
import LayOut from "../../LayOut/LayOut";
import axios from "axios";
import { companyDeleteByIdApi, companyViewApi } from "../../Utils/Axios";
import { useLocation, useNavigate } from "react-router-dom";

const CompanyView = () => {
  const [view, setView] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const location = useLocation();
  const Navigate=useNavigate();
 
  const apiUrl = "http://localhost:8092/ems/company";
  const token = sessionStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getUser = async () => {
    try {
      const response = await companyViewApi();
      setView(response.data.data); // Assuming response.data.data is an array of company objects
    } catch (error) {
      console.error("Failed to fetch data:", error);
      // Handle error if needed
    }
  };


  const getData = (id) => {
    console.log(id);
    Navigate(`/companyRegistration`, { state: { id } }); //deleteuser/
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedItemId(null);
  };

  const handleShowDeleteModal = (id) => {
    setSelectedItemId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedItemId) {
      try {
        const response = await companyDeleteByIdApi(selectedItemId);
        if (response.status === 200) {
          toast.success("Company Deleted Successfully", {
            position: "top-right",
            transition: Bounce,
            hideProgressBar: true,
            theme: "colored",
            autoClose: 3000,
          });
          getUser(); // Refresh the list after deletion
          handleCloseDeleteModal();
        } else {
          toast.error("Failed to delete company. Please try again.", {
            position: "top-right",
            transition: Bounce,
            hideProgressBar: true,
            theme: "colored",
            autoClose: 3000,
          });
        }
      } catch (error) {
        // Handle delete error
        console.error("Failed to delete company:", error);
        toast.error("Failed to delete company. Please try again.", {
          position: "top-right",
          transition: Bounce,
          hideProgressBar: true,
          theme: "colored",
          autoClose: 3000,
        });
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);


  const columns = [
    {
      name: "S No",
      selector: (row, index) => index + 1,
      width: "75px",
    },
    {
      name: "Company Name",
      selector: (row) => row.companyName,
      minWidth: "150px",
      maxWidth: "250px",
      wrap: true,
    },
    {
      name: "Authorized Name",
      selector: (row) => row.name,
      minWidth: "150px",
      maxWidth: "250px",
      wrap: true,
    },
    {
      name: "EmailId",
      selector: (row) => row.emailId,
      width: "300px",
      wrap: true,
    },
    {
      name: "MobileNO",
      selector: (row) => row.mobileNo,
      width: "150px",
      wrap: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: "transparent",
              border: "none",
              padding: "0",
              marginRight: "10px",
            }}
            onClick={() => getData(row.id)}
          >
            <PencilSquare size={22} color="#2255A4" />
          </button>
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: "transparent",
              border: "none",
              padding: "0",
              marginLeft: "5px",
            }}
            onClick={() => handleShowDeleteModal(row.id)}
          >
            <XSquareFill size={22} color="#DA542E" />
          </button>
        </div>
      ),
    },
  ];

  const getRecentYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 10; i--) {
      years.push(i.toString());
    }
    return years;
  };

  const getMonthNames = () => {
    return Array.from({ length: 12 }, (_, i) =>
      (i + 1).toLocaleString("en-US", { minimumIntegerDigits: 2 })
    );
  };

  const getFilteredList = (searchTerm) => {
    setSearch(searchTerm);
    const filtered = view.filter((item) => {
      const lowerCasedSearchTerm = searchTerm.toLowerCase();
      return (
        item.id.toLowerCase().includes(lowerCasedSearchTerm) ||
        item.companyName.toLowerCase().includes(lowerCasedSearchTerm) ||
        item.emailId.toLowerCase().includes(lowerCasedSearchTerm) ||
        item.mobileNo.toLowerCase().includes(lowerCasedSearchTerm)
      );
    });
    setFilteredData(filtered);
  };

  const filterByMonthYear = (selectedMonth, selectedYear) => {
    setSelectedMonth(selectedMonth);
    setSelectedYear(selectedYear);
    const result = view.filter((data) => {
      const date = new Date(data.dateOfHiring);
      return (
        (date.getMonth() + 1 === parseInt(selectedMonth) || !selectedMonth) &&
        (date.getFullYear() === parseInt(selectedYear) || !selectedYear)
      );
    });
    setFilteredData(result);
  };

  const handleSearch = () => {
    console.log("Perform search with:", search, selectedMonth, selectedYear);
  };

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <h1 className="h3 mb-3">
          <strong>Company List</strong>
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
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3 mt-3">
                    <select
                      className="form-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
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
                      onChange={(e) => setSelectedMonth(e.target.value)}
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
                    <button className="btn btn-primary" onClick={handleSearch}>
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
                data={filteredData.length > 0 ? filteredData : view}
                pagination
              />
            </div>
          </div>
          <DeletePopup
            show={showDeleteModal}
            handleClose={handleCloseDeleteModal}
            handleConfirm={() => handleConfirmDelete(selectedItemId)}
            id={selectedItemId}
            pageName="Company"
          />
        </div>
      </div>
    </LayOut>
  );
};

export default CompanyView;

