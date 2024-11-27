import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import LayOut from "../../../LayOut/LayOut";

const OfferLetterForm = () => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm({ mode: 'onChange' });

    const [previewData, setPreviewData] = useState(null);
    const navigate = useNavigate();

    const nextSixMonths = new Date();
    nextSixMonths.setMonth(nextSixMonths.getMonth() + 6);
    const sixMonthsFromNow = nextSixMonths.toISOString().split("T")[0];

    const onSubmit = (data) => {
        const previewData = {
            offerDate: data.offerDate,
            referenceNo: data.referenceNo,
            employeeName: data.employeeName,
            employeeFatherName: data.employeeFatherName,
            employeeAddress: data.employeeAddress,
            employeeContactNo: data.employeeContactNo,
            joiningDate: data.joiningDate,
            jobLocation: data.jobLocation,
            grossCompensation: data.grossCompensation,
            salaryConfigurationId: data.salaryConfigurationId,
            employeePosition: data.employeePosition,
        };
        setPreviewData(previewData);
        console.log("preview:", previewData);

        navigate('/offerLetterPreview', { state: { previewData } });
    };

    const clearForm = () => {
        reset({
            offerDate: '',
            referenceNo: '',
            employeeName: '',
            employeeFatherName: '',
            employeeAddress: '',
            employeeContactNo: '',
            joiningDate: '',
            jobLocation: '',
            grossCompensation: '',
            salaryConfigurationId: '',
            employeePosition: '',
        });
    };

    const toInputTitleCase = (e) => {
        const input = e.target;
        let value = input.value;
        const cursorPosition = input.selectionStart; // Save the cursor position
        // Remove leading spaces
        value = value.replace(/^\s+/g, '');
        // Ensure only alphabets and spaces are allowed
        const allowedCharsRegex = /^[a-zA-Z0-9\s!@#&()*/,.\\-]+$/;
        value = value.split('').filter(char => allowedCharsRegex.test(char)).join('');
        // Capitalize the first letter of each word
        const words = value.split(' ');
        // Capitalize the first letter of each word and lowercase the rest
        const capitalizedWords = words.map(word => {
            if (word.length > 0) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
            return '';
        });
        // Join the words back into a string
        let formattedValue = capitalizedWords.join(' ');
        // Remove spaces not allowed (before the first two characters)
        if (formattedValue.length > 2) {
            formattedValue = formattedValue.slice(0, 2) + formattedValue.slice(2).replace(/\s+/g, ' ');
        }
        // Update input value
        input.value = formattedValue;
        // Restore the cursor position
        input.setSelectionRange(cursorPosition, cursorPosition);
    };

    const handleEmailChange = (e) => {
        // Get the current value of the input field
        const value = e.target.value;
        // Check if the value is empty
        if (value.trim() !== "") {
            return; // Allow space button
        }
        // Prevent space character entry if the value is empty
        if (e.keyCode === 32) {
            e.preventDefault();
        }
    };

    const toInputAddressCase = (e) => {
        const input = e.target;
        let value = input.value;
        const cursorPosition = input.selectionStart; // Save the cursor position
        // Remove leading spaces
        value = value.replace(/^\s+/g, '');
        // Ensure only alphabets (upper and lower case), numbers, and allowed special characters
        const allowedCharsRegex = /^[a-zA-Z0-9\s!-_@#&()*/,.\\-{}]+$/
        value = value.split('').filter(char => allowedCharsRegex.test(char)).join('');

        // Capitalize the first letter of each word, but allow uppercase letters in the middle of the word
        const words = value.split(' ');
        const capitalizedWords = words.map(word => {
            if (word.length > 0) {
                // Capitalize the first letter, but leave the middle of the word intact
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return '';
        });

        // Join the words back into a string
        let formattedValue = capitalizedWords.join(' ');

        // Remove spaces not allowed (before the first two characters)
        if (formattedValue.length > 2) {
            formattedValue = formattedValue.slice(0, 2) + formattedValue.slice(2).replace(/\s+/g, ' ');
        }

        // Update input value
        input.value = formattedValue;

        // Restore the cursor position
        input.setSelectionRange(cursorPosition, cursorPosition);
    };

    function handlePhoneNumberChange(event) {
        let value = event.target.value;

        // Ensure the value starts with +91 and one space
        if (value.startsWith("+91") && value.charAt(3) !== " ") {
            value = "+91 " + value.slice(3); // Ensure one space after +91
        }

        // Allow only numeric characters after +91 and the space
        const numericValue = value.slice(4).replace(/[^0-9]/g, ''); // Remove any non-numeric characters after +91 
        if (numericValue.length <= 10) {
            value = "+91 " + numericValue; // Keep the +91 with a space
        }

        // Limit the total length to 14 characters (including +91 space)
        if (value.length > 14) {
            value = value.slice(0, 14); // Truncate if the length exceeds 14 characters
        }

        // Update the input field's value
        event.target.value = value;
    }

    return (
        <LayOut>
            <div className="container-fluid p-0">
                <div className="row d-flex align-items-center justify-content-between mt-1">
                    <div className="col">
                        <h1 className="h3">
                            <strong>Offer Letter Form</strong>
                        </h1>
                    </div>
                    <div className="col-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <a href="/main">Home</a>
                                </li>
                                <li className="breadcrumb-item active">Generate Offer Letter</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Employee Offer Letter Form</h5>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Employee Name"
                                                name="firstName"
                                                onInput={toInputTitleCase}
                                                minLength={2}
                                                autoComplete="off"
                                                onKeyDown={handleEmailChange}
                                                {...register("employeeName", {
                                                    required: "Name Name is Required",
                                                    pattern: {
                                                        value: /^[A-Za-z ]+$/,
                                                        message:
                                                            "These fields accepts only Alphabetic Characters",
                                                    },
                                                    minLength: {
                                                        value: 3,
                                                        message: "Minimum 3 Characters Required",
                                                    },
                                                    maxLength: {
                                                        value: 100,
                                                        message: "Maximum 100 Characters Required",
                                                    },
                                                })}
                                            />
                                            {errors.employeeName && (
                                                <p className="errorMsg">{errors.employeeName.message}</p>
                                            )}
                                        </div>
                                        <div className="col-lg-1"></div>
                                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                                            <label className="form-label">Father Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Employee Father Name"
                                                name="firstName"
                                                onInput={toInputTitleCase}
                                                minLength={2}
                                                autoComplete="off"
                                                onKeyDown={handleEmailChange}
                                                {...register("employeeFatherName", {
                                                    required: "Father Name is Required",
                                                    pattern: {
                                                        value: /^[A-Za-z ]+$/,
                                                        message:
                                                            "These fields accepts only Alphabetic Characters",
                                                    },
                                                    minLength: {
                                                        value: 3,
                                                        message: "Minimum 3 Characters Required",
                                                    },
                                                    maxLength: {
                                                        value: 100,
                                                        message: "Maximum 100 Characters Required",
                                                    },
                                                })}
                                            />
                                            {errors.employeeFatherName && (
                                                <p className="errorMsg">{errors.employeeFatherName.message}</p>
                                            )}
                                        </div>
                                        {/* <div className="col-12 col-md-6 col-lg-5 mb-3">
                                            <label className="form-label">Reference Number</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Reference Number"
                                                className="form-control"
                                                name="referenceNo"
                                                {...register("referenceNo", {
                                                    required: "Reference Number is required",
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9]{1,20}$/, // Regex for alphanumeric reference number
                                                        message: "Reference Number must be alphanumeric and up to 20 characters"
                                                    }
                                                })}
                                            />
                                            {errors.referenceNo && <p className="errorMsg">{errors.referenceNo.message}</p>}
                                        </div> */}
                                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                                            <label className="form-label">Contact No</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                placeholder="Enter Mobile Number"
                                                autoComplete="off"
                                                maxLength={14} // Limit input to 15 characters
                                                defaultValue="+91 " // Set the initial value to +91 with a space
                                                onInput={handlePhoneNumberChange} // Handle input changes
                                                // onKeyDown={handlePhoneNumberKeyDown} // Handle keydown for specific actions
                                                {...register("employeeContactNo", {
                                                    required: "Contact Number is Required",
                                                    validate: {
                                                        startsWithPlus91: (value) => {
                                                            if (!value.startsWith("+91 ")) {
                                                                return "Contact Number must start with +91 and a space.";
                                                            }
                                                            return true;
                                                        },
                                                        correctLength: (value) => {
                                                            if (value.length !== 14) {
                                                                return "Contact Number must be exactly 10 digits (including +91).";
                                                            }
                                                            return true;
                                                        },
                                                        notRepeatingDigits: (value) => {
                                                            const isRepeating = /^(\d)\1{12}$/.test(value); // Check for repeating digits
                                                            return !isRepeating || "Contact Number cannot consist of the same digit repeated.";
                                                        },
                                                    },
                                                    pattern: {
                                                        value: /^\+91\s\d{10}$/, // Ensure it starts with +91, followed by a space and exactly 10 digits
                                                        message: "Contact Number must be exactly 10 Numbers.",
                                                    },
                                                })}
                                            />
                                            {errors.employeeContactNo && <p className="errorMsg">{errors.employeeContactNo.message}</p>}
                                        </div>
                                        <div className="col-lg-1"></div>
                                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                                            <label className="form-label">Joining Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="joiningDate"
                                                {...register("joiningDate", {
                                                    required: "Joining Date is required",
                                                    validate: {
                                                        notInFuture: (value) => {
                                                            const today = new Date();
                                                            const joiningDate = new Date(value);
                                                            return joiningDate >= today || "Joining Date cannot be in the past";
                                                        }
                                                    }
                                                })}
                                            />
                                            {errors.joiningDate && <p className="errorMsg">{errors.joiningDate.message}</p>}
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                                            <label className="form-label">Job Location</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Address"
                                                autoComplete="off" minLength={2}
                                                onKeyDown={handleEmailChange}
                                                onInput={toInputAddressCase}
                                                {...register("jobLocation", {
                                                    required: "Job Location is Required",
                                                    pattern: {
                                                        value: /^(?=.*[a-zA-Z])[a-zA-Z0-9\s,'#,-_&*.()^\-/]*$/,
                                                        message:
                                                            "Please enter valid Jon Location",
                                                    },
                                                    minLength: {
                                                        value: 3,
                                                        message: "Minimum 3 Characters allowed",
                                                    },
                                                    maxLength: {
                                                        value: 200,
                                                        message: "Maximum 200 Characters allowed",
                                                    },
                                                })}
                                            />
                                            {errors.jobLocation && (
                                                <p className="errorMsg">{errors.jobLocation.message}</p>
                                            )}
                                        </div>
                                        <div className="col-lg-1"></div>
                                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                                            <label className="form-label">Gross Compensation</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                maxLength={10}
                                                placeholder="Enter Gross Compensation"
                                                name="grossCompensation"
                                                {...register("grossCompensation", {
                                                    required: "Gross Compensation is required",
                                                    min: {
                                                        value: 5,
                                                        message: "Minimum 5 Numbers Required"
                                                    },
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: "These filed accepcts only Integers",
                                                    }
                                                })}
                                            />
                                            {errors.grossCompensation && <p className="errorMsg">{errors.grossCompensation.message}</p>}
                                        </div>

                                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                                            <label className="form-label">Position</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                maxLength={40}
                                                placeholder="Enter Position"
                                                name="employeePosition"
                                                {...register("employeePosition", {
                                                    required: "Position is required",
                                                    minLength: {
                                                        value: 2,
                                                        message: "Minimum 2 characters required"
                                                    },
                                                    pattern: {
                                                        value: /^[A-Za-z\s\/]+$/, // Allows alphabets, spaces, and forward slash
                                                        message: "Position can only contain alphabets, spaces, and '/'"
                                                    }
                                                })}
                                            />
                                            {errors.employeePosition && <p className="errorMsg">{errors.employeePosition.message}</p>}
                                        </div>
                                        <div className="col-lg-1"></div>
                                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                                            <label className="form-label">Address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Address"
                                                autoComplete="off" minLength={2}
                                                onKeyDown={handleEmailChange}
                                                onInput={toInputAddressCase}
                                                {...register("employeeAddress", {
                                                    required: "Address is Required",
                                                    pattern: {
                                                        value: /^(?=.*[a-zA-Z])[a-zA-Z0-9\s,'#,-_&*.()^\-/]*$/,
                                                        message:
                                                            "Please enter valid Address",
                                                    },
                                                    minLength: {
                                                        value: 3,
                                                        message: "Minimum 3 Characters allowed",
                                                    },
                                                    maxLength: {
                                                        value: 200,
                                                        message: "Maximum 200 Characters allowed",
                                                    },
                                                })}
                                            />
                                            {errors.employeeAddress && (
                                                <p className="errorMsg">{errors.employeeAddress.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer" style={{ marginLeft: "80%" }}>
                                    <button type="button" className="btn btn-secondary" onClick={clearForm}>
                                        Clear
                                    </button>
                                    <button type="submit" className="btn btn-primary" style={{ marginLeft: "10px" }}>
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </LayOut>
    );
};

export default OfferLetterForm;
