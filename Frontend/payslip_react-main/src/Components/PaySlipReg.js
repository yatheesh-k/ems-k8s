import React, { useState, useEffect } from 'react'
import Footer from '../ScreenPages/Footer';
import Header from '../ScreenPages/Header';
import SideNav from '../ScreenPages/SideNav';
import Select from 'react-select';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';


const PaySlipReg = () => {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm("")
  const [select, setSelect] = useState(false);
  const [view, setView] = useState([]);
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://192.168.1.163:8092/employee/all`)
      .then((response) => {
        console.log(response.data);
        response.data.forEach(user => {
          console.log("User:", user);
          console.log("Status:", user.status); // Log status for each user
      });
      const filteredEmployees = response.data.filter(user => {
        // Convert user.status to a string before using includes()
        const statusString = String(user.status);
        // Check if the statusString contains '2'
        return !statusString.includes('2');
      });
            console.log("Filtered employees:", filteredEmployees);
        const formattedEmployeeList = filteredEmployees.map(user => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.employeeId,
          name: user.employeeId,
        }));
        console.log('Formatted employee list:', formattedEmployeeList);
        setView(formattedEmployeeList);
      })
      .catch((errors) => {

        console.log(errors)
      });

  }, []);

  

  /**Year Drop Down */
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

  const [selectedYear, setSelectedYear] = useState({ value: currentYear, label: currentYear.toString() });

  const handleYearChange = (selectedOption) => {
    setSelectedYear(selectedOption);
    // Perform any additional actions you want when the year changes
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : '');
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('employeeId', data.employeeId);
    formData.append('financialYear', data.financialYear.value); // Assuming financialYear is an object with a 'value' property
    formData.append('month', data.month.value); // Assuming month is an object with a 'value' property
    formData.append('file', data.file[0]); // Assuming file is an array of File objects

    axios.post('http://192.168.1.163:8092/payslip/upload-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        if(response.status===200){
          toast.success("PaySlip Generated Successfuly",{
              position: 'top-right',
              transition:Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000, // Close the toast after 3 seconds
             
          })
      }
        console.log(response.data)
        console.log(data);
        navigate('/payslipview');
      })
      .catch((errors) => {
        if (errors.response) {
          const status = errors.response.status;
          let errorMessage = '';
  
          switch (status) {
              case 403:
                  errorMessage = 'Session TImeOut !';
                  navigate('/')
                  break;
              case 404:
                  errorMessage = 'Resource Not Found !';
                  break;
              case 406:
                  errorMessage = 'Employee Already Exist !';
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
        console.log(errors)

      });

  }

  return (
    <div className='wrapper'>
      <SideNav />
      <div className='main'>
        <Header />
        <main className="content">
          <div className="container-fluid p-0">
            <h1 className="h3 mb-3"><strong>PaySlips Form</strong> </h1>
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title ">Generate PaySlip</h5>
                    <div className="dropdown-divider" style={{ borderTopColor: "#d7d9dd" }} />

                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card-body">
                      <div className='row'>

                        <div className='col-12 col-md-6 col-lg-5 mb-2'>
                          <label className="form-label">Select Employee Name</label>
                          <Controller
                            name="employeeId"
                            control={control}
                            defaultValue=''
                            rules={{ required: true}}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={view}
                                value={view.find(option => option.value === field.value)} // Set the value based on the selected employee ID
                                onChange={(val) => {
                                  field.onChange(val.value); // Update form value with the selected employee ID
                                }}
                                placeholder="Select Employee Name"
                              />
                            )}
                          />
                          {errors && errors.employeeId && (
                            <p className="errorMsg">Employee Name Required</p>)}
                        </div>
                        <div className='col-lg-1'></div>
                        <div className='col-12 col-md-6 col-lg-5 mb-3' >
                          <label className="form-label">Select Financial Year</label>
                          <Controller
                            name="financialYear"
                            control={control}
                            defaultValue={null}
                            rules={{ required: true}}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={options}
                                
                                placeholder="Select Year"
                              />
                            )}
                          />
                          {errors && errors.financialYear && (
                            <p className="errorMsg">Year Required</p>)}
                        </div>
                        <div className='col-12 col-md-6 col-lg-5 mb-3' >
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
                        {/* <div className='col-12 col-md-6 col-lg-5 mb-3' >
                          <label className="form-label">PaySlip</label>
                          <input type="file" name='file' className="form-control" placeholder="upload Pay Slip" accept='application/pdf'
                            onChange={(e) => handleFileChange(e)}
                            {...register("file", {
                              required: true,
                            })}
                          />

                          {errors.file && (
                            <p className="errorMsg">{fileName || 'Upload PDF file'}</p>)}
                        </div> */}
                        <div className='col-lg-1'></div>
                        <div className='col-12 col-md-6 col-lg-5 mb-3' >
                          <label className="form-label">Monthly Salary</label>
                          <input type="text" name='file' className="form-control" placeholder="23434" readOnly accept='application/pdf'
                            onChange={(e) => handleFileChange(e)}
                            {...register("file", {
                              required: true,
                            })}
                          />

                          {errors.file && (
                            <p className="errorMsg">{fileName || 'Upload PDF file'}</p>)}
                        </div>
                        {/* <div className='col-lg-1'></div>
                        <div className='col-12 col-md-6 col-lg-5 mb-3' >
                          <label className="form-label">Working Days</label>
                          <input type="text" name='file' className="form-control" placeholder="No:of Working Days " accept='application/pdf'
                            onChange={(e) => handleFileChange(e)}
                            {...register("file", {
                              required: true,
                            })}
                          />

                          {errors.file && (
                            <p className="errorMsg">{fileName || 'Upload PDF file'}</p>)}
                        </div> */}
                        {/* <div className='col-lg-1'></div>
                        <div className='col-12 col-md-6 col-lg-5 mb-3' >
                          <label className="form-label">Leaves Taken</label>
                          <input type="text" name='file' className="form-control" placeholder="No:of Leaves" accept='application/pdf'
                            onChange={(e) => handleFileChange(e)}
                            {...register("file", {
                              required: true,
                            })}
                          />

                          {errors.file && (
                            <p className="errorMsg">{fileName || 'Upload PDF file'}</p>)}
                        </div> */}


                        <div className='col-12  d-flex justify-content-end mt-5 ' style={{background:"none"}} >
                          <button className="btn btn-primary btn-lg" style={{ marginRight: "65px" }} type='submit'>Submit</button>
                        </div>

                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

    </div>
  )
}

export default PaySlipReg;

















