import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { AppraisalLetterDownload, CompanySalaryStructureGetApi, EmployeeGetApi, EmployeeSalaryGetApiById, EmployeeSalaryPostApi, TemplateGetAPI } from "../../../Utils/Axios";
import { useAuth } from "../../../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../../Utils/Loader";
import LayOut from "../../../LayOut/LayOut";
import AppraisalPreview from "../../Settings/Appraisal/AppraisalPreview";

const AddIncrement = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control, reset, getValues,
    formState: { errors },
  } = useForm({ mode: 'onChange',
    defaultValues: {
      incomeTax: "new", 
      status: "Active" 
  } });
  const { user } = useAuth();
  const date = new Date().toLocaleDateString();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const salaryId = queryParams.get('salaryId');
  const id = queryParams.get('employeeId')
  const [salaryConfigurationId, setSalaryConfigurationId] = useState("");
  const [employes, setEmployes] = useState([]);
  const [salaryStructure, setSalaryStructure] = useState(0);
  const [allowances, setAllowances] = useState({});
  const [salaryStructures, setSalaryStructures] = useState([]);
  const [selectedSalaryConfigurationId, setSelectedSalaryConfigurationId] = useState("");
  const [deductions, setDeductions] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [grossAmount, setGrossAmount] = useState(0);
  const [totalAllowances, setTotalAllowances] = useState({});
  const [totalDeductions, setTotalDeductions] = useState({});
  const [netSalary, setNetSalary] = useState(0);
  const [data, setData] = useState({});
  const [status, setStatus] = useState({})
  const [hra, setHra] = useState(0);
  const [templateAvailable, setTemplateAvailable] = useState(true);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [lossOfPayPerDay, setLossOfPayPerDay] = useState(0);
  const [totalPF, setTotalPF] = useState(0);
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
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [calculatedAllowances, setCalculatedAllowances] = useState({});
  const [error, setError] = useState('');
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
          employeeName: `${employee.firstName} ${employee.lastName}`,
          employeeId: employee.employeeId,
          designationName: employee.designationName,
          departmentName: employee.departmentName,
          dateOfHiring: employee.dateOfHiring,
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
            setShowCards(true);
            setIsUpdating(true);
            setIsReadOnly(data.status === 'InActive');
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


  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i, // Start from 0 for months
    label: `${i} Month${i === 1 ? '' : 's'}`, // Adjust label accordingly
  }));

  const yearOptions = Array.from({ length: 6 }, (_, i) => ({
    value: i, // Start from 0 for years
    label: `${i} Year${i === 1 ? '' : 's'}`, // Adjust label accordingly
  }));

  const fetchTemplate = async (companyId) => {
    try {
      const res = await TemplateGetAPI(companyId);
      const templateNumber = res.data.data.appraisalTemplateNo;
      setSelectedTemplate(templateNumber)
      setTemplateAvailable(!!templateNumber);
    } catch (error) {
      handleApiErrors(error);
      setTemplateAvailable(false);
    }
  };
  useEffect(() => {
    fetchTemplate()
  }, []);

  useEffect(() => {
    const fetchSalaryStructures = async () => {
      try {
        const response = await CompanySalaryStructureGetApi();
        const allSalaryStructures = response.data.data;

        if (allSalaryStructures.length === 0) {
          setError('Company Salary Structure is not defined');
          setSalaryStructure([]);
        } else {
          const activeSalaryStructures = allSalaryStructures.filter(structure => structure.status === "Active");

          if (activeSalaryStructures.length > 0) {
            setSalaryStructure(activeSalaryStructures);
            setAllowances(activeSalaryStructures[0].allowances);
            setDeductions(activeSalaryStructures[0].deductions);
            setError(''); // Clear error if salary structures are found
          } else {
            setError('No active salary structure found');
          }
        }
      } catch (error) {
        setError('Error fetching salary structures.');
        console.error("API fetch error:", error);
      }
    };

    fetchSalaryStructures();
  }, []);

  const calculateTotalDeductions = () => {
    let total = 0;
    Object.entries(deductions).forEach(([key, value]) => {
      if (value.endsWith('%')) {
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
      if (key !== 'otherAllowances') {
        if (value.endsWith('%')) {
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

  const handleAllowanceChange = (key, value) => {
    const newAllowances = { ...allowances, [key]: value };
    setAllowances(newAllowances);

    const totalAllow = calculateTotalAllowances(newAllowances);
    const newOtherAllowances = grossAmount - totalAllow;

    // Check for errors
    if (newOtherAllowances < 0) {
      setErrorMessage("Total allowances exceed gross amount. Please adjust allowances.");
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
  };

  useEffect(() => {
    const totalAllow = calculateTotalAllowances();
    const newOtherAllowances = grossAmount - totalAllow;
    // Check for errors
    if (newOtherAllowances < 0) {
      setErrorMessage("Total allowances exceed gross amount. Please adjust allowances.");
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
      setErrorMessage("Total allowances exceed gross amount. Please adjust allowances.");
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
    setShowCards(true)
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
    const { employeeId, designationName, departmentName, dateOfHiring, months, years } = getValues(); // Get current form values

    // Check if any required field is missing
    if (!employeeId || !designationName || !departmentName || !dateOfHiring || !months || !years) {
      setMessage("Please fill all the required fields.");
      setShowFields(false); // Optionally hide or show some fields based on conditions
    } else {
      setShowFields(true); // Show fields or proceed with form submission
      setErrorMessage(""); // Clear any existing error messages
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

  const fetchSalary = async () => {
    try {
      const response = await CompanySalaryStructureGetApi();
      const salaryStructures = response.data.data;
  
      if (salaryStructures && salaryStructures.length > 0) {
        const salaryStructureId = salaryStructures[0].id;  
        console.log("salary:",salaryStructureId );
        // Extract the 'id' from the first salary structure
        setSalaryStructures(salaryStructures);
        setSalaryConfigurationId(salaryStructureId);  // Set the 'id' into salaryConfigurationId
      } else {
        console.error("No salary structures found in the response.");
      }
    } catch (error) {
      console.error("API fetch error:", error);
    }
  };
  
  useEffect(() => {
    fetchSalary();
  }, []);


  const onSubmit = async () => {
    if (error) {
      toast.error(error);
      return;
    }
    const fixedAmount = parseFloat(data.fixedAmount) || 0;
    const variableAmount = parseFloat(data.variableAmount) || 0;
    const grossAmountValue = parseFloat(grossAmount) || 0;
    const totalEarningsValue = parseFloat(totalAllowances) || 0;
    const netSalaryValue = parseFloat(netSalary) || 0;
    const totalDeductionsValue = parseFloat(totalDeductions) || 0;  
    const pfTaxValue = parseFloat(pfTax) || 0;
    const incomeTax = data.incomeTax || "";
    const statusValue = data.status || "";

    if (variableAmount === 0 && fixedAmount === 0 && grossAmountValue === 0) {
      toast.error("All amounts cannot be zero.");
      return;
    }
    const allowancesData = {};
    const deductionsData = {};

    Object.entries(allowances).forEach(([key, value]) => {
      allowancesData[key] = value;
    });

    Object.entries(deductions).forEach(([key, value]) => {
      deductionsData[key] = value;
    });

    const dataToSubmit = {
      companyName: user.company,
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
     console.log(dataToSubmit);

    if (!employeeId) {
      toast.error("Employee ID is required.");
      return;
    }
    const salaryStructureId = salaryStructures.length > 0 ? salaryStructures[0].id : ""; 
    const payload = {
      companyId : user.companyId,
      employeeId: employeeId, 
      date: new Date().toISOString().split('T')[0],  
      dateOfSalaryIncrement: previewData?.dateOfSalaryIncrement || "",
      grossCompensation: String(grossAmount || ""),  
      salaryConfigurationId: salaryStructureId || "",   
      // appraisalTemplateNo: selectedTemplate,
    };
    try {
      // First, call the EmployeeSalaryPostApi to update salary
      setLoading(true); // Show loader before the delay
      await EmployeeSalaryPostApi(employeeId, dataToSubmit);
      // Introduce a delay before calling AppraisalLetterDownload
      setTimeout(async () => {
        try {
          // Now, after the delay, call the AppraisalLetterDownload API
          await AppraisalLetterDownload(payload);
          
          // If both API calls succeed
          toast.success("Employee Salary Updated and Appraisal Letter Generated Successfully");
          setError(''); // Clear error message on success
          setShowFields(false); // Optionally hide fields after success
          navigate('/employeeview'); // Navigate to the employee view page
        } catch (err) {
          console.error('Error occurred while downloading the appraisal letter:', err);
          toast.error("Failed to generate appraisal letter");
        } finally {
          setLoading(false); // Hide loader after the delay and download process
        }
      }, 2000); // Delay in milliseconds (2000 ms = 2 seconds)
  
    } catch (err) {
      // Handle any errors that occur during the EmployeeSalaryPostApi call
      console.error('Error occurred:', err);
      toast.error("Failed to update salary");
      setLoading(false); // Hide loader if error occurs
    }
  };
  // Preview Form Submission (Before submitting for API calls)
  const submitForm = (data) => {
    console.log("submitForm",data)
    const selectedMonth = data.months ? data.months.label : "";
    const selectedYear = data.years ? data.years.label : "";
    const employeeId = selectedEmployee ? selectedEmployee.employeeId : data.employeeId;
    setEmployeeId(employeeId);
    const submissionData = {
      employeeId: data.employeeId,
      companyId: user.companyId,
      allowances: allowances,
      totalAllowances: totalAllowances
    };
    const preview = {
      employeeId: data.id,
      employeeName:data.employeeName||"",
      designationName: data.designationName || "",
      departmentName: data.departmentName || "",
      dateOfSalaryIncrement: data.dateOfSalaryIncrement || "",
      companyId: user.companyId,
      timePeriod: `${selectedMonth} ${selectedYear}`,
      grossCompensation: grossAmount || "",
      allowances: allowances,
      totalAllowances: totalAllowances,
      date: new Date().toISOString().split('T')[0],  
    };
    setPreviewData(preview);
    setShowPreview(true);
    setSubmissionData(submissionData);
    setData(data)
  };

  const clearForm = () => {
    reset();
    setShowFields(false);
  }


  if (!templateAvailable) {
    return (
      <LayOut>
        <div className="container-fluid p-0">
          <div className="row justify-content-center">
            <div className="col-8 text-center mt-5">
              <h2>No Interns Template Available</h2>
              <p>To set up the Interns templates before proceeding, Please select the Template from Settings <a href="/internsTemplates">Interns Templates </a></p>
              <p>Please contact the administrator to set up the Interns templates before proceeding.</p>
            </div>
          </div>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
            <div className="col">
              <h1 className="h3 mb-3">
                <strong>Appraisal Form</strong>
              </h1>
            </div>
            <div className="col-auto" style={{ paddingBottom: '20px' }}>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="/main">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Appraisal From</li>
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
                    </div>
                    <div className="card-body">
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
                            onChange={(e) => setGrossAmount(parseFloat(e.target.value))}
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
                        <div className="col-12 text-end mt-2">
                          <button type="button" className="btn btn-primary" onClick={calculateAllowances}>
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
                      <div className="row d-flex">
                        <div className="col-6 mb-4">
                          <div className="card">
                            <div className="card-header">
                              <h5 className="card-title">Allowances</h5>
                            </div>
                            <div className="card-body">
                              {errorMessage && <span className="text-danger m-2 text-center">{errorMessage}</span>}
                              {Object.keys(allowances).map((key) => (
                                <div key={key} className="mb-3">
                                  <label>
                                    {key}:
                                    <span className="text-danger me-1">({allowances[key]})</span>
                                    {allowances[key].endsWith('%') && (
                                      <span
                                        className="m-1"
                                        data-toggle="tooltip"
                                        title="Percentage values are calculated based on Gross Amount."
                                      >
                                        <span className="text-primary"><i className="bi bi-info-circle"></i></span>
                                      </span>
                                    )}
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={allowances[key]}
                                    onChange={(e) => handleAllowanceChange(key, e.target.value)}
                                    data-toggle="tooltip"
                                    title={allowances[key].endsWith('%') ? "Percentage values are calculated based on the gross amount." : ""}
                                  />
                                </div>
                              ))}
                              <div className="mb-3">
                                <label>Total Allowances:</label>
                                <input
                                  className="form-control"
                                  type="number"
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
                                <h5 className="card-title me-2">Status</h5>
                                <span className="text-danger">
                                  {errors.status && <p className="mb-0">{errors.status.message}</p>}
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
                                      {...register("status", { required: "Please Select Status" })}
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
                                      {...register("status", { required: "Please Select Status" })}
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
                              <h5 className="card-title">Deductions</h5>
                            </div>
                            <div className="card-body">
                              {Object.entries(deductions).map(([key, value]) => (
                                <div key={key} className="mb-3">
                                  <label>
                                    {key}:
                                    <span className="text-danger">({deductions[key]})</span>
                                    {deductions[key].endsWith('%') && (
                                      <span
                                        className="m-1"
                                        data-toggle="tooltip"
                                        title="Percentage values are calculated based on Gross Amount."
                                      >
                                        <span className="text-primary"><i className="bi bi-info-circle"></i></span>
                                      </span>
                                    )}
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={deductions[key]}
                                    onChange={(e) => handleDeductionChange(key, e.target.value)}
                                    data-toggle="tooltip"
                                    title={deductions[key].endsWith('%') ? "Percentage values are calculated based on the gross amount." : ""}
                                  />
                                </div>
                              ))}
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
                                <h5 className="card-title me-2">TDS</h5>
                                <span className="text-danger">
                                  {errors.incomeTax && <p className="mb-0">{errors.incomeTax.message}</p>}
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
                                      {...register("incomeTax", { required: "Please Select Tax" })}
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
                                      {...register("incomeTax", { required: "Please Select Tax" })}
                                    />
                                    new Regime
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="card">
                            <div className="card-header">
                              <h5 className="card-title">Net Salary</h5>
                            </div>
                            <div className="card-body">
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
                            <button className="btn btn-secondary me-2" onClick={clearForm}>Close</button>
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
                        <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: "center" }}>
                          <b>{error}</b>
                        </div>
                      )}
                    </>
                  )
                )}
              </>
            ) : (
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
                                  rules={{ required: true }}
                                  render={({ field }) => (
                                    <Select
                                      {...field}
                                      options={employes}
                                      value={employes.find(
                                        (option) => option.value === field.value
                                      )}
                                      onChange={(selectedOption) => {
                                        field.onChange(selectedOption.value);

                                        // Get selected employee details
                                        const selectedEmp = employes.find(
                                          (emp) => emp.value === selectedOption.value 
                                        );
                                        if (selectedEmp) {
                                          console.log("Selected Employee Details: ", selectedEmp);

                                          // Use setValue to populate form fields with selected employee's info
                                          setValue("employeeName", selectedEmp.employeeName); // Add employeeName to form
                                          setValue("designationName", selectedEmp.designationName);
                                          setValue("departmentName", selectedEmp.departmentName);
                                          setValue("dateOfHiring", selectedEmp.dateOfHiring);
                                          setValue("id",selectedEmp.employeeId);
                                        }
                                      }}
                                      placeholder="Select Employee Name"
                                    />
                                  )}
                                />
                                {errors.employeeId && (
                                  <p className="errorMsg">Employee Name Required</p>
                                )}
                              </div>
                              <input
                                  type="hidden"
                                  className="form-control"
                                  placeholder="Resignation Date"
                                  name="id"
                                  readOnly
                                  {...register("id")}
                                />
                                <input
                                  type="hidden"
                                  className="form-control"
                                  placeholder="Resignation Date"
                                  name="employeeName"
                                  readOnly
                                  {...register("id")}
                                />
                              <div className="col-lg-1"></div>
                              <div className="col-12 col-md-6 col-lg-5 mb-3">
                                <label className="form-label">Date of Hired</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  placeholder="Resignation Date"
                                  name="dateOfHiring"
                                  readOnly
                                  {...register("dateOfHiring", { required: true })}
                                />
                                {errors.dateOfHiring && (
                                  <p className="errorMsg">
                                    Date of Hiring Required
                                  </p>
                                )}
                              </div>
                              <div className="col-12 col-md-6 col-lg-5 mb-3">
                                <label className="form-label">Designation</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Designation"
                                  name="designationName"
                                  readOnly
                                  {...register("designationName", {
                                    required: true,
                                  })}
                                />
                                {errors.designationName && (
                                  <p className="errorMsg">Designation Required</p>
                                )}
                              </div>
                              <div className="col-lg-1"></div>
                              <div className="col-12 col-md-6 col-lg-5 mb-3">
                                <label className="form-label">Department</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Department"
                                  name="departmentName"
                                  readOnly
                                  {...register("departmentName", {
                                    required: true,
                                  })}
                                />
                                {errors.departmentName && (
                                  <p className="errorMsg">Department Required</p>
                                )}
                              </div>

                              <div className="col-md-5 mb-3">
                                <label className="form-label">Time Period</label>
                                <div className="row d-flex">
                                  <div className="col-md-6 ">
                                    <Controller
                                      name="months"
                                      control={control}
                                      defaultValue=""
                                      rules={{ required: "Please select a month" }} // Validation rule
                                      render={({ field }) => (
                                        <Select
                                          {...field}
                                          options={monthOptions}
                                          placeholder="Select Months"
                                        />
                                      )}
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <Controller
                                      name="years"
                                      control={control}
                                      defaultValue=""
                                      rules={{ required: "Please select a year" }} // Validation rule
                                      render={({ field }) => (
                                        <Select
                                          {...field}
                                          options={yearOptions}
                                          placeholder="Select Years"
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                                {errors.employeeType && (
                                  <p className="errorMsg">
                                    Employee Type is required
                                  </p>
                                )}
                              </div>
                              <div className="col-lg-1"></div>
                              <div className="col-md-5 mb-3">
                                <label className="form-label">Appraisal Date (Hike Start Date)</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  {...register("dateOfSalaryIncrement", {
                                    required: "Appraisal Date is required",
                                  })}
                                />
                                {errors.dateOfSalaryIncrement && (
                                  <p className="errorMsg">{errors.dateOfSalaryIncrement.message}</p>
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
                                onClick={handleGoClick}
                              >
                                Update Salary Structure
                              </button>
                            </div>
                          </div>
                        </form>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
        {showPreview && (
          <div
            className={`modal fade ${showPreview ? 'show' : ''}`}
            style={{ display: showPreview ? 'block' : 'none' }}
            tabIndex="-1"
            role="dialog"
            aria-hidden={!showPreview}
          >

            <div className="modal-dialog modal-lg" role="document" style={{ top: "80%" }}>
            {loading ? (
                    <div className="text-center mt-4">
                      <Loader /> {/* Assuming Loader is your component for showing loading indicator */}
                    </div>
                  ) : (
              <div className="modal-content mt-2">
                <div className="modal-header">
                  <h5 className="modal-title">Preview Appraisal Letter</h5>
                  <button type="button" className="close" onClick={() => setShowPreview(false)} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  
                    <AppraisalPreview previewData={previewData} selectedTemplate={selectedTemplate} />
                
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowPreview(false)}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={onSubmit}>Confirm Submission</button>
                </div>
              </div>
              )}
            </div>
          </div>
        )}
      </div>
    </LayOut>
  );
};

export default AddIncrement; 