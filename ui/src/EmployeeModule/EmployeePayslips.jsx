// // import React, { useState, useEffect } from "react";
// // import { XSquareFill, EyeFill, Download } from "react-bootstrap-icons";
// // import DataTable from "react-data-table-component";
// // import { Link, useNavigate, useParams } from "react-router-dom";
// // import axios from "axios";
// // import { Bounce, toast } from "react-toastify";
// // import DeletePopup from "../Utils/DeletePopup";
// // import LayOut from "../LayOut/LayOut";

// // const EmployeePayslips = () => {
// //   const [slip, setSlip] = useState([]);
// //   const [filteredData, setFilteredData] = useState([]);
// //   const [search, setSearch] = useState([]);
// //   const [selectedMonth, setSelectedMonth] = useState("");
// //   const [selectedYear, setSelectedYear] = useState("");
// //   const navigate = useNavigate();

// //   const [showDeleteModal, setShowDeleteModal] = useState(false);
// //   const [selectedItemId, setSelectedItemId] = useState(null); // State to store the ID of the item to be deleted
// //   const [selectId, setSelectId] = useState(null);

// //   const handleCloseDeleteModal = () => {
// //     setShowDeleteModal(false);
// //     setSelectId(null);
// //     setSelectedItemId(null); // Reset the selected item ID
// //   };

// //   const handleShowDeleteModal = (employeeId, id) => {
// //     setSelectId(employeeId);
// //     setSelectedItemId(id); // Set the ID of the item to be deleted
// //     setShowDeleteModal(true);
// //   };

// //   const getMonthNames = () => {
// //     return Array.from({ length: 12 }, (_, i) => {
// //       const date = new Date(2000, i, 1); // Using 2000 as a dummy year
// //       return date.toLocaleString("en-US", { month: "long" });
// //     });
// //   };

// //   // Function to get an array of recent years (adjust the range if needed)
// //   const getRecentYears = () => {
// //     const currentYear = new Date().getFullYear();
// //     const years = [];
// //     for (let i = currentYear; i >= currentYear - 10; i--) {
// //       years.push(i.toString());
// //     }
// //     return years;
// //   };

// //   const id = sessionStorage.getItem("id");

// //   const company = sessionStorage.getItem("company");
// //   const employeeId = sessionStorage.getItem("employeeId");
// //   const salaryId = sessionStorage.getItem("salaryId");

// //   const getPaySlips = () => {
// //     axios
// //       .get(`http://192.168.1.163:8092//${company}/employee/${employeeId}/${salaryId}`)
// //       .then((response) => {
// //         setSlip(response.data);
// //         setFilteredData(response.data);
// //         console.log(response.data);
// //       })
// //       .catch((errors) => {
// //         toast.error("Network Error", {
// //           position: "top-right",
// //           transition: Bounce,
// //           hideProgressBar: true,
// //           theme: "colored",
// //           autoClose: 3000, // Close the toast after 3 seconds
// //         });
// //         console.log(errors);
// //       });
// //   };

// //   useEffect(() => {
// //     getPaySlips();
// //   }, []);

// //   const handleConfirmDelete = async (employeeId, id) => {
// //     console.log(id);
// //     if (selectId && selectedItemId) {
// //       console.log(selectedItemId);
// //       try {
// //         // Make a DELETE request to the API with the given ID
// //         await axios
// //           .delete(`http://192.168.1.163:8092/payslip/${employeeId}/${id}`)
// //           .then((response) => {
// //             if (response.status === 200) {
// //               toast.success("PaySlip Deleted Successfully", {
// //                 position: "top-right",
// //                 transition: Bounce,
// //                 hideProgressBar: true,
// //                 theme: "colored",
// //                 autoClose: 3000, // Close the toast after 3 seconds
// //               });
// //             }
// //             getPaySlips();
// //             handleCloseDeleteModal();
// //             console.log(response.data);
// //           });
// //       } catch (error) {
// //         if (error.response) {
// //           const status = error.response.status;
// //           let errorMessage = "";

// //           switch (status) {
// //             case 403:
// //               errorMessage = "Session Timeout !";
// //               navigate("/");
// //               break;
// //             case 404:
// //               errorMessage = "Resource Not Found !";
// //               break;
// //             case 406:
// //               errorMessage = "Already Exist !";
// //               break;
// //             case 500:
// //               errorMessage = "Server Error !";
// //               break;
// //             default:
// //               errorMessage = "An Error Occurred !";
// //               break;
// //           }

// //           toast.error(errorMessage, {
// //             position: "top-right",
// //             transition: Bounce,
// //             hideProgressBar: true,
// //             theme: "colored",
// //             autoClose: 3000,
// //           });
// //         } else {
// //           toast.error("Network Error !", {
// //             position: "top-right",
// //             transition: Bounce,
// //             hideProgressBar: true,
// //             theme: "colored",
// //             autoClose: 3000,
// //           });
// //         }
// //         // Log any errors that occur
// //         console.error(error.response);
// //       }
// //     }
// //   };

