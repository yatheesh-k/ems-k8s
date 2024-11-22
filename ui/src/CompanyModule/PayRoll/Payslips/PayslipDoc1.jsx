import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Download } from "react-bootstrap-icons";
import { companyViewByIdApi, EmployeeGetApiById, EmployeePaySlipDownloadById, EmployeePayslipGetById } from "../../../Utils/Axios";
import LayOut from "../../../LayOut/LayOut";
import { useAuth } from "../../../Context/AuthContext";

const PayslipDoc1 = () => {
    const [companyData, setCompanyData] = useState({});
    const [payslipData, setPayslipData] = useState(null);
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const employeeId = queryParams.get("employeeId");
    const payslipId = queryParams.get("payslipId");
    const { user, logoFileName } = useAuth();

    const fetchCompanyData = async (companyId) => {
        try {
            const response = await companyViewByIdApi(companyId);
            setCompanyData(response.data);
        } catch (err) {
            console.error("Error fetching company data:", err);
            toast.error("Failed to fetch company data");
        }
    };

    const fetchEmployeeDetails = async (employeeId) => {
        try {
            const response = await EmployeeGetApiById(employeeId);
            setEmployeeDetails(response.data);
            if (response.data.companyId) {
                fetchCompanyData(response.data.companyId);
            }
        } catch (err) {
            console.error("Error fetching employee details:", err);
            toast.error("Failed to fetch employee details");
        }
    };

    const fetchPayslipData = async () => {
        if (!employeeId || !payslipId) return;
        try {
            const response = await EmployeePayslipGetById(employeeId, payslipId);
            setPayslipData(response.data.data || null);
        } catch (err) {
            console.error("Error fetching payslip data:", err);
            toast.error("Failed to fetch payslip data");
        }
    };

    const handleDownload = async () => {
        if (employeeId && payslipId) {
            try {
                const templateNumber = 1; 
                const success = await EmployeePaySlipDownloadById(employeeId, payslipId, templateNumber);
                if (success) {
                    toast.success("Payslip downloaded successfully");
                } else {
                    toast.error("Failed to download payslip");
                }
            } catch (err) {
                console.error("Error downloading payslip:", err);
                toast.error("Failed to download payslip");
            }
        } else {
            console.error("Employee ID or Payslip ID is missing");
            toast.error("Employee ID or Payslip ID is missing");
        }
    };

    useEffect(() => {
        setLoading(true);
        if (employeeId) {
            fetchEmployeeDetails(employeeId);
        }
        if (employeeId && payslipId) {
            fetchPayslipData();
        }
        setLoading(false);
    }, [employeeId, payslipId, user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!payslipData || !employeeDetails) {
        return <div>No data available</div>;
    }

    const maskPanNumber = (panNumber) => {
        if (!panNumber || panNumber.length < 4) return panNumber;
        const maskedPart = panNumber.slice(0, -4).replace(/./g, '*');
        const visiblePart = panNumber.slice(-4);
        return maskedPart + visiblePart;
    };

    const formatFieldName = (fieldName) => {
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
    };

    return (
        <LayOut>
            <div className="container mt-4" style={{ pointerEvents: "none" }}>
                <div className="card">
                    <div className="card-header mt-4" style={{ background: "none", display: "flex", padding: "0px 25px", borderBottomWidth: "0px" }}>
                        <div className="header-content mt-4" style={{ textAlign: "center", height: "200px", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#9fc7df", border: "1px solid black", borderBottom: "none", borderRight: "none", width: "50%" }}>
                            <div style={{ paddingTop: "20px" }}>
                                {logoFileName ? (
                                    <img className="align-middle" src={logoFileName} alt="Logo" style={{ height: "80px", width: "180px" }} />
                                ) : (
                                    <p>Logo</p>
                                )}
                            </div>
                            <div className="company-details text-center" style={{ padding: "2px" }}>
                                <h6>{companyData.companyAddress}.</h6>
                                <h6>{companyData.mobileNo}</h6>
                                <h6>{companyData.emailId}</h6>
                            </div>
                        </div>
                        <div style={{ width: "50%", marginTop: "24px", padding: "160px 0px 0px 5px", borderTop: "1px solid black", borderRight: "1px solid black" }}>
                            <h3>SALARY SLIP</h3>
                        </div>
                    </div>
                    <div style={{ textAlign: "center", margin: "0px 25px" }}>
                        <h3 style={{ marginBottom: "0px", borderLeft: "1px solid black", backgroundColor: "#ccc", color: "#ccc" }}>SALARY SLIP</h3>
                    </div>
                    <div className="card-body" style={{ padding: "0px 25px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center", backgroundColor: "#9fc7df", paddingTop: "10px", borderLeft: "1px solid black", borderRight: "1px solid black" }}>
                            <h4 style={{ textAlign: "center", paddingLeft: "130px" }}>Employee Details</h4>
                            <h4 style={{ textAlign: "center", marginRight: "130px" }}>Month - Year: {payslipData.month} - {payslipData.year}</h4>
                        </div>
                        <div className="salary-details" style={{ border: "1px solid black", borderBottom: "none" }} >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div style={{ flex: 1, borderRight: "none", borderBottom: "none" }}>
                                    <ul style={{ listStyleType: "none", padding: 0, marginBottom: "2px" }}>
                                        <li style={{ display: "flex", padding: "4px 8px", alignItems: "center" }}>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", paddingRight: "35%" }}><b>EmployeeId</b></span>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", marginRight: "15px" }}>{employeeDetails.employeeId}</span>
                                        </li>
                                        <li style={{ display: "flex", padding: "4px 8px", alignItems: "center" }}>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", paddingRight: "35%" }}><b>Department</b></span>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", marginRight: "15px" }}>{payslipData.department}</span>
                                        </li>
                                        <li style={{ display: "flex", padding: "4px 8px", alignItems: "center" }}>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", paddingRight: "35%" }}><b>Designation</b></span>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", marginRight: "15px" }}>{payslipData.designation}</span>
                                        </li>
                                        <li style={{ display: "flex", padding: "4px 8px", alignItems: "center" }}>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", paddingRight: "35%" }}><b>Bank ACC No</b></span>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", marginRight: "15px" }}>{employeeDetails.accountNo}</span>
                                        </li>
                                        <li style={{ display: "flex", padding: "4px 8px", alignItems: "center" }}>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", paddingRight: "35%" }}><b>Total Days</b></span>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", marginRight: "15px" }}>{payslipData.attendance?.totalWorkingDays || 0}</span>
                                        </li>
                                        <li style={{ display: "flex", padding: "4px 8px", alignItems: "center" }}>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", paddingRight: "35%" }}><b>LOP Days</b></span>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", marginRight: "15px" }}>{(payslipData.attendance?.totalWorkingDays || 0) - (payslipData.attendance?.noOfWorkingDays || 0)}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div style={{ flex: 1, borderBottom: "none", overflow: "hidden" }}>
                                    <ul style={{ listStyleType: "none", padding: 0, marginBottom: "2px" }}>
                                        <li style={{ display: "flex", padding: "4px 8px", alignItems: "center" }}>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px" }}><b>Name</b></span>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", marginRight: "15px" }}>{employeeDetails.firstName} {employeeDetails.lastName}</span>
                                        </li>
                                        <li style={{ display: "flex", padding: "4px 8px", alignItems: "center" }}>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px" }}><b>PAN</b></span>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", marginRight: "15px" }}>{employeeDetails.panNo}</span>
                                        </li>
                                        <li style={{ display: "flex", padding: "4px 8px", alignItems: "center" }}>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px" }}><b>UAN</b></span>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", marginRight: "15px" }}>{employeeDetails.uanNo}</span>
                                        </li>
                                        <li style={{ display: "flex", padding: "4px 8px", alignItems: "center" }}>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px" }}><b>IFSC</b></span>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", marginRight: "15px" }}>{employeeDetails.ifscCode}</span>
                                        </li>
                                        <li style={{ display: "flex", padding: "4px 8px", alignItems: "center" }}>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px" }}><b>Worked Days</b></span>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", marginRight: "15px" }}>{payslipData.attendance?.noOfWorkingDays || 0}</span>
                                        </li>
                                        <li style={{ display: "flex", padding: "4px 8px", alignItems: "center" }}>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px" }}><b>Date of Birth</b></span>
                                            <span style={{ flex: 1, color: "black", paddingTop: "10px", marginRight: "15px" }}>{employeeDetails.dateOfBirth}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="salary-details">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div style={{ flex: 1, border: "1px solid black", borderRight: "none", borderBottom: "none" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", borderBottom: "1px solid black", backgroundColor: "#9fc7df" }}>
                                        <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "15px", color: "black", margin: 0 }}>Earnings</p>
                                        <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "15px", color: "black", margin: 0, paddingRight: "15px" }}>Amount</p>
                                    </div>
                                    <ul style={{ listStyleType: "none", padding: 0, marginBottom: "2px" }}>
                                        {Object.entries(payslipData.salary?.salaryConfigurationEntity?.allowances || {}).map(([key, value]) => (
                                            <li key={key} style={{ display: "flex", padding: "4px 8px", alignItems: "center" }}>
                                                <span style={{ flex: 1, color: "black" }}>{formatFieldName(key)}</span>
                                                <span style={{ flex: 1, color: "black", textAlign: "right", marginRight: "15px" }}>{Math.floor(value)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px" }}>
                                        <span style={{ color: "black" }}>Total Earnings (A)</span>
                                        <span style={{ marginRight: "15px", color: "black" }}>{Math.floor(payslipData.salary?.totalEarnings || 0)}</span>
                                    </div>
                                </div>
                                <div style={{ flex: 1, border: "1px solid black", borderBottom: "none", overflow: "hidden" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", borderBottom: "1px solid black", backgroundColor: "#9fc7df" }}>
                                        <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "15px", color: "black", margin: 0 }}>Deductions</p>
                                        <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "15px", color: "black", margin: 0, paddingRight: "15px" }}>Amount</p>
                                    </div>
                                    <ul style={{ listStyleType: "none", padding: 0, marginBottom: "2px" }}>
                                        {Object.entries(payslipData.salary?.salaryConfigurationEntity?.deductions || {}).map(([key, value]) => (
                                            <li key={key} style={{ display: "flex", padding: "4px 8px", alignItems: "center" }}>
                                                <span style={{ flex: 1, color: "black" }}>{formatFieldName(key)}</span>
                                                <span style={{ flex: 1, color: "black", textAlign: "right", marginRight: "15px" }}>{Math.floor(value)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "0px 8px 4px 8px" }}>
                                        <span style={{ color: "black" }}>LOP</span>
                                        <span style={{ marginRight: "15px", color: "black" }}>{Math.floor(payslipData.salary?.lop || 0)}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px" }}>
                                        <span style={{ color: "black" }}>Total Deductions (B)</span>
                                        <span style={{ marginRight: "15px", color: "black" }}>{Math.floor(payslipData.salary?.totalDeductions || 0)}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", borderTop: "1px solid black", borderBottom: "1px solid black", backgroundColor: "#9fc7df" }}>
                                        <p style={{ fontSize: "15px", fontWeight: "bold", color: "black", marginBottom: "0px" }}>Taxes</p>
                                        <p style={{ fontSize: "15px", fontWeight: "bold", color: "black", marginBottom: "0px", paddingRight: "15px" }}>Amount</p>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px" }}>
                                        <span style={{ color: "black" }}>Income Tax</span>
                                        <span style={{ marginRight: "15px", color: "black" }}>{Math.floor(payslipData.salary?.incomeTax || 0)}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px" }}>
                                        <span style={{ color: "black" }}>Pf Tax</span>
                                        <span style={{ marginRight: "15px", color: "black" }}>{Math.floor(payslipData.salary?.pfTax || 0)}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px" }}>
                                        <span style={{ color: "black" }}>Total Tax (C)</span>
                                        <span style={{ marginRight: "15px", color: "black" }}>{Math.floor(payslipData.salary?.totalTax || 0)}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <tbody>
                                        <tr>
                                            <td className="earnings" colSpan={1} style={{ padding: "4px", textAlign: "left", background: "#9fc7df", color: 'black', border: "1px solid black", width: "25%" }}><b>Net Pay (A-B-C)</b></td>
                                            <td className="earnings" colSpan={3} style={{ textAlign: "left", border: "1px solid black" }}><b>{payslipData.salary?.netSalary || 0}</b></td>
                                        </tr>
                                        <tr>
                                            <td className="earnings" colSpan={1} style={{ padding: "4px", textAlign: "left", background: "#9fc7df", color: 'black', border: "1px solid black", width: "25%" }}><b>Net Salary (in words)</b></td>
                                            <td className="earnings" colSpan={3} style={{ textAlign: "left", border: "1px solid black" }}><b>{payslipData.inWords || ""}</b></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <span className="mt-4"><em>This is a computer-generated payslip and does not require authentication</em></span>
                        <div className="bottom" style={{ marginLeft: "50px", marginRight: "50px", marginTop: "1px", paddingBottom: "30px" }}>
                            &nbsp;&nbsp;
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end align-items-center me-4">
                <button type="button" className="btn btn-outline-primary" onClick={handleDownload}>
                    <span className="m-2">Download</span> <Download size={18} className="ml-1" />
                </button>
            </div>
        </LayOut>
    );
};

export default PayslipDoc1;
