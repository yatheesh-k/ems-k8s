import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import LayOut from "../../LayOut/LayOut";
import { EmployeeGetApi, EmployeeSalaryPostApi } from "../../Utils/Axios";
import { CurrencyRupee, QuestionCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EmployeeSalaryStructure = () => {
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
  const navigate=useNavigate();

  useEffect(() => {
    EmployeeGetApi().then((data) => {
      const filteredData = data
        .filter((employee) => employee.companyId === null)
        .map(({ referenceId, ...rest }) => rest);
      setEmployes(
        filteredData.map((employee) => ({
          label: `${employee.firstName} ${employee.lastName}`,
          value: employee.id,
        }))
      );
    });
  }, []);

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
  };

  const handleFixedAmountChange = (e) => {
    setFixedAmount(parseFloat(e.target.value) || 0);
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
  };

  const handlePfEmployerChange = (e) => {
    setPfEmployer(parseFloat(e.target.value) || 0);
  };

  const handleTravelAllowanceChange = (e) => {
    setTravelAllowance(parseFloat(e.target.value) || 0);
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
    e.preventDefault();
    if (
      variableAmount === 0 &&
      fixedAmount === 0 &&
      travelAllowance === 0 &&
      specialAllowance === 0 &&
      otherAllowances === 0 &&
      hra === 0 &&
      incomeTax === 0 &&
      pfTax === 0 &&
      pfEmployee === 0 &&
      pfEmployer === 0 &&
      grossAmount === 0
    ) {
      setErrorMessage("Please fill the fields.");
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
        specialAllowance: parseFloat(specialAllowance),
        otherAllowances: parseFloat(otherAllowances),
      },
      deductions: {
        pfEmployee: parseFloat(pfEmployee),
        pfEmployer: parseFloat(pfEmployer),
        lop: parseFloat(lossOfPayPerDay),
        totalDeductions: parseFloat(totalPF),
        pfTax: parseFloat(pfTax),
        totalTax: parseFloat(totalTax),
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
        console.error("Error:", error);
        toast.error(error.response.data.message)
      });
  };

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <form className="m-3" onSubmit={onSubmit}>
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
                    <div className="row  align-items-center">
                      <div
                        className="col-6 col-md-6 col-lg-6 mt-3"
                        style={{ width: "400px" }}
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
                      <div className="col-6 col-md-6 col-lg-6 mt-5">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleGoClick}
                        >
                          Go
                        </button>
                      </div>
                      {message && <div className="text-danger">{message}</div>}
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
                      {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                          {errorMessage}
                        </div>
                      )}
                      <hr />
                      <div className="row">
                        <div className="col-md-5 mb-3">
                          <label className="form-label">Variable Amount</label>
                          <input
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            value={variableAmount}
                            onChange={handleVariableAmountChange}
                          />
                        </div>
                        <div className="col-md-1 mb-3"></div>
                        <div className="col-md-5 mb-3">
                          <label className="form-label">Fixed Amount</label>
                          <input
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            value={fixedAmount}
                            onChange={handleFixedAmountChange}
                          />
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
                          value={hra}
                          onChange={(e) => setHra(e.target.value)}
                        />
                      </div>
                      <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">Travel Allowance:<span>(<CurrencyRupee/>)</span></label>
                        <input
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          value={travelAllowance}
                          onChange={handleTravelAllowanceChange}
                        />
                      </div>
                      <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">Special Allowance:<span>(<CurrencyRupee/>)</span></label>
                        <input
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          value={specialAllowance}
                          onChange={handleSpecialAllowanceChange}
                        />
                      </div>
                      <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">Other Allowances:<span>(<CurrencyRupee/>)</span></label>
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
                      <div className="col-12 mt-2">
                        <label className="form-label">
                          Loss of Pay (per Day)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={lossOfPayPerDay}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title"> Deductions </h5>
                      <hr />
                      <div className="col-12" style={{ marginTop: "10px" }}>
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
                      </div>
                      <h5 className="card-title mt-3"> PF Contibution </h5>
                      <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">
                          Employee's PF Contribution
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={pfEmployee}
                          autoComplete="off"
                          onChange={handlePfEmployeeChange}
                        />
                      </div>
                      <div className="col-12" style={{ marginTop: "10px" }}>
                        <label className="form-label">
                          Employer's PF Contribution
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={pfEmployer}
                          autoComplete="off"
                          onChange={handlePfEmployerChange}
                        />
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
                <div className="col-12 text-end">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
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
