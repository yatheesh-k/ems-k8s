import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import LayOut from "../../LayOut/LayOut";
import { EmployeeGetApi, EmployeeSalaryPostApi, EmployeeSalaryGetApiById, EmployeeSalaryPatchApiById } from "../../Utils/Axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../Context/AuthContext";

const EmployeeSalaryStructure = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({ mode: 'onChange' });
  const { user } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const salaryId = queryParams.get('salaryId');
  const id = queryParams.get('employeeId')

  const [employes, setEmployes] = useState([]);
  const [grossAmount, setGrossAmount] = useState(0);
  const [hra, setHra] = useState(0);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [lossOfPayPerDay, setLossOfPayPerDay] = useState(0);
  const [totalPF, setTotalPF] = useState(0);
  const [showFields, setShowFields] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [variableAmount, setVariableAmount] = useState(0);
  const [fixedAmount, setFixedAmount] = useState(0);
  const [incomeTax, setIncomeTax] = useState(0);
  const [pfTax, setPfTax] = useState(0);
  const [pfEmployee, setPfEmployee] = useState(0);
  const [pfEmployer, setPfEmployer] = useState(0);
  const [travelAllowance, setTravelAllowance] = useState(0);
  const [specialAllowance, setSpecialAllowance] = useState(0);
  const [otherAllowances, setOtherAllowances] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Active");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (id && salaryId) {
      setShowFields(true);
    } else {
      setShowFields(false);
    }
  }, [id, salaryId]);


  useEffect(() => {
    EmployeeGetApi().then((data) => {
      const filteredData = data
        .filter((employee) => employee.firstName !== null)
        .map(({ referenceId, ...rest }) => rest);
      setEmployes(
        filteredData.map((employee) => ({
          label: `${employee.firstName} ${employee.lastName} (${employee.employeeId})`,
          value: employee.id,
        }))
      );
    });
  }, []);

  useEffect(() => {
    if (id && salaryId) {
      EmployeeSalaryGetApiById(id, salaryId)
        .then((response) => {
          const data = response.data.data;
          if (data) {
            setEmployeeId(data.employeeId);
            setFixedAmount(parseFloat(data.fixedAmount));
            setVariableAmount(parseFloat(data.variableAmount));
            setGrossAmount(parseFloat(data.grossAmount));
            setStatus(data.status || '');
            setValue('status', data.status || '');
            setShowFields(true);
            setIsUpdating(true);
            setIsReadOnly(data.status === 'InActive');
          }
        })
        .catch((error) => {
          handleApiErrors(error);
        });
    } else {
      setShowFields(false);
    }
  }, [id, salaryId, setValue]);

  useEffect(() => {
    if (salaryId && id) {
      setValue('variableAmount', variableAmount);
      setValue('fixedAmount', fixedAmount);
      setValue('hra', hra);
      setValue('travelAllowance', travelAllowance);
      setValue('pfEmployee', pfEmployee);
      setValue('pfEmployer', pfEmployer);
      // Update other values as necessary
    }
  }, [variableAmount, fixedAmount, hra, travelAllowance, pfEmployee, pfEmployer, salaryId, id, setValue]);


  const handleApiErrors = (error) => {
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
      const errorMessage = error.response.data.error.message;
      toast.error(errorMessage);
    } else {
      toast.error("Network Error !");
    }
    console.error(error.response);
  };

  const handleGoClick = () => {
    if (!employeeId) {
      setMessage("Please select Employee Name");
      setShowFields(false);
    } else {
      setShowFields(true);
      setErrorMessage("");
    }
  };

  const handleEmployeeChange = (selectedOption) => {
    setEmployeeId(selectedOption.value);
  };

  const handleVariableAmountChange = (e) => {
    setVariableAmount(parseFloat(e.target.value) || 0);
    setValue("variableAmount", e.target.value, { shouldValidate: true });
  };

  const handleFixedAmountChange = (e) => {
    setFixedAmount(parseFloat(e.target.value) || 0);
    setValue("fixedAmount", e.target.value, { shouldValidate: true });
  };

  useEffect(() => {
    const newGrossSalary = variableAmount + fixedAmount;
    setGrossAmount(newGrossSalary);
  }, [variableAmount, fixedAmount]);

  useEffect(() => {
    const monthlySalaryValue = parseFloat(grossAmount || 0) / 12;
    setMonthlySalary(monthlySalaryValue.toFixed(2));

    const workingDaysPerMonth = 30;
    const lopPerDayValue = monthlySalaryValue / workingDaysPerMonth;
    setLossOfPayPerDay(lopPerDayValue.toFixed(2));
  }, [grossAmount]);

  const companyName = user.company;

  const onSubmit = (data) => {
    if (
      variableAmount === 0 &&
      fixedAmount === 0 &&  
      grossAmount === 0
    ) {
      return;
    }

    const postData = {
      companyName,
      fixedAmount,
      variableAmount,
      grossAmount,
      status: data.status,
    };

    console.log("Post Data:", postData);
    const apiCall = salaryId
      ? () => EmployeeSalaryPatchApiById(employeeId, salaryId, postData) // Update existing data
      : () => EmployeeSalaryPostApi(employeeId, postData); // Add new data

    apiCall()
      .then((response) => {
        toast.success(salaryId ? "Employee Salary Updated Successfully" : "Employee Salary Added Successfully");
        setErrorMessage(""); // Clear error message on success
        setShowFields(false);
        navigate('/employeeview');
      })
      .catch((error) => {
        handleApiErrors(error);
      });
  };

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
            <div className="col">
              <h1 className="h3 mb-3">
                <strong>Manage Salary</strong>
              </h1>
            </div>
            <div className="col-auto" style={{ paddingBottom: '20px' }}>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="/main">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Payroll</li>
                  <li className="breadcrumb-item active">Manage Salary</li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="row">
            {showFields ? (
              <>
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title"> Salary Details </h5>
                      <hr />
                      <div className="row">
                        <div className="col-md-5 mb-3">
                          <label className="form-label">Variable Amount<span style={{ color: "red" }}>*</span></label>
                          <input
                            id="variableAmount"
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            maxLength={10}
                            {...register("variableAmount", {
                              required: "Variable amount is required",
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "These filed accepcts only Integers",
                              },
                              validate: {
                                notZero: value => value !== "0" || "Value cannot be 0"
                              },
                              minLength: {
                                value: 5,
                                message: "Minimum 5 Numbers Required"
                              },
                              maxLength: {
                                value: 10,
                                message: "Maximum 10 Numbers Allowed"
                              },
                            })}
                            readOnly={isReadOnly}
                            value={variableAmount}
                            onChange={handleVariableAmountChange}
                          />
                          {errors.variableAmount && (
                            <div className="errorMsg">
                              {errors.variableAmount.message}
                            </div>
                          )}
                        </div>
                        <div className="col-md-1 mb-3"></div>
                        <div className="col-md-5 mb-3">
                          <label className="form-label">Fixed Amount<span style={{ color: "red" }}>*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            maxLength={10}
                            {...register("fixedAmount", {
                              required: "Fixed amount is required",
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "These filed accepcts only Integers",
                              },
                              minLength: {
                                value: 5,
                                message: "Minimum 5 Numbers Required"
                              },
                              maxLength: {
                                value: 10,
                                message: "Maximum 10 Numbers Allowed"
                              },
                              validate: {
                                notZero: value => value !== "0" || "Value cannot be 0"
                              }
                            })}
                            readOnly={isReadOnly}
                            value={fixedAmount}
                            onChange={handleFixedAmountChange}
                          />
                          {errors.fixedAmount && (
                            <div className="errorMsg">
                              {errors.fixedAmount.message}
                            </div>
                          )}
                        </div>
                        <div className="col-md-5 mb-3">
                          <label className="form-label">Gross Amount<span style={{ color: "red" }}>*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            value={grossAmount}
                            readOnly
                          />
                        </div>
                        <div className="col-md-1 mb-3"></div>
                        <div className="col-md-5 mb-3">
                          <label className="form-label">Monthly Salary<span style={{ color: "red" }}>*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            value={monthlySalary}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header ">
                      <div className="d-flex justify-content-start align-items-start">
                        <h5 className="card-title me-2">Status</h5>
                        <span className="text-danger">
                          {errors.companyType && (
                            <p className="mb-0">{errors.status.message}</p>
                          )}
                        </span>
                      </div>
                      <hr
                        className="dropdown-divider"
                        style={{ borderTopColor: "#d7d9dd", width: "100%" }}
                      />
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                          <div>
                            <label>
                              <input
                                type="radio"
                                name="status"
                                value="Active"
                                style={{ marginRight: "10px" }}
                                {...register("status", {
                                  required: "Please Select Status",
                                })}
                              />
                              Active
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-1"></div>
                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                          <label className="ml-3">
                            <input
                              type="radio"
                              name="status"
                              value="InActive"
                              style={{ marginRight: "10px" }}
                              {...register("status", {
                                required: "Please Select Status",
                              })}
                            />
                            InActive
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 text-end" style={{ marginTop: "60px" }}>
                  <button type="submit" className="btn btn-primary">
                    {isUpdating ? 'Update' : 'Submit'}
                  </button>
                </div>
              </>
            ) : (
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
                        <div className="col-12 d-flex align-items-center">
                          <div
                            className="mt-3"
                            style={{ flex: "1 1 auto", maxWidth: "400px" }}
                          >
                            <label className="form-label">Select Employee Name</label>
                            <Select
                              options={employes}
                              onChange={handleEmployeeChange}
                              placeholder="Select Employee Name"
                            />
                          </div>
                          <div style={{ marginTop: "27px" }}>
                            <div className="mt-3 ml-3" style={{ marginLeft: "20px" }}>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleGoClick}
                              >
                                Go
                              </button>
                            </div>
                          </div>
                        </div>
                        {message && <div className="errorMsg mt-2" style={{ marginLeft: '10px' }}>{message}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </LayOut>
  );
};

export default EmployeeSalaryStructure; 