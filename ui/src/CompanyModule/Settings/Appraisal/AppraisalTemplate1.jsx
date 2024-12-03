import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { companyViewByIdApi, EmployeeGetApiById } from "../../../Utils/Axios";

const AppraisalTemplate1 = ({
  companyLogo,
  companyData,
  companyName,
  employeeName,
  designation,
  employeeId, // Ensure employeeId is passed as a prop
  period,
  effectiveDate,
  salaryIncrease,
  allowances,
}) => {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, logoFileName } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idFromQuery = queryParams.get("employeeId"); // Extract employeeId from URL query params if needed

  return (
    <div
      className="watermarked"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div style={{ textAlign: "right" }}>
        {logoFileName ? (
          <img
            className="align-middle"
            src={companyLogo}
            alt="Logo"
            style={{ height: "80px", width: "180px" }}
          />
        ) : (
          <p>Logo</p>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "20%",
          right: "30%",
          width: "50%",
          height: "50%",
          backgroundImage: `url(${companyLogo})`,
          transform: "rotate(340deg)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          zIndex: 1,
        }}
      />

      <h4 className="text-center p-3">APPRAISAL LETTER</h4>

      <div className="row d-flex justify-content-between p-1">
        <div className="col-6">
          <p className="mb-0">
            <h6>To</h6>
          </p>
          <p>
            <strong>{employeeName || "EmployeeName"}</strong>
          </p>
          <p>
            <strong>Designation: {designation || "Designation"}</strong>
          </p>
          <p>
            <strong>Emp Id: {employeeId || "EmployeeId"}</strong>
          </p>
        </div>
        <div className="col-6">
          <p className="mb-0 text-end">
            {new Date().toISOString().split("T")[0]}
          </p>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(2px)",
        }}
      >
        <p className="p-2">
          Sub: <strong>Increment of Salary</strong>
        </p>
        <p className="p-2">
          Dear <strong>{employeeName || "Employee Name"}</strong>,
        </p>
        <p>
          We are pleased to inform you that based on your performance and
          contribution to the company, our management has revised your
          compensation to Rs.<strong>{salaryIncrease}</strong> pa which is cost
          to company with effect from <strong>{effectiveDate}</strong>.
        </p>
        <p>
          We recognize your continued contributions and dedication to the
          company, and we are happy to reward your hard work. Please note that
          all other terms and conditions of your employment remain unchanged as
          per your original offer letter.
        </p>
        <p>
          If you have any questions or need further clarification, feel free to
          reach out.
        </p>
        <table className="table border-collapse mb-5">
          <thead>
            <tr className="text-center">
              <th>Particulars</th>
              <th>Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            {allowances &&
              Object.keys(allowances).map((key, index) => {
                const value = allowances[key];
                let allowanceAmount = 0;
                // Check if the value contains a '%' (percentage)
                if (typeof value === "string" && value.includes("%")) {
                  // Extract the numeric part and calculate the allowance as a percentage of salaryIncrease
                  const percentageValue = parseFloat(value.slice(0, -1)); // Remove '%' and convert to a number
                  allowanceAmount = salaryIncrease * (percentageValue / 100);
                } else {
                  // Otherwise, treat the value as a fixed amount
                  allowanceAmount = parseFloat(value); // Convert to number directly
                }
                return (
                  <tr key={index}>
                    <td>
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </td>
                    {/* Show the allowance amount (rounded to nearest integer) */}
                    <td>{Math.floor(allowanceAmount.toFixed(2))}</td>
                  </tr>
                );
              })}
            {/* Add a row for Gross Salary after the allowances */}
            {salaryIncrease && (
              <tr>
                <td>
                  <strong>Gross Salary</strong>
                </td>
                <td>
                  <strong>{salaryIncrease}</strong>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p>
          <i>
            {" "}
            We appreciate your initiative and expect you to take many more such
            responsibilities in future assignments to ensure company’s growth.
          </i>
        </p>
        <div className="mt-5 pt-3">
          <p className="mb-5">With Best Wishes,</p>
          <div className="mt-5 pt-5">
            <p>Authorized Signature</p>
            <h6>{companyName}</h6>
            <h6>
              PH: {companyData.mobileNo}, Email: {companyData.emailId}{" "}
            </h6>
            <h6>{companyData.companyAddress}</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppraisalTemplate1;
