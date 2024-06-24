import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { EnvelopeFill, LockFill, UnlockFill } from 'react-bootstrap-icons';
import { Bounce, toast } from 'react-toastify';


const CompanyLogin = () => {
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
  const [loading,setLoading] =useState(false);

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
    setLoading(true);
    axios.post("http://192.168.1.163:8092/CompanyLogin/send-otp", data)
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
          console.log(response.data)
        }
      })
      .catch((error) => {
        handleErrors(error);
      });
  };

  const verifyOtpAndCompanyLogin = (data) => {
    setLoading(true)
    axios.post("http://192.168.1.163:8092/CompanyLogin/validate-otp", data)
      .then((response) => {
        if (response.status === 200) {
          toast.success("CompanyLogin Successful", {
            position: 'top-right',
            transition: Bounce,
            hideProgressBar: true,
            theme: "colored",
            autoClose: 2000,
          });
          console.log(response.data)
          sessionStorage.setItem('id',response.data.id)
          sessionStorage.setItem('name', response.data.name);
          sessionStorage.setItem('role', response.data.role);
          // Log imageFile to ensure it's present
          console.log('ImageFile:', response.data.imageFile);
          
          // Store imageFile if it exists
          if (response.data.imageFile) {
            sessionStorage.setItem('imageFile', response.data.imageFile);
          } else {
            console.error('imageFile is undefined');
          }
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
                    <div className='card-header'>
                    <div className="text-center mt-2">
                  <p className="lead">
                    Sign
                  </p>
                </div>
                    </div>
                  <div className="card-body" style={{padding:"6px"}}>
                    <div className="m-sm-2">
                    <form onSubmit={handleSubmit(onSubmit)} className='align-items-center'>
                        <label className="form-label">Email Id</label>
                        <>
                          <div className="input-group">
                            <span className="input-group-text"><EnvelopeFill size={20} color='#4C489D' /></span>
                            <input className="form-control" type="email" name="emailId" id='emailId' placeholder="Enter your email"
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
                          </div>
                          {errors.emailId && <p className="errorMsg p-0" style={{ marginLeft: "45px" }}>{errors.emailId.message}</p>}
                        </>
                        <div className='mt-3'>
                          {!otpSent && (
                            <>
                              <label className='form-label'>Password</label>
                              <div className="input-group">
                                <span className="input-group-text" onClick={togglePasswordVisiblity}>
                                  {passwordShown ? (
                                    <UnlockFill size={20} color='#4C489D' />
                                  ) : (
                                    <LockFill size={20} color='#4C489D' />
                                  )}
                                </span>
                                <input
                                  className="form-control"
                                  name="password"
                                  id='password'
                                  placeholder="Enter your password"
                                  onChange={handlePasswordChange}
                                  type={passwordShown ? "text" : "password"}
                                  {...register("password", {
                                    required: "Password is Required",
                                    minLength: {
                                      value: 6,
                                      message: "Password must be at least 6 characters long"
                                    },
                                    maxLength: {
                                      value: 8,
                                      message: "Password cannot be longer than 8 characters"
                                    },
                                    pattern: {
                                      value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$*])/,
                                      message: "Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character."
                                    }
                                  })}
                                />
                              </div>
                              {errors.password && (
                                <p className='errorMsg' style={{ marginLeft: "45px", marginBottom: "0" }}>
                                  {errors.password.message}
                                </p>
                              )}
                            </>
                          )}
                          {otpSent && (
                            <div className="mb-3 input-group">
                              <span className="input-group-text" onClick={togglePasswordVisiblity}>
                                {passwordShown ? (
                                  <UnlockFill size={20} color='#4C489D' />
                                ) : (
                                  <LockFill size={20} color='#4C489D' />
                                )}
                              </span>
                              <input className="form-control" type="password" name="otp" id='otp' placeholder="Enter your OTP"
                                autoComplete='off'
                                {...register("otp", {
                                  required: "OTP is Required.",
                                  pattern: {
                                    value: /^\d{6}$/,
                                    message: "OTP must be 6 digits."
                                  }
                                })}
                              />
                              {errors.otp && <p className="errorMsg">{errors.otp.message}</p>}
                            </div>
                          )}
                        </div>
                        <div className="text-center mt-4" style={{paddingTop:"10px"}}>
                          <button className="btn btn-primary" type="submit" disabled={loading}>
                            {loading ? "Loading..." : (otpSent ? "Verify OTP" : "Send OTP")}
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
    </div>
  );
};

export default CompanyLogin;
