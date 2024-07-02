import axios from "axios";
import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import LayOut from "../../LayOut/LayOut";
import { CompanyRegistrationApi, companyUpdateByIdApi, companyViewByIdApi} from "../../Utils/Axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const CompanyRegistration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const [postImage, setPostImage] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordShown, setPasswordShown] = useState("");
  const location=useLocation();

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
        companyType: data.companyType
        // Add other fields as needed
      };
      if (location.state && location.state.id) {
        const response = await companyUpdateByIdApi(location.state.id, updateData);
        console.log("Update successful", response.data);
        toast.success("Company updated successfully");
        reset()
      } else {
        const response = await CompanyRegistrationApi(data);
        console.log("Company created", response.data);
        toast.success("Company created successfully");
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
          const response = await companyViewByIdApi(location.state.id);
          console.log(response.data);
          reset(response.data);
        } catch (error) {
          console.error('Error fetching company details:', error);
          setErrorMsg('Failed to fetch company details');
        }
      };
  
      fetchData();
    }
  }, [location.state]);
  
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
        <h1 className="h3 mb-3">
          <strong>Company Registration</strong>
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Company Type</h5>
                  <div
                    className="dropdown-divider"
                    style={{ borderTopColor: "#d7d9dd" }}
                  />
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      {/* <label className="form-label">Company Type</label> */}
                      <div>
                        <label>
                          <input
                            type="radio"
                            label='Private Limited'
                            name="companyType"
                            value="Private Limited"
                            style={{ marginRight: "10px" }}
                            {...register("companyType", {
                                required: "Please select your Company Type"
                              })}
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
                            label='Firm'
                            name="companyType"
                            value="Firm"
                            style={{ marginRight: "10px" }}
                            {...register("companyType", {
                                required: "Please select your Company Type"
                              })}
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
                            value: /^[A-Za-z0-9 ]+$/,
                            message:
                              "Thse fileds only accepct Alphabets & Numbers",
                          },
                        })}
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
                        placeholder="Enter Short Name"
                        autoComplete="off"
                        {...register("shortName", {
                          required: "Short Name is required",
                          pattern: {
                            value: /^[A-Za-z0-9 ]+$/,
                            message:
                              "Thse fileds only accepct Alphabets & Numbers",
                          },
                        })}
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
                        {...register("emailId", {
                          required: "Company MailId is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message:
                              "Entered value does not match email format",
                          },
                        })}
                      />
                      {errors.emailId && (
                        <p className="errorMsg">{errors.emailId.message}</p>
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
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Land Number <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter Land Number"
                        autoComplete="off"
                        {...register("landNo", {
                          required: "Land Number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message:
                              "Land Number should contain only 10 numbers",
                          },
                        })}
                      />
                      {errors.landNo && (
                        <p className="errorMsg">{errors.landNo.message}</p>
                      )}
                    </div>

                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-2">
                      <label className="form-label">
                        Mobile Number <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter Mobile Number"
                        autoComplete="off"
                        {...register("mobileNo", {
                          required: "Mobile Number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message:
                              "Mobile Number should contain only 10 numbers",
                          },
                        })}
                      />
                      {errors.mobileNo && (
                        <p className="errorMsg">{errors.mobileNo.message}</p>
                      )}
                    </div>

                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Company Address <span style={{ color: "red" }}>*</span>
                      </label>
                      <textarea
                        type="text"
                        className="form-control"
                        placeholder="Enter Company Address"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("companyAddress", {
                          required: "Company Address is required",
                          pattern: {
                            value:  /^[a-zA-Z0-9\s#./-]*$/,
                            message:
                              "Thse fileds only accepct Alphabets & Numbers",
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
                      <label className="form-label">Company CIN Number </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Company CIN Number"
                        onInput={toInputTitleCase}
                        autoComplete="off"
                        {...register("cinNo", {
                          required: "Company CIN Number is required",
                          pattern: {
                            value: /^[A-Za-z0-9 ]+$/,
                            message:
                              "Thse fileds only accepct Alphabets & Numbers",
                          },
                        })}
                      />
                      {errors.cinNo && (
                        <p className="errorMsg">
                          {errors.cinNo.message}
                        </p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Company Register Number{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Company Register Number"
                        autoComplete="off"
                        {...register("companyRegNo", {
                          required: "Company Register Number is required",
                          pattern: {
                            value: /^[0-9a-zA-Z]+$/,
                            message:
                              "Company Register Number should contain only letters and numbers",
                          },
                        })}
                      />
                      {errors.companyRegNo && (
                        <p className="errorMsg">
                          {errors.companyRegNo.message}
                        </p>
                      )}
                    </div>

                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Company GST Number{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Company GST Number"
                        autoComplete="off"
                        {...register("gstNo", {
                          required: "Company GST Number is required",
                          pattern: {
                            value: /^[0-9A-Za-z]{15}$/i,
                            message:
                              "Company GST Number should be exactly 15 characters long and alphanumeric",
                          },
                        })}
                      />
                      {errors.gstNo && (
                        <p className="errorMsg">{errors.gstNo.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Company Pan Number{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Company Pan Number"
                        autoComplete="off"
                        {...register("panNo", {
                          required: "Company Pan Number is required",
                          pattern: {
                            value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                            message:
                              "Company Pan Number should be in the format: ABCDE1234F",
                          },
                        })}
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
                  <h5 className="card-title">Authorized Contact Details</h5>
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
                        autoComplete="off"
                        {...register("name", {
                          required: "Name is required",
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
                        {...register("personalMailId", {
                          required: "MailId is required",
                          pattern: {
                            value: /^\S+@\S+$/i,
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
                        {...register("address", {
                          required: "Address is required",
                          pattern: {
                            value:  /^[a-zA-Z0-9\s#,@./-]*$/,
                            message:
                              "Please enter Valid Address",
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
          <div
            className="col-12 d-flex justify-content-end mt-5"
            style={{ background: "none" }}
          >
            <button
              className="btn btn-primary btn-lg"
              style={{ marginRight: "65px" }}
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </LayOut>
  );
};

export default CompanyRegistration;
