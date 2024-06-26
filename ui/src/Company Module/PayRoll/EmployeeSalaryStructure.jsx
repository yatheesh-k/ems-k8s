import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { QuestionCircle, QuestionCircleFill } from "react-bootstrap-icons";
import LayOut from "../../LayOut/LayOut";

const EmployeeSalaryStructure = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [view, setView] = useState([]);
  const [grossSalary, setGrossSalary] = useState(0);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [totalAllowance, setTotalAllowance] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [lossOfPayPerDay, setLossOfPayPerDay] = useState(0);
  const [totalPF, setTotalPF] = useState(0);

  
 
 
  // Watch the values of gross Salary, incomeTax, and pfTax fields

  const incomeTax = watch("deductions.incomeTax");
  const pfTax = watch("deductions.pfTax");
  const pfEmployee = watch("deductions.pfEmployee");
  const pfEmployer = watch("deductions.pfEmployer");

  useEffect(() => {
    // Calculate and set monthly salary when grossAmount changes
    const monthlySalaryValue = parseFloat(grossSalary || 0) / 12; // Convert LPA to per month
    setMonthlySalary(monthlySalaryValue);

    const workingDaysPerMonth = 30; // Assume 30 working days in a month
    const lopPerDayValue = monthlySalaryValue / workingDaysPerMonth;
    setLossOfPayPerDay(lopPerDayValue);
  }, [grossSalary]);

  useEffect(() => {
    const totalPFValue = parseFloat(pfEmployee) + parseFloat(pfEmployer);
    setTotalPF(totalPFValue.toFixed(2));
    setValue("deductions.totalDeductions", totalPFValue.toFixed(2));

    const total = (parseFloat(incomeTax) || 0) + (parseFloat(pfTax) || 0);
    setTotalTax(total);
    setValue("deductions.totalTax", total); // Set the value in the form
  }, [pfEmployee, pfEmployer, incomeTax, pfTax, setValue]);

  useEffect(() => {
    // Calculate and set grossSalary when variableAmount or fixedAmount changes
    const variableAmount = parseFloat(watch("variableAmount")) || 0;
    const fixedAmount = parseFloat(watch("fixedAmount")) || 0;
    const newGrossSalary = variableAmount + fixedAmount;
    setGrossSalary(newGrossSalary);
  }, [watch("variableAmount"), watch("fixedAmount")]);

  useEffect(() => {
    axios
      .get(`http://192.168.1.163:8092/employee/all`)
      .then((response) => {
        console.log(response.data);
        const filteredEmployees = response.data.filter((user) => {
          return String(user.status).indexOf("2") === -1; // Check if '2' is not present in the status string
        });
        console.log("Filtered employees:", filteredEmployees);
        const formattedEmployeeList = filteredEmployees.map((user) => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.employeeId,
          name: user.employeeId,
        }));
        console.log("Formatted employee list:", formattedEmployeeList);
        setView(formattedEmployeeList);
      })
      .catch((errors) => {
        console.log(errors);
      });
  }, []);

  const onSubmit = (data) => {
    const employeeId = data.employeeId;
    axios
      .post(`http://192.168.1.163:8092/salary/${employeeId}`, data)
      .then((response) => {
        // Handle successful response
        console.log(response.data);
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
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

  return (
    
    <LayOut>
      <div className="container-fluid p-0">
        <form className="m-3" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="h3 mb-3">
            <strong>Manage Salary</strong>
          </h1>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header" style={{ paddingBottom: "0" }}>
                  <h5 className="card-title">Employee Details</h5>
                  <div
                    className="dropdown-divider"
                    style={{ borderTopColor: "#d7d9dd" }}
                  />
                </div>
                <div className="card-body" style={{ padding: "0 0 0 25%" }}>
                  <div className="mb-4">
                    <div className="row align-items-center">
                      <div
                        className="col-12 col-md-6 col-lg-12 mt-3"
                        style={{ width: "400px" }}
                      >
                        <label className="form-label">
                          Select Employee Name
                        </label>
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
                              )} // Set the value based on the selected employee ID
                              onChange={(val) => {
                                field.onChange(val.value); // Update form value with the selected employee ID
                              }}
                              placeholder="Select Employee Name"
                            />
                          )}
                        />
                        {errors.employeeId && (
                          <p className="errorMsg">Employee Name is required</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title"> Salary Details </h5>
                  <hr />
                  <div className="row">
                    <div className="col-md-5 mb-3">
                      <label className="form-label">Variable Amount</label>
                      <input
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        {...register("variableAmount", {
                          required: "Variable Amount is required",
                          pattern: {
                            value: /^\d+$/,
                            message: "These fields accept only Digits",
                          },
                        })}
                      />
                      {errors.variableAmount && (
                        <p className="errorMsg">
                          {errors.variableAmount.message}
                        </p>
                      )}
                    </div>
                    <div className="col-md-1 mb-3"></div>
                    <div className="col-md-5 mb-3">
                      <label className="form-label">Fixed Amount</label>
                      <input
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        {...register("fixedAmount", {
                          required: "Fixed Amount is required",
                          pattern: {
                            value: /^\d+$/,
                            message: "These fields accept only Digits",
                          },
                        })}
                      />
                      {errors.fixedAmount && (
                        <p className="errorMsg">{errors.fixedAmount.message}</p>
                      )}
                    </div>
                    <div className="col-md-5 mb-3">
                      <label className="form-label">Gross Amount</label>
                      <input
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        value={grossSalary.toFixed(2)}
                        readOnly
                        {...register("grossAmount", {
                          required: "Gross Amount is required",
                          pattern: {
                            value: /^\d+$/,
                            message: "These fields accept only Digits",
                          },
                        })}
                      />
                      {errors.grossAmount && (
                        <p className="errorMsg">{errors.grossAmount.message}</p>
                      )}
                    </div>
                    <div className="col-md-1 mb-3"></div>
                    <div className="col-md-5 mb-3">
                      <label className="form-label">Monthly Salary</label>
                      <input
                        type="text"
                        className="form-control"
                        value={monthlySalary.toFixed(2)} // Convert toFixed after ensuring monthlySalary is a number
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title"> Allowances </h5>
                  <hr />
                  <div className="col-12">
                    <label className="form-label">Basic Salary</label>
                    <input
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      {...register("allowances.basicSalary", {
                        required: "Basic Salary is required",
                        pattern: {
                          value: /^\d+$/,
                          message: "These fields accept only Digits",
                        },
                      })}
                    />
                    {errors["allowances.basicSalary"] && (
                      <p className="errorMsg">
                        {errors["allowances.basicSalary"].message}
                      </p>
                    )}
                  </div>
                  <div className="col-12" style={{ marginTop: "10px" }}>
                    <label className="form-label">HRA:</label>
                    <input
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      value={watch("allowances.hra")}
                      readOnly
                      {...register("allowances.hra")}
                    />
                  </div>
                  <div className="col-12" style={{ marginTop: "10px" }}>
                    <label className="form-label">Travel Allowance</label>
                    <input
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      {...register("allowances.travelAllowance", {
                        required: "Travel Allowance is required",
                        pattern: {
                          value: /^\d+$/,
                          message: "These fields accept only Digits",
                        },
                      })}
                    />
                    {errors["allowances.travelAllowance"] && (
                      <p className="errorMsg">
                        {errors["allowances.travelAllowance"].message}
                      </p>
                    )}
                  </div>
                  <div className="col-12" style={{ marginTop: "10px" }}>
                    <label className="form-label">
                      PF Contribution Employee Allowance
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      {...register("allowances.pfContributionEmployee", {
                        required: "PF Contribution (Employee) is required",
                        pattern: {
                          value: /^\d+$/,
                          message: "These fields accept only Digits",
                        },
                      })}
                    />
                    {errors["allowances.pfContributionEmployee"] && (
                      <p className="errorMsg">
                        {errors["allowances.pfContributionEmployee"].message}
                      </p>
                    )}
                  </div>
                  <div className="col-12" style={{ marginTop: "10px" }}>
                    <label className="form-label">Special Allowance</label>
                    <input
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      {...register("allowances.specialAllowance", {
                        required: "Special Allowance is required",
                        pattern: {
                          value: /^\d+$/,
                          message: "These fields accept only Digits",
                        },
                      })}
                    />
                    {errors["allowances.specialAllowance"] && (
                      <p className="errorMsg">
                        {errors["allowances.specialAllowance"].message}
                      </p>
                    )}
                  </div>
                  <div className="col-12" style={{ marginTop: "10px" }}>
                    <label className="form-label">Other Allowances</label>
                    <input
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      {...register("allowances.otherAllowances", {
                        required: "Other Allowances is required",
                        pattern: {
                          value: /^\d+$/,
                          message: "These fields accept only Digits",
                        },
                      })}
                    />
                    {errors["allowances.otherAllowances"] && (
                      <p className="errorMsg">
                        {errors["allowances.otherAllowances"].message}
                      </p>
                    )}
                  </div>
                  <div className="col-12" style={{ marginTop: "10px" }}>
                    <label className="form-label">Total Earnings:</label>
                    <input
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      value={totalAllowance}
                      onChange={(e) => setTotalAllowance(e.target.value)}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title "> Deductions </h5>
                  <hr />
                  <div className="col-12" style={{ marginTop: "10px" }}>
                    <label className="form-label">Income Tax</label>
                    <input
                      type="text"
                      className="form-control"
                      onInput={toInputTitleCase}
                      autoComplete="off"
                      {...register("deductions.incomeTax", {
                        required: "ncome Tax is required",
                        pattern: {
                          value: /^\d+$/,
                          message: "These fields accepts only Digits",
                        },
                      })}
                    />
                    {errors.incomeTax && (
                      <p className="errorMsg">{errors.incomeTax.message}</p>
                    )}
                  </div>
                  <div className="col-lg-1"></div>
                  <div className="col-12" style={{ marginTop: "10px" }}>
                    <label className="form-label">
                      Professional Tax{" "}
                      <div className="question-mark-container">
                        <QuestionCircle color="red" />
                        <span className="question-mark-text">
                          Professional Tax May Vary State to State
                        </span>
                      </div>
                    </label>
                    {/* Input field for PF Tax */}
                    <input
                      type="text"
                      className="form-control"
                      onInput={toInputTitleCase}
                      autoComplete="off"
                      {...register("deductions.pfTax", {
                        required: "Professional Tax is required",
                        pattern: {
                          value: /^\d+$/,
                          message: "These fields accepts only Digits",
                        },
                      })}
                    />
                    {errors.professionalTax && (
                      <p className="errorMsg">
                        {errors.professionalTax.message}
                      </p>
                    )}
                  </div>
                  <div className="col-12" style={{ marginTop: "10px" }}>
                    <label className="form-label">LOP</label>
                    {/* Input field for LOP */}
                    <input
                      type="text"
                      className="form-control"
                      onInput={toInputTitleCase}
                      autoComplete="off"
                      value={lossOfPayPerDay.toFixed(2)}
                      readOnly
                      {...register("deductions.lop", {
                        required: "LOP is required",
                        pattern: {
                          value: /^\d+$/,
                          message: "These fields accepts only Digits",
                        },
                      })}
                    />
                    {errors.lop && (
                      <p className="errorMsg">{errors.lop.message}</p>
                    )}
                  </div>
                  <div className="col-12" style={{ marginTop: "10px" }}>
                    <label className="form-label">Total Tax</label>
                    {/* Input field for LOP */}
                    <input
                      type="text"
                      className="form-control"
                      value={totalTax}
                      readOnly
                      {...register("deductions.totalTax", {
                        required: "Total Tax is required",
                        pattern: {
                          value: /^\d+$/,
                          message: "This field accepts only digits",
                        },
                      })}
                    />
                    {errors.totaltax && (
                      <p className="errorMsg">{errors.totalTax.message}</p>
                    )}
                  </div>
                </div>
              </div>
              {/* </div>
              
              <div className="col-6"> */}
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Contributions</h5>
                  <hr />
                  <div className="col-12">
                    <label className="form-label">PF Employee</label>
                    <input
                      type="text"
                      className="form-control"
                      onInput={toInputTitleCase}
                      autoComplete="off"
                      {...register("deductions.pfEmployee", {
                        required: "PF Employee is required",
                        pattern: {
                          value: /^\d+$/,
                          message: "These fields accepts only Digits",
                        },
                      })}
                    />
                    {errors.pfEmployee && (
                      <p className="errorMsg">{errors.pfEmployee.message}</p>
                    )}
                  </div>
                  <div className="col-lg-1"></div>
                  <div className="col-12" style={{ marginTop: "10px" }}>
                    <label className="form-label">PF Employer</label>
                    <input
                      type="text"
                      className="form-control"
                      onInput={toInputTitleCase}
                      autoComplete="off"
                      {...register("deductions.pfEmployer", {
                        required: "PF Employer is required",
                        pattern: {
                          value: /^\d+$/,
                          message: "These fields accepts only Digits",
                        },
                      })}
                    />
                    {errors.pfEmployer && (
                      <p className="errorMsg">{errors.pfEmployer.message}</p>
                    )}
                  </div>
                  <div className="col-12" style={{ marginTop: "10px" }}>
                    <label className="form-label">Total PF</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      {...register("deductions.totalDeductions", {
                        required: true,
                      })}
                    />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Total Salary</h5>
                  <hr />
                  <div className="col-12" style={{ marginTop: "10px" }}>
                    <label className="form-label">Net Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      {...register("deductions.netSalary", {
                        required: true,
                      })}
                    />
                    {errors.netAmount && (
                      <p className="errorMsg">Net Amount is required</p>
                    )}
                  </div>
                  <div
                    className="col-12  d-flex justify-content-end mt-5"
                    style={{ background: "none" }}
                  >
                    <button
                      className="btn btn-primary btn-lg"
                      style={{ marginRight: "0px" }}
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </LayOut>
 
  );
};

export default EmployeeSalaryStructure;
