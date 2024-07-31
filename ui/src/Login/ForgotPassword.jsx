import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { forgotPasswordStep1, forgotPasswordStep2, ValidateOtp } from '../Utils/Axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EnvelopeFill, LockFill, UnlockFill } from 'react-bootstrap-icons';

const ForgotPassword = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const watchPassword = watch('password', '');
  const navigate = useNavigate();
  const company = sessionStorage.getItem("company");

  const onSubmitEmail = async (data) => {
    setLoading(true);
    const formData = {
      username: data.email,
      company: company
    };
    try {
      const response = await forgotPasswordStep1(formData);
      console.log(response.data); // Handle API response as needed
      setEmail(data.email); // Update email state here
      setStep(2); // Move to Step 2 if successful
    } catch (error) {
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
      console.log(response.data); // Handle API response as needed
      navigate('/:company/login');
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSubmit(onSubmitEmail)}>
            <div className="form-group">
              <label>Email:</label>
              <div className="input-group">
                <span className="input-group-text">
                <EnvelopeFill size={20} color="#4C489D" />
                </span>
                <input type="email" className="form-control" {...register('email', { required: true })} />
              </div>
              {errors.email && <span className="text-danger">Email is required</span>}
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
                <span className="input-group-text">
                   <EnvelopeFill size={20} color="#4C489D" />
                </span>
                <input type="text" className="form-control" {...register('otp', { required: true })} />
              </div>
              {errors.otp && <span className="text-danger">OTP is required</span>}
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
              <label>New Password:</label>
              <div className="input-group">
                <span className="input-group-text" onClick={togglePasswordVisibility}>
                  {passwordShown ? (
                    <UnlockFill size={20} color="#4C489D" />
                  ) : (
                    <LockFill size={20} color="#4C489D" />
                  )}
                </span>
                <input type={passwordShown ? "text" : "password"} className="form-control" {...register('password', { required: true })} />
              </div>
              {errors.password && <span className="text-danger">Password is required</span>}
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
                  type={passwordShown ? "text" : "password"}
                  className="form-control"
                  {...register('confirmPassword', {
                    required: true,
                    validate: value => value === watchPassword || "Passwords do not match"
                  })}
                />
              </div>
              {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message}</span>}
            </div>
            <div className="form-group">
              <label>Company Name:</label>
              <input type="text" className="form-control" {...register('companyName', { required: true })} />
              {errors.companyName && <span className="text-danger">Company Name is required</span>}
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
                <div className="card-header">
                  <div className="text-center mt-2">
                    <p className="lead">Forgot Password</p>
                  </div>
                </div>
                <div className="card-body">
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
