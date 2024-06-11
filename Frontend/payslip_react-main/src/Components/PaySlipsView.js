import React, { useState, useEffect } from 'react'
import Footer from '../ScreenPages/Footer';
import Header from '../ScreenPages/Header';
import SideNav from '../ScreenPages/SideNav';
import { XSquareFill, EyeFill, Download } from 'react-bootstrap-icons';
import DataTable from 'react-data-table-component';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
import DeletePopup from './DeletePopup';

const PaySlipsView = () => {

  const [slip, setSlip] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const Navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null); // State to store the ID of the item to be deleted
  const [selectId,setSelectId]=useState(null);
  
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectId(null);
    setSelectedItemId(null); // Reset the selected item ID
  };

  const handleShowDeleteModal = (employeeId,id) => {
    setSelectId(employeeId);
    setSelectedItemId(id); // Set the ID of the item to be deleted
    setShowDeleteModal(true);
  };


  const getMonthNames = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2000, i, 1); // Using 2000 as a dummy year
      return date.toLocaleString('en-US', { month: 'long' });
    });
  };
  // Function to get an array of recent years (adjust the range if needed)
  const getRecentYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 10; i--) {
      years.push(i.toString());
    }
    return years;
  };

  const id=sessionStorage.getItem("id")
  const getPaySLips = () => {
    axios.get(`http://192.168.1.163:8092/payslip/company/${id}`)
      .then((response) => {
        setSlip(response.data);
        setFilteredData(response.data);
        console.log(response.data)
      })
      .catch((errors) => {
        toast.error("Network Error", {
          position: 'top-right',
          transition: Bounce,
          hideProgressBar: true,
          theme: "colored",
          autoClose: 3000, // Close the toast after 3 seconds

        })
        console.log(errors)
      }
      );
  }
  useEffect(() => {
    getPaySLips();
  }, [])

  const handleConfirmDelete = async (employeeId, id) => { console.log(id)
    if(selectId  && selectedItemId){
      console.log(selectedItemId);
    try {
      // Make a DELETE request to the API with the given ID
      await axios.delete(`http://192.168.1.163:8092/payslip/${employeeId}/${id}`)
        .then((response) => {
          if (response.status === 200) {
            toast.success("PaySip Deleted Successfully", {
              position: 'top-right',
              transition: Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000, // Close the toast after 3 seconds

            })
          }
          getPaySLips();
          handleCloseDeleteModal();
          console.log(response.data);
        })
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        let errorMessage = '';

        switch (status) {
          case 403:
            errorMessage = 'Session TImeOut !';
            Navigate('/')
            break;
          case 404:
            errorMessage = 'Resource Not Found !';
            break;
          case 406:
            errorMessage = 'Already Exist !';
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
      // Log any errors that occur
      console.error(error.response);
    }
  };
  };

  const getView = (id) => {
    const pdfImageUrl = `http://192.168.1.163:8092/payslip/view/${id} `;
    window.open(pdfImageUrl, '_blank');
  };
  
  const downloadFile = async (employeeId, id) => {
    try {
      const response = await axios.get(`http://192.168.1.163:8092/payslip/download/${id}`, {
        responseType: 'blob',
      });

      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(new Blob([response.data]));
      downloadLink.href = url;
      downloadLink.setAttribute('download', `payslip_${employeeId}/${id}.pdf`); // Specify the filename
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        let errorMessage = '';

        switch (status) {
          case 403:
            errorMessage = 'Session TImeOut !';
            Navigate('/')
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
      console.error('Error downloading file:', error);
    }
    
  };

  const getData = (id) => {
    console.log(id)
    Navigate(`/payslip/${id}`)  //deleteuser/
  } 

  const paginationComponentOptions = {
    noRowsPerPage: true,
  }

  const columns = [
    {
      name: <h5><b>S NO</b></h5>,
      selector: (row, index) => index + 1,
      width: '110px',
    },
    {
      name: <h5><b>Employee ID</b></h5>,
      selector: (row) => row.employeeId,
    },
    // {
    //   name: <h5><b>Employee Name</b></h5>,
    //   selector: (row) => row.employeeName,
    // },
    {
      name: <h5><b>Month</b></h5>,
      selector: (row) => row.month,
    },
    {
      name: <h5><b>Year</b></h5>,
      selector: (row) => row.year,
    },
    {
      name: <h5><b>Action</b></h5>,
      cell: (row) => (
        <div>
          <button
            className="btn btn-sm"
            style={{ backgroundColor: 'transparent', border: 'none', padding: '0' }}
            onClick={() => getView(row.id)}
          >
            <EyeFill size={22} color="#2255a4" />
          </button>
          <button
            className="btn btn-sm"
            style={{ backgroundColor: 'transparent', border: 'none', padding: '0', marginLeft: '10px' }}
            onClick={() => downloadFile(row.employeeId, row.id)}
          >
            <Download size={22} color="orange" />
          </button>
          <button
            className="btn btn-sm"
            style={{ backgroundColor: 'transparent', border: 'none', padding: '0', marginLeft: '10px' }}
            onClick={() => handleShowDeleteModal(row.employeeId, row.id)}
          >
            <XSquareFill size={22} color="red" />
          </button>
        </div>
      ),
    },
  ];

  const getFilteredList = async (searchData, month, year) => {
    setSearch(searchData);
    let filteredData = slip.filter((data) => {
      const matchesSearch = (
        (data.id && data.id.toString().includes(searchData)) ||
        (data.employeeId.toString().toLowerCase().includes(searchData)) ||
        (`${data.firstName} ${data.lastName}`.toLowerCase().includes(searchData.toLowerCase())) ||
        (data.financialYear.toString().includes(searchData))
      );
      const date = new Date(data.financialYear, data.month - 1);
      const monthName = date.toLocaleString('en-US', { month: 'long' });
      const matchesMonth = (!month || monthName.toLowerCase() === month.toLowerCase());
      const matchesYear = (!year || data.financialYear.toString() === year);
  
      return matchesSearch && matchesMonth && matchesYear;
    });

    setFilteredData(filteredData);
  };






  return (
    <div className='wrapper'>
      <SideNav />
      <div className='main'>
        <Header />
        <main className="content">
          <div className="container-fluid p-0">
            <div className='row d-flex align-items-center justify-content-between mt-1'>
              <div className='col'>
              <h1 className="h3 mb-3"><strong>PaySlips</strong> </h1>
              </div>
            </div>
            <div className='col-auto'>
            <nav aria-label="breadcrumb">
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="/main">Home</a></li>
							<li class="breadcrumb-item acitve" >Payslip View</li>
						</ol>
					</nav>
            </div>
         
            {/**Department View TableForm */}
            <div className="row">
              <div className="col-12 col-lg-12 col-xxl-12 d-flex">
                <div className="card flex-fill">
                  <div className="card-header">
                    <div className='row'>
                      <div className='col-12 col-md-6 col-lg-4' >
                        <Link to={'/payslipRegistration'}> <button className="btn btn-primary">Generate PaySlip</button></Link>
                      </div>
                      <div className='row'>
                      <div className='col-md-4 mt-3' >
                        <input type='search' className="form-control" placeholder='Enter Employee Name/ID'
                          value={search}
                          onChange={(e) => getFilteredList(e.target.value)}
                        />
                      </div>
                      <div className='col-md-4 mt-3'>
                        <select
                          className="form-select"
                          value={selectedYear}
                          onChange={(e) => {
                            setSelectedYear(e.target.value);
                            getFilteredList(search, selectedMonth, e.target.value); // Pass the updated year value
                          }}                  >
                          <option value="">Select Year</option>
                          {getRecentYears().map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <div className='col-4 mt-3'>
                        <select
                          className="form-select"
                          value={selectedMonth}
                          onChange={(e) => {
                            const selectedMonthValue = e.target.value;
                            console.log("Selected Month:", selectedMonthValue); // Log selected month value
                            setSelectedMonth(selectedMonthValue);
                            getFilteredList(search, selectedMonthValue, selectedYear);
                          }}
                        >
                          <option value="">Select Month</option>
                          {getMonthNames().map((month, index) => (
                            <option key={index} value={month}>{month}</option>
                          ))}
                        </select>
                      </div>
                      </div>
                      <div className="dropdown-divider" style={{ borderTopColor: "#d7d9dd" }} />
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
                  handleConfirm={(employeeId,id) => handleConfirmDelete(employeeId,id) /console.log(id)} // Pass the id to handleConfirmDelete
                  id={selectedItemId} // Pass the selectedItemId to DeletePopup
                  employeeId={selectId}
                  pageName="PaySlip"
                />
            </div>
          </div>
        </main>
        <Footer />
      </div>

    </div>
  )
}

export default PaySlipsView