import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from 'react-select'
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import LayOut from "../../../LayOut/LayOut";

const AddIncrement = () => {
  const { register, handleSubmit, watch, control, formState: { errors }, } = useForm();
  const [view, setView] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const getMonthNames = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2000, i, 1); // Using 2000 as a dummy year
      return date.toLocaleString("en-US", { month: "long" });
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

  useEffect(() => {
    axios.get(`http://192.168.1.163:8092/employee/all`)
      .then((response) => {
        const filteredEmployees = response.data.filter(user => {
          const statusString = String(user.status);
          return !statusString.includes('2');
        });
        const formattedEmployeeList = filteredEmployees.map(user => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.employeeId,
          name: user.employeeId,
        }));
        setView(formattedEmployeeList);
      })
      .catch((errors) => {
        console.log(errors);
      });
  }, []);

  const onSubmit = (data) => {
    const employeeId = data.employeeId;
    axios.post(`http://192.168.1.163:8092/payroll/${employeeId}`, data)
      .then((response) => {
        // Handle successful response
        console.log(response.data);
      })
      .catch((error) => {
        // Handle error
        console.error('Error:', error);
      });
  };

  const handleEmployeeSelect = (employeeId) => {
    // Fetch and set salary details based on selected employee
    // Example: fetchSalaryDetails(employeeId).then((salaryData) => setValue('salaryDetails', salaryData));
  };
  return (
        <LayOut>
          <div className="container-fluid p-0">
            <h1 className="h3 mb-3">
              <strong>Salary Increament</strong>{" "}
            </h1>
            <div className="row">
              <div className="col-12">
                <div className="card ">
                  <div className="card-header">
                    <h5 className="card-title ">Add Employee Increament </h5>
                    <div
                      className="dropdown-divider"
                      style={{ borderTopColor: "#d7d9dd" }}
                    />
                  </div>
                  <div className="card-body ">
                    <div className="row">
                      <div className="col-lg-12">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          {/* Salary Details */}
                          <div>
                            <div className="row">
                              <div className="col-md-5 mb-3">
                                <label className="form-label">
                                  Select Employee
                                </label>
                                <Controller
                              name="employeeId"
                              control={control}
                              defaultValue=''
                              rules={{ required: true }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  options={view}
                                  value={view.find(option => option.value === field.value)}
                                  onChange={(val) => {
                                    field.onChange(val.value);
                                  }}
                                  placeholder="Select Employee Name"
                                />
                              )}
                            />
                                {errors.employeeType && (
                                  <p className="errorMsg">
                                    Employee Type is required
                                  </p>
                                )}
                              </div>
                              <div className="col-md-5 mb-3"></div>
                              <div className="col-md-5 mb-3">
                                <label className="form-label">
                                  Select Month
                                </label>
                                {/* Dropdown for Employee Type */}
                                {/* Replace placeholder text and options with your actual data */}
                                <select
                                  className="form-select"
                                  value={selectedMonth}
                                  onChange={(e) => {
                                    const selectedMonthValue = e.target.value;
                                    console.log(
                                      "Selected Month:",
                                      selectedMonthValue
                                    ); // Log selected month value
                                    setSelectedMonth(selectedMonthValue);
                                  }}
                                >
                                  <option value="">Select Month</option>
                                  {getMonthNames().map((month, index) => (
                                    <option key={index} value={month}>
                                      {month}
                                    </option>
                                  ))}
                                </select>
                                {errors.employeeType && (
                                  <p className="errorMsg">
                                    Employee Type is required
                                  </p>
                                )}
                              </div>
                              <div className='col-lg-1'></div>
                              <div className="col-md-5 mb-3">
                                <label className="form-label">
                                  Select Year
                                </label>
                                {/* Dropdown for Employee Type */}
                                {/* Replace placeholder text and options with your actual data */}
                                <select
                                  className="form-select"
                                  value={selectedYear}
                                  onChange={(e) => {
                                    setSelectedYear(e.target.value);
                                  }}
                                >
                                  <option value="">Select Year</option>
                                  {getRecentYears().map((year) => (
                                    <option key={year} value={year}>
                                      {year}
                                    </option>
                                  ))}
                                </select>
                                {errors.employeeType && (
                                  <p className="errorMsg">
                                    Employee Type is required
                                  </p>
                                )}
                              </div>
                              <div className="col-md-5 mb-3">
                                <label className="form-label">
                                  Increament Amount
                                </label>
                                {/* Input field for Fixed Amount */}
                                <input
                                  type="text"
                                  className="form-control"
                                  {...register("incrementAmount", {
                                    required: "Increment Amount is Required",
                                    pattern: {
                                      value: /^[0-9 ]+$/,
                                      message: "These field only accepct Numbers"
                                    }
                                  })}
                                />
                                {errors.incrementAmount && (
                                  <p className="errorMsg">
                                    {errors.incrementAmount.message}
                                  </p>
                                )}
                              </div>
                              <div className='col-lg-1'></div>

                              <div className="col-md-5 mb-3">
                                <label className="form-label">
                                  Purpose of Increament
                                </label>
                                {/* Input field for Variable Amount */}
                                <input
                                  type="text"
                                  className="form-control"
                                  {...register("incrementPurpose", {
                                    required: "Purpose is Required",
                                    pattern: {
                                      value: /^[0-9a-zA-Z ]+$/,
                                      message: "These Field accepct both Numbers and Alphabets"
                                    }
                                  })}
                                />
                                {errors.incrementPurpose && (
                                  <p className="errorMsg">
                                    {errors.incrementPurpose.message}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div
                              className="col-12  d-flex justify-content-end mt-5 "
                              style={{ background: "none" }}
                            >
                              <button
                                className="btn btn-primary btn-lg"
                                style={{ marginRight: "65px" }}
                                type="submit"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </LayOut>
       
  );
};

export default AddIncrement;
