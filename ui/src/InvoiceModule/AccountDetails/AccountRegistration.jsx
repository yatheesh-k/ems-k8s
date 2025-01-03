import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Slide, toast } from 'react-toastify';
// import { CompanyRegistrationApi, companyUpdateByIdApi, companyViewByIdApi } from '../Axios';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import LayOut from '../../LayOut/LayOut';
import Select from 'react-select'

const AccountRegistartion = () => {
  const { register, handleSubmit, formState: { errors }, control, trigger, setValue, reset } = useForm();
  const [fields, setFields] = useState([{ bankAccount: '', bankName: '', branchName: '', ifscCode: '', accountType: '' }]);
  const [companyId, setCompanyId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(); // To reference the file input

  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  const validateField = (value, type) => {
    switch (type) {

      case 'ifscCode':
        return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value) || "Invalid IFSC Code format. It should be in the format: AAAA0BBBBBB ";
      default:
        return true;
    }
  };

  const preventInvalidInput = (e, type) => {
    const key = e.key;

    // Alphanumeric check for customerName, state, city fields (no special characters allowed except spaces)
    if (type === 'alpha' && /[^a-zA-Z\s]/.test(key)) {
      e.preventDefault();
    }

    if (type === 'alphaNumeric' && /[^a-zA-Z0-9]/.test(key)) {
      e.preventDefault();
    }

    // Numeric check for fields that should only allow numbers
    if (type === 'numeric' && !/^[0-9]$/.test(key)) {
      e.preventDefault();
    }

  };

  // Custom validator to check trailing spaces
const noTrailingSpaces = (value) => {
  if (value.endsWith(' ')) {
    return "Spaces are not allowed at the end";
  }
  return true; // Return true if the value is valid
};

  const handleInputChange = (e, fieldName) => {
    // Get the input value, trim leading spaces and replace multiple spaces with a single space
    let value = e.target.value.trimStart().replace(/ {2,}/g, ' ');

    // Capitalize the first letter of each word
    value = value.replace(/\b\w/g, (char) => char.toUpperCase());

    // Update the field value and trigger validation
    setValue(fieldName, value);
    trigger(fieldName);  // Trigger validation
  };

  const clearForm = () => {
    // Reset form to initial state with one set of empty fields
    reset();
    setFields([{ bankAccount: '', bankName: '', branchName: '', ifscCode: '', accountType: '' }]);
  };
  const backForm = () => {
    reset();
    navigate("/accountsView");
  };
  const accountTypes = [
    { value: "Savings", label: "Savings" },
    { value: "Current", label: "Current" },
    { value: "NRI", label: "NRI" },
    { value: "Business", label: "Business" },
    { value: "Corporate", label: "Corporate" },
  ];
  const addMoreFields = () => {
    setFields([...fields, { bankAccount: '', bankName: '', branchName: '', ifscCode: '', accountType: '' }]);
  };

  // Function to remove a set of fields
  const removeFields = (index) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index)); // Remove the specified index
    }
  };


  return (
    <LayOut>
      <div className="container-fluid p-0">
        <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
          <div className="col">
            <h1 className="h3 mb-3">
              <strong>Registration</strong>{" "}
            </h1>
          </div>
          <div className="col-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="/main">Home</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/accountsView">AccountDetails</a>
                </li>
                <li className="breadcrumb-item active">Registration</li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title" style={{ marginBottom: "0px" }}>
                  {isUpdating ? "Accounts Data" : "Bank Account Registration"}
                </h5>
                <div
                  className="dropdown-divider"
                  style={{ borderTopColor: "#d7d9dd" }}
                />
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit()}>
                  <div className="d-flex justify-content-end mb-3">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={addMoreFields} // Add more fields when clicked
                    >
                      Add More
                    </button>
                  </div>

                  {fields.map((field, index) => (
                    <div className="row" key={index}>
                      {/* Bank Account Field */}
                      <div className="col-12 col-md-4 col-lg-4 mb-3">
                        <label className="form-label">Bank Account<span style={{ color: "red" }}>*</span></label>
                        <input type="text" className="form-control" placeholder="Enter Bank Account Number"
                          {...register(`fields[${index}].bankAccount`, {
                            required: "Bank Account Number is Required",
                            minLength: {
                              value: 9,
                              message: 'Bank Account Number must be at least 9 characters long',
                            },
                            maxLength: {
                              value: 18,
                              message: 'Bank Account Number must be at most 18 characters long'
                            },
                          })}
                          onChange={(e) => handleInputChange(e, `fields[${index}].bankAccount`)}
                          onKeyPress={(e) => preventInvalidInput(e, 'numeric')}
                        />
                        {errors?.fields?.[index]?.bankAccount && (<p className="errorMsg">{errors.fields[index].bankAccount.message}</p>)}
                      </div>

                      {/* Bank Name Field */}
                      <div className="col-12 col-md-4 col-lg-4 mb-3">
                        <label className="form-label">Bank Name<span style={{ color: "red" }}>*</span></label>
                        <input type="text" className="form-control" placeholder="Enter Bank Name"
                          {...register(`fields[${index}].bankName`, {
                            required: "Bank Name is Required",
                            validate: noTrailingSpaces,
                            minLength: {
                              value: 3,
                              message: "Bank Name must be at least 3 characters long"
                            },
                            maxLength: {
                              value: 60,
                              message: "Bank Name must not exceed 60 characters."
                            }
                          })}
                          onChange={(e) => handleInputChange(e, `fields[${index}].bankName`)}
                          onKeyPress={(e) => preventInvalidInput(e, 'alpha')}
                        />
                        {errors?.fields?.[index]?.bankName && (<p className="errorMsg">{errors.fields[index].bankName.message}</p>)}
                      </div>
                      {/* Branch Name Field */}
                      <div className="col-12 col-md-4 col-lg-4 mb-3">
                        <label className="form-label">
                          Branch <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Branch Name"
                          {...register(`fields[${index}].branchName`, {
                            required: "Branch Name is Required",
                            validate: noTrailingSpaces,
                            minLength: {
                              value: 3,
                              message: "Branch Name must be at least 3 characters long"
                            },
                            maxLength: {
                              value: 60,
                              message: "Branch Name must not exceed 60 characters."
                            }
                          })}
                          onChange={(e) => handleInputChange(e, `fields[${index}].branchName`)}
                          onKeyPress={(e) => preventInvalidInput(e, 'alpha')}
                        />
                        {errors?.fields?.[index]?.branchName && (
                          <p className="errorMsg">{errors.fields[index].branchName.message}</p>
                        )}
                      </div>

                      {/* IFSC Code Field */}
                      <div className="col-12 col-md-4 col-lg-4 mb-3">
                        <label className="form-label">
                          IFSC Code <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter IFSC Code"
                          {...register(`fields[${index}].ifscCode`, {
                            required: "IFSC Code is Required",
                            maxLength: {
                              value: 11,
                              message: 'IFSC Code must be 11 characters long',
                            },
                            validate: (value) => validateField(value, 'ifscCode')
                          })}
                          onChange={(e) => handleInputChange(e, `fields[${index}].ifscCode`)}
                          onKeyPress={(e) => preventInvalidInput(e, 'alphaNumeric')}
                          onInput={(e) => {
                            e.target.value = e.target.value.toUpperCase(); // Convert to uppercase
                          }}
                        />
                        {errors?.fields?.[index]?.ifscCode && (
                          <p className="errorMsg">{errors.fields[index].ifscCode.message}</p>
                        )}
                      </div>

                      {/* Account Type Field */}
                      <div className="col-12 col-md-4 col-lg-4 mb-3">
                        <label className="form-label">
                          Account Type <span style={{ color: "red" }}>*</span>
                        </label>
                        <Controller
                          name={`fields[${index}].accountType`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={accountTypes}
                              getOptionLabel={(e) => e.label}
                              getOptionValue={(e) => e.value}
                            />
                          )}
                        />
                        {errors?.fields?.[index]?.accountType && (
                          <p className="errorMsg">{errors.fields[index].accountType.message}</p>
                        )}
                      </div>

                      {/* Remove Field Button */}
                      {fields.length > 1 && (
                        <div className="col-12 col-md-4 col-lg-4 mb-3">
                          <button
                            type="button"
                            className="btn btn-danger mt-4"
                            onClick={() => {
                              removeFields(index); // Remove the current set of fields
                              clearForm();
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      <hr />
                    </div>
                  ))}

                  {/* Clear and Submit Buttons */}
                  <div className="row">
                    <div className="col-12 mt-4 d-flex justify-content-end" style={{ background: "none", marginBottom: "10px" }}>
                      {!isUpdating ? (
                        <button
                          className="btn btn-secondary me-2"
                          type="button"
                          onClick={clearForm}
                        >
                          Clear
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary me-2"
                          type="button"
                          onClick={backForm}
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginRight: "85px" }}
                      >
                        Add AccountDetails
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayOut>

  );
}
export default AccountRegistartion;
