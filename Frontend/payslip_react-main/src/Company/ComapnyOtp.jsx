import React, { useEffect, useState } from "react";
import "../Login.css";
import { Envelope, Lock, Unlock } from "react-bootstrap-icons";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { text } from "body-parser";

const CompnyOtp = () => {
    const{register,handleSubmit,formState:{errors},reset,setValue}=useForm()
    const [open,setOpen]=useState([]);
    const navigate=useNavigate();
    const location=useLocation();
    const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };
  const handlePasswordChange = (e) => {
    setPasswordShown(e.target.value);
  };


    useEffect(() => {
        // Set the emailId value from the state passed from the login page
        if (location.state && location.state.emailId) {
            setValue("emailId", location.state.emailId);
        }
    }, [location.state, setValue]);

    const handleEmailChange = (e) => {
        // Prevent space character entry
        if (e.keyCode === 32) {
            e.preventDefault();
        }
    };
 
    const onSubmit = (data) => {
        // Adding logic to handle OTP submission, e.g., navigate to the next page
        axios.post("http://192.168.1.163:8092/user/login", data)
        .then((response) => { 
            if(response.status===200){
                toast.success("Login Successfully",{
                    position: 'top-right',
                    transition:Bounce,
                    hideProgressBar: true,
                    theme: "colored",
                    autoClose: 2000, // Close the toast after 2 seconds
                   
                })
            }
            setOpen(response.data);
            sessionStorage.setItem('role',response.data.role)
          sessionStorage.setItem('userId', response.data.userId);
          sessionStorage.setItem('id',response.data.id)
          sessionStorage.setItem('userName', response.data.userName);
            console.log(response.data);
            console.log('OTP submitted successfully!');
            reset();
            navigate("/main")    
        })
        .catch((error) => {
            if (error.response) {
                const status = error.response.status;
                let errorMessage = '';
        
                switch (status) {
                    case 401:
                        errorMessage = 'Session TimeOut !';
                        navigate('/');
                        break;
                    case 404:
                        errorMessage = 'Resource Not Found !';
                        break;
                    case 406:
                        errorMessage = 'Enter Valid OTP !';
                        break;
                    case 500:
                        errorMessage = 'Server Error !';
                        break;
                    default:
                        errorMessage = 'An Error Occurred !';
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
                toast.error('Network Error !', {
                    position: 'top-right',
                    transition: Bounce,
                    hideProgressBar: true,
                    theme: "colored",
                    autoClose: 3000,
                });
            }
        
            console.log(error);
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
                  {" "}
                  <span className="icon" style={{marginTop:"4px"}}>
                    <Envelope size={18} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    autoComplete="off"
                    onKeyDown={handleEmailChange} // Add this event listener
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
                <div className="input_field">
                  <input
                    name="otp"
                    placeholder="******"
                    maxLength={6}
                    onChange={handlePasswordChange}
                    type={passwordShown ? "text" : "password"}
                    {...register("otp", {
                      required: "Password is Required",
                      pattern: {
                        value:
                          "/^\d{6}$/",
                        message: " Please Check Password You Entered",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="errorMsg" style={{ marginLeft: "44px" }}>
                      {errors.password.message}
                    </p>
                  )}
                <span onClick={togglePasswordVisiblity} style={{marginTop:"3px"}}> {passwordShown ? (
                                                        <Unlock size={20}  />
                                                    ) : (
                                                        <Lock size={20}  />
                                                    )}</span>
                </div>

               <button className="button" type="submit">Submit</button>
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

export default CompnyOtp;
