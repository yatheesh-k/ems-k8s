import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import LayOut from "../../LayOut/LayOut";
import { EmployeeGetApi, EmployeeSalaryPostApi } from "../../Utils/Axios";
import { CurrencyRupee, QuestionCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const EmployeeSalaryStructure = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'onChange' });
  const [employes, setEmployes] = useState([]);
  const [grossAmount, setGrossAmount] = useState(0);
  const [hra, setHra] = useState(0);
  const [basicSalary, setBasicSalary] = useState(0);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
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
  const navigate = useNavigate();

  useEffect(() => {
    EmployeeGetApi().then((data) => {
      const filteredData = data
        .filter((employee) => employee.firstName !== null)
        .map(({ referenceId, ...rest }) => rest);
      setEmployes(
        filteredData.map((employee) => ({
          label: `${employee.firstName} ${employee.lastName}`,
          value: employee.id,
        }))
      );
    });
  }, []);

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
      setMessage("Please select an employee.");
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

  const handleIncomeTaxChange = (e) => {
    setIncomeTax(parseFloat(e.target.value) || 0);
  };

  const handlePfTaxChange = (e) => {
    setPfTax(parseFloat(e.target.value) || 0);
  };
  const handleTotalTaxChange = (e) => {
    setTotalTax(parseFloat(e.target.value) || 0);
  };

  const handlePfEmployeeChange = (e) => {
    setPfEmployee(parseFloat(e.target.value) || 0);
    setValue("pfEmployee", e.target.value, { shouldValidate: true });
  };

  const handlePfEmployerChange = (e) => {
    setPfEmployer(parseFloat(e.target.value) || 0);
    setValue("pfEmployer", e.target.value, { shouldValidate: true });
  };

  const handleHraChange = (e) => {
    setHra(parseFloat(e.target.value) || 0);
    setValue("hra", e.target.value, { shouldValidate: true });
  };

  const handleTravelAllowanceChange = (e) => {
    setTravelAllowance(parseFloat(e.target.value) || 0);
    setValue("travelAllowance", e.target.value, { shouldValidate: true });
  };

  const handleSpecialAllowanceChange = (e) => {
    setSpecialAllowance(parseFloat(e.target.value) || 0);
  };

  const handleOtherAllowancesChange = (e) => {
    setOtherAllowances(parseFloat(e.target.value) || 0);
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

  useEffect(() => {
    // Convert hra percentage to actual amount
    const hraPercentage = parseFloat(hra || 0); // Assuming hra is given as a percentage
    const hraAmount = (hraPercentage / 100) * parseFloat(grossAmount || 0);

    const travelAllowanceValue = parseFloat(travelAllowance || 0);
    const specialAllowanceValue = parseFloat(specialAllowance || 0);
    const otherAllowancesValue = parseFloat(otherAllowances || 0);

    const basicSalaryValue =
      parseFloat(grossAmount || 0) -
      (hraAmount +
        travelAllowanceValue +
        specialAllowanceValue +
        otherAllowancesValue);
    setBasicSalary(basicSalaryValue);

    const totalEarningsValue =
      basicSalaryValue +
      hraAmount +
      travelAllowanceValue +
      specialAllowanceValue +
      otherAllowancesValue;
    setTotalEarnings(totalEarningsValue);
  }, [grossAmount, hra, travelAllowance, specialAllowance, otherAllowances]);

  useEffect(() => {
    const totalPFValue = parseFloat(pfEmployee) + parseFloat(pfEmployer);
    setTotalPF(totalPFValue.toFixed(2));

    const totalTaxValue =
      (parseFloat(incomeTax) || 0) + (parseFloat(pfTax) || 0);
    setTotalTax(totalTaxValue);

    const totalDeductionsValue = totalTaxValue + totalPFValue;
    const netSalary = totalEarnings - totalDeductionsValue;
    setTotalAmount(netSalary.toFixed(2));
  }, [pfEmployee, pfEmployer, incomeTax, pfTax, totalEarnings]);

  const companyName = sessionStorage.getItem("company");

  const onSubmit = (e) => {
    if (
      variableAmount === 0 &&
      fixedAmount === 0 &&
      travelAllowance === 0 &&
      specialAllowance === 0 &&
      otherAllowances === 0 &&
      hra === 0 &&
      pfEmployee === 0 &&
      pfEmployer === 0 &&
      grossAmount === 0
    ) {
      // setErrorMessage("Please fill the fields.");
      return;
    }

    const postData = {
      companyName,
      basicSalary,
      fixedAmount,
      variableAmount,
      grossAmount,
      totalEarnings,
      netSalary: totalAmount,
      allowances: {
        travelAllowance: parseFloat(travelAllowance),
        hra: parseFloat(hra),
        pfContributionEmployee: parseFloat(pfEmployee),
        specialAllowance: parseFloat(specialAllowance),
        otherAllowances: parseFloat(otherAllowances),
      },
      deductions: {
        pfEmployee: parseFloat(pfEmployee),
        pfEmployer: parseFloat(pfEmployer),
        totalDeductions: parseFloat(totalPF),
      },
      status: 0,
    };

    console.log("Post Data:", postData);

    EmployeeSalaryPostApi(employeeId, postData)
      .then((response) => {
        toast.success(response.data.message)
        setErrorMessage(""); // Clear error message on success
        setShowFields(false);
        navigate('/employeeview')
      })
      .catch((error) => {
        handleApiErrors(error)
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
                  <li className="breadcrumb-item active">PayRoll</li>
                  <li className="breadcrumb-item active">Manage Salary</li>
                </ol>
              </nav>
            </div>
          </div>
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
                        <div style={{marginTop:"27px"}}>
                        <div className="mt-3 ml-3" style={{marginLeft:"20px"}}>
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
                      {message && <div className="text-danger mt-2" style={{ marginLeft: '10px' }}>{message}</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {showFields && (
              <>
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title"> Salary Details </h5>
                      <hr />
                      <div className="row">
                        <div className="col-md-5 mb-3">
                          <label className="form-label">Variable Amount</label>
                          <input
                            id="variableAmount"
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            {...register("variableAmount", {
                              required: "Variable amount is required",
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "These filed accepcts only Integers",
                              },
                              validate: {
                                notZero: value => value !== "0" || "Value cannot be 0"
                              }
                            })}
                            value={variableAmount}
                            onChange={handleVariableAmountChange}
                          />
                          {errors.variableAmount && (
                            <p className="text-danger">{errors.variableAmount.message}</p>
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
                              required: "Fixed amount is required",
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "These filed accepcts only Integers",
                              },
                              validate: {
                                notZero: value => value !== "0" || "Value cannot be 0"
                              }
                            })}
                            value={fixedAmount}
                            onChange={handleFixedAmountChange}
                          />
                          {errors.fixedAmount && (
                            <p className="text-danger">{errors.fixedAmount.message}</p>
                          )}
                        </div>
                        <div className="col-md-5 mb-3">
                          <label className="form-label">Gross Amount</label>
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
                          <label className="form-label">Monthly Salary</label>
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
                          value={basicSalary}
                          autoComplete="off"
                          readOnly
                        />
                      </div>
                      <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">
                          HRA:<span style={{ color: "red" }}>(%)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          {...register("hra", {
                            required: "Hra is required",
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "These filed accepcts only Integers",
                            },
                            validate: {
                              notZero: value => value !== "0" || "Value cannot be 0"
                            }
                          })}
                          value={hra}
                          onChange={handleHraChange}
                        />
                        {errors.hra && (
                          <p className="text-danger">{errors.hra.message}</p>
                        )}
                      </div>
                      <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">Travel Allowance:<span style={{color:"red"}}>(<CurrencyRupee />)</span></label>
                        <input
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          {...register("travelAllowance", {
                            required: "Travel Allowance is required",
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "These filed accepcts only Integers",
                            },
                            validate: {
                              notZero: value => value !== "0" || "Value cannot be 0"
                            }
                          })}
                          value={travelAllowance}
                          onChange={handleTravelAllowanceChange}
                        />
                        {errors.travelAllowance && (
                          <p className="text-danger">{errors.travelAllowance.message}</p>
                        )}
                      </div>
                      <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">Special Allowance:<span style={{color:"red"}}>(<CurrencyRupee />)</span></label>
                        <input
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          value={specialAllowance}
                          onChange={handleSpecialAllowanceChange}
                        />
                      </div>
                      <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">Other Allowances:<span style={{color:"red"}}>(<CurrencyRupee />)</span></label>
                        <input
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          value={otherAllowances}
                          onChange={handleOtherAllowancesChange}
                        />
                      </div>
                      <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">Total Earnings</label>
                        <input
                          type="text"
                          className="form-control"
                          value={totalEarnings}
                          readOnly
                        />
                      </div>
                      {/* <div className="col-12 mt-2">
                        <label className="form-label">
                          Loss of Pay (per Day)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={lossOfPayPerDay}
                          readOnly
                        />
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title"> Deductions </h5>
                      <hr />
                      {/* <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">Professional Tax<span style={{color:"red", fontSize:"20px"}}><QuestionCircle/></span></label>
                        <input
                          type="text"
                          className="form-control"
                          value={pfTax}
                          autoComplete="off"
                          onChange={handlePfTaxChange}
                        />
                      </div>
                      <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">Total Tax</label>
                        <input
                          type="text"
                          className="form-control"
                          value={totalTax}
                          autoComplete="off"
                          readOnly
                          onChange={handleTotalTaxChange}
                        />
                      </div> */}
                      <h5 className="card-title mt-3"> PF Contibution </h5>
                      <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">
                          Employee's PF Contribution
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          {...register("pfEmployee", {
                            required: "EMployee's PF Contribution is required",
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "These filed accepcts only Integers",
                            },
                            validate: {
                              notZero: value => value !== "0" || "Value cannot be 0"
                            }
                          })}
                          value={pfEmployee}
                          onChange={handlePfEmployeeChange}
                        />
                        {errors.pfEmployee && (
                          <p className="text-danger">{errors.pfEmployee.message}</p>
                        )}
                      </div>
                      <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">
                          Employer's PF Contribution
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          {...register("pfEmployer", {
                            required: "Employer's PF Contribution is required",
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "These filed accepcts only Integers",
                            },
                            validate: {
                              notZero: value => value !== "0" || "Value cannot be 0"
                            }
                          })}
                          value={pfEmployer}
                          onChange={handlePfEmployerChange}
                        />
                        {errors.pfEmployer && (
                          <p className="text-danger">{errors.pfEmployer.message}</p>
                        )}
                      </div>
                      <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">Total PF</label>
                        <input
                          type="text"
                          className="form-control"
                          value={totalPF}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title"> Net Salary </h5>
                        <hr />
                        <div className="col-12">
                          <label className="form-label">Total Amount</label>
                          <input
                            type="text"
                            className="form-control"
                            value={totalAmount}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 text-end" style={{ marginTop: "60px" }}>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </LayOut>
  );
};

export default EmployeeSalaryStructure;
