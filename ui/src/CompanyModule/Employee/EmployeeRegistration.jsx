import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import { Eye, EyeSlash, Handbag } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import LayOut from "../../LayOut/LayOut";
import { DepartmentGetApi, DesignationGetApi, EmployeeGetApiById, EmployeePatchApiById, EmployeePostApi, EmployeePutApiById, employeeUpdateByIdApi, employeeViewApi } from "../../Utils/Axios";

const EmployeeRegistration = () => {

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      status: "", // Initialize with default value or leave empty if fetching dynamically
      roles: ''
    },
  mode:"onChange",
  });
  const [view, setView] = useState([]);
  const [user, setUser] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [stat, setStat] = useState([]);
  const [role, setRole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // State to track if updating or creating
  const [employeeId, setEmployeeId] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [pending, setPending] = useState(false)
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

  const Roles = [
    { value: "Employee", label: "Employee" },
    { value: "Hr", label: "Hr" },
    { value: "Manager", label: "Manager" },
    { value: "Accountant", label: "Accountant" },
  ];

  const Status = [
    { value: "0", label: "Active" },
    { value: "1", label: "InActive" },
    { value: "2", label: "Notice Period" },
    { value: "3", label: "Relieved" }
  ]

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


  const fetchDepartments = async () => {
    try {
      const data = await DepartmentGetApi();
      setDepartments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignations = async () => {
    try {
      const data = await DesignationGetApi();
      setDesignations(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
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

  const onSubmit = async (data) => {
    const company = sessionStorage.getItem('company');
    let roles = data.roles;

  // Convert roles to an array if it's not already
  if (!Array.isArray(roles)) {
    roles = [roles];
  }
    // Constructing the payload
    let payload = {
      companyName: company,
      employeeType: data.type,
      emailId: data.emailId,
      password: data.password,
      designation: data.designation,
      location: data.location,
      manager: data.manager,
      roles: roles, 
      status: data.status,
      accountNo: data.accountNo,
      ifscCode: data.ifscCode,
      bankName: data.bankName
    };
  
    // Add fields specific to POST request
    if (!location.state || !location.state.id) {
      payload = {
        ...payload,
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfHiring: data.dateOfHiring,
        department: data.department,
        panNo: data.panNo,
        uanNo: data.uanNo,
        dateOfBirth: data.dateOfBirth,
        roles:roles
      };
    }
  
    try {
      if (location.state && location.state.id) {
        const response = await EmployeePatchApiById(location.state.id, payload);
        console.log("Update successful", response.data);
        toast.success("Employee updated successfully");
        setTimeout(() => {
          navigate("/employeeView");
        }, 2000); // Adjust the delay time as needed (in milliseconds)
    
        reset();
      } else {
        const response = await EmployeePostApi(payload);
        console.log("Employee created", response.data);
        toast.success("Employee created successfully");
        setTimeout(() => {
          navigate("/employeeView");
        }, 2000); // Adjust the delay time as needed (in milliseconds)
            reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    }
  };

  useEffect(() => {
    if (location && location.state && location.state.id) {
      const fetchData = async () => {
        try {
          const response = await EmployeeGetApiById(location.state.id);
          console.log(response.data);
          reset(response.data);
          setIsUpdating(true);
  
          // Assuming roles is an array and setting the first role
          setValue('status', response.data.data.status.toString());
  
          // Check if roles array has any items
          if (response.data.data.roles && response.data.data.roles.length > 0) {
            setValue('roles', response.data.data.roles[0]);
          } else {
            setValue('roles', null); // Or set default value as needed
          }
        } catch (error) {
          console.error('Error fetching company details:', error);
        }
      };
  
      fetchData();
    }
  }, [location.state,reset,setValue]);
  
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
  };
  const today = new Date();
  const threeMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()).toISOString().split('T')[0];
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
  
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
  
    return `${year}-${month}-${day}`;
  };
  


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
                        <label className="form-label">Employement Type <span style={{ color: "red" }}>*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Last Name"
                          name="type"
                          readOnly
                          {...register("type", {
                            required: "Last Name Required",
                            pattern: {
                              value: /^[A-Za-z ]+$/,
                              message:
                                "These fields accepts only Alphabetic Characters",
                            },
                          })}
                        />
                        {errors.type && (
                          <p className="errorMsg">
                            {errors.type.message}
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
                          name="type"
                          defaultValue=""
                          control={control}
                          rules={{ required: true }}
                          render={({ value }) => (
                            <Select
                              options={Employement}
                              value={Employement.find((c) => c.value === value)}
                              onChange={(val) => {
                                setValue("type", val.value);
                              }}
                              placeholder=" Select Employee Type "
                            />
                          )}
                        />
                        {errors.type && (
                          <p className="errorMsg">Employee Type is Required</p>
                        )}
                      </div>
                    )}
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Employee ID <span style={{ color: "red" }}>*</span></label>
                      <input
                        type={isUpdating ? "text" : "text"}
                        readOnly={isUpdating}
                        className="form-control"
                        placeholder="Enter Employee ID"
                        name="employeeId"
                        minLength={6}  maxLength={10}
                        onKeyDown={handleEmailChange}
                         autoComplete='off' 
                        {...register("employeeId", {
                          required: "Employee Id Required",
                          pattern: {
                            value: /^[A-Z0-9]+$/,
                            message: "Characters are Not Allowed",
                          },
                          minLength: {
                            value: 6,
                            message: "Company Address must not exceed 6 characters",
                          },
                          maxLength: {
                            value: 10,
                            message: "Company Address must not exceed 10 characters",
                          },
                        })}
                      />
                      {errors.employeeId && (
                        <p className="errorMsg">{errors.employeeId.message}</p>
                      )}
                    </div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">First Name <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter First Name"
                        name="firstName"
                        onInput={toInputTitleCase}
                        minLength={2}
                        autoComplete="off"
                        onKeyDown={handleEmailChange}
                        {...register("firstName", {
                          required: "First Name Required",
                          pattern: {
                            value: /^[A-Za-z ]+$/,
                            message:
                              "These fields accepts only Alphabetic Characters",
                          },
                          minLength: {
                            value: 2,
                            message: "Company Address must exceed min 2 characters",
                          },
                        })}
                      />
                      {errors.firstName && (
                        <p className="errorMsg">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Last Name <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Last Name"
                        name="lastName"
                        minLength={2}
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
                          minLength: {
                            value: 2,
                            message: "Company Address must exceed min 2 characters",
                          },
                        })}
                      />
                      {errors.lastName && (
                        <p className="errorMsg">{errors.lastName.message}</p>
                      )}
                    </div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Email Id <span style={{ color: "red" }}>*</span></label>
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
                            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message:"No Spaces allowed Entered value does not match email format",
                          },
                        })}
                      />
                      {errors.emailId && (
                        <p className="errorMsg">{errors.emailId.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Date of Hiring <span style={{ color: "red" }}>*</span></label>
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
                      <label className="form-label">Department <span style={{ color: "red" }}>*</span></label>
                      <Controller
                        name="department"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }} 
                        render={({ field }) => (
                          <select {...field} className="form-select" >
                            <option value="" disabled>Select a department</option>
                            {departments.map(department => (
                              <option key={department.id} value={department.name}>
                                {department.name}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      {errors && errors.department && (
                        <p className="errorMsg">Department Required</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-2">
                      <label className="form-label">Designation <span style={{ color: "red" }}>*</span></label>
                      <Controller
                        name="designation"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }} 
                        render={({ field }) => (
                          <select {...field} className="form-select" >
                            <option value="" disabled>Select a designation</option>
                            {designations.map(designation => (
                              <option key={designation.id} value={designation.name}>
                                {designation.name}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      {errors && errors.designation && (
                        <p className="errorMsg">Designation Required</p>
                      )}
                    </div>

                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Manager <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Manager"
                        onInput={toInputTitleCase}
                        autoComplete="off"   minLength={2}
                        onKeyDown={handleEmailChange}
                        {...register("manager", {
                          required: "Manager Required",
                          pattern: {
                            value: /^[A-Za-z ]+$/,
                            message:
                              "These fields accepts only Alphabetic Characters",
                          },
                          minLength: {
                            value: 2,
                            message: "Company Address must exceed min 2 characters",
                          },
                        })}
                      />
                      {errors.manager && (
                        <p className="errorMsg">{errors.manager.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Location <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Location"
                        onInput={toInputTitleCase}
                        autoComplete="off"  minLength={2}
                        onKeyDown={handleEmailChange}
                        {...register("location", {
                          required: "Location Required",
                          pattern: {
                            value: /^[A-Za-z ]+$/,
                            message:
                              "These fields accepts only Alphabetic Characters",
                          },
                          minLength: {
                            value: 2,
                            message: "Location must exceed min 2 characters",
                          },
                        })}
                      />
                      {errors.location && (
                        <p className="errorMsg">{errors.location.message}</p>
                      )}
                    </div>
                    {isUpdating && (
                      <div className="col-lg-1"></div>
                    )}
                    {isUpdating ? (
                      <></>
                    ) : (
                      <>
                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                          <label className="form-label">Password <span style={{ color: "red" }}>*</span></label>
                          <div className="col-sm-12 input-group">
                            <input
                              className="form-control"
                              placeholder="Enter Password"
                              onChange={handlePasswordChange}
                              autoComplete="off"
                              onKeyDown={handleEmailChange} maxLength={16}
                              type={passwordShown ? "text" : "password"}
                              {...register("password", {
                                required: "Password Required",
                                pattern: {
                                  value:
                                    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,16}$/,
                                  message: "Invalid Password",
                                },
                                minLength: {
                                  value: 2,
                                  message: "Password must exceed min 2 characters",
                                },
                                maxLength: {
                                  value: 16,
                                  message: "Password must not exceed 2 characters",
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

                      </>
                    )}
                    {!isUpdating && (
                      <div className="col-lg-1"></div>
                    )}                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Date of Birth <span style={{ color: "red" }}>*</span></label>
                      <input
                        type={isUpdating ? "date" : "date"}
                        readOnly={isUpdating}
                        name="dateOfBirth"
                        placeholder="Enter Hiring Date"
                        className="form-control"
                        autoComplete="off"
                        {...register("dateOfBirth", {
                          required: true,
                        })}
                        max={getCurrentDate() }
                        {...register("dateOfBirth", {
                          required: true,
                        })}
                      />
                      {errors.dateOfBirth && (
                        <p className="errorMsg">Date of Hiring Required</p>
                      )}
                    </div>
                    {isUpdating && (
                      <div className="col-lg-1"></div>
                    )}

                    <div className="col-12 col-md-6 col-lg-5 mb-2">
                      <label className="form-label mb-3">Employee Status <span style={{ color: "red" }}>*</span></label>
                      <Controller
                        name="status"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={[
                              { value: 0, label: "OnBoarding" },
                              { value: 1, label: "Active" },
                              { value: 2, label: "Inactive" },
                              { value: 3, label: "Notice Period" },
                              { value: 4, label: "Relieved" }
                            ]}
                            value={{
                              value: field.value,
                              label: ["OnBoarding","Active", "Inactive", "Notice Period", "Relieved"][field.value],
                            }}
                            onChange={(val) => field.onChange(val.value)}
                            placeholder="Select Status"
                          />
                        )}
                      />
                      {errors.status && <p className="errorMsg">Employee Status is Required</p>}
                    </div>

                    <div className="col-lg-1"></div>
                    {isUpdating ? (
                      <div className="col-12 col-md-6 col-lg-5 mb-3">
                        <label className="form-label">Role <span style={{ color: "red" }}>*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Last Name"
                          name="roles"
                          readOnly
                          {...register("roles", {
                            required: "Role is Required",
                            pattern: {
                              value: /^[A-Za-z ]+$/,
                              message:
                                "These fields accepts only Alphabetic Characters",
                            },
                          })}
                        />
                        {errors.roles && (
                          <p className="errorMsg">
                            {errors.type.message}
                          </p>
                        )}
                      </div>
                    ) : (
                    <div className="col-12 col-md-6 col-lg-5 mb-2">
                      <label className="form-label mb-3">Select Employee Role</label>
                      <Controller
                        name="roles"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={Roles}
                            value={Roles.find(option => option.value === field.value)}
                            onChange={(val) => field.onChange(val.value)}
                            placeholder="Select Role"
                          />
                        )}
                      />
                      {errors.roles && <p className="errorMsg">Employee Role is Required</p>}
                    </div>
                    )}
                    <div className="col-lg-6"></div>
                    <hr />
                    <h4 className="m-2 mb-3">Account Details <span style={{ color: "red" }}>*</span></h4>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Account Number <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter account Number"
                        name="accountNo"
                        onInput={toInputTitleCase}
                        onKeyDown={handleEmailChange}
                        autoComplete="off"
                        {...register("accountNo", {
                          required: "Account Number Required",
                          pattern: {
                            value: /^\d{9,18}$/,
                            message:
                              "These fields accepts only Integers.No Spaces Allowed",
                          },
                          // minLength: {
                          //   value: 9,
                          //   message: "Account Number must exceed min 9 numbers",
                          // },
                          maxLength: {
                            value: 18,
                            message: "Account Number must not exceed 18 characters",
                          },
                        })}
                      />
                      {errors.accountNo && (
                        <p className="errorMsg">{errors.accountNo.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Ifsc Code <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter ifsc code"
                        name="ifscCode"
                        onInput={toInputTitleCase}
                        onKeyDown={handleEmailChange}
                        autoComplete="off"
                        {...register("ifscCode", {
                          required: "IFSC Code Required",
                          pattern: {
                            value: /^[A-Za-z]{4}0[A-Z0-9]{6}$/,
                            message:
                              "Please enter a valid IFSC code.Spaces Not Allowed ",
                          },
                          maxLength: {
                            value: 11,
                            message: "IFSC Code must not exceed 11 characters",
                          },
                        })}
                      />
                      {errors.ifscCode && (
                        <p className="errorMsg">{errors.ifscCode.message}</p>
                      )}
                    </div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Bank Name <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter bank name"
                        name="bankName"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("bankName", {
                          required: "Bank Name  Required",
                          pattern: {
                            value: /^[A-Za-z&'(),./\- ]{1,100}$/,
                            message:
                              "Allows only Alphabets and special Characters",
                          },
                          maxLength: {
                            value: 50,
                            message: "Bank Name must not exceed 50 characters",
                          },
                        })}
                      />
                      {errors.bankName && (
                        <p className="errorMsg">{errors.bankName.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Uan Number <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter uan number"
                        name="uanNo"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("uanNo", {
                          required: "Uan Required",
                          pattern: {
                            value: /^\d{12}$/,
                            message:
                              "Allows only Integers",
                          },
                          maxLength: {
                            value: 12,
                            message: "UAN Number must not exceed 12 characters",
                          },
                        })}
                      />
                      {errors.uanNo && (
                        <p className="errorMsg">{errors.uanNo.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">PAN Number <span style={{ color: "red" }}>*</span></label>
                      <input
                        type={isUpdating ? "text" : "text"}
                        readOnly={isUpdating}
                        className="form-control"
                        placeholder="Enter pan number"
                        name="panNo"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("panNo", {
                          required: "Pan Number Required",
                          maxLength: {
                            value: 10,
                            message: "Pan Number must not exceed 10 characters",
                          },
                          pattern: {
                            value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                            message:
                              "Pan Number should be in the format: ABCDE1234F.Spaces are not allowed",
                          },
                        })}
                      />
                      {errors.panNo && (
                        <p className="errorMsg">{errors.panNo.message}</p>
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
