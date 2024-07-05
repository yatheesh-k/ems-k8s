import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import LayOut from "./LayOut";
import { ModalTitle } from "react-bootstrap";
import { CameraFill } from "react-bootstrap-icons";
import { companyViewByIdApi } from "../Utils/Axios";
import { useLocation } from "react-router-dom";

function Profile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [postImage, setPostImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState();
  const [value, setValue] = useState();
  const [companyData, setCompanyData] = useState();
  const [employeeSalaryView, setEmployeeSalaryView] = useState();
  const location = useLocation();

  const { id } = location.state || {};

//   useEffect(() => {
//     if (id) {
//       companyViewByIdApi(id).then(response => {
//         setEmployeeSalaryView(response.data.data);
//       });
//     }
//   }, [id]);


  useEffect(() => {
    const fetchCompanyData = async (Id) => {     console.log(Id);
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:8092/ems/company/${Id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCompanyData(response.data);
        Object.keys(response.data).forEach((key) => {
          setValue(key, response.data[key]);
        });
      } catch (err) {
        setError(err);
      }
    };
    fetchCompanyData();
  }, [setValue]);

  const onChangePicture = (e) => {
    setPostImage(URL.createObjectURL(e.target.files[0]));
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleRemoveLogo = () => {
    setPostImage(null);
  };

  const onSubmit = async (data) => {
    const token = sessionStorage.getItem("token");
    const response = await axios.get("companyViewByIdApi", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <h1 className="h3 mb-3">
          <strong>Profile</strong>
        </h1>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title"> Add Company Logo</h5>
                <div
                  className="dropdown-divider"
                  style={{ borderTopColor: "#d7d9dd" }}
                />
              </div>
              <div className="card-body" style={{ marginBottom: "-45px" }}>
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6 mb-6">
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
                              onClick={() => handleRemoveLogo()}
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
      </div>

      <div className="container-fluid p-0">
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
                    <p className="form-label">Company Type</p>
                    <p className="form-control"></p>
                  </div>
                  <div className="col-lg-1"></div>
                  <div className="col-12 col-md-6 col-lg-5 mb-3">
                    <p className="form-label">Company CIN Number</p>
                    <p className="form-control"></p>
                  </div>
                  <div className="col-12 col-md-6 col-lg-5 mb-3">
                    <p className="form-label">Company Name</p>
                    <p className="form-control"></p>
                  </div>
                  <div className="col-lg-1"></div>
                  <div className="col-12 col-md-6 col-lg-5 mb-3">
                    <p className="form-label">Company Mailid</p>
                    <p className="form-control"></p>
                  </div>
                  <div className="col-12 col-md-6 col-lg-5 mb-3">
                    <p className="form-label">Land Number</p>
                    <p className="form-control"></p>
                  </div>
                  <div className="col-lg-1"></div>
                  <div className="col-12 col-md-6 col-lg-5 mb-3">
                    <p className="form-label">Mobile Number</p>
                    <p className="form-control"></p>
                  </div>
                  <div className="col-12 col-md-6 col-lg-5 mb-3">
                    <p className="form-label">Company Address</p>
                    <p className="form-control"></p>
                  </div>
                  <div className="col-lg-1"></div>
                  <div className="col-12 col-md-6 col-lg-5 mb-3">
                    <p className="form-label">Company Register Number</p>
                    <p className="form-control"></p>
                  </div>
                  <div className="col-12 col-md-6 col-lg-5 mb-3">
                    <p className="form-label">Company GST Number</p>
                    <p className="form-control"></p>
                  </div>{" "}
                  <div className="col-lg-1"></div>
                  <div className="col-12 col-md-6 col-lg-5 mb-3">
                    <p className="form-label">Company PAN Number</p>
                    <p className="form-control"></p>
                  </div>
                  <div className="col-12 col-md-6 col-lg-5 mb-3">
                    <p className="form-label">Company Register Number</p>
                    <p className="form-control"></p>
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
                <h5 className="card-title">
                  Authorized Contact Details Details
                </h5>
                <div
                  className="dropdown-divider"
                  style={{ borderTopColor: "#d7d9dd" }}
                />
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-5 mb-3">
                    <p className="form-label">Name</p>
                    <p className="form-control"></p>
                  </div>
                  <div className="col-lg-1"></div>
                  <div className="col-12 col-md-6 col-lg-5 mb-3">
                    <p className="form-label">Personal MailId</p>
                    <p className="form-control"></p>
                  </div>
                  <div className="col-12 col-md-6 col-lg-5 mb-3">
                    <p className="form-label">Personal Mobile Number</p>
                    <p className="form-control"></p>
                  </div>
                  <div className="col-lg-1"></div>
                  <div className="col-12 col-md-6 col-lg-5 mb-3">
                    <p className="form-label">Address</p>
                    <p className="form-control"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className="modal"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <ModalTitle className="modal-title">Company Logo</ModalTitle>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input
                    type="file"
                    className="form-control"
                    {...register("file", {
                      required: "Company Logo is required",
                    })}
                    accept=".jpeg, .png, .jpg, .svg"
                    onChange={onChangePicture}
                  />
                  {errors.file && (
                    <p className="errorMsg">{errors.file.message}</p>
                  )}
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayOut>
  );
}

export default Profile;

