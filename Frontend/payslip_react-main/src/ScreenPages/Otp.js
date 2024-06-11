import React, { useEffect, useState} from 'react'
import {useForm} from'react-hook-form';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import { EnvelopeFill } from 'react-bootstrap-icons';


const Otp = () => {
   const{register,handleSubmit,formState:{errors},reset,setValue}=useForm()
    const [open,setOpen]=useState([]);
    const navigate=useNavigate();
    const location=useLocation();

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
        axios.post("http://192.168.1.163:8092/login/validate-otp", data)
        .then((response) => { 
            if(response.status===200){
                toast.success("Login Successfully",{
                    position: 'top-right',
                    transition:Bounce,
                    hideProgressBar: true,
                    theme: "colored",
                    autoClose: 2000, // Close the toast after 2 seconds
                   
                })
            sessionStorage.setItem('role', response.data.role);
            sessionStorage.setItem('name', response.data.name);
            }
            setOpen(response.data);
            sessionStorage.setItem('role',response.data.role)
          sessionStorage.setItem('userId', response.data.userId);
          sessionStorage.setItem('id',response.data.id)
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
          <main className="d-flex w-100 ">
          <div className="container d-flex flex-column">
              <div className="row vh-100">
                  <div className="col-sm-10 col-md-7 col-lg-6 mx-auto d-table h-100">
                      <div className="d-table-cell align-middle">
                          <div className="text-center mt-2">
                              <h1 className="h2">Welcome</h1>
                              <div className="text-center">
                                  <img src="assets/img/pathbreaker_logo.png" alt="VeganText" className="img-fluid mb-2 " width={180} height={150} />
                              </div>
                              <p className="lead">
                                  Sign in to your account to continue
                              </p>
                          </div>
                          <div className="card" style={{ backgroundColor: "transparent" }}>
                              <div className="card-body">
                                  <div className="m-sm-6">
                                      <form onSubmit={handleSubmit(onSubmit)} >
                                      <div className="mb-3">
                                                    <label className="form-label"><b>Email</b></label>
                                                    <input className="login__input" type="email" name="emailId" id='emailId' placeholder="Enter your email"
                                                     autoComplete='off' 
                                                     onKeyDown={handleEmailChange} // Add this event listener
                                                     {...register("emailId", {
                                                        required: "Email is Required.",
                                                        pattern: {
                                                          value: /^\S[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                          message: "Email is not valid."
                                                        } 
                                                      })}
                                                    />
                                                    {errors.emailId && <p className="errorMsg" style={{marginLeft:"44px"}}>{errors.emailId.message}</p>}
                                                </div>
                                          <div className="mb-3">
                                              <label className="form-label"><b>OTP</b></label>
                                              <input className="login__input" type="text" name="otp" id='otp' placeholder="Enter OTP"
                                                  {...register("otp", {
                                                      required: "Enter OTP",
                                                     
                                                  })}
                                              />
                                              {errors.otp && (<p className='errorMsg'style={{marginLeft:"53px"}}>{errors.otp.message}</p>)}
                                          </div>
                    
                                          <div className="text-center mt-4 ml-5" style={{ display: "flex",marginLeft:"30px" }}>
                                              <button className="login__submit" type='submit'>Login</button>

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
    );
}
export default Otp