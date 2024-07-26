import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Toast, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "react-bootstrap";
import LayOut from "./LayOut";
import { CameraFill, Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CompanyImagePatchApi, companyUpdateByIdApi, companyViewByIdApi } from "../Utils/Axios";
import { jwtDecode } from "jwt-decode";

function Profile() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

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
      const token = sessionStorage.getItem("token");
      try {
        const decodedToken = jwtDecode(token);
        const companyId = decodedToken.sub;
        const response = await companyViewByIdApi(companyId);
        const data = response.data;
        setCompanyData(data);
        // Set form values with the fetched data
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
  }, [setValue]);

  const handleDetailsSubmit = async (data) => {
    const token = sessionStorage.getItem("token");
    try {
      const decodedToken = jwtDecode(token);
      const companyId = decodedToken.sub;
      await companyUpdateByIdApi(companyId, data);
      setSuccessMessage("Profile updated successfully.");
      toast.success("Company Details Updated Successfully");
      setErrorMessage("");
      navigate("/main");
    } catch (err) {
      console.error("Details update error:", err);
      setSuccessMessage("");
      setErrorMessage("Failed to update profile details.");
      setError(err);
    }
  };

  const onChangePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImage(file);
    }
  };

  const handleLogoSubmit = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const decodedToken = jwtDecode(token);
      const companyId = decodedToken.sub;
      if (postImage) {
        const formData = new FormData();
        formData.append("file", postImage);
        await CompanyImagePatchApi(companyId, formData);
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

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleRemoveLogo = () => {
    setPostImage("");
  };

  const onSubmit = async (data) => {
    const token = sessionStorage.getItem("token");
    try {
      const decodedToken = jwtDecode(token);
      const companyId = decodedToken.sub;
      const response = await companyUpdateByIdApi();
      console.log("Updated successfully:", response.data);
      setSuccessMessage("Profile updated successfully.");
      toast.success("Company Details Updated Successfully");
      setErrorMessage("");
      navigate("/main");
    } catch (err) {
      console.error("Update error:", err);
      setSuccessMessage("");
      setErrorMessage("Failed to update profile.");
      setError(err);
    }
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
                {/* <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-primary btn-lg"
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                  >
                    Submit
                  </button>
                </div> */}
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
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          id="companyPhoneNo"
                          className="form-control"
                          {...register("mobileNo")}
                          defaultValue={companyData.mobileNo}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="companyName" className="form-label">
                          Short Name
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
                          id="companyAddress"
                          className="form-control"
                          {...register("companyAddress")}
                          defaultValue={companyData.companyAddress}
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="companyAddress"
                          className="form-label"
                        >
                          Land Number
                        </label>
                        <input
                          type="text"
                          id="companyAddress"
                          className="form-control"
                          {...register("landNo")}
                          defaultValue={companyData.landNo}
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
                          {...register("name")}
                          defaultValue={companyData.name}
                        />
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
                          {...register("personalMailId")}
                          defaultValue={companyData.personalMailId}
                        />
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
                          {...register("personalMobileNo")}
                          defaultValue={companyData.personalMobileNo}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="designation" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          id="designation"
                          className="form-control"
                          {...register("address")}
                          defaultValue={companyData.address}
                        />
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
            <input type="file" onChange={onChangePicture} />
            {postImage && (
              <div>
                <img src={postImage} alt="Logo" style={{ width: "100%" }} />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit(handleLogoSubmit)}>
              Save Changes
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </LayOut>
  );
}

export default Profile;