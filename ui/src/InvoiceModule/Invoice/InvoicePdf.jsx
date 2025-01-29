import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import { CalendarFill } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import { useAuth } from "../../Context/AuthContext";
import {
  companyViewByIdApi,
  InvoiceDownloadById,
  InvoiceGetApiById,
} from "../../Utils/Axios";
import LayOut from "../../LayOut/LayOut";

const InvoicePdf = () => {
  const { setValue } = useForm();
  const [invoiceData, setInvoiceData] = useState({});
  const location = useLocation();
  const [companyDetails, setCompanyDetails] = useState({});
  const { customerId, invoiceId } = location.state || {};
  const { user } = useAuth();
  const companyId = user.companyId;
  console.log("companyId", companyId);

  useEffect(() => {
    if (user.companyId) {
      const fetchCompanyDetails = async () => {
        try {
          const response = await companyViewByIdApi(user.companyId);
          console.log("Fetched company details for companyId:", user.companyId);
          console.log("invoiceDetails", response.data);

          setCompanyDetails(response.data);
          const companyData = response.data;
          setValue("userName", companyData.userName);
          setValue("companyEmail", companyData.companyEmail);
          setValue("phone", companyData.phone);
          setValue("companyName", companyData.companyName);
          setValue("serviceName", companyData.serviceName);
          setValue("pan", companyData.pan);
          setValue("gstNumber", companyData.gstNumber);
          setValue("gender", companyData.gender);
          setValue("accountNumber", companyData.accountNumber);
          setValue("bankName", companyData.bankName);
          setValue("branch", companyData.branch);
          setValue("ifscCode", companyData.ifscCode);
          setValue("address", companyData.address);
          setValue("state", companyData.state);
          setValue("password", companyData.password);
        } catch (error) {
          toast.error("Failed to load company details.", {
            position: "top-right",
            theme: "colored",
            autoClose: 1000,
            transition: Slide,
          });
        }
      };

      fetchCompanyDetails();
    }
  }, [user.companyId, setValue]);

  useEffect(() => {
    // Check if companyId is available
    if (!companyId) {
      console.error("Company ID is missing");
      return; // Exit early if companyId is unavailable
    }

    const fetchData = async () => {
      try {
        const { invoiceId, customerId } = location?.state || {}; // Get the state passed from navigation
        console.log("Invoice ID:", invoiceId); // Log invoiceId from state
        console.log("Customer ID:", customerId); // Log customerId from state
        console.log("Company ID:", companyId); // Log companyId from user context

        // Check if both invoiceId and customerId are present
        if (invoiceId && customerId) {
          const response = await InvoiceGetApiById(
            companyId, // Pass companyId
            customerId, // Pass customerId from location state
            invoiceId // Pass invoiceId from location state
          );
          console.log("API Response Data:", response); // Log the entire response data
          console.log("Invoice Data:", response);
          setInvoiceData(response); // Set the invoice data from the response
        } else {
          console.error(
            "Invoice ID and/or Customer ID not found in location state"
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error); // Log any error that occurs during the API call
      }
    };

    fetchData();
  }, [companyId, location]);

  useEffect(() => {
    if (invoiceData && Object.keys(invoiceData).length > 0) {
      console.log("Updated invoiceData:", invoiceData); // Check the structure
    }
  }, [invoiceData]);

  const handleDownload = async () => {
    // Check if location and invoiceId are available
    if (location && location.state && location.state.invoiceId) {
      const { invoiceId, customerId } = location.state; // Extract invoiceId and customerId from location.state
      const companyId = user.companyId; // Assuming companyId is from the user context

      // Ensure that all required parameters are available
      if (companyId && customerId && invoiceId) {
        try {
          // Call the API to download the invoice with the three parameters
          const success = await InvoiceDownloadById(
            companyId,
            customerId,
            invoiceId
          );

          if (success) {
            toast.success("Invoice downloaded successfully");
          } else {
            toast.error("Failed to download invoice");
          }
        } catch (err) {
          console.error("Error downloading invoice:", err);
          toast.error("Failed to download invoice");
        }
      } else {
        console.error("Company ID, Customer ID, or Invoice ID is missing");
        toast.error("Company ID, Customer ID, or Invoice ID is missing");
      }
    } else {
      console.error("Invoice ID is missing");
      toast.error("Invoice ID is missing");
    }
  };

  return (
    <LayOut>
      <div className="container-fluid" style={{ width: "900px" }}>
        <div className="row">
          <div className="col-md-12">
            <div
              className="card card-body bg-white mt-5"
              style={{ paddingTop: "50px", paddingRight: "60px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: "bold", marginBottom: "0px" }}>
                    PAN No: {invoiceData.panNo}
                  </p>
                  <p style={{ fontWeight: "bold" }}>
                    GST Number: {companyDetails.gstNo}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <img
                    src={companyDetails.imageFile}
                    style={{ height: "60px", width: "155px" }}
                    alt="logo"
                  />
                </div>
              </div>
              <h1 style={{ textAlign: "center" }}>Invoice</h1>
              <div className="row">
                {/* Billing Information */}
                <div className="col-md-6">
                  <div className="text-left">
                    <address>
                      <p style={{ marginBottom: "10px" }}>Billed To,</p>
                      <p style={{ marginBottom: "10px" }}>
                        <b>{invoiceData.customerName},</b>
                      </p>
                      <p style={{ marginBottom: "10px" }}>
                        <b>Email : {invoiceData.email},</b>
                      </p>
                      <p style={{ marginBottom: "10px" }}>
                        <b>Contact No : {invoiceData.mobileNumber},</b>
                      </p>
                      <p style={{ marginBottom: "10px" }}>
                        <b>GST : {invoiceData.customerGstNo},</b>
                      </p>
                      <p style={{ marginBottom: "10px" }}>
                        <b>Address : {invoiceData.customerAddress}.</b>
                      </p>
                    </address>
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  {" "}
                  {/* Use 'text-end' for Bootstrap 5 */}
                  <p>
                    <b>Invoice ID :- {invoiceData.invoiceNumber}</b>
                  </p>
                  <p>
                    <b>Invoice Date :</b> <CalendarFill />{" "}
                    <b>{invoiceData.invoiceDate}</b>
                  </p>
                  <p>
                    <b>Due Date :</b> <CalendarFill />{" "}
                    <b>{invoiceData.dueDate}</b>
                  </p>
                </div>

                {/* Bank Details in Two Columns */}
                <div className="col-md-12">
                  <div className="table-responsive m-t-40">
                    <table
                      className="table table-hover"
                      style={{ marginBottom: "0px" }}
                    >
                      <thead>
                        <tr>
                          <th
                            className="text-center"
                            style={{ background: "#efeded" }}
                          >
                            S.No
                          </th>
                          <th
                            className="text-left"
                            style={{ background: "#efeded" }}
                          >
                            HSN-no
                          </th>
                          <th
                            className="text-left"
                            style={{ background: "#efeded" }}
                          >
                            Details
                          </th>
                          <th
                            className="text-left"
                            style={{ background: "#efeded" }}
                          >
                            Service
                          </th>
                          <th
                            className="text-left"
                            style={{ background: "#efeded" }}
                          >
                            Quantity
                          </th>
                          <th
                            className="text-left"
                            style={{ background: "#efeded" }}
                          >
                            Unit Cost (₹)
                          </th>
                          <th
                            className="text-left"
                            style={{ background: "#efeded" }}
                          >
                            Total Cost (₹)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.orderDetails &&
                        invoiceData.orderDetails.length > 0 ? (
                          invoiceData.orderDetails.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-left">{item.hsnNo}</td>
                              <td className="text-left">{item.productName}</td>
                              <td className="text-left">{item.service}</td>
                              <td className="text-left">{item.quantity}</td>
                              <td className="text-left">{item.unitCost}</td>
                              <td className="text-left">{item.totalCost}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                              No product details available
                            </td>
                          </tr>
                        )}
                      </tbody>

                      <tfoot>
                        {/* Total Cost, IGST, and Grand Total */}
                        <tr>
                          <td
                            colSpan="6"
                            style={{ textAlign: "right", fontWeight: "bold" }}
                          >
                            Total Amount
                          </td>
                          <td>{invoiceData.totalAmount}</td>
                        </tr>
                        {/* <tr>
                        <td colSpan="6" style={{ textAlign: 'right', fontWeight: 'bold' }}>IGST (18%)</td>
                        <td>{invoiceData.iGst}</td>
                      </tr> */}
                        {/* Conditional Rendering for Tax Rows */}
                        {/* {invoiceData.iGst > 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'right', fontWeight: 'bold' }}>IGST (18%)</td>
                          <td>{invoiceData.iGst}</td>
                        </tr>
                      ) : (
                        <>
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'right', fontWeight: 'bold' }}>SGST (9%)</td>
                            <td>{invoiceData.sGst}</td>
                          </tr>
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'right', fontWeight: 'bold' }}>CGST (9%)</td>
                            <td>{invoiceData.cGst}</td>
                          </tr>
                        </>
                      )} */}
                        {invoiceData.gstNo === 0 || invoiceData.gstNo === "" ? (
                          <>
                            <tr>
                              <td
                                colSpan="6"
                                style={{
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                                SGST (9%)
                              </td>
                              <td>0</td>
                            </tr>
                            <tr>
                              <td
                                colSpan="6"
                                style={{
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                                CGST (9%)
                              </td>
                              <td>0</td>
                            </tr>
                          </>
                        ) : invoiceData.igst > 0 ? (
                          <tr>
                            <td
                              colSpan="6"
                              style={{ textAlign: "right", fontWeight: "bold" }}
                            >
                              IGST (18%)
                            </td>
                            <td>{invoiceData.igst}</td>
                          </tr>
                        ) : (
                          <>
                            <tr>
                              <td
                                colSpan="6"
                                style={{
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                                SGST (9%)
                              </td>
                              <td>{invoiceData.sgst}</td>
                            </tr>
                            <tr>
                              <td
                                colSpan="6"
                                style={{
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                                CGST (9%)
                              </td>
                              <td>{invoiceData.cgst}</td>
                            </tr>
                          </>
                        )}
                        <tr>
                          <td
                            colSpan="6"
                            style={{ textAlign: "right", fontWeight: "bold" }}
                          >
                            Grand Total
                          </td>
                          <td>{invoiceData.grandTotal}</td>
                        </tr>
                        <tr>
                          <td
                            colSpan="12"
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            In Words : {invoiceData.grandTotalInWords}{" "}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="12" style={{ textAlign: "center" }}>
                            <span className="text-sm">
                              The payment should be made favouring{" "}
                              <strong>{companyDetails.companyName}</strong> or
                              Direct deposite information given above.
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="table-responsive">
                    <h3 style={{ margin: "40px 0 10px 0px" }}>Bank Details</h3>
                    <div className="col-md-12">
                      <div
                        className="bank-details"
                        style={{ marginBottom: "20px" }}
                      >
                        <div style={{ display: "flex", marginBottom: "10px" }}>
                          <span style={{ fontWeight: "bold", width: "150px" }}>
                            Bank Name :
                          </span>
                          <span>
                            {invoiceData.bankDetails?.[0]?.bankName || "N/A"}
                          </span>
                        </div>
                        {/* <div style={{ display: "flex", marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold", width: "150px" }}>Account Type:</span>
                        <span>{invoiceData.accountType}</span>
                      </div> */}
                        <div style={{ display: "flex", marginBottom: "10px" }}>
                          <span style={{ fontWeight: "bold", width: "150px" }}>
                            Account Number :
                          </span>
                          <span>
                            {invoiceData.bankDetails?.[0]?.accountNumber ||
                              "N/A"}
                          </span>
                        </div>
                        <div style={{ display: "flex", marginBottom: "10px" }}>
                          <span style={{ fontWeight: "bold", width: "150px" }}>
                            IFSC Code :
                          </span>
                          <span>
                            {invoiceData.bankDetails?.[0]?.ifscCode || "N/A"}
                          </span>
                        </div>
                        <div style={{ display: "flex", marginBottom: "10px" }}>
                          <span style={{ fontWeight: "bold", width: "150px" }}>
                            Branch :
                          </span>
                          <span>
                            {invoiceData.bankDetails?.[0]?.branch || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ marginTop: "50px" }}>
                        <b>{companyDetails.companyName}</b>{" "}
                      </p>
                      {/* <img
                        src={companyDetails.stampImage}
                        alt="Stamp"
                        style={{ width: "130px", height: "130px" }}
                      /> */}
                      <h5>Authorized Signature</h5>
                    </div>

                    {/* <h6 style={{ textAlign: "center" }}>CIN : </h6> */}
                    <hr />
                    <div style={{ margin: "40px 0px" }}>
                      <p style={{ textAlign: "center", marginBottom: "0px" }}>
                        {companyDetails.companyName},
                      </p>
                      <p style={{ marginBottom: "0px", textAlign: "center" }}>
                        {companyDetails.companyAddress},
                      </p>
                      <p style={{ marginBottom: "0px", textAlign: "center" }}>
                        {companyDetails.mobileNo}, {companyDetails.emailId}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="text-right"
              style={{ marginBottom: "30px", marginLeft: "82%" }}
              onClick={handleDownload}
            >
              <button className="btn btn-danger">Download as PDF</button>
            </div>
          </div>
        </div>
      </div>
    </LayOut>
  );
};

export default InvoicePdf;
