import React, { useState, useEffect } from "react";
import Footer from "../ScreenPages/Footer";
import Header from "../ScreenPages/Header";
import SideNav from "../ScreenPages/SideNav";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { Bounce, toast } from "react-toastify";

const departments = [
  { value: "Permanent", label: "Permanent" },
  { value: "Contract", label: "Contract" },
  { value: "Trainee", label: "Trainee" },
  { value: "Support", label: "Support" },
];

const RelievingReg = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm("");
  const [emp, setEmp] = useState([]);
  const [des, setDes] = useState([]);
  const [user, setUser] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const location = useLocation();

  const navigate = useNavigate();

  const getEmployeeId = () => {
    axios
      .get(`http://192.168.1.163:8092/employee/all`)
      .then((response) => {
        const formattedEmployeeList = response.data.map((user) => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.employeeId,
        }));
        console.log("Formatted employee list:", formattedEmployeeList);
        setEmp(formattedEmployeeList);
      })
      .catch((errors) => {
        console.log(errors);
      });
  };
  const getDesignation = () => {
    axios
      .get(`http://192.168.1.163:8092/designation/all`)

      .then((response) => {
        console.log(response.data);
        const formattedDesList = response.data.map((user) => ({
          label: user.designationTitle,
          value: user.designationTitle,
        }));

        setDes(formattedDesList);
        console.log(formattedDesList);
      })
      .catch((errors) => {
        console.log(errors);
      });
  };

  useEffect(() => {
    getEmployeeId();
    getDesignation();
  }, []);

  const onSubmit = (data) => {
    delete data.formattedDate;
    if (location && location.state && location.state.employeeId) {
      axios
        .put(
          `http://192.168.1.163:8092/relieving/${location.state.employeeId}`,
          data
        )
        .then((res) => {
          if (res.status === 200) {
            toast.success("Relieving Updated Successfully", {
              position: "top-right",
              transition: Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000, // Close the toast after 3 seconds
            });
          }
          console.log(res.data);
          setUser(res.data);
          navigate("/relievingview");
        })
        .catch((errors) => {
          if (errors.response) {
            const status = errors.response.status;
            let errorMessage = "";

            switch (status) {
              case 403:
                errorMessage = "Session TImeOut !";
                navigate("/");
                break;
              case 404:
                errorMessage = "Resource Not Found !";
                break;
              case 406:
                errorMessage = "Invalid Details !";
                break;
              case 500:
                errorMessage = "Server Error !";
                break;
              default:
                errorMessage = "An Error Occurred !";
                break;
            }

            toast.error(errorMessage, {
              position: "top-right",
              transition: Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000,
            });
          } else {
            toast.error("Network Error !", {
              position: "top-right",
              transition: Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000,
            });
          }
          console.log(errors);
        });
    } else {
      axios
        .post("http://192.168.1.163:8092/relieving/add", data)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Relieving Created Successfully", {
              position: "top-right",
              transition: Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000, // Close the toast after 3 seconds
            });
          }
          console.log(response.data);
          console.log(data);
          navigate("/relievingview");
        })
        .catch((errors) => {
          if (errors.response) {
            const status = errors.response.status;
            let errorMessage = "";

            switch (status) {
              case 403:
                errorMessage = "Session TImeOut !";
                navigate("/");
                break;
              case 404:
                errorMessage = "Resource Not Found !";
                break;
              case 406:
                errorMessage = "Employee Already Relieved !";
                break;
              case 500:
                errorMessage = "Server Error !";
                break;
              default:
                errorMessage = "An Error Occurred !";
                break;
            }

            toast.error(errorMessage, {
              position: "top-right",
              transition: Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000,
            });
          } else {
            toast.error("Network Error !", {
              position: "top-right",
              transition: Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000,
            });
          }

          console.log(errors);
        });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // 'en-GB' represents the format dd-mm-yyyy
  };

  useEffect(() => {
    if (location && location.state && location.state.employeeId) {
      axios
        .get(`http://192.168.1.163:8092/relieving/${location.state.employeeId}`)
        .then((response) => {
          console.log(response.data);
          const fetchedDate = response.data.date; // Assuming the date is in response.data.date
          const formattedDate = formatDate(fetchedDate);
          const employeeName = `${response.data.firstName} ${response.data.lastName}`;
          reset({
            ...response.data,
            employeeName,
            formattedDate,
          });
          // // Set the default value for the "Type of Employment" dropdown using setValue
          // const selectedEmploymentType = departments.find(option => option.value === response.data.typeOfEmployement);
          // console.log('Selected Employment Type:', selectedEmploymentType);
          // setValue("typeOfEmployement", selectedEmploymentType || null);
          setIsUpdating(true);
        })
        .catch((errors) => {
          // Error handling
        });
    }
  }, []);

  // set date of hiring date limit
  const nextThreeMonths = new Date();
  nextThreeMonths.setMonth(nextThreeMonths.getMonth() + 3);
  const threeMonthsFromNow = nextThreeMonths.toISOString().split("T")[0];

  return (
    <div className="wrapper">
      <SideNav />
      <div className="main">
        <Header />
        <main className="content">
          <div className="container-fluid p-0">
            <div className="row d-flex align-items-center justify-content-between mt-1">
              <div className="col">
                <h1 className="h3">
                  <strong>Employee Relieving Form</strong>
                </h1>
              </div>
              <div className="col-auto">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <a href="/main">Home</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="/relievingview">Relieving view</a>
                    </li>
                    <li className="breadcrumb-item active">
                      Relieving Employee
                    </li>
                  </ol>
                </nav>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <div
                      className="dropdown-divider"
                      style={{ borderTopColor: "#d7d9dd" }}
                    />
                    <h5 className="card-title ">
                      {isUpdating
                        ? "Employee Relieving Data"
                        : "Employee Relieving Form"}
                    </h5>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card-body">
                      <div className="row">
                        {isUpdating ? (
                          <div className="col-12 col-md-6 col-lg-5 mb-3">
                            <label className="form-label">Employee Name</label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              name="employeeName"
                              {...register("employeeName", {
                                required: true,
                              })}
                            />
                            {errors.employeeName && (
                              <p className="errorMsg">
                                Resignation Date Required
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="col-12 col-md-6 col-lg-5 mb-2">
                            <label className="form-label">
                              Select Employee Name
                            </label>
                            <Controller
                              name="employeeId"
                              control={control}
                              defaultValue={emp}
                              rules={{ required: true }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  options={emp}
                                  value={emp.find(
                                    (option) => option.value === field.value
                                  )}
                                  onChange={(val) => {
                                    field.onChange(val.value); // Send only the value
                                  }}
                                  placeholder="Select Employee Name"
                                />
                              )}
                            />
                            {errors && errors.employeeId && (
                              <p className="errorMsg">Employee Name Required</p>
                            )}
                          </div>
                        )}
                        <div className="col-lg-5"></div>
                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                          <label className="form-label">Designation</label>
                          <Controller
                            name="designation"
                            control={control}
                            defaultValue={des.length > 0 ? des[0] : null}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={des}
                                value={des.find(
                                  (option) => option.value === field.value
                                )}
                                onChange={(val) => {
                                  field.onChange(val.value); // Send only the value
                                }}
                                placeholder="Select Designation"
                              />
                            )}
                          />
                          {errors && errors.designation && (
                            <p className="errorMsg">Designation Required</p>
                          )}
                        </div>
                        <div className="col-lg-1"></div>
                        {isUpdating ? (
                          <div className="col-12 col-md-6 col-lg-5 mb-3">
                            <label className="form-label">
                              Type of Employement
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              name="typeOfEmployement"
                              {...register("typeOfEmployement", {
                                required: true,
                              })}
                            />
                            {errors.typeOfEmployement && (
                              <p className="errorMsg">
                                Resignation Date Required
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="col-12 col-md-6 col-lg-5 mb-3">
                            <label className="form-label">
                              Type of Employement
                            </label>
                            <Controller
                              className="form-select"
                              name="typeOfEmployement"
                              defaultValue=""
                              control={control}
                              rules={{ required: true }}
                              render={({ value }) => (
                                <Select
                                  options={departments}
                                  value={departments.find(
                                    (c) => c.value === value
                                  )}
                                  onChange={(val) => {
                                    setValue("typeOfEmployement", val.value);
                                  }}
                                  placeholder="Select Employement Type"
                                />
                              )}
                            />

                            {errors.typeOfEmployement && (
                              <p className="errorMsg">Employee Type Required</p>
                            )}
                          </div>
                        )}
                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                          <label className="form-label">
                            Date of Resignation
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            placeholder="Resignation Date"
                            name="resignationDate"
                            max={threeMonthsFromNow}
                            {...register("resignationDate", {
                              required: true,
                            })}
                          />
                          {errors.resignationDate && (
                            <p className="errorMsg">
                              Resignation Date Required
                            </p>
                          )}
                        </div>
                        <div className="col-lg-1"></div>
                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                          <label className="form-label">
                            Date of Last Working Day
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            placeholder="Last Working Date"
                            name="lastWorkingDate"
                            max={threeMonthsFromNow}
                            {...register("lastWorkingDate", {
                              required: true,
                            })}
                          />
                          {errors.lastWorkingDate && (
                            <p className="errorMsg">
                              Last Working Date Required
                            </p>
                          )}
                        </div>

                        <div
                          className="col-12  d-flex justify-content-end mt-5 "
                          style={{ background: "none" }}
                        >
                          <button
                            className={
                              isUpdating
                                ? "btn btn-danger bt-lg"
                                : "btn btn-primary btn-lg"
                            }
                            style={{ marginRight: "65px" }}
                            type="submit"
                          >
                            {isUpdating ? "Update Relieving" : "Add Relieving"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default RelievingReg;
