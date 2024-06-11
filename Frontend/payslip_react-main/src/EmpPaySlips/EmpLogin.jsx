import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { EnvelopeFill, LockFill, UnlockFill } from 'react-bootstrap-icons';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      emailId: "",
      password: "",
      otp: ""
    }
  });
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [passwordShown, setPasswordShown] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent

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
    axios.post("http://192.168.1.163:8092/user/send-otp", data)
      .then((response) => {
        if (response.status === 200) {
          toast.success("OTP Sent Successfully", {
            position: 'top-right',
            transition: Bounce,
            hideProgressBar: true,
            theme: "colored",
            autoClose: 2000,
          });
          setOtpSent(true); // Set OTP sent to true
          setUser(response.data);
        }
      })
      .catch((error) => {
        handleErrors(error);
      });
  };

  const verifyOtpAndLogin = (data) => {
    axios.post("http://192.168.1.163:8092/user/verify-otp", data)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Login Successful", {
            position: 'top-right',
            transition: Bounce,
            hideProgressBar: true,
            theme: "colored",
            autoClose: 2000,
          });
          navigate("/main", { state: { emailId: data.emailId } }); // Navigate to main page
        }
      })
      .catch((error) => {
        handleErrors(error);
      });
  };

  const handleErrors = (error) => {
    if (error.response) {
      const status = error.response.status;
      let errorMessage = '';

      switch (status) {
        case 400:
          errorMessage = 'Email Does Not Exist!';
          navigate('/');
          break;
        case 401:
          errorMessage = 'Session Timed Out!';
          navigate('/');
          break;
        case 404:
          errorMessage = 'Resource Not Found!';
          break;
        case 406:
          errorMessage = 'Invalid Details!';
          break;
        case 500:
          errorMessage = 'Server Error!';
          break;
        default:
          errorMessage = 'An Error Occurred!';
          break;
      }

      toast.error(errorMessage, {
        position: 'top-right',
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 3000,
      });
    } else {
      toast.error('Network Error!', {
        position: 'top-right',
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 3000,
      });
    }

    console.log(error);
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
      <main className="d-flex w-100 ">
        <div className="container d-flex flex-column">
          <div className="row vh-100">
            <div className="col-sm-10 col-md-7 col-lg-6 mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="text-center mt-2">
                  <div className="text-center">
                  </div>
                  <p className="lead">
                    Sign
                  </p>
                </div>
                <div className="card" style={{ backgroundColor: "transparent" }}>
                  <div className="card-body">
                    <div className="m-sm-6">
                      <form onSubmit={handleSubmit(onSubmit)} style={{ alignContent: "center" }}>
                        <div className="mb-3">
                          <label className="form-label"><EnvelopeFill size={20} color='#4C489D' /></label>
                          <input className="login__input" type="email" name="emailId" id='emailId' placeholder="Enter your email"
                            autoComplete='off'
                            onKeyDown={handleEmailChange}
                            {...register("emailId", {
                              required: "Email is Required.",
                              pattern: {
                                value: /^\S[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Email is not valid."
                              }
                            })}
                          />
                          {errors.emailId && <p className="errorMsg" style={{ marginLeft: "44px" }}>{errors.emailId.message}</p>}
                        </div>
                        
                        {!otpSent && (
                          <div className="mb-3">
                            <label className="form-label"><i onClick={togglePasswordVisiblity}>
                              {passwordShown ? (
                                <UnlockFill size={20} color='#4C489D' />
                              ) : (
                                <LockFill size={20} color='#4C489D' />
                              )}
                            </i></label>
                            <input className="login__input" name="password" id='password' placeholder="Enter your password"
                              onChange={handlePasswordChange}
                              type={passwordShown ? "text" : "password"}
                              {...register("password", {
                                required: "Password is Required",
                                pattern: {
                                  value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*])/,
                                  message: "Please Check Password You Entered"
                                }
                              })}
                            />
                            {errors.password && (<p className='errorMsg' style={{ marginLeft: "44px" }}>{errors.password.message}</p>)}
                          </div>
                        )}

                        {otpSent && (
                          <div className="mb-3">
                            <label className="form-label"><i onClick={togglePasswordVisiblity}>
                              {passwordShown ? (
                                <UnlockFill size={20} color='#4C489D' />
                              ) : (
                                <LockFill size={20} color='#4C489D' />
                              )}
                            </i></label>
                            <input className="login__input" type={passwordShown ? "text" : "password"} name="otp" id='otp' placeholder="Enter your OTP"
                              autoComplete='off' 
                              {...register("otp", {
                                required: "OTP is Required.",
                                pattern: {
                                  value: /^\d{6}$/,
                                  message: "OTP must be 6 digits."
                                }
                              })}
                            />
                            {errors.otp && <p className="errorMsg" style={{ marginLeft: "44px" }}>{errors.otp.message}</p>}
                          </div>
                        )}

                        <div className="text-center mt-4" style={{ display: "flex", marginLeft: "30px" }}>
                          <button className="login__submit" type='submit'>{otpSent ? "Verify OTP" : "Get OTP"}</button>
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
    </div>
  );
};

export default Login;
