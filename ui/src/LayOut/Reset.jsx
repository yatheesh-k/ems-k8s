import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { EnvelopeFill, UnlockFill, LockFill } from "react-bootstrap-icons"; // Make sure you have these icons
import { Modal } from "react-bootstrap";
import { resetPassword } from "../Utils/Axios";
import { company, employeeId } from "../Utils/Auth";
import { toast } from "react-toastify";

const Reset = ({ companyName, onClose,show}) => {
  const { register, handleSubmit, formState: { errors },getValues } = useForm();
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  const onSubmit = async (data) => {
    const formData = {
      password: data.password,
      newPassword: data.newPassword,
      companyName: company, 
    };
console.log(formData);
    try {
      setLoading(true);
      const response = await resetPassword(formData,employeeId); // Call resetPassword API function
      console.log('Password reset successful:', response.data);
      setLoading(false);
      onClose(); // Close modal or handle success state
    } catch (error) {
     handleApiErrors(error);
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
  return (
    <Modal show={show} onHide={onClose} centered style={{zIndex:"1050"}}>
    <Modal.Header closeButton>
      <Modal.Title>Reset Password</Modal.Title>
    </Modal.Header>
    <Modal.Body>
          
               
    <div>
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className="form-group mt-3">
      <label className="form-label">Old Password</label>
      <div className="input-group">
        <span className="input-group-text" onClick={togglePasswordVisiblity}>
          {passwordShown ? <UnlockFill size={20} color="#4C489D" /> : <LockFill size={20} color="#4C489D" />}
        </span>
        <input
          className="form-control"
          name="oldPassword"
          id="oldPassword"
          placeholder="Enter your old password"
          type={passwordShown ? "text" : "password"}
          {...register("password", {
            required: "Old Password is Required",
            minLength: {
              value: 6,
              message: "Old Password must be at least 6 characters long",
            },
            pattern: {
              value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$*])/,
              message: "Old Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character.",
            },
          })}
        />
      </div>
      {errors.password && (
        <p className="errorMsg" style={{ marginLeft: "45px", marginBottom: "0" }}>
          {errors.password.message}
        </p>
      )}
    </div>

    <div className="form-group mt-3">
      <label className="form-label">New Password</label>
      <div className="input-group">
        <span className="input-group-text" onClick={togglePasswordVisiblity}>
          {passwordShown ? <UnlockFill size={20} color="#4C489D" /> : <LockFill size={20} color="#4C489D" />}
        </span>
        <input
          className="form-control"
          name="newPassword"
          id="newPassword"
          placeholder="Enter your new password"
          type={passwordShown ? "text" : "password"}
          {...register("newPassword", {
            required: "New Password is Required",
            minLength: {
              value: 6,
              message: "New Password must be at least 6 characters long",
            },
            pattern: {
              value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$*])/,
              message: "New Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character.",
            },
          })}
        />
      </div>
      {errors.newPassword && (
        <p className="errorMsg" style={{ marginLeft: "45px", marginBottom: "0" }}>
          {errors.newPassword.message}
        </p>
      )}
    </div>
    <div className="form-group mt-3">
      <label className="form-label">Confirm Password</label>
      <div className="input-group">
        <span className="input-group-text" onClick={togglePasswordVisiblity}>
          {passwordShown ? <UnlockFill size={20} color="#4C489D" /> : <LockFill size={20} color="#4C489D" />}
        </span>
        <input
          className="form-control"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm your new password"
          type={passwordShown ? "text" : "password"}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === getValues("newPassword") || "The passwords do not match",
          })}
        />
      </div>
      {errors.confirmPassword && (
        <p className="errorMsg" style={{ marginLeft: "45px", marginBottom: "0" }}>
          {errors.confirmPassword.message}
        </p>
      )}
    </div>

    <div className="text-center mt-4">
      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Loading..." : "Submit"}
      </button>
    </div>
  </form>
</div>     
     </Modal.Body>
</Modal>         
  );
};

export default Reset;
