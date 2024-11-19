import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { loginApi } from "../Utils/Axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../Context/AuthContext";
import Loader from "../Utils/Loader";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";

const EmsLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { username: "", password: "" }, mode: "onChange" });
  const { setAuthUser } = useAuth();
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleEmailChange = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  const onSubmit = async (data) => {
    setLoading(true); // Set loading to true when the request starts
   

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
          setErrorMessage("Failed to decode token. Ensure token is valid.");
          setShowErrorModal(true);
        }
      } else {
        setErrorMessage("Unexpected response format. Token not found.");
        setShowErrorModal(true);
      }
    } catch (error) {
      if (error) {
        const errorMessage = error;
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
      } else {
        setErrorMessage("Login failed. Please try again later.");
        setShowErrorModal(true);
      }
    } finally {
      setLoading(false); // Set loading to false after the request is completed
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
      <main className="newLoginMainWrapper">
        {loading && <Loader />}
        <div className="newLoginWrapper">
          <div className="newLoginContainer">
            <div className="newLoginLeftSectionOuter">
              <div className="newLoginLeftTitle">Welcome to <br /> Employee Management System</div>
              <div className="newLoginLeftImgHolder"><img src="..\assets\img\left-img.png" alt="#" /></div>
            </div>
            <div className='newLoginRightSectionOuter'>
              <div className="newLoginRightSection">
                <div className="newLoginRightSecTitle">Login</div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="formgroup">
                    <label className="form-label">Email Id</label>
                    <input className="form-control form-control-lg"
                      type="email"
                      placeholder="Email Id"
                      autoComplete="off"
                      onKeyDown={handleEmailChange}
                      {...register("username", {
                        required: "Email Id is Required.",
                        pattern: {
                          value: /^(?![0-9]+@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov)$/,
                          message: "Invalid email Id format. Only .com, .in, .org, .net, .edu, .gov are allowed.",
                        },
                      })}
                    />
                    {errors.username && <p className="errorMsg">{errors.username.message}</p>}
                  </div>
                  <div class="formgroup">
                    <label class="form-label">Password</label>
                    <input class="form-control form-control-lg"
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
                        validate: validatePassword,
                      })}
                    />
                    {errors.password && (
                      <p className="errorMsg" style={{ marginLeft: "20px" }}>
                        {errors.password.message}
                      </p>
                    )}
                    <span onClick={togglePasswordVisibility} className="fa fa-fw fa-eye field-icon toggle-password"></span>
                  </div>
                  <div className="d-grid gap-2 mt-3">
                    <button className="btn btn-lg btn-primary" type="submit">Sign in</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Error Modal */}
      <Modal
        show={showErrorModal}
        onHide={closeModal}
        centered
        style={{ zIndex: "1050" }}
        className="custom-modal"
      >
        <ModalHeader closeButton>
          <ModalTitle className="text-center">Error</ModalTitle>
        </ModalHeader>
        <ModalBody className="text-center fs-bold">
          {errorMessage}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default EmsLogin;
