import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Slide } from 'react-toastify';
import Select from 'react-select'
import LayOut from '../../LayOut/LayOut';
import { InvoicePutApiById, InvoicePostApi, InvoiceGetApiById } from '../../Utils/Axios';

const InvoiceRegistration = () => {
  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm({ mode: "onChange" });
  // Select data from Redux store
  // const customers = useSelector(selectCustomers) || []; // Ensure it's an array
  // const products = useSelector(selectProducts);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [productsInfo, setProductsInfo] = useState([{ productName: '', hsnNo: '', purchaseDate: '', quantity: '', productCost: '' }]);
  const [showPreview, setShowPreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [invoiceId, setInvoiceId] = useState(null); // to handle edit case
  const [load, setLoad] = useState(false); // to manage loading state for API calls
  // const [customer, setCustomer] = useState(customers); // List of customers for the dropdown
  // const [formattedProducts, setFormattedProducts] = useState(products);
  const navigate = useNavigate();
  const location = useLocation();
  // const dispatch = useDispatch();


  // console.log("customer", customer);
  // console.log("formattedProducts", formattedProducts)

  // useEffect(() => {
  //   dispatch(fetchCustomers());
  //   dispatch(fetchAllProducts());
  // }, [dispatch]);

  // useEffect(() => {
  //   const productOptions = Array.isArray(products) ? products.map((product) => ({
  //     value: product.productId,
  //     label: product.productName,
  //     hsnNo: product.hsnNo,
  //     productCost: product.cost,
  //   })) : [];
  //   setFormattedProducts(productOptions);
  //   console.log("this is from product options ", productOptions);
  // }, [products]);

  // console.log("this is from product options ", formattedProducts);


  const handleCustomerChange = (selectedOption) => {
    setInvoiceData(selectedOption)
    console.log("selectedOption", selectedOption);
    setValue('vendorCode', selectedOption.value);
  };

  // Function to auto-generate invoice number
  const generateInvoiceNumber = () => {
    const currentDate = moment().format('YYYYMMDD');
    const randomSuffix = Math.floor(Math.random() * 10000);
    return `${currentDate}-${randomSuffix}`;
  };

  // useEffect(() => {
  //   // Check if customers is an array before using map
  //   const customerOptions = Array.isArray(customers) ? customers.map((cust) => ({
  //     value: cust.customerId,
  //     label: cust.customerName,
  //   })) : [];

  //   setCustomer(customerOptions);
  //   console.log(customerOptions);
  // }, [customers]);

  // console.log("this is from customers options ", customer);

  // const handleProductChange = (selectedValue, index) => {
  //   // Find the selected product
  //   const selectedProduct = formattedProducts.find(
  //     (product) => product.value === selectedValue
  //   );

  //   if (selectedProduct) {
  //     // Update local state
  //     const updatedProductsInfo = [...productsInfo];
  //     updatedProductsInfo[index] = {
  //       ...updatedProductsInfo[index],
  //       productId: selectedProduct.value,
  //       hsnNo: selectedProduct.hsnNo,
  //       productCost: selectedProduct.productCost,
  //     };
  //     setProductsInfo(updatedProductsInfo);

  //     // Update React Hook Form values
  //     setValue(`productsInfo[${index}].productId`, selectedProduct.value);
  //     setValue(`productsInfo[${index}].hsnNo`, selectedProduct.hsnNo);
  //     setValue(`productsInfo[${index}].productCost`, selectedProduct.productCost);

  //     console.log("Updated Products Info: ", updatedProductsInfo); // Debugging log
  //   }
  // };

  // Function to set default invoice date
  const getDefaultInvoiceDate = () => {
    return moment().format('YYYY-MM-DD');
  };


  // Fetch invoice details on load if invoiceId exists
  const onSubmit = async (data) => {
    console.log("InvoiceRegdata", data)
    setLoad(true); // Show loading spinner or indicator
    try {
      // Construct the request payload in the correct format
      const invoiceDataToSend = {
        customerName: data.customerName.label,
        purchaseOrder: data.purchaseOrder,
        vendorCode: data.vendorCode,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        invoiceNumber: data.invoiceNumber,
        orderRequests: data.productsInfo.map(product => ({
          productId: product.productId,
          hsnNo: product.hsnNo,
          purchaseDate: product.purchaseDate,
          quantity: product.quantity,
        })),
        status: "Active", // You can set the status based on your business logic
      };
      console.log("invoiceDataToSend", invoiceDataToSend)

      if (invoiceId) {
        // If invoiceId exists, send a PUT request to update the existing invoice
        const response = await InvoicePutApiById(invoiceId, invoiceDataToSend);
        toast.success('Invoice updated successfully', { position: 'top-right', autoClose: 1000 });
      } else {
        // If invoiceId does not exist, send a POST request to create a new invoice
        const response = await InvoicePostApi(invoiceDataToSend);
        toast.success('Invoice created successfully', { position: 'top-right', autoClose: 1000 });
        navigate("/Invoices")
      }

      // Update the local invoice data with the response
      setInvoiceData({
        ...data,
        product_details: productsInfo, // Make sure product details are included
      });

      setShowPreview(true); // Show the preview on successful submission
    } catch (error) {
      toast.error('Failed to save invoice', { position: 'top-right', autoClose: 1000 });
    } finally {
      setLoad(false); // Hide the loading indicator
    }
  };

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (location.state && location.state.invoiceId) {
        setInvoiceId(location.state.invoiceId);
        try {
          const response = await InvoiceGetApiById(location.state.invoiceId);
          const invoiceDetails = response.data;
          reset(invoiceDetails);
          setProductsInfo(invoiceDetails.product_details || []);
        } catch (error) {
          toast.error('Error fetching invoice data', { position: 'top-right', autoClose: 1000 });
        }
      }
    };
    fetchInvoiceData();
  }, [location, reset]);

  // Automatically populate invoice number and date if they are not provided
  useEffect(() => {
    if (!invoiceId) {
      // Set default invoice number and date on new invoice creation
      setValue("invoiceNumber", generateInvoiceNumber());
      setValue("invoiceDate", getDefaultInvoiceDate());
    }
  }, [invoiceId, setValue]);

  const togglePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  // For managing the products dynamically
  const AddProductsInfo = () => {
    setProductsInfo([...productsInfo, { productId: '', hsnNo: '', purchaseDate: '', quantity: '', productCost: '' }]);
  };

  const handleDelete = (index) => {
    const updatedProducts = [...productsInfo];
    updatedProducts.splice(index, 1);
    setProductsInfo(updatedProducts);
  };

  const allowNumbersOnly = (e) => {
    if (!/^[1-9\s]*$/.test(e.key)) {
      e.preventDefault();
    }
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
                  <a href="/employeeView">Invoice</a>
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
                  {isUpdating ? "Invoice Data" : "Invoice Registration"}
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
                        Customer Name<span style={{ color: "red" }}>*</span>
                      </label>
                      <Controller
                        name="customerName"
                        id="customerName"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            {...field} // Spread the controller's field props
                            // options={customer} // Pass the formatted customer options
                            onChange={(selectedOption) => {
                              handleCustomerChange(selectedOption); // Handle the change event
                              field.onChange(selectedOption); // Ensure react-hook-form is updated
                            }}
                            getOptionLabel={(e) => e.label} // Customizing label if needed
                            getOptionValue={(e) => e.value} // Customizing value if needed

                          />
                        )}
                      />
                      {errors.customerName && (
                        <p className="errorMsg">{errors.customerName.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Vendor Code <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="vendorCode"
                        readOnly
                        autoComplete="off"
                        // onInput={toInputEmailCase}
                        {...register("vendorCode", {
                          required: "Vendor Code Id is Required",
                        })}
                      />
                      {errors.vendorCode && (
                        <p className="errorMsg">{errors.vendorCode.message}</p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Purchase Order <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="purchaseOrder"
                        placeholder="Enter Purchase Order"
                        className="form-control"
                        autoComplete="off"
                        {...register("purchaseOrder", {
                          required: true,
                        })}
                      />
                      {errors.purchaseOrder && (
                        <p className="errorMsg">
                          {errors.purchaseOrder.message ||
                            "Purchase Order is Required"}
                        </p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Due Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        className="form-control"
                        autoComplete="off"
                        {...register("dueDate", {
                          required: true,
                          validate: {
                            notPast: (value) => {
                              const today = new Date();
                              const selectedDate = new Date(value);
                              // Check if the selected date is today or in the future
                              return selectedDate >= today || "Due date cannot be in the past.";
                            },
                          },
                        })}
                      />
                      {errors.dueDate && (
                        <p className="errorMsg">
                          {errors.dueDate.message ||
                            "Due Date is Required"}
                        </p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Invoice Number <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="invoiceNumber"
                        placeholder="Enter Invoice Number"
                        className="form-control"
                        autoComplete="off"
                        {...register("invoiceNumber", {
                          required: true,
                        })}
                      />
                      {errors.invoiceNumber && (
                        <p className="errorMsg">
                          {errors.invoiceNumber.message ||
                            "Pin Code is Required"}
                        </p>
                      )}
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                      <label className="form-label">
                        Invoice Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        readOnly={isUpdating}
                        name="invoiceDate"
                        placeholder="Enter Invoice Date"
                        className="form-control"
                        autoComplete="off"
                        {...register("invoiceDate", {
                          required: true,
                        })}
                      />
                      {errors.invoiceDate && (
                        <p className="errorMsg">
                          {errors.invoiceDate.message ||
                            "Invoice Date is Required"}
                        </p>
                      )}
                    </div>
                    <div className="card-header" style={{ paddingLeft: "0px" }}>
                      <h5 className="card-title ">Product Details</h5>
                      <div
                        className="dropdown-divider"
                        style={{ borderTopColor: "#d7d9dd" }}
                      />
                    </div>
                    <div className="d-flex justify-content-end mb-2">
                      <button className="btn btn-secondary" onClick={AddProductsInfo}>
                        Add More
                      </button>
                    </div>
                    {productsInfo.map((product, index) => (
                      <div key={index} className="row">
                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                          <label className="form-label">Product Id <span style={{ color: "red" }}>*</span></label>
                          <Controller
                            name={`productsInfo[${index}].productId`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                onChange={(selectedOption) => {
                                  handleCustomerChange(selectedOption);
                                  field.onChange(selectedOption);
                                }}
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                              />
                            )}
                          />
                          {errors.productsInfo && errors.productsInfo[index]?.productId && (
                            <p className="errorMsg">{errors.productsInfo[index].productId.message}</p>
                          )}
                        </div>
                        <div className="col-lg-1"></div>
                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                          <label className="form-label">HSN Number <span style={{ color: "red" }}>*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            id={`hsnNo-${index}`}
                            name={`productsInfo[${index}].hsnNo`}
                            value={productsInfo[index]?.hsnNo || ''}
                            {...register(`productsInfo[${index}].hsnNo`, {
                              required: "HSN Number is Required",
                            })}
                            readOnly
                          />
                          {errors.productsInfo && errors.productsInfo[index]?.hsnNo && (
                            <p className="errorMsg">{errors.productsInfo[index].hsnNo.message}</p>
                          )}
                        </div>
                        <div className="col-lg-1"></div>
                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                          <label className="form-label">Purchase Date <span style={{ color: "red" }}>*</span></label>
                          <input
                            type="date"
                            className="form-control"
                            id={`purchaseDate-${index}`}
                            name={`productsInfo[${index}].purchaseDate`}
                            value={productsInfo[index]?.purchaseDate || ''}
                            {...register(`productsInfo[${index}].purchaseDate`, {
                              required: "Purchase Date is Required",
                            })}
                          />
                          {errors.productsInfo && errors.productsInfo[index]?.purchaseDate && (
                            <p className="errorMsg">{errors.productsInfo[index].purchaseDate.message}</p>
                          )}
                        </div>
                        <div className="col-lg-1"></div>
                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                          <label className="form-label"> Quantity <span style={{ color: "red" }}>*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            id={`quantity-${index}`}
                            name={`productsInfo[${index}].quantity`}
                            value={productsInfo[index]?.quantity || ''}
                            {...register(`productsInfo[${index}].quantity`, {
                              required: "Product Quantity is Required",
                            })}
                          />
                          {errors.productsInfo && errors.productsInfo[index]?.quantity && (
                            <p className="errorMsg">{errors.productsInfo[index].quantity.message}</p>
                          )}
                        </div>
                        <div className="col-lg-1"></div>
                        <div className="col-12 col-md-6 col-lg-5 mb-3">
                          <label className="form-label">Cost <span style={{ color: "red" }}>*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            id={`cost-${index}`}
                            name={`productsInfo[${index}].cost`}
                            value={productsInfo[index]?.hsnNo || ''}
                            {...register(`productsInfo[${index}].cost`, {
                              required: " Product Cost is Required",
                            })}
                            readOnly
                          />
                          {errors.productsInfo && errors.productsInfo[index]?.cost && (
                            <p className="errorMsg">{errors.productsInfo[index].cost.message}</p>
                          )}
                        </div>
                        <div className="col-lg-1"></div>
                        <div className="col-12 col-md-6 col-lg-5 mb-5">

                          <button className="btn btn-danger mt-4" onClick={() => handleDelete(index)}>
                            Delete
                          </button>

                        </div>
                      </div>
                    ))}
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

export default InvoiceRegistration;













