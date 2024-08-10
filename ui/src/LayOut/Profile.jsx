import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Toast, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "react-bootstrap";
import LayOut from "./LayOut";
import { CameraFill, Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CompanyImagePatchApi, companyUpdateByIdApi, companyViewByIdApi, EmployeeGetApiById } from "../Utils/Axios";
import { userId } from "../Utils/Auth";
import { useAuth } from "../Context/AuthContext";

function Profile() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ mode: "onChange" });
  const {user}=useAuth();
  //const [companyId, setCompanyId] = useState(null);
  const [companyData, setCompanyData] = useState({});
  const [postImage, setPostImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(null);
  const [passwordShown, setPasswordShown] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!user.companyId) return;
      try {
        const response = await companyViewByIdApi(user.companyId);
        const data = response.data;
        setCompanyData(data);
        setValue("companyName", data.companyName);
        setValue("emailId", data.emailId);
        setValue("mobileNo", data.mobileNo);
        setValue("shortName", data.shortName);
        setValue("companyAddress", data.companyAddress);
        setValue("landNo", data.landNo);
        setValue("cinNo", data.cinNo);
        setValue("companyRegNo", data.companyRegNo);
        setValue("gstNo", data.gstNo);
        setValue("panNo", data.panNo);
        setValue("name", data.name);
        setValue("personalMailId", data.personalMailId);
        setValue("personalMobileNo", data.personalMobileNo);
        setValue("address", data.address);
      } catch (err) {
        setError(err);
      }
    };

    fetchCompanyData();
  }, [setValue, user.companyId]);

  const handleDetailsSubmit = async (data) => {
    if (!user.companyId) return;
    try {
      await companyUpdateByIdApi(user.companyId, data);
      setSuccessMessage("Profile Updated Successfully.");
      toast.success("Company Details Updated Successfully");
      setErrorMessage("");
      navigate("/main");
    } catch (err) {
      console.error("Details update error:", err);
      setSuccessMessage("");
      setErrorMessage("Failed To Update Profile Details.");
      setError(err);
    }
  };

  const onChangePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImage(file);
    }
  };

  const  toInputTitleCase = (e) => {
    const input = e.target;
    let value = input.value;
    // Remove leading spaces
    value = value.replace(/^\s+/g, '');
    // Initially disallow spaces
    if (!/\S/.test(value)) {
      // If no non-space characters are present, prevent spaces
      value = value.replace(/\s+/g, '');
    } else {
      // Allow spaces if there are non-space characters
      value = value.replace(/^\s+/g, ''); // Remove leading spaces
      const words = value.split(' ');
      const capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
      value = capitalizedWords.join(' ');
    }
    // Update input value
    input.value = value;
  };

  const toInputLowerCase = (e) => {
    const input = e.target;
    let value = input.value;

    // Remove leading spaces
    value = value.replace(/^\s+/g, '');

    // Initially disallow spaces if there are no non-space characters
    if (!/\S/.test(value)) {
      // If no non-space characters are present, prevent spaces
      value = value.replace(/\s+/g, '');
    } else {
      // Convert the entire string to lowercase
      value = value.toLowerCase();

      // Remove leading spaces
      value = value.replace(/^\s+/g, '');
      
      // Capitalize the first letter of each word
      const words = value.split(' ');
      const capitalizedWords = words.map(word => {
        return word.charAt(0).toLowerCase() + word.slice(1);
      });

      value = capitalizedWords.join(' ');
    }

    // Update input value
    input.value = value;
};

