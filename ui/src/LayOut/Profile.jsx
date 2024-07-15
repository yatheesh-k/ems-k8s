import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Modal, Button, Toast } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import LayOut from "./LayOut";
import { CameraFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { companyUpdateByIdApi, companyViewByIdApi } from "../Utils/Axios";

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
  const navigate= useNavigate();

  useEffect(() => {
    const fetchCompanyData = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const decodedToken = jwtDecode(token);
        const companyId = decodedToken.sub;
        const response = await companyViewByIdApi(companyId)
        const data = response.data;
        setCompanyData(data);
      } catch (err) {
        setError(err);
      }
    };

    fetchCompanyData();
  }, [setValue]);



  const onChangePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImage(URL.createObjectURL(file));
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
        <Modal show={successMessage !== ""} onHide={() => setSuccessMessage("")}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>{successMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSuccessMessage("")}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Error Message Modal */}
        <Modal show={errorMessage !== ""} onHide={() => setErrorMessage("")}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{errorMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setErrorMessage("")}>
              Close
            </Button>
          </Modal.Footer>
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
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-primary btn-lg"
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
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
                          readOnly
                        />
                      </div>
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
                          readOnly
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
                      <div className="mb-3">
                        <label htmlFor="website" className="form-label">
                          Password
                        </label>
                        <input
                          type="text"
                          id="website"
                          className="form-control"
                          {...register("password")}
                          defaultValue={companyData.password}
                          readOnly
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
                          readOnly
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
                          Personal Mobile No
                        </label>
                        <input
                          type="text"
                          id="personalMobileNo"
                          className="form-control"
                          {...register("personalMobileNo")}
                          defaultValue={companyData.personalMobileNo}
                          readOnly
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
                          readOnly
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
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update Logo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="file" onChange={onChangePicture} />
            {postImage && (
              <div>
                <img src={postImage} alt="Selected Logo" style={{ width: "100%" }} />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </LayOut>
  );
}

export default Profile;
