import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { EnvelopeFill, LockFill, UnlockFill } from 'react-bootstrap-icons';
import { Bounce, toast } from 'react-toastify';
import { CompanyloginApi } from '../Utils/Axios';

const CompanyLogin = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      username: "",
      password: "",
      otp: ""
    }
  });

  const { company } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [passwordShown, setPasswordShown] = useState(false);
  const [otpSent, setOtpSent] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false); 

  const togglePasswordVisibility = () => {
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

  useEffect(() => {
    // Save 'company' to sessionStorage
    sessionStorage.setItem('company', company);
  }, [company]); // Save whenever 'company' changes

  const sendOtp = (data) => {
    setLoading(true);
    const payload = {
      username: data.username,
      password: data.password,
      company: company
    };

    CompanyloginApi(payload)
      .then((response) => {
        console.log(response.data);
        toast.success("OTP sent Successfully");
        setLoading(false);
        setShowOtpField(true); // Show OTP field after OTP is sent successfully
        setOtpSent(true); // Mark OTP as sent
      })
      .catch((error) => {
        toast.error("Failed to send OTP. Please try again.");
        setLoading(false);
      });
  };

  const token=sessionStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      "Content-Type": "application/json", // Specify content type as JSON
    },
  };

  const verifyOtpAndCompanyLogin = (data) => {

    const payload = {
      username: data.username,
      otp:data.otp,
      company: company
    };
    setLoading(true);
    axios.post("http://localhost:9090/ems/validate", payload,config)
      .then((response) => {
        if (response.status === 200) {
          toast.success("CompanyLogin Successful", {
            position: 'top-right',
            transition: Bounce,
            hideProgressBar: true,
            theme: "colored",
            autoClose: 2000,
          });

          sessionStorage.setItem('id', response.data.id);
          sessionStorage.setItem('name', response.data.name);
          sessionStorage.setItem('role', response.data.role);

          if (response.data.imageFile) {
            sessionStorage.setItem('imageFile', response.data.imageFile);
          } else {
            console.error('imageFile is undefined');
          }

          navigate("/main", { state: { username: data.username } }); // Navigate to main page
        }

      })
      .catch((error) => {
        handleErrors(error);
      });
  };

  const handleErrors = (error) => {
    if (error.response && error.response.data && error.response.data.error) {
      toast.error(error.response.data.error.message, {
        position: 'top-right',
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 2000,
      });
    } else {
      toast.error("An unexpected error occurred.", {
        position: 'top-right',
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 2000,
      });
    }
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
                  <div className="card-body" style={{ padding: "6px" }}>
                    <div className="m-sm-2">
                      <form onSubmit={handleSubmit(onSubmit)} className='align-items-center'>
                        <label className="form-label">Email Id</label>
                        <>
                          <div className="input-group">
                            <span className="input-group-text"><EnvelopeFill size={20} color='#4C489D' /></span>
                            <input className="form-control" type="email" name="username" id='username' placeholder="Enter your email"
                              autoComplete='off'
                              onKeyDown={handleEmailChange}
                              {...register("username", {
                                required: "Email is Required.",
                                pattern: {
                                  value: /^\S[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: "Email is not valid."
                                }
                              })}
                            />
                          </div>
                          {errors.username && <p className="errorMsg p-0" style={{ marginLeft: "45px" }}>{errors.username.message}</p>}
                        </>
                        <div className='mt-3'>
                          {showOtpField ? (
                            <div>
                               <label className="form-label">OTP</label>
                              <div className="mb-3 input-group">
                                <span className="input-group-text" onClick={togglePasswordVisibility}>
                                  <UnlockFill size={20} color='#4C489D' />
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
                            </div>
                          ) : (
                            <>
                              <label className='form-label'>Password</label>
                              <div className="input-group">
                                <span className="input-group-text" onClick={togglePasswordVisibility}>
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
                        </div>
                        <div className="text-center mt-4" style={{ paddingTop: "10px" }}>
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

