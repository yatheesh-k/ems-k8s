import React, { useState, useEffect } from "react";
import Select from "react-select";
import LayOut from "../../LayOut/LayOut";
import {
  EmployeeSalaryGetApiById,
  EmployeeSalaryPatchApiById,
} from "../../Utils/Axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../Context/AuthContext";

const EmployeeSalaryUpdate = () => {
  const {
    register,
    control,
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
  const [totalTax, setTotalTax] = useState("");
  const [employes, setEmployes] = useState([]);
  const [salaryStructure, setSalaryStructure] = useState(0);
  const [allowances, setAllowances] = useState({});
  const [incomeTax, setIncomeTax] = useState(0);
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
    if (id && salaryId) {
      // Fetch employee salary data first
      EmployeeSalaryGetApiById(id, salaryId)
        .then((response) => {
          const data = response.data.data;

          // Handle the employee salary details
          if (data) {
            setEmployeeId(data.employeeId);
            setFixedAmount(parseFloat(data.fixedAmount));
            setVariableAmount(parseFloat(data.variableAmount));
            setGrossAmount(parseFloat(data.grossAmount));
            setPfTax(parseFloat(data.pfTax));
            setIncomeTax(parseFloat(data.incomeTax));
            setStatus(data.status || "");
            setValue("status", data.status || "");
            setShowFields(true);
            setShowCards(true);
            setIsUpdating(true);
            setIsReadOnly(data.status === "InActive"); // Disable fields if salary status is InActive
            calculateAllowances(); // Custom function to calculate allowances, if needed
          }

          // Now, fetch salary structures using the salaryId
          return EmployeeSalaryGetApiById(id, salaryId); // Reuse the same API or make a new call as needed
        })
        .then((response) => {
          const salaryData = response?.data?.data;

          // Log the API response structure for debugging
          console.log("API Response for Salary Structure:", response);

          // Ensure that the salary data exists and has the necessary structure
          if (!salaryData || typeof salaryData !== "object" || Object.keys(salaryData).length === 0) {
            setError("Employee Salary Structure is not defined");
            setSalaryStructure([]); // Clear salary structure if data is invalid
            return; // Exit early to avoid further errors
          }

          // Extract allowances and deductions from the response
          const { salaryConfigurationEntity, status } = salaryData;
          const { allowances, deductions } = salaryConfigurationEntity;

          // Ensure that the status is "Active" before processing
          if (status === "Active") {
            setSalaryStructure([salaryData]); // Set the salary structure
            setAllowances(allowances);         // Set the allowances
            setDeductions(deductions);         // Set the deductions
            setError("");                      // Clear error if everything is valid
          } else {
            setError("Employee Salary Structure is not active");
          }
        })
        .catch((error) => {
          setError("Error fetching employee salary data.");
          console.error("API fetch error:", error); // Log the error for debugging
        })
        .finally(() => {
          setLoading(false); // Set loading to false after the fetch is complete
        });
    } else {
      setShowCards(false); // If id or salaryId is not present, hide the cards
    }
  }, [id, salaryId, setValue]); // Dependencies: re-run effect when `id` or `salaryId` changes

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

  const handleDeductionChange = (key, newValue) => {
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

      // Ensure that the percentage does not exceed 100%
      const numericValue = parseFloat(validValue.slice(0, -1)); // Remove '%' and parse the number
      if (numericValue > 100) {
        setErrorMessage("Percentage value cannot exceed 100%.");
        return;
      }
    } else {
      // For numeric fields, allow only digits and check for validity
      // Remove any non-numeric characters (except for the minus sign if negative)
      validValue = validValue.replace(/[^0-9.-]/g, '');

      // Ensure that the numeric value does not exceed 10 digits
      if (validValue.length > 10) {
        setErrorMessage("Numeric value cannot exceed 10 digits.");
        return;
      }

      // Check for negative values if they are not allowed
      if (parseFloat(validValue) < 0) {
        setErrorMessage("Deduction value cannot be negative.");
        return;
      }

      // Ensure it's a valid number
      if (isNaN(parseFloat(validValue))) {
        setErrorMessage("Invalid numeric value.");
        return;
      }
    }

    // Clear any existing error message if the input is valid
    setErrorMessage("");

    // Update the deductions state with the validated value
    setDeductions((prevDeductions) => ({
      ...prevDeductions,
      [key]: validValue,
    }));
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
    const net = totalAllowances - (totalDeductions + totalTax);
    setNetSalary(net);
  };

  useEffect(() => {
    calculateNetSalary();
  }, [totalAllowances, totalDeductions, totalTax]);

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
      salaryConfigurationRequest: {
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
    const apiCall = () => EmployeeSalaryPatchApiById(employeeId, salaryId, dataToSubmit);

    apiCall()
      .then((response) => {
        toast.success("Employee Salary Updated Successfully");
        setError(""); // Clear error message on success
        setShowFields(false);
        navigate("/employeeview");
      })
      .catch((error) => {
        handleApiErrors(error);
      });
  };

  const handlePfTaxChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setPfTax(value);
  };

  // Handle changes for Income tax
  const handleIncomeTaxChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setIncomeTax(value);
  };

  useEffect(() => {
    calculateTotalTax();
  }, [pfTax, incomeTax]);

  const calculateTotalTax = () => {
    const newTotalTax = pfTax + incomeTax;
    setTotalTax(newTotalTax);
  };

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
            <div className="col">
              <h1 className="h3 mb-3">
                <strong>Salary View</strong>
              </h1>
            </div>
            <div className="col-auto" style={{ paddingBottom: "20px" }}>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="/main">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Payroll</li>
                  <li className="breadcrumb-item active">Salary View</li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="row">
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
                        readOnly
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
                        value={variableAmount}
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
                        readOnly
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
                        value={fixedAmount}
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
                  </div>
                </div>
              </div>
            </div>
            <div className="row col-lg-12 d-flex">
              <div className="col-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title" style={{ marginBottom: "0px" }}>Allowances</h5>
                  </div>
                  <div className="card-body" style={{ paddingLeft: "20px" }}>
                    {errorMessage && (
                      <span className="text-danger m-2 text-center">
                        {errorMessage}
                      </span>
                    )}
                    {Object.keys(allowances).map((key) => {
                      const allowanceValue = allowances[key];
                      const isPercentage = allowanceValue.includes("%");
                      let displayValue = allowanceValue;

                      // Folr numeric fields, we display them as whole numbers
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
                            // readOnly={isOtherAllowanceReadOnly}
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
                    <h5 className="card-title">Status</h5>

                  </div>
                  <div className="card-body col-12" style={{ paddingLeft: "20px" }}>
                    <label className="form-label">
                      Status<span style={{ color: "red" }}>*</span>
                    </label>
                    <Controller
                      name="status"
                      control={control}
                      defaultValue={status}
                      disabled={status === "InActive"}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={[
                            { value: "Active", label: "Active" },
                            { value: "InActive", label: "InActive" },
                          ]}
                          value={
                            field.value
                              ? {
                                value: field.value,
                                label: ["Active", "InActive"].find(
                                  (option) => option === field.value
                                ),
                              }
                              : null
                          }
                          onChange={(val) => field.onChange(val.value)}
                          placeholder="Select Status"
                        />
                      )}
                    />
                    {errors.status && (
                      <p className="errorMsg">Status is Required</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Deductions Card */}
              <div className="col-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title" style={{ marginBottom: "0px" }}>Deductions</h5>
                  </div>
                  <div className="card-body" style={{ paddingLeft: "20px" }}>
                    {Object.keys(deductions).map((key) => {
                      const deductionValue = deductions[key];
                      const isPercentage = deductionValue.includes("%");
                      let displayValue = deductionValue;

                      // For numeric fields, we display them as whole numbers
                      if (!isPercentage) {
                        displayValue = Math.floor(deductionValue);
                      }

                      return (
                        <div key={key} className="mb-2">
                          <label className="form-label">
                            {key}:
                            <span className="text-danger me-1">
                              ({deductionValue})
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
                            value={deductions[key]}
                            onChange={(e) => handleDeductionChange(key, e.target.value)}
                            maxLength={isPercentage ? 4 : 10}
                          />
                          {errorMessage && <p className="text-danger">{errorMessage}</p>}
                        </div>
                      );
                    })}

                    {/* Total Deductions Section */}
                    <div className="mb-3">
                      <label>Total Deductions</label>
                      <input
                        className="form-control"
                        type="number"
                        value={totalDeductions}
                        readOnly
                        data-toggle="tooltip"
                        title="This is the total of all deductions."
                      />
                    </div>

                    {/* PF Tax Section */}
                    <div className="col-12" style={{ marginTop: "10px" }}>
                      <label className="form-label">PF Tax</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pfTax}
                        maxLength={10}
                        onChange={handlePfTaxChange}
                      />
                    </div>

                    {/* Income Tax Section */}
                    <div className="col-12" style={{ marginTop: "10px" }}>
                      <label className="form-label">Income Tax</label>
                      <input
                        type="text"
                        className="form-control"
                        value={incomeTax}
                        maxLength={10}
                        onChange={handleIncomeTaxChange}
                      />
                    </div>

                    {/* Total Tax Section */}
                    <div className="col-12" style={{ marginTop: "10px" }}>
                      <label className="form-label">
                        Total Tax
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={totalTax}
                        readOnly
                      />
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
                    type="submit"
                    className="btn btn-danger"
                    disabled={!!errorMessage}
                  >
                    Update
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
          </div>
        </form>
      </div >
    </LayOut >
  );
};

export default EmployeeSalaryUpdate;