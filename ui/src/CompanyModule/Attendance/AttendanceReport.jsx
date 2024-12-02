import React, { useEffect, useState } from "react";
import LayOut from "../../LayOut/LayOut";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import {
  EmployeeGetApi,
  AttendanceReportApi,
  AttendancePatchById,
} from "../../Utils/Axios";
import { PencilSquare } from "react-bootstrap-icons";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { ModalTitle, ModalHeader, ModalBody } from "react-bootstrap";

const AttendanceReport = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ mode: "onChange" });
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState({});
  const [editAttendance, setEditAttendance] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [refreshData, setRefreshData] = useState("");
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [columns, setColumns] = useState([]);
  const [finalEmployeeDetails, setFinalEmployeeDetails] = useState({});
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedAttendanceId, setSelectedAttendanceId] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState({});
  const [isAllAttendance, setIsAllAttendance] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasRecords, setHasRecords] = useState(true);

  const navigate = useNavigate();

  const handleEmployeeChange = (selectedOption) => {
    setEmployeeId(selectedOption.value);
    const selectedEmployee = employees.find(
      (emp) => emp.value === selectedOption.value
    );
    setSelectedEmployeeDetails(selectedEmployee);
  };

  const handleShowEditModal = (row) => {
    setSelectedAttendance(row);
    setSelectedEmployeeId(row.employeeId);
    setSelectedAttendanceId(row.attendanceId);
    reset({
      totalWorkingDays: row.totalWorkingDays,
      noOfWorkingDays: row.noOfWorkingDays,
    });
    setEditAttendance(true);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedAttendance({});
  };

  const filterByMonthYear = () => {
    if (!selectedYear && !handleEmployeeChange) {
      alert("Please select a year.");
      return;
    }
    fetchAttendanceData(employeeId, selectedMonth, selectedYear);
    setFinalEmployeeDetails(selectedEmployeeDetails);
  };

  const fetchAttendanceData = async (empId = null, month = "", year = "") => {
    try {
      const monthNames = getMonthNames(); // Assuming this function returns month names ["January", "February", ..., "December"]

      // Get the current year and month
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; // Current month (1-based, so we add 1)

      // If no year is selected, default to current year
      if (!year) {
        year = currentYear;
      }

      // Default to last month if no month is selected
      let selectedMonth = month || currentMonth - 1;
      if (selectedMonth < 1) selectedMonth = 12; // If the selectedMonth is 0 (i.e., current month is January), set it to December

      // Condition 1: Default case, fetch data for the last month and current year
      if (!empId || !year) {
        const lastMonthName = monthNames[selectedMonth - 1]; // Get last month's name
        const defaultResponse = await AttendanceReportApi(
          empId,
          lastMonthName,
          currentYear
        ); // Call API with last month and current year
        console.log("defaultResponse", defaultResponse);
        const data = defaultResponse.data.data;
        let filteredData = [];

        // Filter data if records are found
        if (data && data.length > 0) {
          filteredData = data.filter(
            (item) =>
              item.year === currentYear.toString() &&
              item.month === lastMonthName
          );
          setAttendanceData(filteredData); // Set filtered data for last month and current year
        } else {
          setHasRecords(false); // No records found
        }

        setShowFields(true); // Show data fields after fetching
        updateColumns(true); // Update columns
      } else if (empId && year) {
        // Condition 2: When employee and year are selected, fetch attendance for the selected year, and employee
        const selectedMonthName = ""; // Use null if month is not selected

        // If month is selected, do not pass the month to the API
        const selectedResponse = await AttendanceReportApi(
          empId,
          selectedMonthName,
          year
        ); // API call without month if month is not selected
        console.log("selectedResponse", selectedResponse);
        const selectedData = selectedResponse.data.data;
        let filteredData = [];

        // Filter data based on the selected year and month (if available)
        if (selectedData && selectedData.length > 0) {
          if (selectedMonthName) {
            // If month is selected, filter by month and year
            filteredData = selectedData.filter(
              (item) =>
                item.year === year.toString() &&
                item.month === selectedMonthName
            );
          } else {
            // If month is not selected, filter by year
            filteredData = selectedData.filter(
              (item) => item.year === year.toString()
            );
          }

          setAttendanceData(filteredData); // Set filtered data for selected employee and year
          setHasRecords(filteredData.length > 0); // Check if records are available
        } else {
          setHasRecords(false); // No records found for the selected employee and year
        }
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setHasRecords(false); // Handle errors and ensure no records are shown
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await EmployeeGetApi();
        const formattedData = data
          .filter((employee) => employee.firstName !== null)
          .map(({ id, firstName, lastName, employeeId }) => ({
            label: `${firstName} ${lastName} (${employeeId})`,
            value: id,
            firstName,
            lastName,
            employeeId,
          }));
        setEmployees(formattedData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
    fetchAttendanceData(); // Fetch all attendance data initially
  }, []);

  const getMonthNames = () => {
    return Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString("en-US", { month: "long" })
    );
  };

  const getRecentYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, i) => (currentYear - i).toString());
  };

  const onSubmit = async (data) => {
    try {
      await AttendancePatchById(selectedEmployeeId, selectedAttendanceId, data);
      toast.success("Attendance Record Updated Successfully", {
        position: "top-right",
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 3000,
      });
      setTimeout(() => {
        handleCloseEditModal();
        setRefreshData((prev) => !prev);
        navigate("/attendanceReport");
        fetchAttendanceData(employeeId, selectedMonth, selectedYear); // Fetch updated attendance
      }, 1000);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const formatDateHeader = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthNames = getMonthNames();
    const lastMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonth = monthNames[lastMonthIndex];
    return `Attendance Details for ${lastMonth} ${currentYear}`;
  };

  const handleApiErrors = (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.message
    ) {
      const errorMessage = error.response.data.error.message;
      toast.error(errorMessage);
    } else {
      toast.error("Network Error !");
    }
    console.error(error.response);
  };

  const updateColumns = (update = false) => {
    const commonColumns = [
      {
        name: (
          <h6>
            <b>No. Of Working Days</b>
          </h6>
        ),
        selector: (row) => row.noOfWorkingDays,
        width: "240px",
      },
      {
        name: (
          <h6>
            <b>Total Working Days</b>
          </h6>
        ),
        selector: (row) => row.totalWorkingDays,
        width: "240px",
      },
      {
        name: (
          <h6>
            <b>Actions</b>
          </h6>
        ),
        cell: (row) => (
          <div>
            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "transparent",
                border: "none",
                padding: "10px",
                marginLeft: "5px",
              }}
              onClick={() => handleShowEditModal(row)}
              title="Edit"
            >
              <PencilSquare size={22} color="#2255a4" />
            </button>
          </div>
        ),
      },
    ];

    const dynamicColumns = [
      {
        name: (
          <h6>
            <b>S No</b>
          </h6>
        ),
        selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
        width: "80px",
      },
      ...(!isAttendance && !selectedYear
        ? [
            {
              name: (
                <h6>
                  <b>Name</b>
                </h6>
              ),
              selector: (row) => `${row.firstName} ${row.lastName}`,
              width: "200px",
            },
          ]
        : []),
      ...(!isAttendance && selectedYear
        ? [
            {
              name: (
                <h6>
                  <b>Name</b>
                </h6>
              ),
              selector: (row) => (
                <div title={`${row.firstName} ${row.lastName}`}>
                  {`${
                    row.firstName.length > 8
                      ? row.firstName.slice(0, 8) + "..."
                      : row.firstName
                  } ${
                    row.lastName.length > 8
                      ? row.lastName.slice(0, 8) + "..."
                      : row.lastName
                  }`}
                </div>
              ),
              width: "150px",
            },
          ]
        : []),
      ...(!isAttendance && selectedYear
        ? [
            {
              name: (
                <h6>
                  <b>Month</b>
                </h6>
              ),
              selector: (row) => row.month,
              width: "150px",
            },
          ]
        : []),
    ];

    if (update) {
      setColumns([...dynamicColumns, ...commonColumns]);
    } else {
      setColumns([...commonColumns]);
    }
  };

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
          <div className="col">
            <h1 className="h3 mb-3">
              <strong>Attendance Report</strong>
            </h1>
          </div>
          <div className="col-auto" style={{ paddingBottom: "20px" }}>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="/main">Home</a>
                </li>
                <li className="breadcrumb-item active">Attendance</li>
                <li className="breadcrumb-item active">Attendance Report</li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header" style={{ paddingLeft: "90px" }}>
                <div className="row d-flex justify-content-start align-items-center">
                  <div className="col-12 col-md-6 col-lg-5">
                    <label className="card-title">
                      Select Employee <span className="text-danger">*</span>
                    </label>
                    <Select
                      options={employees}
                      onChange={handleEmployeeChange}
                      placeholder="Select Employee"
                      menuPortalTarget={document.body}
                    />
                    {selectedEmployee && (
                      <p>Selected: {selectedEmployee.label}</p>
                    )}
                  </div>

                  <div className="col-12 col-md-6 col-lg-5">
                    <label className="card-title">
                      Select Year <span className="text-danger fw-100">*</span>
                    </label>
                    <select
                      className="form-select"
                      style={{
                        paddingBottom: "6px",
                        zIndex: "1",
                        height: "37px",
                      }}
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value); // Update state
                        filterByMonthYear(selectedMonth, e.target.value); // Call the filtering function
                      }}
                    >
                      <option value="">Select Year</option>
                      {getRecentYears().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    className="col-12 col-md-6 col-lg-2"
                    style={{ marginTop: "30px" }}
                  >
                    <button
                      style={{ paddingBottom: "8px" }}
                      className="btn btn-primary"
                      onClick={filterByMonthYear}
                      disabled={!selectedYear || !employeeId}
                    >
                      Go
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <h5 className="card-title mt-2 text-secondary">
                  {isAttendance ? (
                    <>
                      Pay Slip Details for{" "}
                      {finalEmployeeDetails.firstName
                        ? `${finalEmployeeDetails.firstName} ${finalEmployeeDetails.lastName} (${finalEmployeeDetails.employeeId})`
                        : "All Employees"}
                      {selectedYear && ` - ${selectedYear}`}
                      {selectedMonth &&
                        ` - ${getMonthNames()[selectedMonth - 1]}`}
                    </>
                  ) : (
                    formatDateHeader()
                  )}
                </h5>
                <hr />
                {hasRecords ? (
                  <div>
                    <DataTable
                      columns={columns}
                      data={attendanceData}
                      pagination
                      highlightOnHover
                      pointerOnHover
                      dense
                      onChangePage={(page) => setCurrentPage(page)}
                      onChangeRowsPerPage={(perPage) => setRowsPerPage(perPage)}
                    />
                  </div>
                ) : (
                  <div className="text-center mt-4">
                    <p>There are no records to display</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showEditModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fade modal show"
          tabIndex="-1"
          style={{ zIndex: "9999", display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <ModalHeader>
                <ModalTitle>Edit Attendance</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div
                    className="card-body"
                    style={{ width: "1060px", paddingBottom: "0px" }}
                  >
                    <div className="col-12 col-md-6 col-lg-4 mb-2">
                      <label>Total Working Days</label>
                      <input
                        type="number"
                        name="totalWorkingDays"
                        readOnly
                        className="form-control"
                        {...register("totalWorkingDays", { required: true })}
                      />
                      {errors.totalWorkingDays && (
                        <p className="errorMsg">
                          {errors.totalWorkingDays.message}
                        </p>
                      )}
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 mb-2">
                      <label>No. Of Working Days</label>
                      <input
                        type="text"
                        name="noOfWorkingDays"
                        maxLength={2}
                        className="form-control"
                        {...register("noOfWorkingDays", {
                          required: "No. of working days is required",
                          pattern: {
                            value: /^\d+$/,
                            message: "Only numbers are allowed",
                          },
                          min: {
                            value: 0,
                            message: "Cannot be less than 0 days",
                          },
                          validate: {
                            maxTotal: (value) => {
                              const totalWorkingDays =
                                watch("totalWorkingDays"); // Get total working days

                              // Check if value contains "to" (i.e., a range like "4 to 9")
                              if (value.includes("to")) {
                                // Split the value by "to", then trim and convert to numbers
                                const [start, end] = value
                                  .split("to")
                                  .map((val) => parseInt(val.trim(), 10));

                                // Check if the range is valid
                                if (isNaN(start) || isNaN(end)) {
                                  return "Invalid range format.";
                                }

                                // Ensure that the range is within totalWorkingDays
                                if (start > end) {
                                  return "Start value cannot be greater than end value."; // Invalid range
                                }

                                if (
                                  start <= totalWorkingDays &&
                                  end <= totalWorkingDays
                                ) {
                                  return true; // Valid range
                                } else {
                                  return "The range cannot exceed total working days.";
                                }
                              } else {
                                // If it's a single value, check if it's within the working days
                                const numberValue = parseInt(value, 10);

                                if (isNaN(numberValue)) {
                                  return "Invalid number.";
                                }

                                return (
                                  numberValue <= totalWorkingDays ||
                                  "Value cannot exceed total working days."
                                );
                              }
                            },
                          },
                        })}
                      />
                      {errors.noOfWorkingDays && (
                        <p className="errorMsg">
                          {errors.noOfWorkingDays.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary" type="submit">
                      Save changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseEditModal}
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
    </LayOut>
  );
};

export default AttendanceReport;

// import React, { useEffect, useState } from 'react';
// import LayOut from '../../LayOut/LayOut';
// import Select from 'react-select';
// import { useForm } from 'react-hook-form';
// import { EmployeeGetApi, AttendanceReportApi, AttendancePatchById } from '../../Utils/Axios';
// import { PencilSquare } from 'react-bootstrap-icons';
// import DataTable from 'react-data-table-component';
// import { useNavigate } from 'react-router-dom';
// import { ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap';
// import { Bounce, toast } from 'react-toastify';

// const AttendanceReport = () => {
//     const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({ mode: 'onChange' });
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState('');
//     const [selectedMonth, setSelectedMonth] = useState('');
//     const [selectedYear, setSelectedYear] = useState('');
//     const [editAttendance, setEditAttendance] = useState(false);
//     const [selectedAttendance, setSelectedAttendance] = useState({});
//     const [isAllAttendance, setIsAllAttendance] = useState(false);
//     const [isAttendance, setIsAttendance] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [attendanceData, setAttendanceData] = useState([]);
//     const [hasRecords, setHasRecords] = useState(true);
//     const [columns, setColumns] = useState([]);
//     const [finalEmployeeDetails, setFinalEmployeeDetails] = useState({});
//     const [employeeId, setEmployeeId] = useState("");
//     const [refreshData, setRefreshData] = useState("");
//     const [selectedAttendanceId, setSelectedAttendanceId] = useState("");
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const navigate = useNavigate();

//     // Fetching employees and initializing columns on component load
//     useEffect(() => {
//         const fetchEmployees = async () => {
//             try {
//                 const response = await EmployeeGetApi(); // Response from the employee API
//                 const formattedData = response
//                     .filter((employee) => employee.firstName !== null)
//                     .map(({ id, firstName, lastName, employeeId }) => ({
//                         label: `${firstName} ${lastName} (${employeeId})`,
//                         value: id,
//                         firstName,
//                         lastName,
//                         employeeId,
//                     }));
//                 setEmployees(formattedData);

//                 // Default to the first employee if available
//                 if (formattedData.length > 0) {
//                     const currentDate = new Date();
//                     const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
//                     const currentYear = currentDate.getFullYear();

//                     setSelectedMonth(currentMonth.toString());
//                     setSelectedYear(currentYear.toString());

//                     fetchAttendanceData(formattedData[0].value, currentMonth, currentYear); // Fetch data for the first employee
//                 }
//             } catch (error) {
//                 console.error("Error fetching employees:", error);
//             }
//         };

//         fetchEmployees();
//         updateColumns(); // Initialize columns for the table
//     }, []); // Empty dependency array ensures this runs once on component mount

//     // Function to handle changes in employee selection
//     const handleEmployeeChange = (selectedOption) => {
//         setSelectedEmployee(selectedOption);
//         setAttendanceData([]); // Reset attendance data when employee changes
//         setSelectedMonth(""); // Reset month
//         setSelectedYear(""); // Reset year
//     };

//     const formatDateHeader = () => {
//         const now = new Date();
//         const currentMonth = now.getMonth();
//         const currentYear = now.getFullYear();
//         const monthNames = getMonthNames();
//         return `Attendance Details for ${monthNames[currentMonth]} ${currentYear}`;
//     };

//     const handleShowEditModal = (row) => {
//         setSelectedAttendance(row);
//         setSelectedEmployeeId(row.employeeId);
//         setSelectedAttendanceId(row.attendanceId);
//         reset({
//             totalWorkingDays: row.totalWorkingDays,
//             noOfWorkingDays: row.noOfWorkingDays,
//         });
//         setEditAttendance(true);
//         setShowEditModal(true);
//     };

//     const handleApiErrors = (error) => {
//         if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
//             const errorMessage = error.response.data.error.message;
//             toast.error(errorMessage);
//         } else {
//             toast.error("Network Error !");
//         }
//         console.error(error.response);
//     };

//     const handleCloseEditModal = () => {
//         setShowEditModal(false);
//         setSelectedAttendance({});
//     };

//     const fetchAllAttendanceData = async () => {
//         try {
//             const now = new Date();
//             const currentMonth = now.getMonth() + 1;
//             const currentYear = now.getFullYear();

//             const monthNames = getMonthNames();
//             const currentMonthName = monthNames[currentMonth - 1];

//             const response = await AttendancePatchById(null, currentMonthName, currentYear);
//             const data = response.data.data;
//             setAttendanceData(data);
//             setHasRecords(data.length > 0);
//             setIsAllAttendance(true);
//             setIsAttendance(false);
//             updateColumns(true);
//         } catch (error) {
//             console.error("Error fetching attendance data:", error);
//             setHasRecords(false); // In case of error, assume no records
//         }
//     };

//     // Function to fetch attendance data based on selected employee, month, and year
//     const fetchAttendanceData = async (employeeId = null, month = null, year = null) => {
//         try {
//             // Get the current date
//             const currentDate = new Date();

//             // If month and year are not provided, use the current month and year
//             const currentMonth = month || currentDate.getMonth() + 1; // getMonth() returns 0-based month index (0-11)
//             const currentYear = year || currentDate.getFullYear(); // getFullYear() returns the current year (e.g., 2024)

//             // Get the month names and month name based on the current or provided month
//             const monthNames = getMonthNames();
//             const monthName = monthNames[currentMonth - 1] || '';

//             // Only include employeeId if it's provided
//             const response = await AttendanceReportApi(employeeId, monthName, currentYear);
//             const data = response.data.data;

//             if (data.length > 0) {
//                 setAttendanceData(data);
//                 setHasRecords(true);
//             } else {
//                 setHasRecords(false);
//             }
//         } catch (error) {
//             console.error("Error fetching attendance data:", error);
//             setHasRecords(false);
//         }
//     };

//     // Function to get month names
//     const getMonthNames = () => {
//         return Array.from({ length: 12 }, (_, i) =>
//             new Date(0, i).toLocaleString("en-US", { month: "long" })
//         );
//     };

//     // Function to get recent years
//     const getRecentYears = () => {
//         const currentYear = new Date().getFullYear();
//         return Array.from({ length: 11 }, (_, i) => (currentYear - i).toString());
//     };

//     // Update columns for the table
//     const updateColumns = () => {
//         setColumns([
//             {
//                 name: <h6><b>S No</b></h6>,
//                 selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
//                 width: "80px",
//             },
//             {
//                 name: <h6><b>Name</b></h6>,
//                 selector: (row) => `${row.firstName} ${row.lastName}`,
//                 width: "200px",
//             },
//             {
//                 name: <h6><b>No. Of Working Days</b></h6>,
//                 selector: (row) => row.noOfWorkingDays,
//                 width: "240px",
//             },
//             {
//                 name: <h6><b>Total Working Days</b></h6>,
//                 selector: (row) => row.totalWorkingDays,
//                 width: "240px",
//             },
//             {
//                 name: <h6><b>Actions</b></h6>,
//                 cell: (row) => (
//                     <div>
//                         <button
//                             className="btn btn-sm"
//                             style={{ backgroundColor: "transparent", border: "none", padding: "10px", marginLeft: "5px" }}
//                             onClick={() => handleShowEditModal(row)}
//                             title='Edit'
//                         >
//                             <PencilSquare size={22} color="#2255a4" />
//                         </button>
//                     </div>
//                 ),
//             },
//         ]);
//     };

//     // Filter data based on selected month and year
//     const filterByMonthYear = () => {
//         if (selectedEmployee && selectedMonth && selectedYear) {
//             fetchAttendanceData(selectedEmployee.value, selectedMonth, selectedYear);
//         }
//     };

//     const onSubmit = async (data) => {
//         try {
//             await AttendancePatchById(selectedEmployeeId, selectedAttendanceId, data);
//             toast.success("Attendance Record Updated Successfully", {
//                 position: "top-right",
//                 transition: Bounce,
//                 hideProgressBar: true,
//                 theme: "colored",
//                 autoClose: 3000,
//             });
//             setTimeout(() => {
//                 handleCloseEditModal();
//                 setRefreshData((prev) => !prev);
//                 navigate("/attendanceReport");
//                 fetchAllAttendanceData(employeeId, selectedMonth, selectedYear);
//             }, 1000);
//         } catch (error) {
//             handleApiErrors(error);
//         }
//     };

//     return (
//         <LayOut>
//             <div className="container-fluid p-0">
//                 <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
//                     <div className="col">
//                         <h1 className="h3 mb-3">
//                             <strong>Attendance Report</strong>
//                         </h1>
//                     </div>
//                     <div className="col-auto" style={{ paddingBottom: '20px' }}>
//                         <nav aria-label="breadcrumb">
//                             <ol className="breadcrumb mb-0">
//                                 <li className="breadcrumb-item">
//                                     <a href="/main">Home</a>
//                                 </li>
//                                 <li className="breadcrumb-item active">Attendance</li>
//                                 <li className="breadcrumb-item active">Attendance Report</li>
//                             </ol>
//                         </nav>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-12">
//                         <div className="card">
//                             <div className="card-header">
//                                 <div className="row d-flex justify-content-center" style={{ paddingLeft: '50px' }}>
//                                     <div className="col-md-3 mt-3">
//                                         <label className="card-title">Select Employee <span className='text-danger'>*</span></label>
//                                         <Select
//                                             options={employees}
//                                             onChange={handleEmployeeChange}
//                                             placeholder="Select Employee"
//                                             menuPortalTarget={document.body}
//                                         />
//                                     </div>
//                                     <div className="col-md-3 mt-3">
//                                         <label className="card-title">Select Year <span className='text-danger fw-100'>*</span></label>
//                                         <select
//                                             className="form-select"
//                                             style={{ paddingBottom: '6px', zIndex: "1", height: "37px" }}
//                                             value={selectedYear}
//                                             onChange={(e) => {
//                                                 setSelectedYear(e.target.value);
//                                                 filterByMonthYear();
//                                             }}
//                                         >
//                                             <option value="">Select Year</option>
//                                             {getRecentYears().map((year) => (
//                                                 <option key={year} value={year}>
//                                                     {year}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     <div className="col-md-3 mt-3">
//                                         <label className="card-title">Select Month<span className='text-danger fw-100'>*</span></label>
//                                         <select
//                                             className="form-select"
//                                             style={{ paddingBottom: '6px', height: "37px" }}
//                                             value={selectedMonth}
//                                             onChange={(e) => {
//                                                 setSelectedMonth(e.target.value);
//                                                 filterByMonthYear();
//                                             }}
//                                         >
//                                             <option value="">Select Month</option>
//                                             {getMonthNames().map((month, index) => (
//                                                 <option key={index} value={(index + 1).toString()}>
//                                                     {month}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     <div className="col-md-3" style={{ marginTop: "45px" }}>
//                                         <button
//                                             style={{ paddingBottom: "8px" }}
//                                             className="btn btn-primary"
//                                             onClick={filterByMonthYear}
//                                             disabled={!selectedYear || !selectedEmployee || !selectedMonth}
//                                         >
//                                             Go
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="card-body">
//                                 <h5 className="card-title mt-2 text-secondary">
//                                     {isAttendance ? (
//                                         <>
//                                             Pay Slip Details for{" "}
//                                             {finalEmployeeDetails.firstName
//                                                 ? `${finalEmployeeDetails.firstName} ${finalEmployeeDetails.lastName} (${finalEmployeeDetails.employeeId})`
//                                                 : 'All Employees'}
//                                             {selectedYear && ` - ${selectedYear}`}
//                                             {selectedMonth && ` - ${getMonthNames()[selectedMonth - 1]}`}
//                                         </>
//                                     ) : (
//                                         formatDateHeader()
//                                     )}
//                                 </h5>
//                                 <hr />
//                                 {hasRecords ? (
//                                     <DataTable
//                                         columns={columns}
//                                         data={attendanceData}
//                                         pagination
//                                         paginationServer
//                                         paginationTotalRows={attendanceData.length}
//                                         currentPage={currentPage}
//                                         onChangeRowsPerPage={setRowsPerPage}
//                                         onChangePage={setCurrentPage}
//                                     />
//                                 ) : (
//                                     <p>No attendance records found.</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {showEditModal && (
//                 <div
//                     role='dialog'
//                     aria-modal="true"
//                     className='fade modal show'
//                     tabIndex="-1"
//                     style={{ zIndex: "9999", display: "block" }}
//                 >
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content">
//                             <ModalHeader>
//                                 <ModalTitle>Edit Attendance</ModalTitle>
//                                 <button
//                                     type="button"
//                                     className="btn-close" // Bootstrap's close button class
//                                     aria-label="Close"
//                                     onClick={handleCloseEditModal} // Function to close the modal
//                                 ></button>
//                             </ModalHeader>
//                             <ModalBody>
//                                 <form onSubmit={handleSubmit(onSubmit)}>
//                                     <div className="card-body" style={{ width: "1060px", paddingBottom: "0px" }}>
//                                         <div className='col-12 col-md-6 col-lg-4 mb-2'>
//                                             <label>Total Working Days</label>
//                                             <input
//                                                 type="text"
//                                                 name='totalWorkingDays'
//                                                 readOnly
//                                                 className="form-control"
//                                                 {...register("totalWorkingDays", { required: true })}
//                                             />
//                                             {errors.totalWorkingDays && <p className="errorMsg">{errors.totalWorkingDays.message}</p>}
//                                         </div>
//                                         <div className='col-12 col-md-6 col-lg-4 mb-2'>
//                                             <label>No. Of Working Days</label>
//                                             <input
//                                                 type="text"
//                                                 name='noOfWorkingDays'
//                                                 maxLength={2}
//                                                 className="form-control"
//                                                 {...register("noOfWorkingDays", {
//                                                     required: "No. of working days is required",
//                                                     pattern: {
//                                                         value: /^\d+$/,
//                                                         message: "Only numbers are allowed",
//                                                     },
//                                                     min: {
//                                                         value: 0,
//                                                         message: "Cannot be less than 0 days",
//                                                     },
//                                                     validate: {
//                                                         maxTotal: (value) => {
//                                                             const totalWorkingDays = watch("totalWorkingDays"); // Get total working days

//                                                             // Check if value contains "to" (i.e., a range like "4 to 9")
//                                                             if (value.includes("to")) {
//                                                                 // Split the value by "to", then trim and convert to numbers
//                                                                 const [start, end] = value.split("to").map(val => parseInt(val.trim(), 10));

//                                                                 // Check if the range is valid
//                                                                 if (isNaN(start) || isNaN(end)) {
//                                                                     return "Invalid range format.";
//                                                                 }

//                                                                 // Ensure that the range is within totalWorkingDays
//                                                                 if (start > end) {
//                                                                     return "Start value cannot be greater than end value."; // Invalid range
//                                                                 }

//                                                                 if (start <= totalWorkingDays && end <= totalWorkingDays) {
//                                                                     return true; // Valid range
//                                                                 } else {
//                                                                     return "The range cannot exceed total working days.";
//                                                                 }
//                                                             } else {
//                                                                 // If it's a single value, check if it's within the working days
//                                                                 const numberValue = parseInt(value, 10);

//                                                                 if (isNaN(numberValue)) {
//                                                                     return "Invalid number.";
//                                                                 }

//                                                                 return numberValue <= totalWorkingDays || "Value cannot exceed total working days.";
//                                                             }
//                                                         },
//                                                     }
//                                                 })}
//                                             />
//                                             {errors.noOfWorkingDays && <p className='errorMsg'>{errors.noOfWorkingDays.message}</p>}
//                                         </div>
//                                     </div>
//                                     <div className='modal-footer' style={{marginRight:"15px"}}>
//                                         <button
//                                             type='button'
//                                             className="btn btn-secondary"
//                                             onClick={handleCloseEditModal}
//                                         >
//                                             Cancel
//                                         </button>
//                                         <button
//                                             className="btn btn-primary"
//                                             type='submit'
//                                         >
//                                             Save changes
//                                         </button>
//                                     </div>
//                                 </form>
//                             </ModalBody>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </LayOut>
//     );
// };

// export default AttendanceReport;
