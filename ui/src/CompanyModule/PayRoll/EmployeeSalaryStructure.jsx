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
import { Button, Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";

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
  const [basicSalary, setBasicSalary] = useState(0); // State for Basic Salary
  const [allowances, setAllowances] = useState({});
  const [deductions, setDeductions] = useState({});
  const [updatedDeductions, setUpdatedDeductions] = useState({});
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
  const [showPfModal, setShowPfModal] = useState(false); // Modal visibility
  const [selectedPF, setSelectedPF] = useState('calculated'); 
  const [calculatedPF, setCalculatedPF] = useState({ pfEmployee: 0, pfEmployer: 0 });
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

  useEffect(() => {
    const fetchSalaryStructures = async () => {
      try {
        const response = await CompanySalaryStructureGetApi();
        const allSalaryStructures = response.data.data;

        if (allSalaryStructures.length === 0) {
          setErrorMessage("Company Salary Structure is not defined");
        } else {
          const activeSalaryStructures = allSalaryStructures.filter(
            (structure) => structure.status === "Active"
          );

          if (activeSalaryStructures.length > 0) {
            const firstStructure = activeSalaryStructures[0];
            setAllowances(firstStructure.allowances);
            setDeductions(firstStructure.deductions);
           // Extract Basic Salary and HRA from the allowances
           const basicAllowance = firstStructure.allowances.find(
            (allowance) => allowance.type === "Basic"
          );
          const hraAllowance = firstStructure.allowances.find(
            (allowance) => allowance.type === "HRA"
          );
          setBasicSalary(basicAllowance ? basicAllowance.amount : 0);
          setHra(hraAllowance ? hraAllowance.amount : 0);
            setErrorMessage(""); // Clear error if salary structures are found
            console.log("deductions",firstStructure.deductions)
            console.log("allowances",firstStructure.allowances)

          } else {
            setErrorMessage("No active salary structure found");
          }
        }
      } catch (error) {
        setErrorMessage("Error fetching salary structures.");
        console.error("API fetch error:", error);
      }
    };

    fetchSalaryStructures();
  }, []);
 
  const calculateTotalAllowances = () => {
    let totalAllowances = 0;
    // Calculate other allowances (travel, provident fund, etc.)
    Object.entries(allowances).forEach(([key, value]) => {
      if (key !== "HRA" && key !== "Basic Salary") {
        if (value.includes("%")) {
          const percentageValue = parseFloat(value.replace("%", ""));
          if (key === "Provident Fund Employer") {
            totalAllowances += (percentageValue / 100) * grossAmount;
          } else {
            totalAllowances += (percentageValue / 100) * grossAmount;
          }
        } else {
          totalAllowances += parseFloat(value);
        }
      }
    });

    setTotalAllowances(totalAllowances);
  };

  useEffect(() => {
    calculateAllowances();
  }, [allowances, basicSalary, grossAmount]);
       
  
  const calculatePFContributions = () => {
    const basicSalaryPercentage = parseFloat(allowances["Basic Salary"]) || 0; // Basic Salary percentage
    const pfEmployeePercentage = parseFloat(deductions["Provident Fund Employee"]) || 0; // Employee PF percentage
    const pfEmployerPercentage = parseFloat(deductions["Provident Fund Employer"]) || 0; // Employer PF percentage

    // Calculate Basic Salary Amount from the gross salary
    const basicSalaryAmount = (basicSalaryPercentage / 100) * grossAmount;

    // Calculate PF Contributions
    const pfEmployee = (pfEmployeePercentage / 100) * basicSalaryAmount;
    const pfEmployer = (pfEmployerPercentage / 100) * basicSalaryAmount;
    return {
      pfEmployee,
      pfEmployer,
    };
  };

  // Function to handle PF limit check and show the modal
  const handlePFLimitCheck = () => {
    const { pfEmployee, pfEmployer } = calculatePFContributions();
    const totalPF = pfEmployee + pfEmployer;

    setCalculatedPF({ pfEmployee, pfEmployer }); // Set calculated PF values

    // Case: If total PF exceeds ₹43,200 per year or is less than ₹43,200
    if (totalPF !== 43200) {
    } else {
      // If total PF is exactly ₹43,200 per year, no confirmation needed
      updateDeductions(43200 /2, 43200 /2); // Use fixed PF values of ₹43,200 per year (monthly)
    }
  };

  // Update the deductions with PF values
  const updateDeductions = (pfEmployee, pfEmployer) => {
    const newDeductions = {
      ...deductions,
      "Provident Fund Employee": pfEmployee.toFixed(2),
      "Provident Fund Employer": pfEmployer.toFixed(2),
    };
    setUpdatedDeductions(newDeductions); // Save the updated deductions in state
  };

  // Handle modal close and update PF values based on selection
  const handleModalClose = () => {
    const { pfEmployee, pfEmployer } = calculatedPF;
   
    if (selectedPF === 'calculated') {
      updateDeductions(pfEmployee, pfEmployer); // Use calculated PF
    } else {
      const fixedPF = 43200 /2; // Use ₹43,200 per year
      updateDeductions(fixedPF, fixedPF); // Set fixed PF
    }
    setShowPfModal(false); // Close the modal
  };

  // Function to calculate the total deductions including PF
  const calculateTotalDeductions = () => {
    let total = 0;

    // Loop through the updated deductions
    Object.entries(updatedDeductions).forEach(([key, value]) => {
      if (typeof value === "string" && value.endsWith("%")) {
        const percentageValue = parseFloat(value.slice(0, -1)); // Remove '%' and parse as number
        total += (percentageValue / 100) * grossAmount; // Apply percentage to gross amount
      } else {
        total += parseFloat(value) || 0; // Add fixed deduction amount
      }
    });

    return isNaN(total) ? 0 : total;
  };

  useEffect(() => {
    handlePFLimitCheck(); // Trigger the PF limit check on initial load or relevant updates
  }, [grossAmount, allowances, deductions]);
  
  const handleAllowanceChange = (key, newValue) => {
    let validValue = newValue;
    const isPercentage = newValue.includes("%");
    let errorMessage = "";
  
    // Check for non-numeric characters (excluding the '%' symbol)
    if (!isPercentage && /[^0-9.-]/.test(newValue)) {
      errorMessage = "Only numeric values are allowed.";
    }
  
    // Handle percentage-specific validation
    if (isPercentage) {
      validValue = newValue.replace(/[^0-9%]/g, '');
      // Limit to 1-2 digits before the '%' symbol
      if (validValue.includes('%')) {
        const digitsBeforePercentage = validValue.split('%')[0].slice(0, 2);
        validValue = digitsBeforePercentage + '%';
      }
  
      if (validValue.length > 4) {
        errorMessage = "Percentage value should have up to 2 digits before '%'.";
      }
    } else {
      if (validValue.length > 10) {
        errorMessage = "Numeric value cannot exceed 10 digits.";
      }
  
      if (parseFloat(validValue) < 0) {
        errorMessage = "Allowance value cannot be negative.";
      }
    }
  
    // Update the allowances state if no errors
    if (!errorMessage) {
      setAllowances((prevAllowances) => ({
        ...prevAllowances,
        [key]: validValue,
      }));
    }
  
    setErrorMessage(errorMessage);
  };
  
  const handleDeductionChange = (key, value) => {
    if (/[a-zA-Z]/.test(value)) {
      setErrorMessage("Alphabetic characters are not allowed.");
      return;
    }
  
    if (value.includes('%')) {
      const numericValue = value.slice(0, -1); // Remove '%' and convert to number
      if (numericValue && parseFloat(numericValue) > 100) {
        setErrorMessage("Percentage value cannot exceed 100%.");
        return;
      }
      const percentageValue = parseFloat(numericValue) / 100;
      setDeductions(prevDeductions => ({
        ...prevDeductions,
        [key]: percentageValue,
      }));
      setErrorMessage("");
      return;
    }
  
    if (!value.endsWith('%')) {
      const numericValue = value.replace(/[^0-9.]/g, "");
      if (numericValue.length > 10) {
        setErrorMessage("Numeric value cannot exceed 10 digits.");
        return;
      }
  
      if (parseFloat(numericValue) < 0) {
        setErrorMessage("Deduction value cannot be negative.");
        return;
      }
  
      setDeductions(prevDeductions => ({
        ...prevDeductions,
        [key]: parseFloat(numericValue),
      }));
      setErrorMessage("");
    }
  };
  
  useEffect(() => {
    const totalAllowances = calculateTotalAllowances(); // Get total allowances
    const newOtherAllowances = grossAmount - totalAllowances; // Calculate the remaining amount for Other Allowances
  
    // If total allowances exceed gross salary, show an error or adjust accordingly
    if (newOtherAllowances < 0) {
      setErrorMessage("Total allowances exceed gross amount. Please adjust allowances.");
      setIsSubmitDisabled(true); // Disable the submit button
    } else {
      setErrorMessage(""); // Clear error message if valid
      setIsSubmitDisabled(false); // Enable the button
    }
  
    // Ensure Other Allowances cannot be negative
    const validOtherAllowances = Math.max(0, newOtherAllowances);
  
    // Update allowances with the new value of Other Allowances
    setAllowances((prevAllowances) => ({
      ...prevAllowances,
      "Other Allowances": validOtherAllowances.toFixed(2),  // Ensure 2 decimal places for consistency
    }));
  
    // Set the total allowances including the valid Other Allowances
    setTotalAllowances(totalAllowances + validOtherAllowances);
  }, [allowances, grossAmount]);
   // Trigger when grossAmount or any allowance changes

useEffect(() => {
  const totalDed = calculateTotalDeductions();

  // Ensure the result is a number before setting it
  if (typeof totalDed === 'number') {
    setTotalDeductions(totalDed); // Store as a number
  } else {
    setTotalDeductions(0); // Default to 0 if totalDed is not a valid number
  }
}, [deductions, grossAmount]);

useEffect(() => {
  // Calculate total allowances and total deductions whenever the gross amount changes
  const totalAllowances = calculateTotalAllowances();
  const totalDeductions = calculateTotalDeductions();

  // Update state
  setTotalAllowances(totalAllowances);
  setTotalDeductions(totalDeductions);

}, [grossAmount, allowances, deductions]); // Ensure dependencies include `grossAmount`, `allowances`, and `deductions`

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
    setShowPfModal(false);
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
  const handleSubmitButtonClick = () => {
    // Calculate total allowances
    const totalAllowances = calculateTotalAllowances();
  
    // Calculate total deductions
    const totalDeductions = calculateTotalDeductions();
  
    // Calculate net salary
    const netSalary = grossAmount + totalAllowances - totalDeductions;
  
    // Set the calculated values to state
    setTotalAllowances(totalAllowances);
    setTotalDeductions(totalDeductions);
    setNetSalary(netSalary);
  
    // Optionally, show any relevant messages
    if (netSalary < 0) {
      setErrorMessage('Net Salary cannot be negative');
    } else {
      setErrorMessage('');
    }
    
    // Check PF limit if necessary
    handlePFLimitCheck();
    setShowPfModal(true);
    setShowCards(true);
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
                            onClick={handleSubmitButtonClick}
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
                                  {Object.entries(allowances).map(([key, value]) => {
                                    const isPercentage = typeof value === 'string' && value.endsWith('%');
                                    let displayValue = value;

                                    if (isPercentage) {
                                      const percentageValue = parseFloat(value.slice(0, -1)); // Extract percentage

                                      // For HRA, use basicSalary; for other allowances, use grossAmount
                                      if (key === "HRA") {
                                        displayValue = (percentageValue / 100) * basicSalary; // Calculate based on basicSalary
                                      } else {
                                        displayValue = (percentageValue / 100) * grossAmount; // Calculate based on grossAmount
                                      }
                                    } else if (!isNaN(parseFloat(value))) {
                                      // If it's a fixed allowance (like Travel Allowance), just use the numeric value
                                      displayValue = parseFloat(value);
                                    }

                                    // Ensure displayValue is a number, and avoid displaying NaN
                                    if (isNaN(displayValue)) {
                                      displayValue = 0;
                                    }

                                    return (
                                      <div key={key} className="mb-3">
                                        <label>{key}</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          value={displayValue} // Display the actual value
                                          onChange={(e) => handleAllowanceChange(key, e.target.value)} // Handle change
                                        />
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
                                 {errorMessage && (
                                  <p className="text-danger">{errorMessage}</p>
                                )}
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
                            {Object.entries(updatedDeductions).map(([key, value]) => {
                                let displayValue = value;
                                // If the deduction is a percentage, apply it to the gross amount
                                if (typeof value === "number" && value < 1) {
                                  displayValue = value * grossAmount;
                                }

                                return (
                                  <div key={key} className="mb-3">
                                    <label>{key}</label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      value={displayValue} // Display the value (either percentage or calculated value)
                                      onChange={(e) => handleDeductionChange(key, e.target.value)} // Handle change
                                    />
                                  </div>
                                );
                              })}
                           <div className="mb-3">
                              <label>Total Deductions</label>
                              <input
                                className="form-control"
                                type="number"
                                value={totalDeductions.toFixed(2)} // Format as string here
                                readOnly
                                data-toggle="tooltip"
                                title="This is the total of all deductions."
                              />
                                {errorMessage && <p className="text-danger">{errorMessage}</p>}
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
        <Modal show={showPfModal} onHide={() => setShowPfModal(false)} centered style={{ zIndex: '1050' }} className="custom-modal">
        <ModalHeader closeButton >
          <ModalTitle className="text-center">Confirm Provident Fund Option</ModalTitle>
        </ModalHeader>
        <ModalBody className="text-center fs-bold">
          <p>
            The Total Provident Fund is ₹{calculatedPF.pfEmployee + calculatedPF.pfEmployer}. 
            Please choose your preferred option:
          </p>
          <div className="d-flex align-items-center mb-3">
  <input
    className="form-check-input me-2"
    type="radio"
    name="pfOption"
    value="calculated"
    checked={selectedPF === 'calculated'}
    onChange={() => setSelectedPF('calculated')}
  />
  <label className="mb-0">
  Use Calculated PF:  ₹{calculatedPF.pfEmployee + calculatedPF.pfEmployer} per year
  </label>
</div>

<div className="d-flex align-items-center mb-3">
  <input
    className="form-check-input me-2"
    type="radio"
    name="pfOption"
    value="fixed"
    checked={selectedPF === 'fixed'}
    onChange={() => setSelectedPF('fixed')}

  />
  <label className="mb-0 ml-2">
  Use Calculated PF: ₹43,200 per year  
  <span
    className="d-inline-block" 
    data-bs-toggle="tooltip" 
    data-bs-placement="top"
    title="₹43,200 is the standard PF for an employee (₹3,600 per month)"
  >
    <i className="bi bi-info-circle text-primary"></i> {/* Info icon from Bootstrap Icons */}
  </span>
  </label>
</div>
        </ModalBody>
        <div className="text-center">
          <Button variant="primary ml-2" onClick={handleModalClose}>Confirm</Button>
          <Button variant="secondary" onClick={() => setShowPfModal(false)}>Cancel</Button>
        </div>
      </Modal>
      </div>
    </LayOut>
  );
};

export default EmployeeSalaryStructure;
