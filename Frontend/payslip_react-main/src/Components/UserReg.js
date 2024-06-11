import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../ScreenPages/Footer';
import Header from '../ScreenPages/Header';
import SideNav from '../ScreenPages/SideNav';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { Bounce, toast } from 'react-toastify';


const UserReg = () => {
  const { register, handleSubmit, control, formState: { errors }, reset, setValue, getValues } = useForm('');
  const [stat, setStat] = useState([]);
  const [role, setRole] = useState([]);
  const [user, setUser] = useState([]);
  const [isUpdating,setIsUpdating]=useState(false)
  const [userId, setUserId] = useState('');
  const [userIdCounter, setUserIdCounter] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  
  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };
  const handlePasswordChange = (e) => {
    setPasswordShown(e.target.value);
  };

  const handleEmailChange = (e) => {
    // Get the current value of the input field
    const value = e.target.value;
    
    // Check if the value is empty
    if (value.trim() !== '') {
        return; // Allow space button
    }

    // Prevent space character entry if the value is empty
    if (e.keyCode === 32) {
        e.preventDefault();
    }
};

const toInputTitleCase = e => {
  let value = e.target.value;
  // Split the value into an array of words
  const words = value.split(' ');
  // Capitalize the first letter of each word
  const capitalizedWords = words.map(word => {
    // Capitalize the first letter of the word
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  // Join the capitalized words back into a single string
  value = capitalizedWords.join(' ');
  // Set the modified value to the input field
  e.target.value = value;
};

  useEffect(() => {
    // Generate the initial Employee ID when the component mounts
    generateUserId();
  }, []); // Empty dependency array ensures this effect runs only once

  const generateUserId = () => {
    // Generate the next Employee ID in the series
    const newuserId = `USER${userIdCounter.toString().padStart(3, '0')}`;
    setUserIdCounter(prevCounter => prevCounter + 1);
    setUserId(newuserId);
  };


 


  const getStatus = () => {
    axios.get(`http://192.168.1.163:8092/status/all`)
      .then((response) => {
        const filteredStatus = response.data.filter(role => role.statusInfo !== 'Notice Period' && role.statusInfo !== 'Relieved' );
        console.log(response.data);
        const formattedStatusList = filteredStatus.map(user => ({
          label: user.statusInfo,
          value: user.status,
          name: user.status,
        }));

        setStat(formattedStatusList);
        console.log(formattedStatusList);
      })
      .catch((errors) => {

        console.log(errors)
      });

  };
  const getRole = () => {
    axios.get(`http://192.168.1.163:8092/role/all`)
      .then((response) => {
        const filteredRoles = response.data.filter(role => role.role !== 'Employee');
        
        const formattedRoleList = filteredRoles.map(role => ({
          label: role.role,
          value: role.role,
        }));

        setRole(formattedRoleList); // Set the formatted role list to the state variable
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getStatus();
    getRole();
  }, [])


  const onSubmit = (data) => {
    if (location && location.state && location.state.userId) {
      axios.put(`http://192.168.1.163:8092/user/${location.state.userId}`, data)
        .then((res) => {
          if (res.status === 200) {
            toast.success("User Updated Successfully", {
              position: 'top-right',
              transition: Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000, // Close the toast after 3 seconds

            })
          }
          console.log(res.data);
          setUser(res.data);
          navigate('/usersView')
        }).catch((errors) => {
          if (errors.response) {
            const status = errors.response.status;
            let errorMessage = '';

            switch (status) {
              case 403:
                errorMessage = 'Session TImeOut !';
                navigate('/')
                break;
              case 404:
                errorMessage = 'Resource Not Found !';
                break;
              case 406:
                errorMessage = 'Invalid Details !';
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
          console.log(errors)

        });
    } else {
      axios.post('http://192.168.1.163:8092/user/registration', data)
        .then((response) => {
          if (response.status === 200) {
            toast.success("User Created Successfully", {
              position: 'top-right',
              transition: Bounce,
              hideProgressBar: true,
              theme: "colored",
              autoClose: 3000, // Close the toast after 3 seconds

            })
          }
          console.log(response.data);

          navigate('/usersView')
        })
        .catch((errors) => {
          if (errors.response) {
            const status = errors.response.status;
            let errorMessage = '';

            switch (status) {
              case 403:
                errorMessage = 'Session TImeOut !';
                navigate('/')
                break;
              case 404:
                errorMessage = 'Resource Not Found !';
                break;
              case 406:
                errorMessage = 'Invalid Details !';
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
          console.log(errors)

        });
    };
  }
  useEffect(() => {

    if (location && location.state && location.state.userId) {
      // setIsUpdating(true);
      axios.get(`http://192.168.1.163:8092/user/${location.state.userId}`)
        .then((response) => {
          console.log(response.data);
          const formattedRegistrationDate = formatDate(response.data.registrationDate); // Format the date
          response.data.registrationDate = formattedRegistrationDate; // Update the date field in the response object
          reset(response.data);
          console.log(response.data.registrationDate);
          setIsUpdating(true);
        })
        .catch((errors) => {

          console.log(errors)

        });
    }
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  };

  return (
    <div className='wrapper'>
      <SideNav />
      <div className='main'>
        <Header />
        <main className="content">
          <div className="container-fluid p-0">
            <h1 className="h3 mb-3"><strong>Users Registration Form</strong> </h1>
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title ">{isUpdating? "User Data":"User Registration"}</h5>
                    <div className="dropdown-divider" style={{ borderTopColor: "#d7d9dd" }} />
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className='row'>
                        <div className='col-12 col-md-6 col-lg-5 mb-3' >
                          <label className="form-label">User ID</label>
                          <input type={isUpdating?"text":"text"} readOnly={isUpdating} className={`form-control ${errors.employeeId ? 'is-invalid' : ''}`} placeholder="Enter User ID" name='userId'
                           autoComplete='off' onKeyDown={handleEmailChange}
                           {...register("userId", {
                              required: "User ID Required",

                            })}
                          />
                          {errors.userId && (<p className='errorMsg'>{errors.userId.message}</p>)}
                        </div>
                        <div className='col-lg-1'></div>
                        <div className='col-12 col-md-6 col-lg-5 mb-3' >
                          <label className="form-label">User Name</label>
                          <input type={isUpdating?"text":"text"} readOnly={isUpdating}  className='form-control' placeholder="Enter User Name" name='userName'
                          autoComplete='off'   onInput={toInputTitleCase}
                          onKeyDown={handleEmailChange}
                       // value={userId} 
                            {...register("userName", {
                              required: "User Name Required",
                              pattern: {
                                value:/^(?:[A-Z][a-z]*\s*)+$/,
                                message: "These fields accepts only Alphabetic Characters",
                              }
                            })}
                          />
                          {errors.userName && (<p className='errorMsg'>{errors.userName.message}</p>)}
                        </div>

                        <div className='col-12 col-md-6 col-lg-5 mb-3' >
                          <label class="form-label">Date of Registration</label>
                          <input type="date" className="form-control" placeholder="Resignation Date" name='registrationDate'
                          autoComplete='off'
                          {...register("registrationDate", {
                              required: true,
                            })}
                          />
                          {errors.registrationDate && (<p className='errorMsg'>Registration Data Required</p>)}
                        </div>
                        <div className='col-lg-1'></div>
                        <div className='col-12 col-md-6 col-lg-5 mb-3' >
                          <label className="form-label">Email Id</label>
                          <input type={isUpdating?"email":"email"} readOnly={isUpdating}  className='form-control' placeholder="Enter Email Id" name='emailId'
                           autoComplete='off' onKeyDown={handleEmailChange}
                           {...register("emailId", {
                              required: "Email ID Required",
                              pattern: {
                                value:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ,
                                message: "Please check the Email Id You Entered",
                              }
                            })}
                          />
                          {errors.emailId && (<p className='errorMsg'>{errors.emailId.message}</p>)}
                        </div>
                        <div className='col-lg-1'></div>
                        <div className='col-12 col-md-6 col-lg-5 mb-3' >
                          <label className="form-label">Password</label>
                          <div className='input-group'>
                          <input className='form-control ' placeholder="Enter Password"
                            onChange={handlePasswordChange} autoComplete='off'
                            type={passwordShown ? "text" : "password"}
                            {...register("password", {
                              required: "Password Required",
                              pattern: {
                                value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
                                message: "Invalid Password"
                              }
                            })}
                          />
                          <i onClick={togglePasswordVisiblity}> {passwordShown ? (
                            <Eye size={20} />
                          ) : (
                            <EyeSlash size={20} />
                          )}</i>
                          </div>
                          {errors.password && (<p className='errorMsg'>{errors.password.message}</p>)}
                        </div>
                        <div className='col-lg-1'></div>
                        <div className='col-12 col-md-6 col-lg-5 mb-3' >
                          <label className="form-label">Status</label>
                          <Controller
                            name="status"
                            control={control}
                            defaultValue=''
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={stat}
                                value={stat.find(option => option.value === field.value)}
                                onChange={(val) => {
                                  field.onChange(val.value); // Send only the value
                                }}
                              />

                            )}
                          />
                          {errors && errors.status && (
                            <p className="errorMsg">Status Required</p>)}
                        </div>

                        <div className='col-lg-1'></div>
                        <div className='col-12 col-md-6 col-lg-5 mb-2' >
                          <label className="form-label">Role</label>
                          <Controller
                            name="role"
                            control={control}
                            defaultValue=''
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={role} // Ensure that role contains the correct data
                                value={role.find(option => option.value === field.value)}
                                onChange={(val) => {
                                  field.onChange(val.value); // Send only the value
                                }}
                              />
                            )}
                          />
                          {errors && errors.role && (
                            <p className="errorMsg">Role Required</p>)}
                        </div>
                        <div className='col-lg-1'></div>
                        {/* <div className='col-12 col-md-6 col-lg-5 mb-3' >
                          <label className="form-label">Ip Address</label>
                          <input type="text" className='form-control' placeholder="Enter IP Address" name='ipAddress'
                          autoComplete='off'
                            {...register("ipAddress", {
                              required: "IP Address Required",
                            })}
                          />
                          {errors.ipAddress && (<p className='errorMsg'>{errors.ipAddress.message}</p>)}
                        </div> */}

                        <div className='col-12 d-flex justify-content-end mt-5 ' style={{background:"none"}} >
                          <button className={isUpdating? "btn btn-danger bt-lg" : "btn btn-primary btn-lg"} style={{ marginRight: "65px" }} type='submit'>{isUpdating? "Update User":"Add User"}</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

    </div>
  )
}

export default UserReg