const handleLogoSubmit = async () => {
  if (!user.companyId) return;
  try {
    if (postImage) {
      const formData = new FormData();
      formData.append("image", "string");
      formData.append("file", postImage);
      await CompanyImagePatchApi(user.companyId, formData);
      setPostImage("");
      setSuccessMessage("Logo updated successfully.");
      toast.success("Company Logo Updated Successfully");
      setErrorMessage("");
      closeModal();
    }
  } catch (err) {
    console.error("Logo update error:", err);
    setSuccessMessage("");
    setErrorMessage("Failed to update logo.");
    setError(err);
  }
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

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleRemoveLogo = () => {
    setPostImage("");
  };

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <h1 className="h3 mb-3">
          <strong>Profile</strong>
        </h1>
        {/* Success Message Modal */}
        <Modal
          show={successMessage !== ""}
          onHide={() => setSuccessMessage("")}
          centered
          style={{ zIndex: "1050" }}
          className="custom-modal"
        >
          <ModalHeader closeButton>
            <ModalTitle>Success</ModalTitle>
          </ModalHeader>
          <ModalBody>{successMessage}</ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setSuccessMessage("")}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        {/* Error Message Modal */}
        <Modal
          show={errorMessage !== ""}
          onHide={() => setErrorMessage("")}
          centered
          style={{ zIndex: "1050" }}
          className="custom-modal"
        >
          <ModalHeader closeButton>
            <ModalTitle>Error</ModalTitle>
          </ModalHeader>
          <ModalBody>{errorMessage}</ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setErrorMessage("")}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Add Company Logo</h5>
                <hr />
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <div
                      style={{
                        position: "relative",
                        fontSize: "50px",
                        cursor: "pointer",
                        marginRight: "80%",
                      }}
                      onClick={openModal}
                    >
                      <div
                        style={{
                          position: "relative",
                          justifyContent: "center",
                        }}
                      >
                        {postImage ? (
                          <>
                            <img
                              src={postImage}
                              alt="Selected Logo"
                              style={{ width: "100%", height: "auto" }}
                            />
                            <button
                              className="btn btn-sm btn-danger"
                              style={{
                                position: "absolute",
                                top: -10,
                                right: -10,
                                borderRadius: "50%",
                              }}
                              onClick={handleRemoveLogo}
                            >
                              X
                            </button>
                          </>
                        ) : (
                          <CameraFill />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleDetailsSubmit)}>
          <div className="row mt-3">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Company Details</h5>
                  <hr />
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="companyName" className="form-label">
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          className="form-control"
                          {...register("companyName")}
                          defaultValue={companyData.companyName}
                          readOnly
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="companyMail" className="form-label">
                          Company MailId
                        </label>
                        <input
                          type="text"
                          id="companyMail"
                          className="form-control"
                          {...register("emailId")}
                          defaultValue={companyData.emailId}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="companyPhoneNo"
                          className="form-label"
                        >
                          Alternate Number
                        </label>
                        <input
                          type="text"
                          id="companyPhoneNo"
                          className="form-control"
                          onInput={toInputTitleCase}
                          defaultValue={companyData.mobileNo}
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
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="companyName" className="form-label">
                          Service Name
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          className="form-control"
                          {...register("shortName")}
                          defaultValue={companyData.shortName}
                          readOnly
                        />
                      </div>
                      {/* <div className="col-12 col-md-6 col-lg-5 mb-3"> 
                        <label htmlFor="website" className="form-label">
                          Password
                        </label>
                        <div className="col-sm-12 input-group">
                        <input
                          type={passwordShown ? "text" : "password"}
                          id="website"
                          className="form-control"
                          {...register("password")}
                          defaultValue={companyData.password}
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
                      </div> */}
                      <div className="mb-3">
                        <label
                          htmlFor="companyAddress"
                          className="form-label"
                        >
                          Company Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Company Address"
                          onKeyDown={handleEmailChange}
                          onInput={toInputTitleCase}
                          defaultValue={companyData.companyAddress}
                          autoComplete="off"
                          id="companyAddress"
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
                      <div className="mb-3">
                        <label
                          htmlFor="companyAddress"
                          className="form-label"
                        >
                          Contact Number
                        </label>
                        <input
                          type="text"
                          id="companyAddress"
                          className="form-control"
                          onInput={toInputTitleCase}
                          defaultValue={companyData.landNo}
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Company Registration Details</h5>
                  <hr />
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Company CIN Number
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="form-control"
                          {...register("cinNo")}
                          defaultValue={companyData.cinNo}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="personalMailId"
                          className="form-label"
                        >
                          Company Register Number
                        </label>
                        <input
                          type="text"
                          id="personalMailId"
                          className="form-control"
                          {...register("companyRegNo")}
                          defaultValue={companyData.companyRegNo}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label
                          htmlFor="personalMobileNo"
                          className="form-label"
                        >
                          Company GST Number
                        </label>
                        <input
                          type="text"
                          id="personalMobileNo"
                          className="form-control"
                          {...register("gstNo")}
                          defaultValue={companyData.gstNo}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="designation" className="form-label">
                          Company PAN Number
                        </label>
                        <input
                          type="text"
                          id="designation"
                          className="form-control"
                          {...register("panNo")}
                          defaultValue={companyData.panNo}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="row mt-3">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Personal Information</h5>
                  <hr />
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="form-control"
                          onInput={toInputTitleCase}
                          defaultValue={companyData.name}
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
                      <div className="mb-3">
                        <label
                          htmlFor="personalMailId"
                          className="form-label"
                        >
                          Personal Mail ID
                        </label>
                        <input
                          type="text"
                          id="personalMailId"
                          className="form-control"
                          onInput={toInputLowerCase}
                          defaultValue={companyData.personalMailId}
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
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label
                          htmlFor="personalMobileNo"
                          className="form-label"
                        >
                          Personal Mobile No
                        </label>
                        <input
                          type="text"
                          id="personalMobileNo"
                          className="form-control"
                          onInput={toInputTitleCase}
                          defaultValue={companyData.personalMobileNo}
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
                      <div className="mb-3">
                        <label htmlFor="designation" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          id="designation"
                          className="form-control"
                          onInput={toInputTitleCase}
                          defaultValue={companyData.address}
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
          </div>

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

        {/* Modal for Image Upload */}
        <Modal
          show={showModal}
          onHide={closeModal}
          centered
          style={{ zIndex: "1050" }}
          className="custom-modal"
        >
          <ModalHeader closeButton>
            <ModalTitle>Update Logo</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <input type="file"
              {...register("file", { required: "Logo Required" })}
              onChange={onChangePicture}
            />
            {postImage && (
              <div>
                <image src={postImage} alt="Selected Logo" style={{ width: "100%" }} />
              </div>
            )}
            {errors.file && (
              <p className="errorMsg">
                {errors.file.message}
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={closeModal}>
              Cancle
            </Button>
            <Button variant="primary" onClick={handleSubmit(handleLogoSubmit)}>
              Upload
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </LayOut>
  );
}

export default Profile;