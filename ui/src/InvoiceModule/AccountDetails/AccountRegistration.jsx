import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Slide, toast } from 'react-toastify';
import { useAuth } from '../../Context/AuthContext';
import LayOut from '../../LayOut/LayOut';
import Select from 'react-select'
import { BankGetApiById, BankPostApi, BankPutApiById, } from '../../Utils/Axios';


const AccountRegistartion = () => {
  const { register, handleSubmit, formState: { errors }, control, trigger, setValue, reset } = useForm();

  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();
  console.log("user", user.companyId);
  const companyId = user.companyId
  const [passwordShown, setPasswordShown] = useState(false);
  const [update, setUpdate] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = (data) => {
    const payload = {
      accountNumber: data.accountNumber,
      bankName: data.bankName,
      branchName: data.branchName,
      ifscCode: data.ifscCode,
      accountType: data.accountType.value, // Extract the value of the accountType object
    };

    console.log('Flattened Payload:', payload); // Log the payload to verify its structure

    if (location && location.state && location.state.bankId) {
      // If updating, call the PUT API
      BankPutApiById(companyId, location.state.bankId, payload)
        .then((res) => {
          const successMessage = res.data.message || 'Bank Account updated successfully';
          toast.success(successMessage, {
            position: 'top-right',
            autoClose: 1000,
          });
          setUpdate(res.data.data);
          navigate('/accountsView');
        })
        .catch((error) => {
          console.error('Error updating bank:', error); // Log the error for debugging
          const errorMsg = error.response?.data?.error?.message || error.message || 'Error updating bank';
          toast.error(errorMsg, {
            position: 'top-right',
            autoClose: 1000,
          });
        });
    } else {
      // If adding new bank, call the POST API
      BankPostApi(companyId, payload)
        .then((response) => {
          toast.success('Bank Account added successfully', {
            position: 'top-right',
            autoClose: 1000,
          });
          setUpdate((prevState) => [...prevState, response.data.data]);
          navigate('/accountsView');
        })
        .catch((error) => {
          console.error('Error adding bank account:', error); // Log the full error object
          const errorMessage = error.response?.data?.error?.message || 'Error adding bank details';
          toast.error(errorMessage, {
            position: 'top-right',
            autoClose: 1000,
          });
        });
    }
  };

  useEffect(() => {
    console.log('Location state:', location.state);
    console.log('companyId:', companyId);
    if (location && location.state && location.state.bankId) {
      const bankId = location.state.bankId;
      console.log('bankId:', bankId);
      BankGetApiById(companyId, bankId)
        .then((response) => {
          console.log('bank data:', response);
          reset(response.data);
          setIsUpdating(true);
        })
        .catch((error) => {
          console.error('Error fetching data:', error.response || error);
          if (error.response) {
            console.error('API Error Response:', error.response.data);
          }
          toast.error('Error fetching Bank data.');
        });
    }
  }, [location.state?.bankId, companyId, reset]);

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
    reset();
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-12 col-md-4 col-lg-4 mb-3">
                      <label className="form-label">
                        Bank Account<span style={{ color: "red" }}>*</span>
                      </label>
                      <input type="text"
                        className="form-control"
                        placeholder="Enter Bank Account Number"
                        name="accountNumber"
                        autoComplete="off"
                        {...register("accountNumber", {
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
                        onChange={(e) => handleInputChange(e, "accountNumber")}
                        onKeyPress={(e) => preventInvalidInput(e, 'numeric')}
                      />
                      {errors.accountNumber && (
                        <p className="errorMsg">{errors.accountNumber.message}</p>
                      )}
                    </div>
                    <div className="col-12 col-md-4 col-lg-4 mb-3">
                      <label className="form-label">
                        Bank Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Bank Name"
                        name="bankName"
                        autoComplete="off"
                        {...register("bankName", {
                          required: "Bank Name is Required",
                          validate: noTrailingSpaces,
                          minLength: {
                            value: 3,
                            message: "Bank Name must be at least 3 characters long",
                          },
                          maxLength: {
                            value: 60,
                            message: "Bank Name must not exceed 60 characters.",
                          },
                        })}
                        onChange={(e) => handleInputChange(e, "bankName")}
                        onKeyPress={(e) => preventInvalidInput(e, 'alpha')}
                      />
                      {errors.bankName && (
                        <p className="errorMsg">{errors.bankName.message}</p>
                      )}
                    </div>
                    {/* Branch Name Field */}
                    <div className="col-12 col-md-4 col-lg-4 mb-3">
                      <label className="form-label">
                        Branch Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Branch Name"
                        name="branchName"
                        autoComplete="off"
                        {...register("branchName", {
                          required: "Branch Name is Required",
                          validate: noTrailingSpaces,
                          minLength: {
                            value: 3,
                            message: "Branch Name must be at least 3 characters long",
                          },
                          maxLength: {
                            value: 60,
                            message: "Branch Name must not exceed 60 characters.",
                          },
                        })}
                        onChange={(e) => handleInputChange(e, "branchName")}
                        onKeyPress={(e) => preventInvalidInput(e, 'alpha')}
                      />
                      {errors.branchName && (
                        <p className="errorMsg">{errors.branchName.message}</p>
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
                        name="ifscCode"
                        autoComplete="off"
                        {...register("ifscCode", {
                          required: "IFSC Code is Required",
                          maxLength: {
                            value: 11,
                            message: 'IFSC Code must be 11 characters long',
                          },
                          validate: (value) => validateField(value, 'ifscCode'),
                        })}
                        onChange={(e) => handleInputChange(e, "ifscCode")}
                        onKeyPress={(e) => preventInvalidInput(e, 'alphaNumeric')}
                        onInput={(e) => {
                          e.target.value = e.target.value.toUpperCase(); // Convert to uppercase
                        }}
                      />
                      {errors.ifscCode && (
                        <p className="errorMsg">{errors.ifscCode.message}</p>
                      )}
                    </div>

                    {/* Account Type Field */}
                    <div className="col-12 col-md-4 col-lg-4 mb-3">
                      <label className="form-label">
                        Account Type <span style={{ color: "red" }}>*</span>
                      </label>
                      <Controller
                        name="accountType"
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
                      {errors.accountType && (
                        <p className="errorMsg">{errors.accountType.message}</p>
                      )}
                    </div>
                    <div className="col-12 col-md-4 col-lg-4 mb-3">
                      <label className="form-label">
                        Address <span style={{ color: "red" }}>*</span>
                      </label>
                      <textarea
                        name="address"
                        placeholder="Enter Address"
                        className="form-control"
                        autoComplete="off"
                        rows="4"
                        {...register("address", {
                          required: "Address is Required",
                          validate: noTrailingSpaces,
                          minLength: {
                            value: 3,
                            message: 'Address must be at least 3 characters long'
                          },
                          maxLength: {
                            value: 250,
                            message: 'Address must be at most 250 characters long'
                          }
                        })}
                        onChange={(e) => handleInputChange(e, "address")}
                        onKeyPress={(e) => preventInvalidInput(e, 'address')}
                      />
                       {errors.address && (
                        <p className="errorMsg">{errors.address.message}</p>
                      )}
                    </div>
                    {errorMessage && (
                      <div className="alert alert-danger mt-4 text-center">
                        {errorMessage}
                      </div>
                    )}
                    <div
                      className="col-12 mt-4  d-flex justify-content-end"
                      style={{ background: "none" }}
                    >
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
                        className={
                          isUpdating
                            ? "btn btn-danger bt-lg"
                            : "btn btn-primary btn-lg"
                        }
                        style={{ marginRight: "85px" }}
                        type="submit"
                      >
                        {isUpdating ? "Update BankDetail" : "Add BankDetails"}{" "}
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
