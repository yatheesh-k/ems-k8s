import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { forgotPasswordStep1, forgotPasswordStep2, ValidateOtp } from '../Utils/Axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BriefcaseFill, EnvelopeFill, LockFill, UnlockFill } from 'react-bootstrap-icons';

const ForgotPassword = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ mode: "onChange" });
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [otpShown, setOtpShown] = useState(false); // Separate state for OTP visibility
  const [loading, setLoading] = useState(false);
  const watchPassword = watch('password', '');
  const navigate = useNavigate();
  const company = localStorage.getItem("company");

  const onSubmitEmail = async (data) => {
    setLoading(true);
    const formData = {
      username: data.email,
      company: company
    };
    try {
      const response = await forgotPasswordStep1(formData);
      console.log(response.data);
      toast.success("OTP Sent Successfully"); // Handle API response as needed
      setEmail(data.email); // Update email state here
      setStep(2); // Move to Step 2 if successful
    } catch (error) {
      console.error("Failed to send OTP:", error);
      handleApiErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async (data) => {
    setLoading(true);
    const formData = {
      username: data.email,
      otp: data.otp,
      company: company
    };
    try {
      const response = await ValidateOtp(formData);
      toast.success("Verification Successfull");
      console.log(response.data); // Handle API response as needed
      setStep(3); // Move to Step 3 if OTP validation successful
    } catch (error) {
      handleApiErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitNewPassword = async (data) => {
    setLoading(true);
    try {
      const formData = {
        username: email,
        password: data.password,
        company: company,
        companyFullName: data.companyName
      };
      const response = await forgotPasswordStep2(formData);
      toast.success("Password Updated Successfully");
      console.log(response.data); // Handle API response as needed
      navigate(`/${company}/login`);
    } catch (error) {
      handleApiErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApiErrors = (error) => {
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
      const errorMessage = error.response.data.error.message;
      toast.error(errorMessage);
    } else {
      toast.error("Network Error !");
    }
    console.error(error.response);
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const toggleOtpVisibility = () => {
    setOtpShown(!otpShown);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSubmit(onSubmitEmail)}>
            <div className="form-group">
              <label>Email Id</label>
              <div className="input-group">
                <span className="input-group-text">
                  <EnvelopeFill size={20} color="#4C489D" />
                </span>
                <input
                  type="email"
                  placeholder='Enter Your Email Id'
                  className="form-control"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="errorMsg p-0" style={{ marginLeft: "60px" }}>
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleSubmit(onSubmitOtp)}>
            <div className="form-group">
              <label>Email Id:</label>
              <div className="input-group">
                <span className="input-group-text">
                  <EnvelopeFill size={20} color="#4C489D" />
                </span>
                <input type="email" className="form-control" value={email} disabled />
              </div>
            </div>
            <div className="form-group">
              <label>OTP:</label>
              <div className="input-group">
                <span className="input-group-text" onClick={toggleOtpVisibility} style={{ cursor: 'pointer' }}>
                  {otpShown ? (
                    <UnlockFill size={20} color="#4C489D" />
                  ) : (
                    <LockFill size={20} color="#4C489D" />
                  )}
                </span>
                <input
                  type={otpShown ? "text" : "password"}
                  placeholder='Enter OTP'
                  className="form-control"
                  {...register('otp', {
                    required: 'OTP is required',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'Invalid OTP'
                    }
                  })}
                />
              </div>
              {errors.otp && <span className="text-danger" style={{ marginLeft: "60px" }}>{errors.otp.message}</span>}
            </div>
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleSubmit(onSubmitNewPassword)}>
            <div className="form-group">
              <label>Email:</label>
              <div className="input-group">
                <span className="input-group-text">
                  <EnvelopeFill size={20} color="#4C489D" />
                </span>
                <input type="email" className="form-control" value={email} disabled />
              </div>
            </div>
            <div className="form-group">
              <label>OTP:</label>
              <div className="input-group">
                <span className="input-group-text" onClick={toggleOtpVisibility} style={{ cursor: 'pointer' }}>
                  {otpShown ? (
                    <UnlockFill size={20} color="#4C489D" />
                  ) : (
                    <LockFill size={20} color="#4C489D" />
                  )}
                </span>
                <input
                  placeholder='Enter OTP'
                  type={otpShown ? "text" : "password"}
                  className="form-control"
                  {...register('otp', {
                    required: 'OTP is required',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'Invalid OTP'
                    }
                  })}
                />
              </div>
              {errors.otp && <span className="text-danger" style={{ marginLeft: "60px" }}>{errors.otp.message}</span>}
            </div>
            <div className="form-group">
              <label>New Password:</label>
              <div className="input-group">
                <span className="input-group-text" onClick={togglePasswordVisibility}>
                  {passwordShown ? (
                    <UnlockFill size={20} color="#4C489D" />
                  ) : (
                    <LockFill size={20} color="#4C489D" />
                  )}
                </span>
                <input
                  placeholder='Enter Your New Password'
                  type={passwordShown ? "text" : "password"}
                  className="form-control"
                  {...register("password", {
                    required: "Password is Required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="errorMsg" style={{ marginLeft: "55px", marginBottom: "0" }}>
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="form-group">
              <label>Confirm Password:</label>
              <div className="input-group">
                <span className="input-group-text" onClick={togglePasswordVisibility}>
                  {passwordShown ? (
                    <UnlockFill size={20} color="#4C489D" />
                  ) : (
                    <LockFill size={20} color="#4C489D" />
                  )}
                </span>
                <input
                  placeholder='Confirm Password'
                  type={passwordShown ? "text" : "password"}
                  className="form-control"
                  {...register('confirmPassword', {
                    required: 'Confirm Password is required',
                    validate: value => value === watchPassword || "Passwords do not match"
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="errorMsg" style={{ marginLeft: "60px", marginBottom: "0" }}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="form-group">
              <label>Company Name:</label>
              <div className="input-group">
                <span className="input-group-text">
                  <BriefcaseFill size={20} color="#4C489D" />
                </span>
              <input
                placeholder='Enter Your Company'
                type="text"
                className="form-control"
                {...register("companyName", {
                  required: "Company Name is required",
                  pattern: {
                    value: /^[a-zA-Z\s,.'\-\/]*$/,
                    message: "Field accepts only alphabets and special characters:( , ' -  . /)",
                  },
                  minLength: {
                    value: 2,
                    message: "minimum 2 characters required",
                  },
                })}
              />
              </div>
              {errors.companyName && (
                <p className="errorMsg" style={{ marginLeft: "60px", marginBottom: "0" }}>
                  {errors.companyName.message}
                </p>
              )}
            </div>
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary" disabled={loading || isSubmitting}>
                {loading ? "Loading..." : "Update Password"}
              </button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <main className="d-flex w-100 ">
      <div className="container d-flex flex-column">
        <div className="row vh-100">
          <div className="col-sm-10 col-md-7 col-lg-6 mx-auto d-table h-100">
            <div className="d-table-cell align-middle">
              <div className="card">
                <div className="card-header" style={{paddingBottom:'0px'}}>
                  <div className="text-center mt-2">
                    <p className="lead">Forgot Password</p>
                  </div>
                </div>
                <div className="card-body" style={{ marginRight: '60px',paddingTop:'0px' }}>
                  <div className="m-sm-2">
                    {renderStep()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
