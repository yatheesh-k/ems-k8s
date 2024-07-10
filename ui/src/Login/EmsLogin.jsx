import React, { useState } from "react";
import { Envelope, Key, Lock, Unlock } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { loginApi } from "../Utils/Axios";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";

const EmsLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { username: "", password: "" } });

  const { company } = useParams();
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

  const onSubmit = (data) => {
    const payload = {
      ...data,
      company: company,
    };
    loginApi(payload)
      .then((response) => {
        console.log(response.data);
        // Handle successful login
        navigate("/main");
      })
      .catch((error) => {
        console.error("Login failed:", error);
        if (error.response && error.response.data && error.response.data.error) {
          // Extract error message from response
          const errorMessage = error.response.data.error.message;
          // Update error message state and show error modal
          setErrorMessage(errorMessage);
          setShowErrorModal(true);
        } else {
          // Default error message
          setErrorMessage("Login failed. Please try again later.");
          setShowErrorModal(true);
        }
      });
  };

  const closeModal = () => {
    setShowErrorModal(false);
    setErrorMessage(""); // Clear error message when modal is closed
  };

  return (
    <div>
      <div className="form_wrapper">
        <div className="form_container">
          <div className="title_container">
            <h2>Sign in</h2>
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
                    <p className="errorMsg" style={{ marginLeft: "44px" }}>
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
                    })}
                  />
                  {errors.password && (
                    <p className="errorMsg" style={{ marginLeft: "44px" }}>
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
                  Log in
                </button>
              </form>
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
