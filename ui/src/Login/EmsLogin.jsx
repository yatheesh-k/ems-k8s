import React, { useState } from "react";
import { Envelope, Key, Lock, Unlock } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { loginApi } from "../Utils/Axios";
import { toast } from "react-toastify";
import axios from "axios";

const EmsLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { username: "", password: "" } });

  const {company}=useParams();
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

  const onSubmit = (data) => {
    const payload = {
      ...data,
      company:company
    };
    loginApi(payload)
      .then((response) => {
        console.log(response.data);
        toast.success("Login Successfully");
        navigate("/main");
      })
      .catch((error) => {
        toast.error("Login failed. Please try again.");
      });
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
                    <p className="errorMsg" style={{ marginLeft: "44px" }}>
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* {otpSent && (
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
                )} */}

                {/* {!otpSent && ( */}
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
                      // pattern: {
                      //   value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*])/,
                      //   message: "Please Check Password You Entered",
                      // },
                    })}
                  />
                  {errors.password && (
                    <p className="errorMsg" style={{ marginLeft: "44px" }}>
                      {errors.password.message}
                    </p>
                  )}
                  <span
                    onClick={togglePasswordVisiblity}
                    style={{ marginTop: "3px" }}
                  >
                    {passwordShown ? <Unlock size={20} /> : <Lock size={20} />}
                  </span>
                </div>
                {/* )} */}

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
