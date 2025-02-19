import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Select from "react-select";
import LayOut from "../../LayOut/LayOut";
import { useAuth } from "../../Context/AuthContext";
import { InvoicePostApi } from "../../Utils/Axios";
import { fetchCustomers } from "../../Redux/CustomerSlice";
import { fetchProducts } from "../../Redux/ProductSlice";
import { fetchBanks } from "../../Redux/BankSlice";

const InvoiceRegistration = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  // Select data from Redux store
  // const customers = useSelector(selectCustomers) || []; // Ensure it's an array
  //const products = useSelector(selectProducts);
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customers);
  const { products } = useSelector((state) => state.products);
  const { banks } = useSelector((state) => state.banks);

  console.log("products", products);
  const [invoiceData, setInvoiceData] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [customFields, setCustomFields] = useState([]); // Dynamic field names
  const [newField, setNewField] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [productRows, setProductRows] = useState([]);
  const { user } = useAuth();
  const companyId = user.companyId;
  console.log("companyId", companyId);

  const [productsInfo, setProductsInfo] = useState([
    {
      productName: "",
      hsnNo: "",
      purchaseDate: "",
      quantity: "",
      productCost: "",
    },
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null); // to handle edit case
  const [load, setLoad] = useState(false); // to manage loading state for API calls
  const [customer, setCustomer] = useState(customers); // List of customers for the dropdown
  const [product, setProduct] = useState(products);
  const [bank, setBank] = useState(banks);
  const [formattedProducts, setFormattedProducts] = useState(products);
  const [formattedBanks, setFormattedBanks] = useState(banks);
  const navigate = useNavigate();
  const location = useLocation();

  console.log("customer", customer);
  console.log("product", product);

  console.log("formattedProducts", formattedProducts);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
    dispatch(fetchBanks(companyId));
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(products)) {
      const productOptions = products.map((product) => ({
        value: product.productId,
        label: product.productName,
        hsnNo: product.hsnNo,
        productCost: product.productCost,
      }));
      setFormattedProducts(productOptions);
    }
  }, [products]);

  useEffect(() => {
    if (companyId) {
      console.log("fetchBanks", fetchBanks);
      dispatch(fetchBanks(companyId));
    }
  }, [dispatch, companyId]);

  useEffect(() => {
    console.log("Banks from Redux store:", banks);
  }, [banks]);

  // Filter banks based on search term
  useEffect(() => {
    if (Array.isArray(banks)) {
      const bankOptions = banks.map((bank) => ({
        value: bank.bankId, // Assuming `bank.id` is the unique identifier
        label: bank.bankName, // Assuming `bank.bankName` is the name of the bank
      }));
      setFormattedBanks(bankOptions);
    }
  }, [banks]);

  const handleBankChange = (selectedOption) => {
    console.log("Selected Bank:", selectedOption);
    // Additional actions can be performed here, if necessary
  };

  console.log("this is from product options ", formattedProducts);

  const handleCustomerChange = (selectedOption) => {
    setInvoiceData(selectedOption);
    console.log("selectedOption", selectedOption);
    //setValue("vendorCode", selectedOption.value);
  };

  useEffect(() => {
    if (companyId) {
      dispatch(fetchCustomers(companyId));
    }
  }, [dispatch, companyId]);

  useEffect(() => {
    console.log("Customers from Redux store:", customers);
  }, [customers]);

  useEffect(() => {
    if (customers && Array.isArray(customers)) {
      const result = customers.filter((customer) =>
        customer.customerName.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(result);
    } else {
      setFilteredData([]);
    }
  }, [search, customers]);

  useEffect(() => {
    if (companyId) {
      dispatch(fetchProducts(companyId));
    }
  }, [dispatch, companyId]);

  useEffect(() => {
    console.log("Customers from Redux store:", products);
  }, [products]);

  useEffect(() => {
    if (products && Array.isArray(products)) {
      const result = products.filter((product) =>
        product.productName.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(result);
    } else {
      setFilteredData([]);
    }
  }, [search, products]);

  // Function to auto-generate invoice number
  //   const generateInvoiceNumber = () => {
  //     const currentDate = moment().format('YYYYMMDD');
  //     const randomSuffix = Math.floor(Math.random() * 10000);
  //     return `${currentDate}-${randomSuffix}`;
  //   };

  useEffect(() => {
    // Check if customers is an array before using map
    const productOptions = Array.isArray(products)
      ? products.map((prod) => ({
          value: prod.productId,
          label: prod.productName,
        }))
      : [];

    setProduct(productOptions);
    console.log(productOptions);
  }, [products]);

  useEffect(() => {
    // Check if customers is an array before using map
    const customerOptions = Array.isArray(customers)
      ? customers.map((cust) => ({
          value: cust.customerId,
          label: cust.customerName,
        }))
      : [];

    setCustomer(customerOptions);
    console.log(customerOptions);
  }, [customers]);

  console.log("this is from customers options ", customer);

  const handleProductChange = (selectedOption, index) => {
    console.log("Selected Product:", selectedOption);

    if (!selectedOption || !selectedOption.productCost) {
      console.error(
        "Selected product does not have productCost",
        selectedOption
      );
      return;
    }

    const purchaseDate = getValues(`productsInfo[${index}].purchaseDate`);
    const quantity = getValues(`productsInfo[${index}].quantity`);

    const updatedProductsInfo = [...productsInfo];
    updatedProductsInfo[index] = {
      ...updatedProductsInfo[index],
      productId: selectedOption.value, // Product ID
      productName: selectedOption.label, // Product Name
      hsnNo: selectedOption.hsnNo, // HSN No
      productCost: selectedOption.productCost, // Product Cost
      purchaseDate: purchaseDate,
      quantity: quantity,
    };

    setProductsInfo(updatedProductsInfo);

    // Update React Hook Form values for product details
    setValue(`productsInfo[${index}].productName`, selectedOption.label);
    setValue(`productsInfo[${index}].hsnNo`, selectedOption.hsnNo);
    setValue(`productsInfo[${index}].productCost`, selectedOption.productCost);
    setValue(`productsInfo[${index}].purchaseDate`, purchaseDate); // Empty initially
    setValue(`productsInfo[${index}].quantity`, quantity); // Empty initially

    console.log("Updated Products Info:", updatedProductsInfo);
  };

  // Function to set default invoice date
  //   const getDefaultInvoiceDate = () => {
  //     return moment().format('YYYY-MM-DD');
  //   };

  const onSubmit = async (data) => {
    console.log("🔍 Full Form Data Before Fix:", data); // Check the received form data

    setLoad(true);

    try {
      const customerId = data.customerName?.value;
      if (!customerId) {
        console.error("❌ Customer ID is missing!");
        toast.error("Customer ID is required");
        setLoad(false);
        return;
      }

      // ✅ Convert products array into a dynamic key-value object for customFields
      const customFieldsObject = {};

      // Add predefined fields to the object
      customFieldsObject.customerName = data.customerName.label || "";
      customFieldsObject.purchaseOrder = data.purchaseOrder || "";
      customFieldsObject.vendorCode = data.vendorCode || "";
      customFieldsObject.invoiceDate = data.invoiceDate || "";
      customFieldsObject.dueDate = data.dueDate || "";
      
      // Add dynamic product fields
      if (data.products?.length > 0) {
        data.products.forEach((product) => {
          Object.keys(product).forEach((key) => {
            customFieldsObject[key] = product[key] || "";
          });
        });
      }
      
      console.log("✅ Final Payload:", customFieldsObject);
      
      console.log("🛠️ Transformed Custom Fields:", customFieldsObject);

      // ✅ Prepare final payload
      const invoiceDataToSend = {
        // customerName: data.customerName.label,
        // purchaseOrder: data.purchaseOrder,
        // vendorCode: data.vendorCode,
        // invoiceDate: data.invoiceDate,
        // dueDate: data.dueDate,
        status: "Active",
        bankId: data.bankName,
        invoice: customFieldsObject, // ✅ Dynamically generated custom fields
      };

      console.log("📡 Sending Data to API:", invoiceDataToSend);

      const response = await InvoicePostApi(
        companyId,
        customerId,
        invoiceDataToSend
      );
      console.log("✅ API Response:", response);

      toast.success("Invoice created successfully", {
        position: "top-right",
        autoClose: 1000,
      });
      navigate("/invoiceView");

      setInvoiceData(data);
      setShowPreview(true);
    } catch (error) {
      console.error("❌ API Error:", error);
      toast.error("Failed to save invoice", {
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      setLoad(false);
    }
  };

  // // Automatically populate invoice number and date if they are not provided
  useEffect(() => {
    if (!invoiceId) {
      // Set default invoice number and date on new invoice creation
      // setValue("invoiceNumber", generateInvoiceNumber());
      // setValue("invoiceDate", getDefaultInvoiceDate());
    }
  }, [invoiceId, setValue]);

  const togglePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  // // For managing the products dynamically
  const AddProductsInfo = () => {
    setProductsInfo([
      ...productsInfo,
      {
        productId: "",
        hsnNo: "",
        purchaseDate: "",
        quantity: "",
        productCost: "",
      },
    ]);
  };

  const handleDelete = (index) => {
    const updatedProducts = [...productsInfo];
    updatedProducts.splice(index, 1);
    setProductsInfo(updatedProducts);
  };

  const allowNumbersOnly = (e) => {
    if (!/^[0-9\s]*$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleInvoiceDateChange = (e) => {
    const invoiceDate = new Date(e.target.value);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(invoiceDate.getDate() + 15);
    setValue("dueDate", dueDate.toISOString().split("T")[0]);
  };

  useEffect(() => {
    const invoiceDate = document.getElementById("invoiceDate").value;
    if (invoiceDate) {
      handleInvoiceDateChange({ target: { value: invoiceDate } });
    }
  }, []);

  const toInputTitleCase = (e) => {
    let value = e.target.value;
    e.target.value = value.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleKeyDown = (e) => {
    if (/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleAddField = () => {
    const trimmedNewField = newField.trim();

    if (trimmedNewField !== "") {
      if (customFields.length < 6) {
        if (!customFields.includes(trimmedNewField)) {
          setCustomFields((prevFields) => [...prevFields, trimmedNewField]); // Ensure correct state update
          setNewField(""); // Reset input field
          setShowModal(false); // Close modal if needed
          setErrorMessage(""); // Reset error message
        } else {
          setErrorMessage(`Field "${trimmedNewField}" already exists.`); // Set error message
        }
      } else {
        setErrorMessage("You can only add up to 6 fields."); // Set error message
      }
    }
  };

  // Add new product row
  const handleAddProductRow = () => {
    setProductRows([...productRows, {}]);
  };

  // Remove product row
  const handleDeleteRow = (index) => {
    setProductRows(productRows.filter((_, i) => i !== index));
  };

  // Remove custom field
  const handleDeleteField = (fieldIndex) => {
    setCustomFields(customFields.filter((_, i) => i !== fieldIndex));
  };

  // Handle form submission
  // const onSubmit = (data) => {
  //   console.log("Form Submitted:", data);
  // };

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
          <div className="col">
            <h1 className="h3 mb-3">
              <strong>Invoice Registration</strong>{" "}
            </h1>
          </div>
          <div className="col-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="/main">Home</a>
                </li>
                <li className="breadcrumb-item active">Invoices</li>
                <li className="breadcrumb-item active">Invoice Registration</li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title" style={{ marginBottom: "0px" }}>
                  Invoice Registration Form
                </h5>
                <div
                  className="dropdown-divider"
                  style={{ borderTopColor: "#d7d9dd" }}
                />
              </div>
              <form
                className="form-horizontal"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="card-body">
                  <h4 className="ml-3" style={{ marginTop: "20px" }}>
                    <b>Invoice Details</b>
                  </h4>

                  {/* Customer Name Dropdown */}
                  <div className="form-group row mt-5">
                    <label
                      htmlFor="customer"
                      className="col-sm-2 text-right control-label col-form-label"
                    >
                      Client Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-sm-9 mb-3">
                      <Controller
                        name="customerName"
                        id="customerName"
                        control={control}
                        rules={{ required: "Client Name is required" }} // Mandatory validation rule
                        render={({ field }) => (
                          <Select
                            {...field} // Spread the controller's field props
                            options={customer} // Pass the formatted customer options
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
                        <p
                          className="errorMsg"
                          style={{ marginLeft: "6px", marginBottom: "0" }}
                        >
                          {errors.customerName.message}
                        </p> // Display error message
                      )}
                    </div>
                  </div>

                  <div className="form-group row mt-1">
                    <label
                      htmlFor="bankName"
                      className="col-sm-2 text-right control-label col-form-label"
                    >
                      Bank Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-sm-9 mb-3">
                      <Controller
                        name="bankName" // This is the field name in the form
                        control={control}
                        rules={{ required: "Bank Name is required" }} // Validation rule
                        render={({ field }) => (
                          <Select
                            {...field} // Spread the react-hook-form field props
                            options={formattedBanks} // The list of bank options
                            value={
                              formattedBanks.find(
                                (bank) => bank.value === field.value
                              ) || null
                            } // Find the selected bank by matching value (bankId)
                            onChange={(selectedOption) => {
                              // Handle bank selection
                              field.onChange(
                                selectedOption ? selectedOption.value : null
                              ); // Update the bankId (value) in form
                            }}
                            getOptionLabel={(e) => e.label} // Display the bank name (label) in the dropdown
                            getOptionValue={(e) => e.value} // The value corresponds to bankId
                          />
                        )}
                      />
                      {errors.bankName && (
                        <p
                          className="errorMsg"
                          style={{ marginLeft: "6px", marginBottom: "0" }}
                        >
                          {errors.bankName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Vendor Code */}
                  <div className="form-group row">
                    <label
                      htmlFor="vendorCode"
                      className="col-sm-2 text-right control-label col-form-label"
                    >
                      Vendor Code <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-sm-9 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        name="vendorCode"
                        id="vendorCode"
                        placeholder="Enter Vendor Code"
                        {...register("vendorCode", {
                          required: "Vendor Code is required",
                          pattern: {
                            value: /^[A-Za-z0-9]+$/, // Accept only alphabets and numbers
                            message: "Only alphabets and numbers are allowed",
                          },
                          minLength: {
                            value: 3,
                            message:
                              "Vendor Code must be at least 3 characters long",
                          },
                          maxLength: {
                            value: 10,
                            message: "Vendor Code cannot exceed 10 characters",
                          },
                        })}
                      />
                      {errors.vendorCode && (
                        <p
                          className="errorMsg"
                          style={{ marginLeft: "6px", marginBottom: "0" }}
                        >
                          {errors.vendorCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Purchase Order */}
                  <div className="form-group row">
                    <label
                      htmlFor="purchaseOrder"
                      className="col-sm-2 text-right control-label col-form-label"
                    >
                      Purchase Order <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-sm-9 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        name="purchaseOrder"
                        id="purchaseOrder"
                        placeholder="Enter Purchase Order"
                        {...register("purchaseOrder", {
                          required: "Purchase Order is required",
                          pattern: {
                            value: /^[A-Za-z0-9]+$/, // Accept only alphabets and numbers
                            message: "Only alphabets and numbers are allowed",
                          },
                          minLength: {
                            value: 3,
                            message:
                              "Purchase Order must be at least 3 characters long",
                          },
                          maxLength: {
                            value: 10,
                            message:
                              "Purchase Order cannot exceed 10 characters",
                          },
                        })}
                      />
                      {errors.purchaseOrder && (
                        <p
                          className="errorMsg"
                          style={{ marginLeft: "6px", marginBottom: "0" }}
                        >
                          {errors.purchaseOrder.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Invoice Number */}
                  {/* <div className="form-group row">
                    <label
                      htmlFor="invoiceNumber"
                      className="col-sm-2 text-right control-label col-form-label"
                    >
                      Invoice Number
                    </label>
                    <div className="col-sm-9 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="invoiceNumber"
                        name="invoiceNumber"
                        {...register("invoiceNumber", {
                          required: "Invoice number is required",
                        })}
                      />
                    </div>
                    {errors.invoiceNumber && (
                      <p className="errorMsg">{errors.invoiceNumber.message}</p>
                    )}
                  </div> */}

                  {/* Invoice Date */}
                  <div className="form-group row">
                    <label
                      htmlFor="invoiceDate"
                      className="col-sm-2 text-right control-label col-form-label"
                    >
                      Invoice Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-sm-9 mb-3">
                      <input
                        type="date"
                        className="form-control"
                        name="invoiceDate"
                        id="invoiceDate"
                        autoComplete="off"
                        {...register("invoiceDate", {
                          required: "Invoice date is required",
                          onChange: handleInvoiceDateChange, // Set due date when invoice date changes
                        })}
                      />
                      {errors.invoiceDate && (
                        <p
                          className="errorMsg"
                          style={{ marginLeft: "6px", marginBottom: "0" }}
                        >
                          {errors.invoiceDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="dueDate"
                      className="col-sm-2 text-right control-label col-form-label"
                    >
                      Due Date
                    </label>
                    <div className="col-sm-9 mb-3">
                      <input
                        type="date"
                        className="form-control"
                        name="dueDate"
                        id="dueDate"
                        autoComplete="off"
                        {...register("dueDate", {})}
                        disabled
                      />
                    </div>
                    {/* {errors.dueDate && (
                      <p className="errorMsg" style={{ marginLeft: "6px" }}>
                        {errors.dueDate.message}
                      </p>
                    )} */}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary mb-2"
                    onClick={() => setShowModal(true)}
                  >
                    Add Fields
                  </button>
                  {customFields.length > 0 && (
                    <div>
                      <h5>Custom Fields:</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {customFields.map((field, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center"
                          >
                            <input
                              {...register(`customField_${index}`)}
                              className="form-control me-2 mb-2"
                              defaultValue={field}
                              style={{ width: "150px" }} // Adjust width if needed
                            />
                            <button
                              type="button"
                              style={{ padding: "6px" }}
                              className="btn btn-danger btn-sm mb-2"
                              onClick={() =>
                                setCustomFields(
                                  customFields.filter((_, i) => i !== index)
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                 
                  {showModal && (
                    <div
                      role="dialog"
                      aria-modal="true"
                      className="fade modal show" // Consider using a library for better modal handling
                      tabIndex="-1"
                      style={{ zIndex: "9999", display: "block" }} // Often, libraries handle styling
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Add Custom Field</h5>
                            <button
                              className="close"
                              onClick={() => setShowModal(false)}
                            >
                              &times;
                            </button>
                          </div>
                          <div className="modal-body">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Field Name"
                              value={newField}
                              onChange={(e) => {
                                const value = e.target.value;

                                // Validation rules
                                if (!/^[A-Za-z\s&-]+$/.test(value)) {
                                  setErrorMessage(
                                    "Only alphabetic characters, spaces, '&' and '-' are allowed."
                                  );
                                } else if (value.length < 2) {
                                  setErrorMessage(
                                    "Minimum 2 characters required."
                                  );
                                } else if (value.length > 40) {
                                  setErrorMessage(
                                    "Maximum 40 characters allowed."
                                  );
                                } else if (/\s$/.test(value)) {
                                  setErrorMessage(
                                    "Spaces at the end are not allowed."
                                  );
                                } else {
                                  setErrorMessage(""); // No error
                                }

                                setNewField(value);
                              }}
                              onInput={toInputTitleCase}
                              onKeyDown={handleKeyDown}
                              autoComplete="off"
                            />
                            {errorMessage && (
                              <p className="errorMsg text-danger">
                                {errorMessage}
                              </p>
                            )}
                          </div>
                          <div className="modal-footer">
                            <button
                              className="btn btn-secondary"
                              onClick={() => setShowModal(false)}
                            >
                              Close
                            </button>
                            <button
                              className="btn btn-primary"
                              onClick={handleAddField}
                            >
                              Add Field
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add Product Row Button */}
                  <div>
                    <button
                      type="button"
                      className="btn btn-secondary mb-3"
                      onClick={handleAddProductRow}
                    >
                      Add Product Row
                    </button>

                    {/* Dynamically Generated Product Rows */}
                    {productRows.map((_, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="row mb-2 align-items-center"
                      >
                        {customFields.map((field, fieldIndex) => (
                          <div key={fieldIndex} className="col-md-2">
                            <label>{field}</label>
                            <input
                              type="text"
                              className="form-control"
                              {...register(`products[${rowIndex}].${field}`)}
                            />
                          </div>
                        ))}
                        <div
                          className="col-md-2"
                          style={{
                            paddingLeft: "0px",
                            paddingRight: "0px",
                            marginTop: "20px",
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() =>
                              setProductRows(
                                productRows.filter((_, i) => i !== rowIndex)
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* <div className="row">
                    <div className="col-sm-6">
                      <h4 className="ml-3" style={{ marginTop: "20px" }}>
                        <b>Product Details</b>
                      </h4>
                    </div>
                    <div className="col-sm-6">
                      <div className="card-body">
                        <button
                          type="button"
                          onClick={AddProductsInfo}
                          className="btn btn-secondary"
                          style={{ marginLeft: "63%" }}
                        >
                          Add More{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-12">
                      {productsInfo &&
                        productsInfo.length > 0 &&
                        productsInfo.map((item, index) => (
                          <div key={index} className="row">
                            <div className="form-group col-sm-2 ml-2 mt-2">
                              <div className="row">
                                <label
                                  htmlFor="productId"
                                  className="text-right control-label col-form-label pb-2"
                                >
                                  Product Name{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                              </div>
                              <Controller
                                name={`productsInfo[${index}].productId`}
                                control={control}
                                rules={{ required: "Product is required" }}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    options={formattedProducts}
                                    value={
                                      formattedProducts.find(
                                        (product) =>
                                          product.value === field.value
                                      ) || null
                                    } // Find the selected product by matching value
                                    onChange={(selectedOption) => {
                                      handleProductChange(
                                        selectedOption,
                                        index
                                      );
                                      field.onChange(
                                        selectedOption
                                          ? selectedOption.value
                                          : null
                                      ); // Pass only productId (value)
                                    }}
                                    getOptionLabel={(e) => e.label}
                                    getOptionValue={(e) => e.value}
                                  />
                                )}
                              />
                            </div>
                            <div className="form-group col-sm-2 ml-2 mt-2">
                              <label
                                htmlFor={`hsnNo-${index}`}
                                className="text-right control-label col-form-label"
                              >
                                HSN No
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id={`hsnNo-${index}`}
                                name={`productsInfo[${index}].hsnNo`}
                                value={productsInfo[index]?.hsnNo || ""}
                                {...register(`productsInfo[${index}].hsnNo`)}
                                readOnly
                              />
                            </div>

                            <div className="form-group col-sm-2 ml-2 mt-2">
                              <label
                                htmlFor={`purchaseDate-${index}`}
                                className="text-right control-label col-form-label"
                              >
                                Purchase Date{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                className="form-control"
                                id={`purchaseDate-${index}`}
                                name={`productsInfo[${index}].purchaseDate`}
                                type="date"
                                autoComplete="off"
                                {...register(
                                  `productsInfo[${index}].purchaseDate`,
                                  {
                                    required: "Purchase Date is required",
                                  }
                                )}
                              />
                            </div>

                            <div className="form-group col-sm-2 ml-2 mt-2">
                              <label
                                htmlFor={`quantity-${index}`}
                                className="text-right control-label col-form-label"
                              >
                                Quantity <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                className="form-control"
                                id={`quantity-${index}`}
                                name={`productsInfo[${index}].quantity`}
                                type="text"
                                onKeyDown={allowNumbersOnly}
                                placeholder="Enter Quantity"
                                maxLength={4}
                                {...register(
                                  `productsInfo[${index}].quantity`,
                                  {
                                    required: "Quantity is required",
                                  }
                                )}
                              />
                            </div>

                            <div className="form-group col-sm-2 ml-2 mt-2">
                              {errors.productsInfo?.[index]?.productCost && (
                                <p className="errorMsgs">*</p>
                              )}
                              <label
                                htmlFor={`productCost-${index}`}
                                className=" text-right control-label col-form-label"
                              >
                                Unit Cost
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                id={`productCost-${index}`}
                                name={`productsInfo[${index}].productCost`}
                                value={productsInfo[index]?.productCost || ""}
                                {...register(
                                  `productsInfo[${index}].productCost`
                                )}
                                readOnly
                              />
                            </div>

                            <div
                              className="form-group col-sm-2 ml-2"
                              style={{ marginTop: "40px" }}
                            >
                              <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(index)}
                              >
                                Delete
                              </button>
                            </div>
                            {errors?.productsInfo?.[index]?.productId && (
                              <p className="errorMsg">
                                {errors.productsInfo[index].productId.message}
                              </p>
                            )}
                            {errors?.productsInfo?.[index]?.purchaseDate && (
                              <p
                                className="errorMsg"
                                style={{ marginLeft: "333px" }}
                              >
                                {
                                  errors.productsInfo[index].purchaseDate
                                    .message
                                }
                              </p>
                            )}
                            {errors?.productsInfo?.[index]?.quantity && (
                              <p
                                className="errorMsg"
                                style={{ marginLeft: "500px" }}
                              >
                                {errors.productsInfo[index].quantity.message}{" "}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div> */}
                </div>
                <div className="card-body">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ marginLeft: "90%" }}
                    disabled={load}
                  >
                    {load ? "submitting..." : "submit"}
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

export default InvoiceRegistration;
