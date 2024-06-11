import React, { useState } from 'react';
import Select from 'react-select';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
import SideNav from '../../ScreenPages/SideNav';
import Header from '../../ScreenPages/Header';
import Footer from '../../ScreenPages/Footer';
import DataTable from 'react-data-table-component';

const GeneratePaySlip = () => {
  const { handleSubmit, control, formState: { errors } } = useForm("");
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();
  const [view, setView] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedMonthYear, setSelectedMonthYear] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]); // State to track selected employees
  const [selectAll, setSelectAll] = useState(false); // State to track select all checkbox

  // Year Drop Down
  const currentYear = new Date().getFullYear();
  const startYear = 2000; // or any other start year you prefer
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, index) => startYear + index);
  const months = Array.from({ length: 12 }, (_, index) => ({
    value: (index + 1).toString().padStart(2, '0'),
    label: new Date(2000, index, 1).toLocaleString('default', { month: 'long' }),
  }));
  const options = years.map((year) => ({
    value: year,
    label: year.toString(),
  })).reverse();

  const companyId = sessionStorage.getItem("id");

  const onSubmit = (data) => {
    const { month, year } = data;
    const payload = {
      month: month.label,
      year: year.label
    };

    axios.post(`http://192.168.1.163:8092/payslip/employee/${companyId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        toast.success("PaySlip Generated Successfully", {
          position: 'top-right',
          transition: Bounce,
          hideProgressBar: true,
          theme: "colored",
          autoClose: 3000,
        });
      }
      setView(response.data);
      setSelectedMonthYear(`${month.label} ${year.label}`);
      setShow(true);
    })
    .catch((errors) => {
      // Handle errors
    });
  };

  const handleCheckboxChange = (employeeId) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employeeId)
        ? prevSelected.filter((id) => id !== employeeId)
        : [...prevSelected, employeeId]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(view.map((employee) => employee.employeeId));
    }
    setSelectAll(!selectAll);
  };

  const handleGeneratePaySlips = async () => {
    const promises = selectedEmployees.map((employeeId) =>
      axios.post(`http://192.168.1.163:8092/payslip/${companyId}/${employeeId}`, {
        month: selectedMonthYear.split(' ')[0],
        year: selectedMonthYear.split(' ')[1]
      })
    );

    try {
      await Promise.all(promises);
      toast.success("All Payslips Generated Successfully", {
        position: 'top-right',
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Error Generating Some Payslips", {
        position: 'top-right',
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 3000,
      });
    }
  };


  const columns = [
    {
      name: (
        <>
        
         <input
          type="checkbox"
          className='form-check-input'
          checked={selectAll}
          onChange={handleSelectAllChange}
        />
  
        </>
      
      ),
      cell: row => (
        <>
       
         <input
          type="checkbox"
          className='form-check-input'
          checked={selectedEmployees.includes(row.employeeId)}
          onChange={() => handleCheckboxChange(row.employeeId)}
        />
    
        </>
       
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: 'Employee ID',
      selector: 'employeeId',
      sortable: true
    },
    {
      name: 'Employee Name',
      selector: 'employeeName',
      sortable: true
    },
    {
      name: 'Total Working Days',
      selector: 'totalWorkingDays',
      sortable: true
    },
    {
      name: 'No. of Leaves',
      selector: 'lop',
      sortable: true
    },
    {
      name: 'Net Salary',
      selector: 'netSalary',
      sortable: true
    },
    {
      name: 'Month',
      selector: 'month',
      sortable: true
    },
    {
      name: 'Year',
      selector: 'year',
      sortable: true
    }
  ];

  return (
    <div className='wrapper'>
      <SideNav />
      <div className='main'>
        <Header />
        <main className="content">
          <div className="container-fluid p-0">
            <h1 className="h3 mb-3"><strong>PaySlips Form</strong></h1>
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">Generate PaySlip</h5>
                    <div className="dropdown-divider" style={{ borderTopColor: "#D7D9DD" }} />
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card-body">
                      <div className='row'>
                        <div className='col-12 col-md-6 col-lg-5 mb-3'>
                          <label className="form-label">Select Year</label>
                          <Controller
                            name="year"
                            control={control}
                            defaultValue=""
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={options}
                                placeholder="Select Year"
                              />
                            )}
                          />
                          {errors && errors.year && (
                            <p className="errorMsg">Year Required</p>)}
                        </div>
                        <div className='col-lg-1'></div>
                        <div className='col-12 col-md-6 col-lg-5 mb-3'>
                          <label className="form-label">Select Month</label>
                          <Controller
                            name="month"
                            control={control}
                            defaultValue={null}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={months}
                                placeholder="Select Month"
                              />
                            )}
                          />
                          {errors && errors.month && (
                            <p className="errorMsg">Month Required</p>)}
                        </div>
                        <div className='col-12 d-flex justify-content-end mt-5' style={{ background: "none" }}>
                          <button className="btn btn-primary btn-lg" style={{ marginRight: "65px" }} type='submit'>Submit</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {show && (
            <div className="col-12">
              <div className="card">
                <div className="card-header"></div>
                <h6 style={{ paddingLeft: "15px" }}>Month/Year: {selectedMonthYear}</h6>
                <DataTable
                  columns={columns}
                  data={view}
                />
                <div className='m-3 d-flex justify-content-end bg-transparent'>
                  <button className='btn btn-primary' type='button' onClick={handleGeneratePaySlips}>Generate PaySlips</button>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default GeneratePaySlip;
