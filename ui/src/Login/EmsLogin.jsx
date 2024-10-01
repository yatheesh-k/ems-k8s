import React, { useState } from "react";
import { Envelope, Lock, Unlock } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { loginApi } from "../Utils/Axios";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../Context/AuthContext";

const EmsLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: "", password: "" }, mode:"onChange" });
  const { setAuthUser } = useAuth();
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false); // State for error modal
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleEmailChange = (e) => {
    // Prevent space character entry
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await loginApi(data);
      const token = response.data?.token;
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const { sub: userId, roles: userRole, company, employeeId } = decodedToken;
          setAuthUser({ userId, userRole, company, employeeId });
          toast.success("Login Successful");
          navigate("/main");
        } catch (decodeError) {
          console.error("Token decoding failed:", decodeError);
          setErrorMessage("Failed to decode token. Ensure token is valid.");
          setShowErrorModal(true);
        }
      } else {
        console.error('Token not found in response');
        setErrorMessage("Unexpected response format. Token not found.");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.log("Error response data:", error); 
      if (error) {
        const errorMessage = error;
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
      } else {
        setErrorMessage("Login failed. Please try again later.");
        setShowErrorModal(true);
      }
      
    }
  };
  

  const closeModal = () => {
    setShowErrorModal(false);
    setErrorMessage(""); // Clear error message when modal is closed
  };

  const validatePassword = (value) => {
    const errors = [];
    if (!/(?=.*[0-9])/.test(value)) {
      errors.push("at least one digit");
    }
    if (!/(?=.*[a-z])/.test(value)) {
      errors.push("at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      errors.push("at least one uppercase letter");
    }
    if (!/(?=.*\W)/.test(value)) {
      errors.push("at least one special character");
    }
    if (value.includes(" ")) {
      errors.push("no spaces");
    }
    
    if (errors.length > 0) {
      return `Password must contain ${errors.join(", ")}.`;
    }
    return true; // Return true if all conditions are satisfied
  };

  return (
    <div>
      <div className="form_wrapper">
        <div className="form_container">
          <div className="title_container">
            <h2>Login</h2>
          </div>
          <div className="row clearfix">
            <div className>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input_field">
                  <span className="icon" style={{ marginTop: "4px" }}>
                    <Envelope size={18} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
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
                  {errors.username && (
                    <p className="errorMsg" style={{ marginLeft: "35px" }}>
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="input_field">
                  <input
                    name="password"
                    placeholder="Password"
                    onChange={handleEmailChange}
                    type={passwordShown ? "text" : "password"}
                    {...register("password", {
                      required: "Password is Required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long",
                      },
                      maxLength: {
                        value: 16,

                        message: "Password must not Exceed 16 characters long",
                      },
                      validate:validatePassword,
                    })}
                  />
                  {errors.password && (
                    <p className="errorMsg" style={{ marginLeft: "35px" }}>
                      {errors.password.message}
                    </p>
                  )}
                  <span
                    onClick={togglePasswordVisibility}
                    style={{ marginTop: "3px" }}
                  >
                    {passwordShown ? <Unlock size={20} /> : <Lock size={20} />}
                  </span>
                </div>

                <button className="button" type="submit">
                  Login
                </button>
              </form>
            </div>
          </div>
          <div className="row">
                  {/* <div className="d-flex justify-content-center mt-1">
                    <a href="/" className="me-1">
                      <Facebook size={16} />
                    </a>
                    <a href="/" className="me-1">
                      <Linkedin size={16} />
                    </a>
                    <a href="/" className="me-1" style={{ color: "#34A853" }}>
                      <Google size={16} />
                    </a>
                    <a href="/" className="me-1" style={{ color: "#E1306C" }}>
                      <Instagram size={16} />
                    </a>
                  </div> */}
                  <div>
                    <span style={{fontSize:"0.8em"}}>
                      Copyrights &copy;2024 PATHBREAKER TECHNOLOGIES PVT.LTD. All
                      Rights Reserved{" "}
                    </span>
                  </div>
                </div>
        </div>
      </div>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={closeModal} centered style={{ zIndex: "1050" }} className="custom-modal" >
        <ModalHeader closeButton>
          <ModalTitle>Error</ModalTitle>
        </ModalHeader>
        <ModalBody>{errorMessage}</ModalBody>
      </Modal>
    </div>
  );
};

export default EmsLogin;
