import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { EnvelopeFill, LockFill, UnlockFill } from "react-bootstrap-icons";
import { Bounce, toast } from "react-toastify";
import { CompanyloginApi, ValidateOtp } from "../Utils/Axios";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";

const CompanyLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      otp: "",
    },
  });

  const { company } = useParams();
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpTimeLimit, setOtpTimeLimit] = useState(40); // Time limit for OTP in seconds
  const [sessionTimeout, setSessionTimeout] = useState(false); // State for session timeout

  useEffect(() => {
    sessionStorage.setItem("company", company);
  }, [company]);

  useEffect(() => {
    // Countdown function for OTP time limit
    const countdown = setTimeout(() => {
      if (!otpSent) {
        setShowOtpField(true); // Hide OTP field after timeout
        setOtpTimeLimit(40); // Reset timer for next OTP request
        setSessionTimeout(true); // Set session timeout state
      }
    }, otpTimeLimit * 1000);

    return () => clearTimeout(countdown); // Clear timeout on component unmount or re-render
  }, [otpSent, otpTimeLimit]);

  const sendOtp = (data) => {
    setLoading(true);
    const payload = {
      username: data.username,
      password: data.password,
      company: company,
    };

    CompanyloginApi(payload)
      .then((response) => {
        console.log(response.data);
        toast.success("OTP sent Successfully");
        setLoading(false);
        setShowOtpField(true);
        setOtpSent(true);
        setSessionTimeout(false); // Reset session timeout state
        // Start countdown for OTP time limit
        setOtpTimeLimit(40); // Reset timer for each OTP request
      })
      .catch((error) => {
        console.error("Failed to send OTP:", error);
        setLoading(false);
        if (error.response && error.response.data && error.response.data.error) {
          const errorMessage = error.response.data.error.message;
          setErrorMessage(errorMessage);
          setShowErrorModal(true);
        } else {
          setErrorMessage("Failed to send OTP. Please try again.");
          setShowErrorModal(true);
        }
      });
  };

  const verifyOtpAndCompanyLogin = (data) => {
    const payload = {
      username: data.username,
      otp: data.otp,
      company: company,
    };
    setLoading(true);
   ValidateOtp(payload)
      .then((response) => {
        if (response.status === 200) {
          toast.success("CompanyLogin Successful", {
            position: "top-right",
            transition: Bounce,
            hideProgressBar: true,
            theme: "colored",
            autoClose: 2000,
          });

          if (response.data.imageFile) {
            sessionStorage.setItem("imageFile", response.data.imageFile);
          } else {
            console.error("imageFile is undefined");
          }
          setTimeout(() => {
            navigate("/main", { state: { username: data.username } });
          }, 2000);
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setLoading(false);
        if (error.response && error.response.data && error.response.data.error) {
          const errorMessage = error.response.data.error.message;
          setErrorMessage(errorMessage);
          setShowErrorModal(true);
        } else {
          setErrorMessage("Login failed. Please try again later.");
          setShowErrorModal(true);
        }
      });
  };

  const closeModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handlePasswordChange = (e) => {
    setPasswordShown(e.target.value);
  };

  const handleEmailChange = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  const onSubmit = (data) => {
    if (sessionTimeout) {
      reset(); // Reset form fields
      setSessionTimeout(false); // Reset session timeout state
    }

    if (otpSent) {
      verifyOtpAndCompanyLogin(data);
    } else {
      sendOtp(data);
    }
  };

  return (
    <div>
      <main className="d-flex w-100 ">
        <div className="container d-flex flex-column">
          <div className="row vh-100">
            <div className="col-sm-10 col-md-7 col-lg-6 mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="card">
                  <div className="card-header">
                    <div className="text-center mt-2">
                      <p className="lead">Sign in</p>
                    </div>
                  </div>
                  <div className="card-body" style={{ padding: "6px" }}>
                    <div className="m-sm-2">
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="align-items-center"
                      >
                        <label className="form-label">Email Id</label>
                        <>
                          <div className="input-group">
                            <span className="input-group-text">
                              <EnvelopeFill size={20} color="#4C489D" />
                            </span>
                            <input
                              className="form-control"
                              type="email"
                              name="username"
                              id="username"
                              placeholder="Enter your email"
                              autoComplete="off"
                              onKeyDown={handleEmailChange}
                              {...register("username", {
                                required: "Email is Required.",
                                pattern: {
                                  value: /^\S[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: "Email is not valid.",
                                },
                              })}
                            />
                          </div>
                          {errors.username && (
                            <p
                              className="errorMsg p-0"
                              style={{ marginLeft: "45px" }}
                            >
                              {errors.username.message}
                            </p>
                          )}
                        </>
                        <div className="mt-3">
                          {showOtpField ? (
                            <div>
                              <label className="form-label">OTP</label>
                              <div className="mb-3 input-group">
                                <span
                                  className="input-group-text"
                                  onClick={togglePasswordVisibility}
                                >
                                  {passwordShown ? (
                                    <UnlockFill size={20} color="#4C489D" />
                                  ) : (
                                    <LockFill size={20} color="#4C489D" />
                                  )}
                                </span>
                                <input
                                  className="form-control"
                                  type={passwordShown ? "text" : "password"}
                                  name="otp"
                                  id="otp"
                                  placeholder="Enter your OTP"
                                  autoComplete="off"
                                  {...register("otp", {
                                    required: "OTP is Required.",
                                    pattern: {
                                      value: /^\d{6}$/,
                                      message: "OTP must be 6 digits.",
                                    },
                                  })}
                                />
                              </div>
                              {errors.otp && (
                                <p className="errorMsg">
                                  {errors.otp.message}
                                </p>
                              )}
                            </div>
                          ) : (
                            <>
                              <label className="form-label">Password</label>
                              <div className="input-group">
                                <span
                                  className="input-group-text"
                                  onClick={togglePasswordVisibility}
                                >
                                  {passwordShown ? (
                                    <UnlockFill size={20} color="#4C489D" />
                                  ) : (
                                    <LockFill size={20} color="#4C489D" />
                                  )}
                                </span>
                                <input
                                  className="form-control"
                                  name="password"
                                  id="password"
                                  placeholder="Enter your password"
                                  onChange={handlePasswordChange}
                                  type={passwordShown ? "text" : "password"}
                                  {...register("password", {
                                    required: "Password is Required",
                                    minLength: {
                                      value: 6,
                                      message:
                                        "Password must be at least 6 characters long",
                                    },
                                  })}
                                />
                              </div>
                              {errors.password && (
                                <p
                                  className="errorMsg"
                                  style={{
                                    marginLeft: "45px",
                                    marginBottom: "0",
                                  }}
                                >
                                  {errors.password.message}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        <div
                          className="text-center mt-4"
                          style={{ paddingTop: "10px" }}
                        >
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                          >
                            {loading ? "Loading..." : "Login"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Modal show={showErrorModal} onHide={closeModal} centered style={{ zIndex: "1050" }} className="custom-modal" >
        <ModalHeader closeButton >
          <ModalTitle className="text-center">Error</ModalTitle>
        </ModalHeader>
        <ModalBody className="text-center fs-bold">{errorMessage}</ModalBody>
      </Modal>
    </div>
  );
};

export default CompanyLogin;