// //   const getView = (id) => {
// //     const pdfImageUrl = `http://192.168.1.163:8092/payslip/view/${id} `;
// //     window.open(pdfImageUrl, "_blank");
// //   };

// //   const downloadFile = async (employeeId, id) => {
// //     try {
// //       const response = await axios.get(
// //         `http://192.168.1.163:8092/payslip/download/${id}`,
// //         {
// //           responseType: "blob",
// //         }
// //       );

// //       const downloadLink = document.createElement("a");
// //       const url = window.URL.createObjectURL(new Blob([response.data]));
// //       downloadLink.href = url;
// //       downloadLink.setAttribute("download", `payslip_${employeeId}/${id}.pdf`); // Specify the filename
// //       document.body.appendChild(downloadLink);
// //       downloadLink.click();
// //       document.body.removeChild(downloadLink);
// //     } catch (error) {
// //       if (error.response) {
// //         const status = error.response.status;
// //         let errorMessage = "";

// //         switch (status) {
// //           case 403:
// //             errorMessage = "Session Timeout !";
// //             navigate("/");
// //             break;
// //           case 404:
// //             errorMessage = "Resource Not Found !";
// //             break;
// //           case 406:
// //             errorMessage = "Invalid Details !";
// //             break;
// //           case 500:
// //             errorMessage = "Server Error !";
// //             break;
// //           default:
// //             errorMessage = "An Error Occurred !";
// //             break;
// //         }

// //         toast.error(errorMessage, {
// //           position: "top-right",
// //           transition: Bounce,
// //           hideProgressBar: true,
// //           theme: "colored",
// //           autoClose: 3000,
// //         });
// //       } else {
// //         toast.error("Network Error !", {
// //           position: "top-right",
// //           transition: Bounce,
// //           hideProgressBar: true,
// //           theme: "colored",
// //           autoClose: 3000,
// //         });
// //       }
// //       console.error("Error downloading file:", error);
// //     }
// //   };

// //   const getData = (id) => {
// //     console.log(id);
// //     navigate(`/payslip/${id}`); //deleteuser/
// //   };

// //   const paginationComponentOptions = {
// //     noRowsPerPage: true,
// //   };

// //   const columns = [
// //     {
// //       name: (
// //         <h5>
// //           <b>S NO</b>
// //         </h5>
// //       ),
// //       selector: (row, index) => index + 1,
// //       width: "110px",
// //     },
// //     {
// //       name: (
// //         <h5>
// //           <b>Employee ID</b>
// //         </h5>
// //       ),
// //       selector: (row) => row.employeeId,
// //     },
// //     // {
// //     //   name: <h5><b>Employee Name</b></h5>,
// //     //   selector: (row) => row.employeeName,
// //     // },
// //     {
// //       name: (
// //         <h5>
// //           <b>Month</b>
// //         </h5>
// //       ),
// //       selector: (row) => row.month,
// //     },
// //     {
// //       name: (
// //         <h5>
// //           <b>Year</b>
// //         </h5>
// //       ),
// //       selector: (row) => row.year,
// //     },
// //     {
// //       name: (
// //         <h5>
// //           <b>Action</b>
// //         </h5>
// //       ),
// //       cell: (row) => (
// //         <>
// //           <button onClick={() => getView(row.id)}>View</button>
// //           <button onClick={() => downloadFile(row.employeeId, row.id)}>Download</button>
// //           <button onClick={() => handleShowDeleteModal(row.employeeId, row.id)}>Delete</button>
// //         </>
// //       ),
// //     },
// //   ];

// //   return (
// //     <LayOut>
// //       <div className="container">
// //         <h1>Employee Payslips</h1>
// //         <div className="filters">
// //           <select
// //             value={selectedMonth}
// //             onChange={(e) => setSelectedMonth(e.target.value)}
// //           >
// //             <option value="">Select Month</option>
// //             {getMonthNames().map((month) => (
// //               <option key={month} value={month}>
// //                 {month}
// //               </option>
// //             ))}
// //           </select>
// //           <select
// //             value={selectedYear}
// //             onChange={(e) => setSelectedYear(e.target.value)}
// //           >
// //             <option value="">Select Year</option>
// //             {getRecentYears().map((year) => (
// //               <option key={year} value={year}>
// //                 {year}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //         <DataTable
// //           columns={columns}
// //           data={filteredData}
// //           pagination
// //           paginationComponentOptions={paginationComponentOptions}
// //         />
// //       </div>
// //       <DeletePopup
// //         show={showDeleteModal}
// //         handleClose={handleCloseDeleteModal}
// //         handleConfirmDelete={handleConfirmDelete}
// //         employeeId={selectId} // Pass the employeeId to DeletePopup
// //         id={selectedItemId} // Pass the selectedItemId to DeletePopup
// //       />
// //     </LayOut>
// //   );
// // };

// // export default EmployeePayslips;


