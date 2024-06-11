import React, { useEffect, useState } from "react";
import Footer from "../../ScreenPages/Footer";
import Header from "../../ScreenPages/Header";
import SideNav from "../../ScreenPages/SideNav";
import { useForm } from "react-hook-form";
import ManageSalary from "./ManageSalary";
import { SalaryProvider, useSalaryContext } from "../../Context/SalaryContext";

const SalaryStructure = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { formData, updateFormData } = useSalaryContext();



  // State variables for allowances
  const [hra, setHra] = useState(0);
  const [travelAllowance, setTravelAllowance] = useState(0);
  const [specialAllowance, setSpecialAllowance] = useState(0);
  const [otherAllowances, setOtherAllowances] = useState(0);
  const [basicSalary, setBasicSalary] = useState(100);

  // Watch for changes in allowances
  const watchHra = watch("allowances.hra", 0);
  const watchTravelAllowance = watch("allowances.travelAllowance", 0);
  const watchSpecialAllowance = watch("allowances.specialAllowance", 0);
  const watchOtherAllowances = watch("allowances.otherAllowances", 0);

  // Update basic salary whenever any allowance changes
  useEffect(() => {
    const hraVal = parseFloat(watchHra) || 0;
    const travelVal = parseFloat(watchTravelAllowance) || 0;
    const specialVal = parseFloat(watchSpecialAllowance) || 0;
    const otherVal = parseFloat(watchOtherAllowances) || 0;

    setHra(hraVal);
    setTravelAllowance(travelVal);
    setSpecialAllowance(specialVal);
    setOtherAllowances(otherVal);

    const totalAllowances = hraVal + travelVal + specialVal + otherVal;
    setBasicSalary(100 - totalAllowances);
  }, [
    watchHra,
    watchTravelAllowance,
    watchSpecialAllowance,
    watchOtherAllowances,
  ]);

  const onSubmit = (data) => {
    updateFormData(data);
    console.log(data);
  };

  return (
    <SalaryProvider>
    <div className="wrapper">
      <SideNav />
      <div className="main">
        <Header />
        <main className="content">
          <div className="container-fluid p-0">
            <form className="m-3" onSubmit={handleSubmit(onSubmit)}>
              <h1 className="h3 mb-3">
                <strong>Manage Salary</strong>
              </h1>
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">Allowances:</h5>
                      <hr />
                      <div className="row">
                        <div className="col-lg-6">
                          <label className="form-label">Basic Salary (%)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={basicSalary}
                            readOnly
                          />
                        </div>
                        <div className="col-lg-6">
                          <label className="form-label">HRA (%)</label>
                          <input
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            {...register("allowances.hra", {
                              pattern: {
                                value: /^\d+$/,
                                message: "These fields accept only Digits",
                              },
                            })}
                          />
                        </div>
                        <div className="col-lg-6" style={{ marginTop: "10px" }}>
                          <label className="form-label">
                            Travel Allowance (%)
                          </label>
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
                        <div className="col-lg-6" style={{ marginTop: "10px" }}>
                          <label className="form-label">
                            Special Allowance (%)
                          </label>
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
                        <div className="col-lg-6" style={{ marginTop: "10px" }}>
                          <label className="form-label">
                            Other Allowances (%)
                          </label>
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
                      </div>
                     
                      <div className="row mt-4">
                        <h5 className="card-title">Contributions :</h5>
                        <div className="col-6">
                          <label className="form-label">PF Contribution</label>
                          <input
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            {...register("deductions.pfEmployee", {
                              required: "PF Employee is required",
                              pattern: {
                                value: /^\d+$/,
                                message: "These fields accepts only Digits",
                              },
                            })}
                          />
                          {errors["deductions.pfEmployee"] && (
                            <p className="errorMsg">
                              {errors["deductions.pfEmployee"].message}
                            </p>
                          )}
                        </div>
                        <div className="col-6 d-flex align-items-end justify-content-end bg-transparent mr-3">
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card mt-3">
                    <div className="card-header">
                    <h6 className="card-title">Income Tax Rates</h6>
                    </div>
                
                    <table className="table">
                      <thead className="bg-secondary">
                        <tr>
                          <th>Net Income Range</th>
                          <th>Assessment Year 2025-26</th>
                          <th>Assessment Year 2024-25</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Up to Rs. 2,50,000</td>
                          <td>-</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>Rs. 2,50,000 to Rs. 5,00,000</td>
                          <td>5%</td>
                          <td>5%</td>
                        </tr>
                        <tr>
                          <td>Rs. 5,00,000 to Rs. 10,00,000</td>
                          <td>20%</td>
                          <td>20%</td>
                        </tr>
                        <tr>
                          <td>Above Rs. 10,00,000</td>
                          <td>30%</td>
                          <td>30%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* <div className="d-flex flex-row-reverse m-3">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div> */}
              </div>
            </form>
          </div>
        </main>
        <Footer />
      
      </div>
    </div>
    </SalaryProvider>
  );
};

export default SalaryStructure;
