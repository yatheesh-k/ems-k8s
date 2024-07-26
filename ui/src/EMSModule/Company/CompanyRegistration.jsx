import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import LayOut from "../../LayOut/LayOut";
import {
  CompanyRegistrationApi,
  companyUpdateByIdApi,
  companyViewByIdApi,
} from "../../Utils/Axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const CompanyRegistration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onChange' });
  const [postImage, setPostImage] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [passwordShown, setPasswordShown] = useState("");
  const [editMode, setEditMode] = useState(false); // State to track edit mode

  const location = useLocation();
  const navigate = useNavigate();

  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };
  const handlePasswordChange = (e) => {
    setPasswordShown(e.target.value);
  };
  const handleEmailChange = (e) => {
    const value = e.target.value;
    if (value.trim() !== "") {
      return;
    }
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  const handleCompanyTypeChange = (e) => {
    setCompanyType(e.target.value);
  };

  const onChangePicture = (e) => {
    setPostImage(URL.createObjectURL(e.target.files[0]));
  };

  const onSubmit = async (data) => {
    try {
      const updateData = {
        password: data.password,
        companyAddress: data.companyAddress,
        mobileNo: data.mobileNo,
        landNo: data.landNo,
        name: data.name,
        personalMailId: data.personalMailId,
        personalMobileNo: data.personalMobileNo,
        address: data.address,
        companyType: data.companyType,
        // Add other fields as needed
      };

      if (location.state && location.state.id) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await companyUpdateByIdApi(location.state.id, updateData);
        setTimeout(() => {
          toast.success("Company updated successfully");
          navigate("/companyView");
          reset();
        }, 900);
      } else {
        await CompanyRegistrationApi(data);
        setTimeout(() => {
          toast.success("Company created successfully");
          navigate("/companyView");
          reset();
        }, 1000);
      }
    } catch (error) {
      handleApiErrors(error)
    }
  };

  useEffect(() => {
    if (location && location.state && location.state.id) {
      const fetchData = async () => {
        try {
          const response = await companyViewByIdApi(location.state.id);
          console.log(response.data);
          reset(response.data);
          setCompanyType(response.data.companyType);
          setEditMode(true);
        } catch (error) {
          handleApiErrors(error);
        }
      };

      fetchData();
    }
  }, [location.state]);


  const handleApiErrors = (error) => {
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
      const errorMessage = error.response.data.error.message;
      toast.error(errorMessage);
    } else {
      toast.error("Network Error !");
    }
    console.error(error.response);
  };

  const toInputTitleCase = (e) => {
    const inputValue = e.target.value;
    let newValue = "";
    let capitalizeNext = true;

    for (let i = 0; i < inputValue.length; i++) {
      const char = inputValue.charAt(i);
      if (char === " ") {
        // Allow spaces if they are not leading spaces
        if (newValue.length > 0) {
          newValue += " ";
          capitalizeNext = true; // Next character should be capitalized
        }
      } else if (capitalizeNext) {
        // Capitalize the first letter of each word
        newValue += char.toUpperCase();
        capitalizeNext = false;
      } else {
        // Preserve lowercase characters in between words
        newValue += char.toLowerCase();
      }
    }
    // Update the input field value
    e.target.value = newValue;
  };



  const toInputLowerCase = (e) => {
    const inputValue = e.target.value;
    let newValue = "";
    for (let i = 0; i < inputValue.length; i++) {
      const char = inputValue.charAt(i);
      if (char.match(/[a-z]/)) {
        // Only allow lowercase letters
        newValue += char;
      }
    }
    e.target.value = newValue;
  };

  const toInputSpaceCase = (e) => {
    let inputValue = e.target.value;
    let newValue = "";

    // Remove spaces from the beginning of inputValue
    inputValue = inputValue.trim();

    // Track if we've encountered any non-space character yet
    let encounteredNonSpace = false;

    for (let i = 0; i < inputValue.length; i++) {
      const char = inputValue.charAt(i);
      if (char.match(/[a-zA-Z0-9]/) || (encounteredNonSpace && char === " ")) {
        // Allow any alphabetic characters (both lowercase and uppercase)
        // Allow numbers and spaces only after encountering non-space characters
        if (char !== " ") {
          encounteredNonSpace = true;
        }
        newValue += char;
      }
    }

    e.target.value = newValue.toLowerCase(); // Convert to lowercase (if needed)
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setPostImage(base64);
  };

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
          <div className="col">
            <h1 className="h3 mb-3">
              <strong>Company Registration</strong>{" "}
            </h1>
          </div>
          <div className="col-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="/main">Home</a>
                </li>
                <li className="breadcrumb-item active">Company Registration</li>
              </ol>
            </nav>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header ">
                  <div className="d-flex justify-content-start align-items-start">
                    <h5 className="card-title me-2">Company Type</h5>
                    <span className="text-danger">
                      {errors.companyType && (
                        <p className="mb-0">{errors.companyType.message}</p>
                      )}
                    </span>
                  </div>
                  <hr
                    className="dropdown-divider"
                    style={{ borderTopColor: "#d7d9dd", width: "100%" }}
                  />
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <div>
                        <label>
                          <input
                            type="radio"
                            name="companyType"
                            value="Private Limited"
                            style={{ marginRight: "10px" }}
                            {...register("companyType", {
                              required: !editMode ? "Please select your Company Type" : false,
                            })}
                            disabled={editMode}
                          />
                          Private Limited
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="ml-3">
                        <input
                          type="radio"
                          name="companyType"
                          value="Firm"
                          style={{ marginRight: "10px" }}
                          {...register("companyType", {
                            required: !editMode ? "Please select your Company Type" : false,
                          })}
                          disabled={editMode}
                        />
                        Firm
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Company Details</h5>
                  <div
                    className="dropdown-divider"
                    style={{ borderTopColor: "#d7d9dd" }}
                  />
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Company Name <span style={{ color: "red" }}>*</span>{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Company Name"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("companyName", {
                          required: "Company Name is required",
                          pattern: {
                            value: /^[a-zA-Z\s,.'\-\/]*$/,
                            message: "Field accepts only alphabets and special characters:( , ' -  . /)",
                          },
                          minLength: {
                            value: 2,
                            message: "minimum 2 characters required",
                          },
                        })}
                        disabled={editMode}
                      />
                      {errors.companyName && (
                        <p className="errorMsg">{errors.companyName.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Short Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        onInput={toInputLowerCase}
                        placeholder="Enter Short Name"
                        autoComplete="off"
                        {...register("shortName", {
                          required: "Short Name is required",
                          pattern: {
                            value: /^[a-z]+$/,
                            message:
                              "No Spaces allowed. These fields only accept small cases only.",
                          },
                          minLength: {
                            value: 2,
                            message: "minimum 2 characters required",

                          },
                          maxLength: {
                            value: 16,
                            message: "minimum 2 and maximum 16 characters allowed",
                          },
                        })}
                        disabled={editMode}
                      />
                      {errors.shortName && (
                        <p className="errorMsg">{errors.shortName.message}</p>
                      )}
                    </div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Company MailId <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter Company MailId"
                        autoComplete="off"
                        onKeyDown={handleEmailChange}
                        {...register("emailId", {
                          required: "Company MailId is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message:
                              "No Spaces allowed Entered value does not match email format",
                          },
                        })}
                        disabled={editMode}
                      />
                      {errors.emailId && (
                        <p className="errorMsg">{errors.emailId.message}</p>
                      )}
                    </div>
                    {editMode ? (
                      <> 
                      <div className="col-lg-1"></div>
                      <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Contact Number <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter Contact Number"
                        autoComplete="off"
                        onKeyDown={handleEmailChange}
                        {...register("landNo", {
                          required: "Contact Number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message:
                              "Contact Number should contain only 10 numbers. ",
                          },
                        })}
                      />
                      {errors.landNo && (
                        <p className="errorMsg">{errors.landNo.message}</p>
                      )}
                    </div>
                    </>
                    ) : (
                      <>
                        <div className="col-lg-1"></div>
                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                          <label className="form-label">
                            Password <span style={{ color: "red" }}>*</span>
                          </label>
                          <div className="col-sm-12 input-group">
                            <input
                              className="form-control"
                              placeholder="Enter Password"
                              onChange={handlePasswordChange}
                              autoComplete="off"
                              onKeyDown={handleEmailChange}
                              type={passwordShown ? "text" : "password"}
                              {...register("password", {
                                required: "Password is Required",
                                pattern: {
                                  value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,16}$/,
                                  message:
                                    "Password must contain at least 6 characters, including one uppercase letter, one lowercase letter, one number, and one special character.",
                                },
                                minLength: {
                                  value: 6,
                                  message: "Minimum 6 characters required",
                                },
                                maxLength: {
                                  value: 16,
                                  message: "Minimum 6 & maximum 16 characters allowed",
                                },
                              })}
                            />
                            <i onClick={togglePasswordVisiblity} style={{ margin: "5px" }}>
                              {passwordShown ? <Eye size={17} /> : <EyeSlash size={17} />}
                            </i>
                          </div>
                          {errors.password && (
                            <p className="errorMsg">{errors.password.message}</p>
                          )}
                        </div>
                      </>
                    )}
                    {!editMode &&(
                      <>
    <div className="col-12 col-md-6 col-lg-5 mb-3">
    <label className="form-label">
      Contact Number <span style={{ color: "red" }}>*</span>
    </label>
    <input
      type="tel"
      className="form-control"
      placeholder="Enter Contact Number"
      autoComplete="off"
      onKeyDown={handleEmailChange}
      {...register("landNo", {
        required: "Contact Number is required",
        pattern: {
          value: /^[0-9]{10}$/,
          message:
            "Contact Number should contain only 10 numbers. ",
        },
      })}
    />
    {errors.landNo && (
      <p className="errorMsg">{errors.landNo.message}</p>
    )}
  </div>

  <div className="col-lg-1"></div>
  </>
                    )}
                
                    <div className="col-12 col-md-6 col-lg-5 mb-2">
                      <label className="form-label">
                        Alternate Number <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter Mobile Number"
                        autoComplete="off"
                        onKeyDown={handleEmailChange}
                        {...register("mobileNo", {
                          required: "Mobile Number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message:
                              "Alternate Number should contain only 10 numbers",
                          },
                        })}
                      />
                      {errors.mobileNo && (
                        <p className="errorMsg">{errors.mobileNo.message}</p>
                      )}
                    </div>
                    {editMode &&(
                       <div className="col-lg-1"></div>

                    )}

                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Company Address <span style={{ color: "red" }}>*</span>
                      </label>
                      <textarea
                        type="text"
                        className="form-control"
                        placeholder="Enter Company Address"
                        onKeyDown={handleEmailChange}
                        autoComplete="off"
                        {...register("companyAddress", {
                          required: "Company Address is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s,'#,&*()^\-/.]*$/,
                            message:
                              "Please enter valid Address",
                          },
                          maxLength: {
                            value: 100,
                            message: "maximum 100 characters allowed",
                          },
                        })}
                      />
                      {errors.companyAddress && (
                        <p className="errorMsg">
                          {errors.companyAddress.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Company Registration Details</h5>
                  <div
                    className="dropdown-divider"
                    style={{ borderTopColor: "#d7d9dd" }}
                  />
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">Company CIN Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Company CIN number"
                        onKeyDown={handleEmailChange}
                        autoComplete="off"
                        maxLength={21}
                        {...register("cinNo", {
                          required: "Company CIN Number is required",
                          maxLength: {
                            value: 21,
                            message: "CIN Number must not exceed 21 characters",
                          },
                          pattern: {
                            value: /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/,

                            message:
                              "Invalid CIN Number format",
                          },
                        })}
                        disabled={editMode}
                      />
                      {errors.cinNo && (
                        <p className="errorMsg">{errors.cinNo.message}</p>
                      )}

                    </div>

                    <div className="col-lg-1"></div>

                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Company Register Number{" "}
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Company Registration Number"
                        onKeyDown={handleEmailChange}
                        autoComplete="off"
                        maxLength={21}
                        {...register("companyRegNo", {
                          required: "Company Register Number is required",
                          maxLength: {
                            value: 21,
                            message: "Registration Number must not exceed 21 characters",
                          },
                          pattern: {
                            value: /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/,

                            message:
                              "Invalid Registration Number format",
                          },
                        })}
                        disabled={editMode}
                      />
                      {errors.companyRegNo && (
                        <p className="errorMsg">{errors.companyRegNo.message}</p>
                      )}
                    </div>

                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Company GST Number{" "}
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Company GST number"
                        autoComplete="off"
                        onKeyDown={handleEmailChange}
                        maxLength={15}
                        {...register("gstNo", {
                          required: "Company GST Number is required",
                          maxLength: {
                            value: 15,
                            message: "GST Number must not exceed 15 characters",
                          },
                          pattern: {
                            value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,

                            message:
                              "Invalid GST Number",
                          },
                        })}
                        disabled={editMode}
                      />
                      {errors.gstNo && <p className="errorMsg">{errors.gstNo.message}</p>}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Company PAN Number{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Company PAN number"
                        autoComplete="off"
                        onKeyDown={handleEmailChange}
                        maxLength={10}
                        {...register("panNo", {
                          required: "Company Pan Number is required",
                          maxLength: {
                            value: 10,
                            message: "PAN Number must not exceed 10 characters",
                          },
                          pattern: {
                            value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                            message:
                              "PAN Number should be in the format: ABCDE1234F",
                          },
                        })}
                        disabled={editMode}
                      />
                      {errors.panNo && (
                        <p className="errorMsg">{errors.panNo.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Authorized Details</h5>
                  <div
                    className="dropdown-divider"
                    style={{ borderTopColor: "#d7d9dd" }}
                  />
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Authorized Name"
                        onKeyDown={handleEmailChange}
                        maxLength={20}
                        autoComplete="off"
                        {...register("name", {
                          required: "Name is required",
                          maxLength: {
                            value: 20,
                            message: "Name must not exceed 20 characters",
                          },
                          pattern: {
                            value: /^[a-zA-Z\s]*$/,
                            message: "Name should contain only alphabets",
                          },
                        })}
                      />
                      {errors.name && (
                        <p className="errorMsg">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Personal MailId <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter MailId"
                        autoComplete="off"
                        onKeyDown={handleEmailChange}
                        {...register("personalMailId", {
                          required: "MailId is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message:
                              "Entered value does not match email format",
                          },
                        })}
                      />
                      {errors.personalMailId && (
                        <p className="errorMsg">
                          {errors.personalMailId.message}
                        </p>
                      )}
                    </div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Personal Mobile Number{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter Mobile Number"
                        autoComplete="off"
                        onKeyDown={handleEmailChange}
                        maxLength={10}
                        {...register("personalMobileNo", {
                          required: "Mobile Number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message:
                              "Mobile Number should be exactly 10 digits long and should contain only numbers",
                          },
                        })}
                      />
                      {errors.personalMobileNo && (
                        <p className="errorMsg">
                          {errors.personalMobileNo.message}
                        </p>
                      )}
                    </div>

                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Address <span style={{ color: "red" }}>*</span>
                      </label>
                      <textarea
                        type="text"
                        className="form-control"
                        placeholder="Enter Address"
                        autoComplete="off"
                        onKeyDown={handleEmailChange}
                        maxLength={100}
                        {...register("address", {
                          required: "Address is required",
                          maxLength: {
                            value: 100,
                            message: "Name must not exceed 100 characters",
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9\s,'#,&*()^\-/.]*$/,
                            message: "Please enter valid Address",
                          },
                        })}
                      />
                      {errors.address && (
                        <p className="errorMsg">{errors.address.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-1"></div>
          <div className="col-12 d-flex justify-content-end mt-5"
            style={{ background: "none" }}
          >
            <button type="submit" className="btn btn-primary btn-lg" style={{ marginRight: "65px" }}>
              {editMode ? 'Update Company' : 'Submit'}
            </button>
          </div>
        </form>
      </div >
    </LayOut >
  );
};

export default CompanyRegistration;