// import React, { useEffect, useState } from 'react';
// import { EmployeeSalaryGetApiById } from '../Utils/Axios'; // Adjust the path to your API file
// import { toast, Bounce } from 'react-toastify';
// import DataTable from 'react-data-table-component';
// import { Link, useNavigate } from 'react-router-dom';
// import LayOut from '../LayOut/LayOut';
// import { Download, EyeFill, XSquareFill } from 'react-bootstrap-icons';

// const EmployeePayslips = () => {
//   const [slip, setSlip] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedItemId, setSelectedItemId] = useState(null);
//   const [selectId, setSelectId] = useState(null);
//   const navigate = useNavigate();

//   const handleCloseDeleteModal = () => {
//     setShowDeleteModal(false);
//     setSelectId(null);
//     setSelectedItemId(null);
//   };

//   const handleShowDeleteModal = (employeeId, id) => {
//     setSelectId(employeeId);
//     setSelectedItemId(id);
//     setShowDeleteModal(true);
//   };

//   const getMonthNames = () => {
//     return Array.from({ length: 12 }, (_, i) => {
//       const date = new Date(2000, i, 1);
//       return date.toLocaleString("en-US", { month: "long" });
//     });
//   };

//   const getRecentYears = () => {
//     const currentYear = new Date().getFullYear();
//     const years = [];
//     for (let i = currentYear; i >= currentYear - 10; i--) {
//       years.push(i.toString());
//     }
//     return years;
//   };
//   useEffect(() => {
//     if (id) {
//       EmployeeSalaryGetApiById(id).then(response => {
//         setEmployeeSalaryView(response.data.data);
//       });
//     }
//   }, [id]);


//   useEffect(() => {
//     fetchPaySlips();
//   }, []);

//   const paginationComponentOptions = {
//     noRowsPerPage: true,
//   };

//   const columns = [
//     {
//       name: <h5><b>S NO</b></h5>,
//       selector: (row, index) => index + 1,
//       width: "110px",
//     },
//     {
//       name: <h5><b>Employee ID</b></h5>,
//       selector: (row) => row.employeeId,
//     },
//     {
//       name: <h5><b>Month</b></h5>,
//       selector: (row) => row.month,
//     },
//     {
//       name: <h5><b>Year</b></h5>,
//       selector: (row) => row.year,
//     },
//     {
//       name: <h5><b>Action</b></h5>,
//       cell: (row) => (
//         <div>
//           <button
//             className="btn btn-sm"
//             style={{ backgroundColor: "transparent", border: "none", padding: "0" }}
//           >
//             <EyeFill size={22} color="#2255a4" />
//           </button>
//           <button
//             className="btn btn-sm"
//             style={{ backgroundColor: "transparent", border: "none", padding: "0", marginLeft: "10px" }}
//           >
//             <Download size={22} color="orange" />
//           </button>
//           <button
//             className="btn btn-sm"
//             style={{ backgroundColor: "transparent", border: "none", padding: "0", marginLeft: "10px" }}
//             onClick={() => handleShowDeleteModal(row.employeeId, row.id)}
//           >
//             <XSquareFill size={22} color="red" />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <LayOut>
//       <div className="d-sm-flex justify-content-between align-items-center mb-4">
//         <h1 className="h3 mb-0 text-gray-800">Employee Pay Slips</h1>
//         <Link
//           to="/payslip/add"
//           className="btn btn-primary btn-sm d-none d-sm-inline-block"
//         >
//           <i className="fas fa-plus fa-sm text-white-50"></i> Add Pay Slip
//         </Link>
//       </div>
//       <div className="card shadow mb-4">
//         <div className="card-header py-3">
//           <div className="row">
//             <div className="col-lg-4 mb-2">
//               <input
//                 type="text"
//                 placeholder="Search by ID, Name, Year..."
//                 className="form-control"
//                 value={search}
//               />
//             </div>
//             <div className="col-lg-3 mb-2">
//               <select
//                 className="form-control"
//                 value={selectedMonth}
//                 onChange={(e) => setSelectedMonth(e.target.value)}
//               >
//                 <option value="">Select Month</option>
//                 {getMonthNames().map((month) => (
//                   <option key={month} value={month}>
//                     {month}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-lg-3 mb-2">
//               <select
//                 className="form-control"
//                 value={selectedYear}
//                 onChange={(e) => setSelectedYear(e.target.value)}
//               >
//                 <option value="">Select Year</option>
//                 {getRecentYears().map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-lg-2">
//               <button
//                 className="btn btn-primary btn-block"
//                 onClick={() => {
//                   setSelectedMonth("");
//                   setSelectedYear("");
//                   setSearch("");
//                   setFilteredData(slip);
//                 }}
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="card-body">
//           <DataTable
//             columns={columns}
//             data={filteredData}
//             pagination
//             paginationComponentOptions={paginationComponentOptions}
//             highlightOnHover
//             striped
//             pointerOnHover
//           />
//         </div>
//       </div>
//     </LayOut>
//   );
// };

// export default EmployeePayslips;