import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import SideNav from '../ScreenPages/SideNav';
import Header from '../ScreenPages/Header';
import Footer from '../ScreenPages/Footer';

const CompanyReg = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [postImage, setPostImage] = useState('')

    const onChangePicture = (e) => {
        setPostImage(URL.createObjectURL(e.target.files[0]));
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            // Append file data
            formData.append("file", data.file[0]);
            // Append other form fields
            formData.append("companyName", data.companyName);
            formData.append("companyAddress", data.companyAddress);
            formData.append("emailId", data.emailId);
            formData.append("password", data.password);
            formData.append("landNo", data.landNo);
            formData.append("mobileNo", data.mobileNo);
            formData.append("companyRegNo", data.companyRegNo);
            formData.append("gstNo", data.gstNo);
            formData.append("panNo", data.panNo);
            formData.append("name", data.name);
            formData.append("personalMailId", data.personalMailId);
            formData.append("personalMobileNo", data.personalMobileNo);
            formData.append("address", data.address);

            const response = await axios.post('http://192.168.1.163:8092/company/add', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            console.log('Response:', response.data);
        } catch (error) {
            console.error('Submission error:', error);
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

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setPostImage(base64);
    };

    return (
        <div className='wrapper'>
            <SideNav />
            <div className='main'>
                <Header />
                <main className="content">
                    <div className="container-fluid p-0">
                        <h1 className="h3 mb-3"><strong>Company Registration</strong></h1>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="card-title">Company Details</h5>
                                            <div className="dropdown-divider" style={{ borderTopColor: "#d7d9dd" }} />
                                        </div>
                                        <div className="card-body">
                                            <div className='row'>
                                                <div className='col-12 col-md-6 col-lg-5 mb-3'>
                                                    <label className="form-label">Company Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Company Name"
                                                        onInput={toInputTitleCase} autoComplete='off'
                                                        {...register("companyName", {
                                                            required: "Company Name is required",
                                                            pattern: {
                                                                value: /^[A-Za-z ]+$/,
                                                                message: "Thse fileds only accepct Alphabets"
                                                            }
                                                        })}
                                                    />
                                                    {errors.companyName && <p className="errorMsg">{errors.companyName.message}</p>}
                                                </div>
                                                <div className='col-lg-1'></div>
                                                <div className='col-12 col-md-6 col-lg-5 mb-3'>
                                                    <label className="form-label">Company Address</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Company Address"
                                                        onInput={toInputTitleCase} autoComplete='off'
                                                        {...register("companyAddress", {
                                                            required: "Company Address is required",
                                                            pattern: {
                                                                value: /^[A-Za-z0-9 ]+$/,
                                                                message: "Thse fileds only accepct Alphabets & Numbers"
                                                            }
                                                        })}
                                                    />
                                                    {errors.companyAddress && <p className="errorMsg">{errors.companyAddress.message}</p>}
                                                </div>
                                                <div className='col-12 col-md-6 col-lg-5 mb-3'>
                                                    <label className="form-label">Company MailId</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Enter Company MailId"
                                                       autoComplete='off'
                                                        {...register("emailId", {
                                                            required: "Company MailId is required",
                                                            pattern: {
                                                                value: /^\S+@\S+$/i,
                                                                message: "Entered value does not match email format"
                                                            }
                                                        })}
                                                    />
                                                    {errors.companyMailId && <p className="errorMsg">{errors.companyMailId.message}</p>}
                                                </div>
                                                <div className='col-lg-1'></div>
                                                <div className='col-12 col-md-6 col-lg-5 mb-3'>
                                                    <label className="form-label">Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        placeholder="Enter Password"
                                                        onInput={toInputTitleCase} autoComplete='off'
                                                        {...register("password", {
                                                            required: "Password is required",
                                                            pattern: {
                                                                value: /^[A-Za-z0-9+@ ]+$/,
                                                                message: "Thse fileds accepct both Numbers & Alphabets"
                                                            }
                                                        })}
                                                    />
                                                    {errors.password && <p className="errorMsg">{errors.password.message}</p>}
                                                </div>
                                                <div className='col-12 col-md-6 col-lg-5 mb-3'>
                                                    <label className="form-label">Land Number</label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        placeholder="Enter Land Number"
                                                        onInput={toInputTitleCase} autoComplete='off'
                                                        {...register("landNo", {
                                                            required: "Land Number is required",
                                                            pattern: {
                                                                value: /^[0-9]{10}$/,
                                                                message: "These fileds only accepct Numbers"
                                                            }
                                                        })}
                                                    />
                                                    {errors.landNumber && <p className="errorMsg">{errors.landNumber.message}</p>}
                                                </div>
                                                <div className='col-lg-1'></div>
                                                <div className='col-12 col-md-6 col-lg-5 mb-2'>
                                                    <label className="form-label">Mobile Number</label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        placeholder="Enter Mobile Number"
                                                        onInput={toInputTitleCase} autoComplete='off'
                                                        {...register("mobileNo", {
                                                            required: "Mobile Number is required",
                                                            pattern: {
                                                                value: /^[0-9]+$/,
                                                                message: "These fields only accepct Numbers"
                                                            }
                                                        })}
                                                    />
                                                    {errors.mobileNumber && <p className="errorMsg">{errors.mobileNumber.message}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="card-title">Company Registration Details</h5>
                                            <div className="dropdown-divider" style={{ borderTopColor: "#d7d9dd" }} />
                                        </div>
                                        <div className="card-body">
                                            <div className='row'>
                                                <div className='col-12 col-md-6 col-lg-5 mb-3'>
                                                    <label className="form-label">Company Register Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Company Register Number"
                                                        onInput={toInputTitleCase} autoComplete='off'
                                                        {...register("companyRegNo", {
                                                            required: "Company Register Number is required",
                                                            pattern: {
                                                                value: /^[0-9a-zA-Z]+$/,
                                                                message: "These fields accepct Both Alphabets & Numbers"
                                                            }
                                                        })}
                                                    />
                                                    {errors.companyRegisterNumber && <p className="errorMsg">{errors.companyRegisterNumber.message}</p>}
                                                </div>
                                                <div className='col-lg-1'></div>
                                                <div className='col-12 col-md-6 col-lg-5 mb-3'>
                                                    <label className="form-label">Company GST Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Company GST Number"
                                                        onInput={toInputTitleCase} autoComplete='off'
                                                        {...register("gstNo", {
                                                            required: "Company GST Number is required",
                                                            pattern: {
                                                                value: /^[0-9a-zA-Z]+$/,
                                                                message: "These fields only accepct Numbers"
                                                            }
                                                        })}
                                                    />
                                                    {errors.companyGstNumber && <p className="errorMsg">{errors.companyGstNumber.message}</p>}
                                                </div>
                                                <div className='col-12 col-md-6 col-lg-5 mb-3'>
                                                    <label className="form-label">Company Pan Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Company Pan Number"
                                                        onInput={toInputTitleCase} autoComplete='off'
                                                        {...register("panNo", {
                                                            required: "Company Pan Number is required",
                                                            pattern: {
                                                                value: /^[0-9a-zA-Z]+$/,
                                                                message: "These fields only accepct Numbers"
                                                            }
                                                        })}
                                                    />
                                                    {errors.companyPanNumber && <p className="errorMsg">{errors.companyPanNumber.message}</p>}
                                                </div>
                                                <div className='col-lg-1'></div>
                                                <div className='col-12 col-md-6 col-lg-5 mb-3'>
                                                    <label className="form-label">Company Logo</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        {...register("file", {
                                                            required: "Company Logo is required"
                                                        })}
                                                        accept=".jpeg, .png, .jpg"
                                                        onChange={onChangePicture}
                                                    // onChange={(e) => handleFileUpload(e)}
                                                    />
                                                    {errors.file && <p className="errorMsg">{errors.file.message}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="card-title">Authorized Contact Details</h5>
                                            <div className="dropdown-divider" style={{ borderTopColor: "#d7d9dd" }} />
                                        </div>
                                        <div className="card-body">
                                            <div className='row'>
                                                <div className='col-12 col-md-6 col-lg-5 mb-3'>
                                                    <label className="form-label">Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Authorized Name"
                                                        onInput={toInputTitleCase} autoComplete='off'
                                                        {...register("name", {
                                                            required: "Name is required",
                                                            pattern: {
                                                                value: /^[a-zA-Z]+$/,
                                                                message: "These fields only accepct Alphabets"
                                                            }
                                                        })}
                                                    />
                                                    {errors.authorizedName && <p className="errorMsg">{errors.authorizedName.message}</p>}
                                                </div>
                                                <div className='col-lg-1'></div>
                                                <div className='col-12 col-md-6 col-lg-5 mb-3'>
                                                    <label className="form-label">Personal MailId</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Enter MailId"
                                                        onInput={toInputTitleCase} autoComplete='off'
                                                        {...register("personalMailId", {
                                                            required: "MailId is required",
                                                            pattern: {
                                                                value: /^\S+@\S+$/i,
                                                                message: "Entered value does not match email format"
                                                            }
                                                        })}
                                                    />
                                                    {errors.personalMailId && <p className="errorMsg">{errors.personalMailId.message}</p>}
                                                </div>
                                                <div className='col-12 col-md-6 col-lg-5 mb-3'>
                                                    <label className="form-label">Personal Mobile Number</label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        placeholder="Enter Mobile Number"
                                                        onInput={toInputTitleCase} autoComplete='off'
                                                        {...register("personalMobileNo", {
                                                            required: "Mobile Number is required",
                                                            pattern: {
                                                                value: /^[0-9]{10}$/,
                                                                message: "These fields only accepct Numbers"
                                                            }
                                                        })}
                                                    />
                                                    {errors.personalMobileNumber && <p className="errorMsg">{errors.personalMobileNumber.message}</p>}
                                                </div>
                                                <div className='col-lg-1'></div>
                                                <div className='col-12 col-md-6 col-lg-5 mb-3'>
                                                    <label className="form-label">Address</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Address"
                                                        onInput={toInputTitleCase} autoComplete='off'
                                                        {...register("address", {
                                                            required: "Address is required",
                                                            pattern: {
                                                                value: /^[0-9a-zA-Z]+$/,
                                                                message: "These fields only accepct Numbers & Albhabets"
                                                            }
                                                        })}
                                                    />
                                                    {errors.authorizedAddress && <p className="errorMsg">{errors.authorizedAddress.message}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-1'></div>
                            <div className='col-12 d-flex justify-content-end mt-5' style={{ background: "none" }} >
                                <button className="btn btn-primary btn-lg" style={{ marginRight: "65px" }} type='submit'>Submit</button>
                            </div>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default CompanyReg;