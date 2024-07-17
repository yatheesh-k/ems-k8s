import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { forgotPasswordStep1, forgotPasswordStep2, ValidateOtp } from '../Utils/Axios';
import { company } from '../Utils/Auth';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const { register, handleSubmit,watch, formState: { errors, isSubmitting } } = useForm();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyShortName, setCompanyShortName] = useState(company);
  const watchPassword = watch('password', '');
  const navigate=useNavigate();

  const onSubmitEmail = async (data) => {
    setLoading(true);
    const formData = {
      username: data.email,
      company: companyShortName
    };
    try {
      const response = await forgotPasswordStep1(formData);
      console.log(response.data); // Handle API response as needed
      setEmail(data.email); // Update email state here
      setStep(2); // Move to Step 2 if successful
    } catch (error) {
      console.error('Forgot Password Step 1 Error:', error);
      // Handle error, show message, etc.
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async (data) => {
    setLoading(true);
    const formData = {
        username: data.email,
        otp:data.otp,
        company: companyShortName
      };
    try {
      const response = await ValidateOtp(formData);
      console.log(response.data); // Handle API response as needed
      setStep(3); // Move to Step 3 if OTP validation successful
    } catch (error) {
      console.error('OTP Validation Error:', error);
      // Handle error, show message, etc.
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
        company: companyShortName,
        companyFullName: data.companyName
      };
      const response = await forgotPasswordStep2(formData);
      console.log(response.data); // Handle API response as needed
      navigate('/:company/login')
    } catch (error) {
      console.error('Update Password Error:', error);
      // Handle error, show message, etc.
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSubmit(onSubmitEmail)}>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" className="form-control" {...register('email', { required: true })} />
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
              <input type="email" className="form-control" value={email} disabled />
            </div>
            <div className="form-group">
              <label>OTP:</label>
              <input type="text" className="form-control" {...register('otp', { required: true })} />
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
              <input type="email" className="form-control" value={email} disabled />
            </div>
            <div className="form-group">
              <label>New Password:</label>
              <input type="password" className="form-control" {...register('password', { required: true })} />
              {errors.password && <span className="text-danger">Password is required</span>}
            </div>
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                {...register('confirmPassword', {
                  required: true,
                  validate: value => value === watchPassword || "Passwords do not match"
                })}
              />
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
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
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
  );
};

export default ForgotPassword;
