import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Slide, toast } from 'react-toastify';
import LayOut from "../../LayOut/LayOut";
import { ProductPostApi, ProductPutApiById,ProductGetApiById } from "../../Utils/Axios";

const ProductRegistration = () => {
    const { register, handleSubmit, reset, trigger, setValue, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState(""); // State for error message
    const [productData, setProductData] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const onSubmit = (data) => {
        if (location && location.state && location.state.productId) {
            ProductPutApiById(location.state.productId, data)
                .then((res) => {
                    toast.success('Updated Successfully', {
                        position: 'top-right',
                        transition: Slide,
                        hideProgressBar: true,
                        theme: "colored",
                        autoClose: 1000,
                    });
                    navigate('/productview');
                });
        } else {
            ProductPostApi(data)
                .then((response) => {
                    toast.success('Registered Successfully', {
                        position: 'top-right',
                        transition: Slide,
                        hideProgressBar: true,
                        theme: "colored",
                        autoClose: 1000,
                    });
                    navigate('/productview');
                })
                .catch((errors) => {
                    toast.error(errors, {
                        position: 'top-right',
                        transition: Slide,
                        hideProgressBar: true,
                        theme: "colored",
                        autoClose: 1000,
                    });
                    console.log('Error occurred');
                });
        }
    };

    useEffect(() => {
        if (location && location.state && location.state.productId) {
            ProductGetApiById(location.state.productId)
                .then((response) => {
                    setIsUpdating(true);
                    console.log("API Response Data:", response.data); // Debugging the API response
                    setProductData(response.data);  // Store data in state
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [location]);

    // Use effect to reset form after the product data is set
    useEffect(() => {
        if (productData) {
            reset(productData); // Only reset when productData is available
        }
    }, [productData, reset]);

    const validateField = (value, type) => {
        switch (type) {

            case 'productName':
                return value.length >= 3 && value.length <= 60 || "Product name must be between 3 and 60 characters";

            case 'productCost':
                return /^[0-9]{1,8}(\.[0-9]{1,2})?$/.test(value) || "Product cost must be a valid number (max 8 digits before decimal, e.g., 99999999.99)";

            case 'hsnNo':
                return /^[0-9]{6}$/.test(value) || "HSN number must be exactly 6 digits";

            case 'gst':
                return /^[0-9]{1,2}(\.[0-9]{1,2})?$/.test(value) && parseFloat(value) < 100 || "GST must be a valid number less than 100%";
            default:
                return true;
        }
    };
    const preventInvalidInput = (e, type) => {
        const key = e.key;
        const inputValue = e.target.value;

        if (type === 'alpha' && /[^a-zA-Z\s]/.test(key)) {
            e.preventDefault();
        }
        // Numeric check for fields that should only allow numbers
        if (type === 'numeric' && !/^[0-9]$/.test(key)) {
            e.preventDefault();
        }
        if (type === 'decimal') {
            // Prevent invalid decimal input
            if (!/^[0-9.]$/.test(key)) {
                e.preventDefault();
            }
            // Prevent multiple dots
            if (key === '.' && inputValue.includes('.')) {
                e.preventDefault();
            }
        }
        // Prevent spaces (if any additional validation is needed)
        if (type === 'whitespace' && key === ' ') {
            e.preventDefault();
        }
    };
    const handleInputChange = (e, fieldName) => {
        let value = e.target.value;

        // Remove leading and trailing spaces
        value = value.trimStart().replace(/ {2,}/g, ' ');

        if (fieldName === 'productName') {
            // Capitalize the first letter of each word
            value = value.replace(/\b\w/g, (char) => char.toUpperCase());
        } else if (fieldName === 'productCost' || fieldName === 'gst') {
            // Ensure only numeric or decimal input
            value = value.replace(/[^0-9.]/g, '');

            // Disallow multiple leading zeros unless followed by a decimal
            if (value.startsWith('0') && value.length > 1 && value[1] !== '.') {
                value = value.replace(/^0+/, '0'); // Retain only a single leading zero
            }

            // Prevent multiple decimals
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
        } else if (fieldName === 'hsnNo') {
            // Ensure only numeric input for HSN
            value = value.replace(/[^0-9]/g, '');
        }
        // Set value and trigger validation
        setValue(fieldName, value);
        trigger(fieldName); // Validate the updated field
    };
    const clearForm = () => {
      reset();
    };
    const backForm = () => {
      reset();
      navigate("/customersView");
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
                                    <a href="/employeeView">Products</a>
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
                  {isUpdating ? "Customer Data" : "Product Registration"}
                </h5>
                <div
                  className="dropdown-divider"
                  style={{ borderTopColor: "#d7d9dd" }}
                />
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row ">
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Product Name<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type={isUpdating ? "text" : "text"}
                        className="form-control"
                        placeholder="Enter Product Name"
                        name="productName"
                        autoComplete="off"
                        {...register("productName", {
                          required: "Product Name is Required",
                        })}
                      />
                      {errors.productName && (
                        <p className="errorMsg">{errors.productName.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Product Cost <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type={isUpdating ? "text" : "text"}
                        readOnly={isUpdating}
                        className="form-control"
                        placeholder="Enter Product Cost"
                        name="productCost"
                        autoComplete="off"
                        // onInput={toInputEmailCase}
                        {...register("productCost", {
                          required: "Product Cost is Required",
                        })}
                      />
                      {errors.productCost && (
                        <p className="errorMsg">{errors.productCost.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        HSN Number <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        readOnly={isUpdating}
                        name="hsnNo"
                        placeholder="Enter HSN Number"
                        className="form-control"
                        autoComplete="off"
                        {...register("hsnNo", {
                          required: true,
                        })}
                      />
                      {errors.hsnNo && (
                        <p className="errorMsg">
                          {errors.hsnNo.message ||
                            "HSN Number is Required"}
                        </p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        GST%<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="gst"
                        placeholder="Enter GST Percentage"
                        className="form-control"
                        autoComplete="off"
                        {...register("gst", {
                          required: true,
                        })}
                      />
                      {errors.gst && (
                        <p className="errorMsg">
                          {errors.gst.message ||
                            "GST Percentage is Required"}
                        </p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Service <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="service"
                        placeholder="Enter Product Service"
                        className="form-control"
                        autoComplete="off"
                        {...register("service", {
                          required: true,
                        })}
                      />
                      {errors.service && (
                        <p className="errorMsg">
                          {errors.service.message ||
                            "Product Service is Required"}
                        </p>
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
                        {isUpdating ? "Update Employee" : "Add Employee"}{" "}
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
};

export default ProductRegistration;
