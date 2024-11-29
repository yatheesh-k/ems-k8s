import React, { useState, useEffect } from "react";
import Select from "react-select";
import LayOut from "../../LayOut/LayOut";
import {
  EmployeeGetApi,
  EmployeeSalaryPostApi,
  EmployeeSalaryGetApiById,
  EmployeeSalaryPatchApiById,
  CompanySalaryStructureGetApi,
} from "../../Utils/Axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useAuth } from "../../Context/AuthContext";
import Loader from "../../Utils/Loader";

const EmployeeSalaryStructure = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const { user } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const salaryId = queryParams.get("salaryId");
  const id = queryParams.get("employeeId");

  const [employes, setEmployes] = useState([]);
  const [salaryStructure, setSalaryStructure] = useState(0);
  const [allowances, setAllowances] = useState({});
  const [deductions, setDeductions] = useState({});
  const [grossAmount, setGrossAmount] = useState(0);
  const [totalAllowances, setTotalAllowances] = useState({});
  const [totalDeductions, setTotalDeductions] = useState({});
  const [netSalary, setNetSalary] = useState(0);
  const [hra, setHra] = useState(0);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [lossOfPayPerDay, setLossOfPayPerDay] = useState(0);
  const [showFields, setShowFields] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [variableAmount, setVariableAmount] = useState(0);
  const [fixedAmount, setFixedAmount] = useState(0);
  const [pfTax, setPfTax] = useState(0);
  const [pfEmployee, setPfEmployee] = useState(0);
  const [pfEmployer, setPfEmployer] = useState(0);
  const [travelAllowance, setTravelAllowance] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Active");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [showCards, setShowCards] = useState(false);
  const [loading, setLoading] = useState(false);
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
            setStatus(data.status || "");
            setValue("status", data.status || "");
            setShowFields(true);
            setShowCards(true);
            setIsUpdating(true);
            setIsReadOnly(data.status === "InActive");
            calculateAllowances();
          }
        })
        .catch((error) => {
          handleApiErrors(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setShowCards(false);
    }
  }, [id, salaryId, setValue]);

  // useEffect(() => {
  //   const fetchSalaryStructures = async () => {
  //     try {
  //       const response = await CompanySalaryStructureGetApi();
  //       const allSalaryStructures = response.data.data;
  //       const activeSalaryStructures = allSalaryStructures.filter(structure => structure.status === "Active");

  //       if (activeSalaryStructures.length > 0) {
  //         setSalaryStructure(activeSalaryStructures);
  //         setAllowances(activeSalaryStructures[0].allowances);
  //         setDeductions(activeSalaryStructures[0].deductions);
  //       }
  //     } catch (error) {
  //       console.error("API fetch error:", error);
  //       setError('Error fetching salary structures.');
  //     }
  //   };

  //   fetchSalaryStructures();
  // }, []);

  useEffect(() => {
    const fetchSalaryStructures = async () => {
      try {
        const response = await CompanySalaryStructureGetApi();
        const allSalaryStructures = response.data.data;

        if (allSalaryStructures.length === 0) {
          setError("Company Salary Structure is not defined");
          setSalaryStructure([]);
        } else {
          const activeSalaryStructures = allSalaryStructures.filter(
            (structure) => structure.status === "Active"
          );

          if (activeSalaryStructures.length > 0) {
            setSalaryStructure(activeSalaryStructures);
            setAllowances(activeSalaryStructures[0].allowances);
            setDeductions(activeSalaryStructures[0].deductions);
            setError(""); // Clear error if salary structures are found
          } else {
            setError("No active salary structure found");
          }
        }
      } catch (error) {
        setError("Error fetching salary structures.");
        console.error("API fetch error:", error);
      }
    };

    fetchSalaryStructures();
  }, []);

  const calculateTotalDeductions = () => {
    let total = 0;
    Object.entries(deductions).forEach(([key, value]) => {
      if (value.endsWith("%")) {
        const parsedValue = parseFloat(value.slice(0, -1));
        const percentageValue = (parsedValue / 100) * (grossAmount || 0);
        total += percentageValue;
      } else {
        total += parseFloat(value) || 0;
      }
    });
    return total;
  };

  const calculateTotalAllowances = () => {
    let total = 0;
    Object.entries(allowances).forEach(([key, value]) => {
      if (key !== "otherAllowances") {
        if (value.endsWith("%")) {
          const parsedValue = parseFloat(value.slice(0, -1));
          const percentageValue = (parsedValue / 100) * (grossAmount || 0);
          total += percentageValue;
        } else {
          total += parseFloat(value) || 0;
        }
      }
    });
    return total;
  };

  const handleAllowanceChange = (key, newValue) => {
    let validValue = newValue;

    // Check if the value is a percentage
    const isPercentage = newValue.includes("%");

    // Handle percentage-specific validation
    if (isPercentage) {
      // Remove any non-numeric characters except for '%'
      validValue = newValue.replace(/[^0-9%]/g, '');

      // Limit to 1-2 digits before the '%' symbol
      if (validValue.includes('%')) {
        const digitsBeforePercentage = validValue.split('%')[0].slice(0, 2);
        validValue = digitsBeforePercentage + '%';
      }

      // If more than 3 characters (e.g., "100%"), show an error message
      if (validValue.length > 4) {
        setErrorMessage("Percentage value should have up to 2 digits before '%'.");
        return;
      }
    } else {
      // For numeric fields, allow only digits and check for validity
      if (validValue.length > 10) {
        setErrorMessage("Numeric value cannot exceed 10 digits.");
        return;
      }

      // Allow negative values and zero (if needed)
      if (parseFloat(validValue) < 0) {
        setErrorMessage("Allowance value cannot be negative.");
        return;
      }

      setErrorMessage(""); // Clear error if valid
    }

    // Update the allowances state with the validated value
    setAllowances((prevAllowances) => ({
      ...prevAllowances,
      [key]: validValue,
    }));
  };


  const handleInputChange = (key, e) => {
    let newValue = e.target.value;

    // If the value contains '%' (percentage), we ensure no extra characters after it
    if (newValue.includes("%")) {
      // If length exceeds 4 (e.g., "100%"), truncate to the first 4 characters
      if (newValue.length > 4) {
        newValue = newValue.slice(0, 4); // Limit to 3 digits + '%'
      }

      // Ensure only digits before the '%' symbol
      const validPercentageValue =
        newValue.slice(0, -1).replace(/[^0-9]/g, "") + "%";
      newValue = validPercentageValue; // Update with the valid percentage format
    } else {
      // If it's a number (no '%'), restrict to a maximum of 10 digits
      if (newValue.length > 10) {
        newValue = newValue.slice(0, 10); // Limit to 10 digits
      }

      // Allow only numeric values (remove any non-numeric characters)
      newValue = newValue.replace(/[^0-9]/g, "");
    }

    // Clear the error message if the input is valid
    setErrorMessage("");

    // Call the validation and update logic
    handleAllowanceChange(key, newValue);
  };

  // const handleKeyDown = (e, key) => {
  //   if (e.key === 'Backspace') {
  //     let newValue = allowances[key];

  //     // If value contains '%' and we're deleting a digit before it
  //     if (newValue.includes('%')) {
  //       const valueBeforePercent = newValue.slice(0, -1); // Remove '%'
  //       if (valueBeforePercent.length > 0) {
  //         // Allow the deletion of one character at a time before '%'
  //         newValue = valueBeforePercent.slice(0, -1) + '%';
  //       }
  //     }

  //     // If we're trying to clear everything before '%'
  //     if (newValue.slice(0, -1) === '') {
  //       newValue = '';
  //     }

  //     // Update the allowances with the new value
  //     setAllowances((prev) => ({
  //       ...prev,
  //       [key]: newValue,
  //     }));

  //     // Prevent default behavior to avoid unwanted deletion
  //     e.preventDefault();
  //   }
  // };

  useEffect(() => {
    const totalAllow = calculateTotalAllowances();
    const newOtherAllowances = grossAmount - totalAllow;
    // Check for errors
    if (newOtherAllowances < 0) {
      setErrorMessage(
        "Total allowances exceed gross amount. Please adjust allowances."
      );
      setIsSubmitDisabled(true); // Disable the button
    } else {
      setErrorMessage(""); // Clear error message if valid
      setIsSubmitDisabled(false); // Enable the button
    }

    // Update total allowances
    const validOtherAllowances = Math.max(0, newOtherAllowances);
    setTotalAllowances(totalAllow + validOtherAllowances);

    setAllowances((prevAllowances) => ({
      ...prevAllowances,
      otherAllowances: validOtherAllowances.toFixed(2),
    }));
  }, [allowances, grossAmount]);

  const handleDeductionChange = (key, value) => {
    if (value.endsWith("%")) {
      const numericValue = value.slice(0, -1); // Remove '%' symbol to check numeric value
      if (numericValue && parseFloat(numericValue) > 100) {
        setErrorMessage("Percentage value cannot exceed 100%.");
        return; // Prevent the change if the value exceeds 100%
      }
      if (value.length > 4) {
        setErrorMessage(
          "Percentage value cannot exceed 4 characters (including '%')."
        );
        return; // Prevent the change if the length exceeds 4 characters (like 100%)
      }
      // Check for negative percentage values
      if (numericValue.startsWith("-")) {
        setErrorMessage("Percentage value cannot be negative.");
        return; // Prevent the change if the value is negative
      }
    }
    // Validation for number-related fields (maximum 10 digits)
    if (!value.endsWith("%")) {
      const numericValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      if (numericValue.length > 10) {
        setErrorMessage("Numeric value cannot exceed 10 digits.");
        return; // Prevent further input if the length exceeds 10 digits
      }
      if (parseFloat(value) < 0) {
        setErrorMessage("Deduction value cannot be negative.");
        return; // Prevent deduction if value is negative
      }
    }
    setErrorMessage("");

    const newDeductions = { ...deductions, [key]: value };
    setDeductions(newDeductions);
  };

  useEffect(() => {
    const totalDed = calculateTotalDeductions();
    setTotalDeductions(totalDed);
  }, [deductions, grossAmount]);

  //Calculate total allowances when allowances or grossAmount change
  useEffect(() => {
    const totalAllow = calculateTotalAllowances();
    const newOtherAllowances = grossAmount - totalAllow;

    // Check for errors and set the error message accordingly
    if (newOtherAllowances < 0) {
      setErrorMessage(
        "Total allowances exceed gross amount. Please adjust allowances."
      );
    } else {
      setErrorMessage(""); // Clear error message if valid
    }

    // Update total allowances only if valid
    const validOtherAllowances = Math.max(0, newOtherAllowances);
    setTotalAllowances(totalAllow + validOtherAllowances);

    // Update other allowances
    setAllowances((prevAllowances) => ({
      ...prevAllowances,
      otherAllowances: validOtherAllowances.toFixed(2),
    }));
  }, [allowances, grossAmount]);

  const calculateAllowances = () => {
    calculateTotalAllowances();
    calculateTotalDeductions();
    setShowCards(true);
  };

  const calculateNetSalary = () => {
    const net = totalAllowances - totalDeductions;
    setNetSalary(net);
  };

  useEffect(() => {
    calculateNetSalary();
  }, [totalAllowances, totalDeductions]);

  useEffect(() => {
    if (salaryId && id) {
      setValue("variableAmount", variableAmount);
      setValue("fixedAmount", fixedAmount);
      setValue("hra", hra);
      setValue("travelAllowance", travelAllowance);
      setValue("pfEmployee", pfEmployee);
      setValue("pfEmployer", pfEmployer);
      // Update other values as necessary
    }
  }, [
    variableAmount,
    fixedAmount,
    hra,
    travelAllowance,
    pfEmployee,
    pfEmployer,
    salaryId,
    id,
    setValue,
  ]);

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

  const handleGoClick = () => {
    if (!employeeId) {
      setMessage("Please Select Employee Name");
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
    // Check if there's an error related to salary structures
    if (error) {
      toast.error(error); // Display the error message using toast
      return; // Exit if there's an error
    }

    // If no error, proceed with the form submission logic
    const fixedAmount = parseFloat(data.fixedAmount) || 0;
    const variableAmount = parseFloat(data.variableAmount) || 0;
    const grossAmountValue = parseFloat(grossAmount) || 0;
    const totalEarningsValue = parseFloat(totalAllowances) || 0;
    const netSalaryValue = parseFloat(netSalary) || 0;
    const totalDeductionsValue = parseFloat(totalDeductions) || 0;
    const pfTaxValue = parseFloat(pfTax) || 0;
    const incomeTax = data.incomeTax;
    const statusValue = data.status;

    // Check if variableAmount, fixedAmount, and grossAmount are all 0
    if (variableAmount === 0 && fixedAmount === 0 && grossAmountValue === 0) {
      return; // Exit if all amounts are zero
    }

    // Construct the allowances and deductions objects
    const allowancesData = {};
    const deductionsData = {};

    Object.entries(allowances).forEach(([key, value]) => {
      allowancesData[key] = value;
    });

    Object.entries(deductions).forEach(([key, value]) => {
      deductionsData[key] = value;
    });

    const dataToSubmit = {
      companyName: companyName,
      fixedAmount: fixedAmount.toFixed(2),
      variableAmount: variableAmount.toFixed(2),
      grossAmount: grossAmountValue.toFixed(2),
      salaryConfigurationEntity: {
        allowances: allowancesData,
        deductions: deductionsData,
      },
      totalEarnings: totalEarningsValue.toFixed(2),
      netSalary: netSalaryValue.toFixed(2),
      totalDeductions: totalDeductionsValue.toFixed(2),
      pfTax: pfTaxValue.toFixed(2),
      incomeTax: incomeTax,
      status: statusValue,
    };
    const apiCall = salaryId
      ? () => EmployeeSalaryPatchApiById(employeeId, salaryId, dataToSubmit)
      : () => EmployeeSalaryPostApi(employeeId, dataToSubmit);

    apiCall()
      .then((response) => {
        toast.success(
          salaryId
            ? "Employee Salary Updated Successfully"
            : "Employee Salary Added Successfully"
        );
        setError(""); // Clear error message on success
        setShowFields(false);
        navigate("/employeeview");
      })
      .catch((error) => {
        handleApiErrors(error);
      });
  };

  const clearForm = () => {
    reset();
    setShowFields(false);
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
            <div className="col-auto" style={{ paddingBottom: "20px" }}>
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
                      <h5 className="card-title" style={{ marginBottom: "0px" }}> Salary Details </h5>
                    </div>
                    <div className="card-body" style={{ marginLeft: "20px" }}>
                      <div className="row">
                        <div className="col-md-5 mb-3">
                          <label className="form-label">Variable Amount</label>
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
                              maxLength: {
                                value: 10,
                                message: "Maximum 10 Numbers Allowed",
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
                          <label className="form-label">
                            Fixed Amount<span style={{ color: "red" }}>*</span>
                          </label>
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
                                message: "Minimum 5 Numbers Required",
                              },
                              maxLength: {
                                value: 10,
                                message: "Maximum 10 Numbers Allowed",
                              },
                              validate: {
                                notZero: (value) =>
                                  value !== "0" || "Value cannot be 0",
                              },
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
                          <label className="form-label">
                            Gross Amount<span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            value={grossAmount}
                            onChange={(e) =>
                              setGrossAmount(parseFloat(e.target.value))
                            }
                            readOnly
                          />
                        </div>
                        <div className="col-md-1 mb-3"></div>
                        <div className="col-md-5 mb-3">
                          <label className="form-label">
                            Monthly Salary
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={monthlySalary}
                            readOnly
                          />
                        </div>
                        <div className="col-12 text-end mt-2">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={calculateAllowances}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {loading ? (
                  <Loader /> // Show loader while loading
                ) : (
                  showCards && (
                    <>
                      <div className="row col-lg-12 d-flex">
                        <div className="col-6 mb-4">
                          <div className="card">
                            <div className="card-header">
                              <h5 className="card-title" style={{ marginBottom: "0px" }}>Allowances</h5>
                            </div>
                            <div className="card-body">
                              {errorMessage && (
                                <span className="text-danger m-2 text-center">
                                  {errorMessage}
                                </span>
                              )}
                            {Object.keys(allowances).map((key) => {
        const allowanceValue = allowances[key];
        const isPercentage = allowanceValue.includes("%");
        let displayValue = allowanceValue;

        // For numeric fields, we display them as whole numbers
        if (!isPercentage) {
          displayValue = Math.floor(allowanceValue);
        }

        return (
          <div key={key} className="mb-2">
            <label className="form-label">
              {key}:
              <span className="text-danger me-1">
                ({allowanceValue})
              </span>
              {isPercentage && (
                <span
                  className="m-1"
                  data-toggle="tooltip"
                  title="Percentage values are calculated based on Gross Amount."
                >
                  <span className="text-primary">
                    <i className="bi bi-info-circle"></i>
                  </span>
                </span>
              )}
            </label>
            <input
              type="text"
              className="form-control"
              value={allowanceValue}
              onChange={(e) => handleAllowanceChange(key, e.target.value)}
              maxLength={isPercentage ? 4 : 10}
            />
            {errorMessage && (
              <p className="text-danger">{errorMessage}</p>
            )}
          </div>
        );
      })}
                              <div className="mb-3">
                                <label>Total Allowances:</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="totalAllowance"
                                  value={totalAllowances}
                                  readOnly
                                  data-toggle="tooltip"
                                  title="This is the total of all allowances."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="card">
                            <div className="card-header">
                              <div className="d-flex justify-content-start align-items-start">
                                <h5 className="card-title me-2" style={{ marginBottom: "0px" }}>Status</h5>
                                <span className="text-danger">
                                  {errors.status && (
                                    <p className="mb-0">
                                      {errors.status.message}
                                    </p>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-12 col-md-6 col-lg-5 mb-3">
                                  <label>
                                    <input
                                      type="radio"
                                      name="status"
                                      defaultChecked
                                      value="Active"
                                      style={{ marginRight: "10px" }}
                                      {...register("status", {
                                        required: "Please Select Status",
                                      })}
                                    />
                                    Active
                                  </label>
                                </div>
                                <div className="col-lg-1"></div>
                                <div className="col-12 col-md-6 col-lg-5 mb-3">
                                  <label>
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

                        {/* Deductions Card */}
                        <div className="col-6 mb-4">
                          <div className="card">
                            <div className="card-header">
                              <h5 className="card-title" style={{ marginBottom: "0px" }}>Deductions</h5>
                            </div>
                            <div className="card-body">
                              {Object.entries(deductions).map(
                                ([key, value]) => (
                                  <div key={key} className="mb-3">
                                    <label>
                                      {key}:
                                      <span className="text-danger">
                                        ({deductions[key]})
                                      </span>
                                      {deductions[key].endsWith("%") && (
                                        <span
                                          className="m-1"
                                          data-toggle="tooltip"
                                          title="Percentage values are calculated based on Gross Amount."
                                        >
                                          <span className="text-primary">
                                            <i className="bi bi-info-circle"></i>
                                          </span>
                                        </span>
                                      )}
                                    </label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      maxLength={10}
                                      value={deductions[key]}
                                      onChange={(e) => {
                                        // Allow only numbers and '%' characters
                                        const newValue = e.target.value.replace(
                                          /[^0-9%]/g,
                                          ""
                                        );
                                        handleDeductionChange(key, newValue);
                                      }}
                                    />
                                  </div>
                                )
                              )}
                              <div className="mb-3">
                                <label>Total Deductions</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  value={totalDeductions.toFixed(2)}
                                  readOnly
                                  data-toggle="tooltip"
                                  title="This is the total of all deductions."
                                />
                              </div>
                            </div>
                          </div>
                          <div className="card">
                            <div className="card-header ">
                              <div className="d-flex justify-content-start align-items-start">
                                <h5 className="card-title me-2" style={{ marginBottom: "0px" }}>TDS</h5>
                                <span className="text-danger">
                                  {errors.incomeTax && (
                                    <p className="mb-0">
                                      {errors.incomeTax.message}
                                    </p>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-12 col-md-6 col-lg-5 mb-3">
                                  <label>
                                    <input
                                      type="radio"
                                      name="incomeTax"
                                      value="old"
                                      style={{ marginRight: "10px" }}
                                      {...register("incomeTax", {
                                        required: "Please Select Tax",
                                      })}
                                    />
                                    Old Regime
                                  </label>
                                </div>
                                <div className="col-lg-1"></div>
                                <div className="col-12 col-md-6 col-lg-5 mb-3">
                                  <label>
                                    <input
                                      type="radio"
                                      name="incomeTax"
                                      value="new"
                                      defaultChecked
                                      style={{ marginRight: "10px" }}
                                      {...register("incomeTax", {
                                        required: "Please Select Tax",
                                      })}
                                    />
                                    New Regime
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="card">
                            <div className="card-header">
                              <h5 className="card-title" style={{ marginBottom: "0px" }}>Net Salary</h5>
                            </div>
                            <div className="card-body" style={{ paddingLeft: "20px" }}>
                              <div className="mb-3">
                                <label>Net Salary</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="netSalary"
                                  value={netSalary.toFixed(2)}
                                  readOnly
                                  data-toggle="tooltip"
                                  title="This is the final salary after all deductions and allowances."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="text-end">
                            <button
                              className="btn btn-secondary me-2"
                              onClick={clearForm}
                            >
                              Close
                            </button>
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={!!errorMessage}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                      {error && (
                        <div
                          className="error-message"
                          style={{
                            color: "red",
                            marginBottom: "10px",
                            textAlign: "center",
                          }}
                        >
                          <b>{error}</b>
                        </div>
                      )}
                    </>
                  )
                )}
              </>
            ) : (
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title" style={{ marginBottom: "0px" }}>
                      Employee Details
                    </h5>
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
                            <label className="form-label">
                              Select Employee Name
                            </label>
                            <Select
                              options={employes}
                              onChange={handleEmployeeChange}
                              placeholder="Select Employee Name"
                            />
                          </div>
                          <div style={{ marginTop: "27px" }}>
                            <div
                              className="mt-3 ml-3"
                              style={{ marginLeft: "20px" }}
                            >
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
                        {message && (
                          <div
                            className="errorMsg mt-2"
                            style={{ marginLeft: "10px" }}
                          >
                            {message}
                          </div>
                        )}
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
