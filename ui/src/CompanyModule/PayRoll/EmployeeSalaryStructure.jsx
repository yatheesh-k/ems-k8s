import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { QuestionCircle, QuestionCircleFill } from "react-bootstrap-icons";
import LayOut from "../../LayOut/LayOut";
import { EmployeeGetApi, EmployeeSalaryPostApi } from "../../Utils/Axios";

const EmployeeSalaryStructure = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [employes, setEmployes] = useState([]);
  const [grossAmount, setGrossAmount] = useState(0);    console.log(grossAmount);
  const [hra, setHra] = useState(0);
  const [basicSalary, setBasicSalary] = useState(0);   console.log(basicSalary);

  const [monthlySalary, setMonthlySalary] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0); console.log(totalEarnings);
  const [totalTax, setTotalTax] = useState(0);

  const [totalAmount, setTotalAmount] = useState(0);  
  const [lossOfPayPerDay, setLossOfPayPerDay] = useState(0);   console.log(lossOfPayPerDay);

  const [totalPF, setTotalPF] = useState(0);
  const [showFields, setShowFields] = useState(false);

  const handleGoClick = () => {
    setShowFields(true);
  };

  // Watch the values of gross Salary, incomeTax, and pfTax fields

  const incomeTax = watch("deductions.incomeTax");
  const pfTax = watch("deductions.pfTax");
  const pfEmployee = watch("deductions.pfEmployee");
  const pfEmployer = watch("deductions.pfEmployer");

  useEffect(() => {
    // Calculate and set monthly salary when grossAmount changes
    const monthlySalaryValue = parseFloat(grossAmount || 0) / 12; // Convert LPA to per month
    setMonthlySalary(monthlySalaryValue);

    const workingDaysPerMonth = 30; // Assume 30 working days in a month
    const lopPerDayValue = monthlySalaryValue / workingDaysPerMonth;
    setLossOfPayPerDay(lopPerDayValue);
  }, [grossAmount]);

  useEffect(() => {
    const totalPFValue = parseFloat(pfEmployee) + parseFloat(pfEmployer);
    setTotalPF(totalPFValue.toFixed(2));
    setValue("deductions.totalDeductions", totalPFValue.toFixed(2));


    const totalTaxValue = (parseFloat(incomeTax) || 0) + (parseFloat(pfTax) || 0);
    setTotalTax(totalTaxValue);
    setValue("deductions.totalTax", totalTaxValue); // Set the value in the form

    const totalDeductionsValue = totalTaxValue + totalPFValue;
    const netSalary = totalEarnings - totalDeductionsValue;
    setTotalAmount(netSalary.toFixed(2));
    setValue("netSalary", netSalary.toFixed(2));
  }, [pfEmployee, pfEmployer, incomeTax, pfTax, totalEarnings, setValue]);


  useEffect(() => {
    // Calculate and set grossAmount when variableAmount or fixedAmount changes
    const variableAmount = parseFloat(watch("variableAmount")) || 0;
    const fixedAmount = parseFloat(watch("fixedAmount")) || 0;
    const newGrossSalary = variableAmount + fixedAmount;
    setGrossAmount(newGrossSalary);
  }, [watch("variableAmount"), watch("fixedAmount")]);

  useEffect(() => {
    // Calculate and set basic when remaining allowances are added
    const hra = parseFloat(watch("allowances.hra")) || 0;
    const travelAllowance =
      parseFloat(watch("allowances.travelAllowance")) || 0;
    const pfContributionEmployee =
      parseFloat(watch("allowances.pfContributionEmployee")) || 0;
    const otherAllowance = parseFloat(watch("allowances.otherAllowances")) || 0;
    const specialAllowance =
      parseFloat(watch("allowances.specialAllowance")) || 0;


    const basicSalary = (grossAmount -
      (((hra / 100) * grossAmount) +
        travelAllowance +
        pfContributionEmployee +
        otherAllowance +
        specialAllowance));
    setBasicSalary(basicSalary);
    const totalEarnings = basicSalary + ((hra / 100) * grossAmount) + travelAllowance + pfContributionEmployee + otherAllowance + specialAllowance;
    setTotalEarnings(totalEarnings);

  }, [
    watch("grossAmount"),
    watch("allowances.hra"),
    watch("allowances.travelAllowance"),
    watch("allowances.pfContributionEmployee"),
    watch("allowances.otherAllowances"),
    watch("allowances.specialAllowance"),
  ]);

  useEffect(() => {
    EmployeeGetApi().then(data => {
      const filteredData = data
        .filter(employee => employee.employeeId !== null) // Exclude employees with null employeeId
        .map(({ referenceId, ...rest }) => rest); // Exclude referenceId
      setEmployes(
        filteredData.map(employee => ({
          label: `${employee.firstName} ${employee.lastName}`,
          value: employee.id,
        }))
      );
    });
  }, [])

  const companyName = sessionStorage.getItem("company")


  const onSubmit = (data) => {
    const companyName = sessionStorage.getItem("company");

    const postData = {
      ...data,
      companyName,
    };

    console.log('Post Data:', postData); // Log postData to inspect it before sending

    EmployeeSalaryPostApi(postData.employeeId, postData)
      .then((response) => {
        // Handle successful response
        console.log(response.data);
        reset();
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
                    <div className="row  align-items-center">
                      <div
                        className="col-6 col-md-6 col-lg-6 mt-3"
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
                              options={employes}
                              value={employes.find(option => option.value === field.value)}
                              onChange={val => field.onChange(val.value)}
                              placeholder="Select Employee Name"
                            />
                          )}
                        />
                        {errors.employeeId && (
                          <p className="errorMsg">Employee Name is required</p>
                        )}
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
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            {...register("variableAmount", {
                              required: "Variable Amount is required",
                              pattern: {
                                value: /^\d+(\.\d{1,2})?$/,
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
                                value: /^\d+(\.\d{1,2})?$/,
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
                            value={grossAmount.toFixed(2)}
                            readOnly
                            {...register("grossAmount", {
                              required: "Gross Amount is required",
                              pattern: {
                                value: /^\d+(\.\d{1,2})?$/,
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
                          value={basicSalary.toFixed(2)}
                          autoComplete="off"
                          {...register("basicSalary", {
                            required: "Basic Salary is required",
                            pattern: {
                              value: /^\d+(\.\d{1,2})?$/,
                              message: "These fields accept only Digits",
                            },
                          })}
                          readOnly
                        />
                        {errors["basicSalary"] && (
                          <p className="errorMsg">
                            {errors["basicSalary"].message}
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
                          // readOnly
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
                              value: /^\d+(\.\d{1,2})?$/,
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
                              value: /^\d+(\.\d{1,2})?$/,
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
                              value: /^\d+(\.\d{1,2})?$/,
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
                              value: /^\d+(\.\d{1,2})?$/,
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
                      value={totalEarnings}
                      onChange={(e) => setTotalEarnings(e.target.value)}
                      {...register("totalEarnings", {
                        required: "TotalEarnings is required",
                        pattern: {
                          value: /^\d+(\.\d{1,2})?$/,
                          message: "These fields accepts only Digits",
                        },
                      })}
                      readOnly
                    />
                        {/* <input
                          type="text"
                          className="form-control"
                          value={totalEarnings.toFixed(2)}
                          autoComplete="off"
                          {...register("totalEarnings", {
                            required: "Basic Salary is required",
                            pattern: {
                              value: /^\d+(\.\d{1,2})?$/,
                              message: "These fields accept only Digits",
                            },
                          })}
                          readOnly
                        /> */}
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
                            required: "Income Tax is required",
                            pattern: {
                              value: /^\d+(\.\d{1,2})?$/,
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
                              value: /^\d+(\.\d{1,2})?$/,
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
                              value: /^\d+(\.\d{1,2})?$/,
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

                        <input
                          type="text"
                          className="form-control"
                          value={totalTax}
                          readOnly
                          {...register("deductions.totalTax", {
                            required: "Total Tax is required",
                            pattern: {
                              value: /^\d+(\.\d{1,2})?$/,
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
                              value: /^\d+(\.\d{1,2})?$/,
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
                              value: /^\d+(\.\d{1,2})?$/,
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
                          // value={}
                          readOnly
                          {...register("netSalary", {
                            required: true,
                          })}
                        />
                        {errors.netSalary && (
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

              </>
            )}

          </div>
        </form>
      </div>
    </LayOut>



  );
};

export default EmployeeSalaryStructure;
