import React, { useState } from "react";
// import "./Login.css";
import { Envelope, Key, Lock, Unlock } from "react-bootstrap-icons";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

const EmsLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      emailId: "",
      otp: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  const handlePasswordChange = (e) => {
    setPasswordShown(e.target.value);
  };

  const handleEmailChange = (e) => {
    // Prevent space character entry
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  const sendOtp = (data) => {
    const postData = {
      emailId: data.emailId,
      password: data.password,
    };
    axios
      .post("http://192.168.1.163:8092/login/send-otp", postData)
      .then((response) => {
        if (response.status === 200) {
          toast.success("OTP Sent Successfully", {
            position: "top-right",
            transition: Bounce,
            hideProgressBar: true,
            theme: "colored",
            autoClose: 2000, // Close the toast after 2 seconds
          });
          setOtpSent(true); // Set OTP sent to true
          setUser(response.data);
        }
      })
      .catch((error) => {
        handleErrors(error);
      });
  };

  const handleErrors = (error) => {
    if (error.response) {
      const status = error.response.status;
      let errorMessage = "";

      switch (status) {
        case 400:
          errorMessage = "Email Does Not Exist!";
          break;
        case 401:
          errorMessage = "Session Timed Out!";
          break;
        case 404:
          errorMessage = "Resource Not Found!";
          break;
        case 406:
          errorMessage = "Invalid Details!";
          break;
        case 500:
          errorMessage = "Server Error!";
          break;
        default:
          errorMessage = "An Error Occurred!";
          break;
      }

      toast.error(errorMessage, {
        position: "top-right",
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 3000,
      });
    } else {
      toast.error("Network Error!", {
        position: "top-right",
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 3000,
      });
    }

    console.log(error);
  };

  const verifyOtpAndLogin = (data) => {
    const postData = {
      emailId: data.emailId,
      otp: data.otp,
    };
    axios
      .post("http://192.168.1.163:8092/login/validate-otp", postData)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Login Successful", {
            position: "top-right",
            transition: Bounce,
            hideProgressBar: true,
            theme: "colored",
            autoClose: 2000, // Close the toast after 2 seconds
          });
          console.log(response.data)
          sessionStorage.setItem('id',response.data.id)
          sessionStorage.setItem('name', response.data.name);
          sessionStorage.setItem('role', response.data.role);
          sessionStorage.setItem('imageFile', response.data.ImageFile);
          navigate("/main", { state: { emailId: data.emailId } }); // Navigate to main page
        }
      })
      .catch((error) => {
        handleErrors(error);
      });
  };

  const onSubmit = (data) => {
    if (otpSent) {
      verifyOtpAndLogin(data);
    } else {
      sendOtp(data);
    }
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
                    {...register("emailId", {
                      required: "Email is Required.",
                      pattern: {
                        value: /^\S[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email is not valid.",
                      },
                    })}
                  />
                  {errors.emailId && (
                    <p className="errorMsg" style={{ marginLeft: "44px" }}>
                      {errors.emailId.message}
                    </p>
                  )}
                </div>

                {otpSent && (
                  <div className="input_field">
                    <input
                       type={passwordShown ? "text" : "password"}
                      name="otp"
                      placeholder=" Enter OTP"
                      {...register("otp", {
                        required: "OTP is Required",

                        pattern: {
                          value: /^\d{6}$/,
                          message: "OTP must be 6 digits.",
                        },
                      })}
                    />
                     <span onClick={togglePasswordVisiblity} style={{ marginTop: "3px" }}>
                      {passwordShown ? <Key size={20} /> : <Key size={20} />}
                    </span>
                    {errors.otp && (
                      <p className="errorMsg" style={{ marginLeft: "44px" }}>
                        {errors.otp.message}
                      </p>
                    )}
                  </div>
                )}

{!otpSent && (
                  <div className="input_field">
                    <input
                      name="password"
                      placeholder="Password"
                      onChange={handleEmailChange}
                      type={passwordShown ? "text" : "password"}
                      {...register("password", {
                        required: "Password is Required",
                        pattern: {
                          value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*])/,
                          message: "Please Check Password You Entered",
                        },
                      })}
                    />
                    {errors.password && (
                      <p className="errorMsg" style={{ marginLeft: "44px" }}>
                        {errors.password.message}
                      </p>
                    )}
                    <span onClick={togglePasswordVisiblity} style={{ marginTop: "3px" }}>
                      {passwordShown ? <Unlock size={20} /> : <Lock size={20} />}
                    </span>
                  </div>
                )}


                <button className="button" type="submit">
                  {otpSent ? "Verify OTP and Login" : "Send OTP"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <p className="credit">
        Developed by{" "}
        <a href="http://www.designtheway.com" target="_blank">
          PathBreaker Technologies PVT.LTD
        </a>
      </p>
    </div>
  );
};

export default EmsLogin;
