import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LayOut from "../../LayOut/LayOut";

const ManageAttendence = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm("");
  const [view, setView] = useState([]);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();
  const [totalWorkingDays, setTotalWorkingDays] = useState(0);
  const [numberOfLeaves, setNumberOfLeaves] = useState(0);
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

  const toInputTitleCase = (e) => {
    let value = e.target.value;
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

  useEffect(() => {
    axios
      .get(`http://192.168.1.163:8092/employee/all`)
      .then((response) => {
        const filteredEmployees = response.data.filter((user) => {
          const statusString = String(user.status);
          return !statusString.includes("2");
        });
        const formattedEmployeeList = filteredEmployees.map((user) => ({
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
    const payload = {
      ...data,
      month: selectedMonth,
      year: selectedYear,
    };
    axios
      .post(`http://192.168.1.163:8092/attendance/${employeeId}`, payload)
      .then((response) => {
        console.log(response.data);
        reset();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const calculateWorkingDays = () => {
    return totalWorkingDays - numberOfLeaves;
  };

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <h1 className="h3 mb-3">
          <strong>Attandance Management</strong>{" "}
        </h1>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title ">Manage Attandance</h5>
                <div
                  className="dropdown-divider"
                  style={{ borderTopColor: "#d7d9dd" }}
                />
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-5 mb-2">
                      <label className="form-label">Select Employee Name</label>
                      <Controller
                        name="employeeId"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={view}
                            value={view.find(
                              (option) => option.value === field.value
                            )}
                            onChange={(val) => {
                              field.onChange(val.value);
                            }}
                            placeholder="Select Employee Name"
                          />
                        )}
                      />
                      {errors && errors.employeeId && (
                        <p className="errorMsg">Employee Name Required</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>{" "}
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Total Working Days</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Total of working days"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("totalWorkingDays", {
                          required: "Total of Working Days is Required",
                          min: 0,
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "These fields Accepts only numbers",
                          },
                        })}
                        onChange={(e) =>
                          setTotalWorkingDays(parseFloat(e.target.value))
                        }
                      />
                      {errors && errors.numberOfWorkingDays && (
                        <p className="errorMsg">
                          {errors && errors.numberOfWorkingDays.message}
                        </p>
                      )}
                    </div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Select Month</label>

                      <select
                        className="form-select"
                        value={selectedMonth}
                        onChange={(e) => {
                          const selectedMonthValue = e.target.value;
                          console.log("Selected Month:", selectedMonthValue); // Log selected month value
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
                        <p className="errorMsg">Employee Type is required</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>{" "}
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Number of Leaves</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter number of leaves"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("lop", {
                          required: "Number of Leaves is Required",
                          min: 0,
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "These fields Accepct only Numbers",
                          },
                        })}
                        onChange={(e) =>
                          setNumberOfLeaves(parseFloat(e.target.value))
                        }
                      />
                      {errors && errors.numberOfWorkingDays && (
                        <p className="errorMsg">
                          {errors && errors.numberOfWorkingDays.message}
                        </p>
                      )}
                    </div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Select Financial Year
                      </label>

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
                        <p className="errorMsg">Employee Type is required</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>{" "}
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Number of Working Days
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={calculateWorkingDays()}
                        readOnly
                      />
                      {errors && errors.numberOfWorkingDays && (
                        <p className="errorMsg">
                          {errors && errors.numberOfWorkingDays.message}
                        </p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LayOut>
  );
};

export default ManageAttendence;
