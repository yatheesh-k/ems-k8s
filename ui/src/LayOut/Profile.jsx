import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "react-bootstrap";
import LayOut from "./LayOut";
import { CameraFill, Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CompanyImagePatchApi, companyUpdateByIdApi, companyViewByIdApi, EmployeeGetApiById } from "../Utils/Axios";
import { userId } from "../Utils/Auth";

function Profile() {
  const { register, handleSubmit,reset, setValue, formState: { errors } } = useForm({ mode: "onChange" });
  const { user } = useAuth();
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
      if (!companyId) return;
      try {
        const response = await companyViewByIdApi(companyId);
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
  }, [setValue, companyId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await EmployeeGetApiById(userId);
        const companyId = response.data.companyId;
        setCompanyId(companyId);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  const handleDetailsSubmit = async (data) => {
    if (!companyId) return;

    // Extract only the fields you want to update
    const updateData = {
        companyAddress: data.companyAddress,
        mobileNo: data.mobileNo,
        landNo: data.landNo,
        name: data.name,
        personalMailId: data.personalMailId,
        personalMobileNo: data.personalMobileNo,
        address: data.address
    };

    try {
        await companyUpdateByIdApi(companyId, updateData);
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
        setPostImage(file); // Set the actual File object here
    }
};


  const handleLogoSubmit = async () => {
    if (!companyId) return;
    try {
      if (postImage) {
        const formData = new FormData();
        formData.append("image", "string");
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
      setErrorMessage("Failed To Update Logo.");
      setError(err);
    }
  }

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleCloseUploadImageModal = () => {
    setPostImage(false);
    reset();
    setShowModal(false);
  };

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
                          <CameraFill />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form for Company Details */}
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
                        <label htmlFor="companyMobile" className="form-label">
                          Company Mobile No
                        </label>
                        <input
                          type="text"
                          id="companyMobile"
                          className="form-control"
                          {...register("mobileNo")}
                          defaultValue={companyData.mobileNo}
                        />
                      </div>                    
                    </div>

                    <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="companyShortName" className="form-label">
                          Company Short Name
                        </label>
                        <input
                          type="text"
                          id="companyShortName"
                          className="form-control"
                          {...register("shortName")}
                          defaultValue={companyData.shortName}
                          readOnly
                        />
                      </div>
                   

                      <div className="mb-3">
                        <label htmlFor="landNo" className="form-label">
                          Landline No
                        </label>
                        <input
                          type="text"
                          id="landNo"
                          className="form-control"
                          {...register("landNo")}
                          defaultValue={companyData.landNo}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="companyAddress" className="form-label">
                          Company Address
                        </label>
                        <textarea
                          id="companyAddress"
                          className="form-control"
                          {...register("companyAddress")}
                          defaultValue={companyData.companyAddress}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="cinNo" className="form-label">
                          CIN No
                        </label>
                        <input
                          type="text"
                          id="cinNo"
                          className="form-control"
                          {...register("cinNo")}
                          defaultValue={companyData.cinNo}
                          readOnly
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="panNo" className="form-label">
                          PAN No
                        </label>
                        <input
                          type="text"
                          id="panNo"
                          className="form-control"
                          {...register("panNo")}
                          defaultValue={companyData.panNo}
                          readOnly
                        />
                      </div>
                    
                    </div>
                    <div className="col-md-6"> 
                      <div className="mb-3 ">
                        <label htmlFor="companyRegNo" className="form-label">
                          Company Reg. No
                        </label>
                        <input
                          type="text"
                          id="companyRegNo"
                          className="form-control"
                          {...register("companyRegNo")}
                          defaultValue={companyData.companyRegNo}
                          readOnly
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="gstNo" className="form-label">
                          GST No
                        </label>
                        <input
                          type="text"
                          id="gstNo"
                          className="form-control"
                          {...register("gstNo")}
                          defaultValue={companyData.gstNo}
                          readOnly
                        />
                      </div>
                      </div>
                  </div>
                  <div className="row mt-2">
                  <div className="col-md-6">
                  <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Contact Person Name
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
                        <label htmlFor="personalMailId" className="form-label">
                          Personal Mail Id
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
                        <label htmlFor="personalMobileNo" className="form-label">
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
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <textarea
                          id="address"
                          className="form-control"
                          {...register("address")}
                          defaultValue={companyData.address}
                        />
                      </div>
                  </div>
                  </div>
                </div>

                <div className="card-footer text-end">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Modal for Logo Upload */}
        <Modal show={showModal} onHide={closeModal} style={{zIndex:"1050"}} centered>
          <ModalHeader closeButton>
            <ModalTitle>Upload Logo</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <input
              type="file"
              className="form-control"
              onChange={onChangePicture}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={handleCloseUploadImageModal}>
              Cancel

            </Button>
            <Button variant="primary" onClick={handleLogoSubmit}>
              Upload Logo
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </LayOut>
  );
}

export default Profile;
