import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import { Eye, EyeSlash, Handbag } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import LayOut from "../../LayOut/LayOut";

const EmployeeRegistration = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm("");
  const [user, setUser] = useState([]);
  const [dep, setDep] = useState([]);
  const [des, setDes] = useState([]);
  const [stat, setStat] = useState([]);
  const [role, setRole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // State to track if updating or creating
  const [employeeId, setEmployeeId] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };
  const handlePasswordChange = (e) => {
    setPasswordShown(e.target.value);
  };

  const handleEmailChange = (e) => {
    // Get the current value of the input field
    const value = e.target.value;

    // Check if the value is empty
    if (value.trim() !== "") {
      return; // Allow space button
    }

    // Prevent space character entry if the value is empty
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  const Employement = [
    { value: "Permanent", label: "Permanent" },
    { value: "Contract", label: "Contract" },
    { value: "Trainee", label: "Trainee" },
    { value: "Support", label: "Support" },
  ];

  useEffect(() => {
    // Retrieve companyName from session storage
    const storedCompanyName = sessionStorage.getItem("name");
    setCompanyName(storedCompanyName);

    // Generate employeeId only if data is not submitted
    if (!isDataSubmitted && storedCompanyName) {
      const generatedEmployeeId = generateEmployeeId(storedCompanyName);
      setEmployeeId(generatedEmployeeId);
    }
  }, [isDataSubmitted, companyName]);

  const generateEmployeeId = (companyName) => {
    const seriesCounter = sessionStorage.getItem("seriesCounter") || 1;
    const formattedSeriesCounter = String(seriesCounter).padStart(4, "0");
    const newEmployeeId =
      companyName.toUpperCase().substring(0, 3) + formattedSeriesCounter;

    return newEmployeeId;
  };

  const getDepartment = () => {
    return axios
      .get(`http://192.168.1.163:8092/department/all`)
      .then((response) => {
        const formattedDepList = response.data.map((dep) => ({
          label: dep.departmentTitle,
          value: dep.departmentTitle,
        }));
        console.log("Department data:", formattedDepList); // Log department data
        setDep(formattedDepList);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
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

  const getStatus = () => {
    axios
      .get(`http://192.168.1.163:8092/status/all`)
      .then((response) => {
        const statusesToInclude = ["Active", "Notice Period"]; // List of status names to include

        const filteredStatus = response.data.filter((role) =>
          statusesToInclude.includes(role.statusInfo)
        );

        console.log("Filtered data:", filteredStatus);

        console.log(response.data);
        const formattedStatusList = filteredStatus.map((user) => ({
          label: user.statusInfo,
          value: user.status,
        }));

        setStat(formattedStatusList);
        console.log(formattedStatusList);
      })
      .catch((errors) => {
        console.log(errors);
      });
  };
  const getRole = () => {
    axios
      .get(`http://192.168.1.163:8092/role/all`)
      .then((response) => {
        const filteredRoles = response.data.filter(
          (role) => role.role !== "Admin"
        );

        const formattedRoleList = filteredRoles.map((role) => ({
          label: role.role,
          value: role.role,
        }));
        setRole(formattedRoleList); // Set the formatted role list to the state variable
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    Promise.all([getDepartment(), getDesignation(), getStatus(), getRole()])
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

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

  const onSubmit = (data) => {
    if (location && location.state && location.state.employeeId) {
      axios
        .put(
          `http://192.168.1.163:8092/employee/${location.state.employeeId}`,
          data
        )
        .then((res) => {
          if (res.status === 200) {
            toast.success(" Employee Updated Successfully", {
              position: "top-right",
              transition: Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000, // Close the toast after 3 seconds
            });
          }
          console.log(res.data);
          setUser(res.data);
          navigate("/employeeview");
        })
        .catch((errors) => {
          if (errors.response) {
            const status = errors.response.status;
            let errorMessage = "";

            switch (status) {
              case 400:
                errorMessage = " Data Already Exist";
                break;
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
        .post("http://192.168.1.163:8092/employee/registration", data)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Employee Created Successfully", {
              position: "top-right",
              transition: Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000, // Close the toast after 3 seconds
            });
          }
          if (companyName) {
            const updatedEmployeeId = generateEmployeeId(companyName);
            setEmployeeId(updatedEmployeeId);
            setIsDataSubmitted(true);
          }
          console.log(response.data);
          console.log(data);
          navigate("/employeeview");
        })
        .catch((errors) => {
          if (errors.response) {
            const status = errors.response.status;
            let errorMessage = "";

            switch (status) {
              case 400:
                errorMessage = " Data Already Exist";
                break;
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
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
  };

  useEffect(() => {
    if (location && location.state && location.state.employeeId) {
      // setIsUpdating(true);
      axios
        .get(`http://192.168.1.163:8092/employee/${location.state.employeeId}`)
        .then((response) => {
          console.log(response.data);
          const formattedDateOfHiring = formatDate(response.data.dateOfHiring); // Format the date
          response.data.dateOfHiring = formattedDateOfHiring; // Update the date field in the response object
          reset(response.data);
          setIsUpdating(true);
        })
        .catch((errors) => {
          console.log(errors);
        });
    }
  }, [location.state]);

  // set date of hiring date limit
  const nextThreeMonths = new Date();
  nextThreeMonths.setMonth(nextThreeMonths.getMonth() + 3);
  const threeMonthsFromNow = nextThreeMonths.toISOString().split("T")[0];

  return (
    <LayOut>
      <div className="container-fluid p-0">
      <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
              <div className="col">
              <h1 className="h3 mb-3"><strong>Employee Registration</strong> </h1>
              </div>
              <div className="col-auto">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <a href="/main">Home</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="/employeeView">Employee View</a>
                    </li>
                    <li className="breadcrumb-item active">
                      Employee Registration
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title ">
                  {isUpdating ? "Employee Data" : "Employee Registration"}
                </h5>
                <div
                  className="dropdown-divider"
                  style={{ borderTopColor: "#d7d9dd" }}
                />
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row ">
                    {isUpdating ? (
                      <div className="col-12 col-md-6 col-lg-5 mb-3">
                        <label className="form-label">Employement Type </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Last Name"
                          name="employeeType"
                          readOnly
                          {...register("employeeType", {
                            required: "Last Name Required",
                            pattern: {
                              value: /^[A-Za-z ]+$/,
                              message:
                                "These fields accepts only Alphabetic Characters",
                            },
                          })}
                        />
                        {errors.employeeType && (
                          <p className="errorMsg">
                            {errors.employeeType.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="col-12 col-md-6 col-lg-5 mb-2">
                        <label className="form-label mb-3">
                          Select Employee Type
                        </label>
                        <Controller
                          className="form-select"
                          name="employeeType"
                          defaultValue=""
                          control={control}
                          rules={{ required: true }}
                          render={({ value }) => (
                            <Select
                              options={Employement}
                              value={Employement.find((c) => c.value === value)}
                              onChange={(val) => {
                                setValue("employeeType", val.value);
                              }}
                              placeholder=" Select Employee Type "
                            />
                          )}
                        />
                        {errors.employeeType && (
                          <p className="errorMsg">Employee Type is Required</p>
                        )}
                      </div>
                    )}
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Employee ID</label>
                      <input
                        type={isUpdating ? "text" : "text"}
                        readOnly={isUpdating}
                        className="form-control"
                        placeholder="Enter Employee ID"
                        name="employeeId"
                        // value={employeeId} for auto generating
                        onKeyDown={handleEmailChange}
                        value={employeeId}
                        // autoComplete='off' maxLength={10}
                        {...register("employeeId", {
                          required: "Employee Id Required",
                          pattern: {
                            value: /^[A-Z0-9]+$/,
                            message: "Characters are Not Allowed",
                          },
                        })}
                      />
                      {errors.employeeId && (
                        <p className="errorMsg">{errors.employeeId.message}</p>
                      )}
                    </div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter First Name"
                        name="firstName"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        onKeyDown={handleEmailChange}
                        {...register("firstName", {
                          required: "First Name Required",
                          pattern: {
                            value: /^[A-Za-z ]+$/,
                            message:
                              "These fields accepts only Alphabetic Characters",
                          },
                        })}
                      />
                      {errors.firstName && (
                        <p className="errorMsg">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Last Name"
                        name="lastName"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        onKeyDown={handleEmailChange}
                        {...register("lastName", {
                          required: "Last Name Required",
                          pattern: {
                            value: /^[A-Za-z ]+$/,
                            message:
                              "These fields accepts only Alphabetic Characters",
                          },
                        })}
                      />
                      {errors.lastName && (
                        <p className="errorMsg">{errors.lastName.message}</p>
                      )}
                    </div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Email Id</label>
                      <input
                        type={isUpdating ? "email" : "email"}
                        readOnly={isUpdating}
                        className="form-control"
                        placeholder="Enter Email"
                        name="emailId"
                        autoComplete="off"
                        onKeyDown={handleEmailChange}
                        {...register("emailId", {
                          required: "Email Id Required",
                          pattern: {
                            value:
                              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Please check the Email Id You Entered",
                          },
                        })}
                      />
                      {errors.emailId && (
                        <p className="errorMsg">{errors.emailId.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Date of Hiring</label>
                      <input
                        type={isUpdating ? "date" : "date"}
                        readOnly={isUpdating}
                        name="dateOfHiring"
                        placeholder="Enter Hiring Date"
                        className="form-control"
                        autoComplete="off"
                        max={threeMonthsFromNow}
                        {...register("dateOfHiring", {
                          required: true,
                        })}
                      />
                      {errors.dateOfHiring && (
                        <p className="errorMsg">Date of Hiring Required</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-2">
                      <label className="form-label">Department</label>
                      <Controller
                        name="department"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={dep}
                            value={dep.find(
                              (option) => option.value === field.value
                            )}
                            onChange={(val) => {
                              field.onChange(val.value); // Send only the value
                            }}
                            placeholder="Select Department"
                          />
                        )}
                      />
                      {errors && errors.department && (
                        <p className="errorMsg">Department Required</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-2">
                      <label className="form-label">Designation</label>
                      <Controller
                        name="designation"
                        defaultValue="" // Set the default department value
                        control={control}
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
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Manager</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Manager"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        onKeyDown={handleEmailChange}
                        {...register("manager", {
                          required: "Manager Required",
                          pattern: {
                            value: /^[A-Za-z ]+$/,
                            message:
                              "These fields accepts only Alphabetic Characters",
                          },
                        })}
                      />
                      {errors.manager && (
                        <p className="errorMsg">{errors.manager.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Location"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        onKeyDown={handleEmailChange}
                        {...register("location", {
                          required: "Location Required",
                          pattern: {
                            value: /^[A-Za-z ]+$/,
                            message:
                              "These fields accepts only Alphabetic Characters",
                          },
                        })}
                      />
                      {errors.location && (
                        <p className="errorMsg">{errors.location.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Password</label>
                      <div className="col-sm-12 input-group">
                        <input
                          className="form-control"
                          placeholder="Enter Password"
                          onChange={handlePasswordChange}
                          autoComplete="off"
                          onKeyDown={handleEmailChange}
                          type={passwordShown ? "text" : "password"}
                          {...register("password", {
                            required: "Password Required",
                            pattern: {
                              value:
                                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
                              message: "Invalid Password",
                            },
                          })}
                        />
                        <i
                          onClick={togglePasswordVisiblity}
                          style={{ margin: "5px" }}
                        >
                          {" "}
                          {passwordShown ? (
                            <Eye size={17} />
                          ) : (
                            <EyeSlash size={17} />
                          )}
                        </i>
                      </div>
                      {errors.password && (
                        <p className="errorMsg">{errors.password.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Status</label>
                      <Controller
                        name="status"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={stat}
                            value={stat.find(
                              (option) => option.value === field.value
                            )}
                            onChange={(val) => {
                              field.onChange(val.value); // Send only the value
                            }}
                            placeholder="Status Required"
                          />
                        )}
                      />
                      {errors && errors.status && (
                        <p className="errorMsg">Select Status</p>
                      )}
                    </div>

                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-2">
                      <label className="form-label">Role</label>
                      <Controller
                        name="role"
                        control={control}
                        defaultValue={role}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={role} // Ensure that role contains the correct data
                            value={role.find(
                              (option) => option.value === field.value
                            )}
                            onChange={(val) => {
                              field.onChange(val.value); // Send only the value
                            }}
                            placeholder="Select Role"
                          />
                        )}
                      />
                      {errors && errors.role && (
                        <p className="errorMsg">Role Required</p>
                      )}
                    </div>
                    <div className="col-lg-6"></div>
                    <hr />
                    <h6 className="mt-2">Account Details</h6>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Account Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter account Number"
                        name="ipAddress"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("ipAddress", {
                          required: "Ip Address Required",
                        })}
                      />
                      {errors.ipAddress && (
                        <p className="errorMsg">{errors.ipAddress.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Ifsc Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter ifsc code"
                        name="ipAddress"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("ipAddress", {
                          required: "Ip Address Required",
                        })}
                      />
                      {errors.ipAddress && (
                        <p className="errorMsg">{errors.ipAddress.message}</p>
                      )}
                    </div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Bank Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter bank name"
                        name="ipAddress"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("ipAddress", {
                          required: "Ip Address Required",
                        })}
                      />
                      {errors.ipAddress && (
                        <p className="errorMsg">{errors.ipAddress.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Bank Address</label>
                      <textarea
                        type="text"
                        className="form-control"
                        placeholder="Enter address"
                        name="ipAddress"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("ipAddress", {
                          required: "Ip Address Required",
                        })}
                      />
                      {errors.ipAddress && (
                        <p className="errorMsg">{errors.ipAddress.message}</p>
                      )}
                    </div>

                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Aadhaar Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter aadhar Number"
                        name="ipAddress"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("ipAddress", {
                          required: "Ip Address Required",
                        })}
                      />
                      {errors.ipAddress && (
                        <p className="errorMsg">{errors.ipAddress.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Uan Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter uan number"
                        name="ipAddress"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("ipAddress", {
                          required: "Ip Address Required",
                        })}
                      />
                      {errors.ipAddress && (
                        <p className="errorMsg">{errors.ipAddress.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">PAN Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter pan number"
                        name="ipAddress"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("ipAddress", {
                          required: "Ip Address Required",
                        })}
                      />
                      {errors.ipAddress && (
                        <p className="errorMsg">{errors.ipAddress.message}</p>
                      )}
                    </div>

                    <div
                      className="col-12 mt-4  d-flex justify-content-end"
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
                        {isUpdating ? "Update Employee" : "Add Employee"}{" "}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayOut>
  );
};

export default EmployeeRegistration;
