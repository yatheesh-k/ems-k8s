import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import { Eye, EyeSlash, Handbag } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import LayOut from "../../LayOut/LayOut";
import { DepartmentGetApi, DesignationGetApi, EmployeeGetApiById, EmployeePostApi, EmployeePutApiById, employeeUpdateByIdApi, employeeViewApi } from "../../Utils/Axios";

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
    }
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

  const apiUrl = "http://localhost:8092/ems/departmet";
  const token = sessionStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
    if (location && location.state && location.state.id) {
      const fetchData = async () => {
        try {
          const response = await EmployeeGetApiById(location.state.id);
          console.log(response.data);
          reset(response.data);
        } catch (error) {
          console.error('Error fetching company details:', error);
        }
      };

      fetchData();
    }
  }, [location.state]);

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
    // Constructing the payload
    let payload = {
      companyName: company,
      employeeType: data.type,
      emailId: data.emailId,
      password: data.password,
      designation: data.designation,
      location: data.location,
      manager: data.manager,
      roles: [data.role], // Assuming 'roles' is a single select, otherwise adjust accordingly
      status: data.status,
      accountNo: data.accountNo,
      ifscCode: data.ifscCode,
      bankName: data.bankName
    };
  
    // Add fields specific to creation (POST) request
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
        dateOfBirth: data.dateOfBirth
      };
    }
  
    try {
      if (location.state && location.state.id) {
        const response = await EmployeePutApiById(location.state.id, payload);
        console.log("Update successful", response.data);
        toast.success("Employee updated successfully");
        navigate("/employeeView");
        reset();
      } else {
        const response = await EmployeePostApi(payload);
        console.log("Employee created", response.data);
        toast.success("Employee created successfully");
        navigate("/employeeView");
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
          reset(response.data.data);
          setIsUpdating(true);
          // Set individual fields if necessary
          setValue('status', response.data.data.status.toString());

          // Assuming roles is an array and setting the first role
          setValue('roles', response.data.data.roles.length > 0 ? response.data.data.roles[0] : null);
        } catch (error) {
          console.error('Error fetching company details:', error);
        }
      };

      fetchData();
    }
  }, [location.state, reset, setValue]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
  };



  // set date of hiring date limit
  const nextThreeMonths = new Date();
  nextThreeMonths.setMonth(nextThreeMonths.getMonth() + 3);

  // Function to format date to dd/mm/yyyy
  const formatDateToDDMMYYYY = (date) => {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const threeMonthsFromNow = formatDateToDDMMYYYY(nextThreeMonths);

  console.log(threeMonthsFromNow); // Output: dd/mm/yyyy

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
                      <label className="form-label">Employee ID</label>
                      <input
                        type={isUpdating ? "text" : "text"}
                        readOnly={isUpdating}
                        className="form-control"
                        placeholder="Enter Employee ID"
                        name="employeeId"
                        // value={employeeId} for auto generating
                        onKeyDown={handleEmailChange}
                        // value={employeeId}
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
                      <label className="form-label">Designation</label>
                      <Controller
                        name="designation"
                        control={control}
                        defaultValue=""
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
                    {isUpdating && (
                      <div className="col-lg-1"></div>
                    )}
                    {isUpdating ? (
                      <></>
                    ) : (
                      <>
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

                      </>
                    )}
                    {!isUpdating && (
                      <div className="col-lg-1"></div>
                    )}                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Date of Birth</label>
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
                      />
                      {errors.dateOfBirth && (
                        <p className="errorMsg">Date of Hiring Required</p>
                      )}
                    </div>
                    {isUpdating && (
                      <div className="col-lg-1"></div>
                    )}

                    <div className="col-12 col-md-6 col-lg-5 mb-2">
                      <label className="form-label mb-3">Select Employee Status</label>
                      <Controller
                        name="status"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={[
                              { value: 0, label: "Active" },
                              { value: 1, label: "Inactive" },
                              { value: 2, label: "Notice Period" },
                              { value: 3, label: "Relieved" }
                            ]}
                            value={{
                              value: field.value,
                              label: ["Active", "Inactive", "Notice Period", "Relieved"][field.value],
                            }}
                            onChange={(val) => field.onChange(val.value)}
                            placeholder="Select Status"
                          />
                        )}
                      />
                      {errors.status && <p className="errorMsg">Employee Status is Required</p>}
                    </div>

                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-2">
                      <label className="form-label mb-3">Select Employee Role</label>
                      <Controller
                        name="role"
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

                    <div className="col-lg-6"></div>
                    <hr />
                    <h6 className="mt-2">Account Details</h6>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Account Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter account Number"
                        name="accountNo"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("accountNo", {
                          required: "Account Number Required",
                        })}
                      />
                      {errors.accountNo && (
                        <p className="errorMsg">{errors.accountNo.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Ifsc Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter ifsc code"
                        name="ifscCode"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("ifscCode", {
                          required: "IFSC Code Required",
                        })}
                      />
                      {errors.ifscCode && (
                        <p className="errorMsg">{errors.ifscCode.message}</p>
                      )}
                    </div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Bank Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter bank name"
                        name="bankName"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("bankName", {
                          required: "Bank Name  Required",
                        })}
                      />
                      {errors.bankName && (
                        <p className="errorMsg">{errors.bankName.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Uan Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter uan number"
                        name="uanNo"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("uanNo", {
                          required: "Uan  Required",
                        })}
                      />
                      {errors.uanNo && (
                        <p className="errorMsg">{errors.uanNo.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">PAN Number</label>
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
