import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Download } from "react-bootstrap-icons";
import { companyViewByIdApi, EmployeeGetApiById, EmployeePaySlipDownloadById, EmployeePayslipGetById } from "../../../Utils/Axios";
import LayOut from "../../../LayOut/LayOut";
import { useAuth } from "../../../Context/AuthContext";

const PayslipDoc4 = () => {
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
                const templateNumber = 4; 
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
                    <div className="card-header mt-4" style={{ background: "none", paddingBottom: "0px", paddingLeft: "30px", paddingRight: "30px" }}>
                        <div className="header-content mt-4" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                {logoFileName ? (
                                    <img className="align-middle" src={logoFileName} alt="Logo" style={{ height: "80px", width: "180px" }} />
                                ) : (
                                    <p>Logo</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card-body m-0 p-2">
                        <div className="payslip-details">
                            <div style={{ padding: "20px" }}>
                                <table style={{ borderCollapse: "collapse", border: "1px solid black", width: "100%" }}>
                                    <tbody>
                                        <tr>
                                            <th colSpan={4} style={{ background: "#d3d3d3", color: 'black', paddingLeft: "5px", border: "1px solid black" }}><b>{companyData.companyName}</b></th>
                                        </tr>
                                        <tr>
                                            <th colSpan={4} style={{ background: "#d3d3d3", color: 'black', paddingLeft: "5px", border: "1px solid black" }}><b>Payslip for {payslipData.month} - {payslipData.year}</b></th>
                                        </tr>
                                        <tr>
                                            <th style={{ padding: "4px", width: "150px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black" }}>Employee ID</th>
                                            <td style={{ padding: "4px", textAlign: "left", border: "1px solid black" }}>{employeeDetails.employeeId}</td>
                                            <th style={{ padding: "4px", width: "150px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black" }}>Name</th>
                                            <td style={{ padding: "4px", textAlign: "left", border: "1px solid black" }}>{employeeDetails.firstName} {employeeDetails.lastName}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ padding: "4px", width: "150px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black" }}>Department</th>
                                            <td style={{ padding: "4px", textAlign: "left", border: "1px solid black" }}>{payslipData.department}</td>
                                            <th style={{ padding: "4px", width: "150px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black" }}>PAN</th>
                                            <td style={{ padding: "4px", textAlign: "left", border: "1px solid black" }}>{employeeDetails.panNo}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ padding: "4px", width: "150px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black" }}>Designation</th>
                                            <td style={{ padding: "4px", textAlign: "left", border: "1px solid black" }}>{payslipData.designation}</td>
                                            <th style={{ padding: "4px", width: "150px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black" }}>UAN</th>
                                            <td style={{ padding: "4px", textAlign: "left", border: "1px solid black" }}>{employeeDetails.uanNo}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ padding: "4px", width: "150px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black" }}>Bank ACC No</th>
                                            <td style={{ padding: "4px", textAlign: "left", border: "1px solid black" }}>{employeeDetails.accountNo}</td>
                                            <th style={{ padding: "4px", width: "150px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black" }}>IFSC</th>
                                            <td style={{ padding: "4px", textAlign: "left", border: "1px solid black" }}>{employeeDetails.ifscCode}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ padding: "4px", width: "150px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black" }}>Bank Name</th>
                                            <td style={{ padding: "4px", textAlign: "left", border: "1px solid black" }}>{employeeDetails.bankName}</td>
                                            <th style={{ padding: "4px", width: "150px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black" }}>Location</th>
                                            <td style={{ padding: "4px", textAlign: "left", border: "1px solid black" }}></td>
                                        </tr>
                                        <tr>
                                            <th style={{ padding: "4px", width: "150px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black" }}>Total Days</th>
                                            <td style={{ padding: "4px", textAlign: "left", border: "1px solid black" }}>{payslipData.attendance?.totalWorkingDays || 0}</td>
                                            <th style={{ padding: "4px", width: "150px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black" }}>Worked Days</th>
                                            <td style={{ padding: "4px", textAlign: "left", border: "1px solid black" }}>{payslipData.attendance?.noOfWorkingDays || 0}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ padding: "4px", width: "150px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black" }}>LOP Days</th>
                                            <td style={{ padding: "4px", textAlign: "left", border: "1px solid black" }}>{(payslipData.attendance?.totalWorkingDays || 0) - (payslipData.attendance?.noOfWorkingDays || 0)}</td>
                                            <th style={{ padding: "4px", width: "150px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black" }}>Date of Birth</th>
                                            <td style={{ padding: "4px", textAlign: "left", border: "1px solid black" }}>{employeeDetails.dateOfBirth}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="salary-details" style={{ padding: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ flex: 1, border: "1px solid black", borderRight: "none", borderBottom: "none" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", background: "#d3d3d3", borderBottom: "1px solid black" }}>
                                            <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "15px", color: "black", margin: 0 }}>Earnings</p>
                                            <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "15px", color: "black", margin: 0, paddingRight:"15px" }}>Amount</p>
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
                                            <span style={{ marginRight: "15px", color: "black" }}>{payslipData.salary?.totalEarnings || 0}</span>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, border: "1px solid black", borderBottom: "none", overflow: "hidden" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", background: "#d3d3d3", borderBottom: "1px solid black" }}>
                                            <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "15px", color: "black", margin: 0 }}>Deductions</p>
                                            <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "15px", color: "black", margin: 0, paddingRight:"15px" }}>Amount</p>
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
                                        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", borderTop: "1px solid black", borderBottom: "1px solid black", background: "#d3d3d3" }}>
                                            <p style={{ fontSize: "15px", fontWeight: "bold", color: "black", marginBottom: "0px" }}>Taxes</p>
                                            <p style={{ fontSize: "15px", fontWeight: "bold", color: "black", marginBottom: "0px", paddingRight:"15px" }}>Amount</p>
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
                                                <td className="earnings" colSpan={1} style={{ padding: "4px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black", width: "25%" }}><b>Net Pay (A-B-C)</b></td>
                                                <td className="earnings" colSpan={3} style={{ textAlign: "left", border: "1px solid black" }}><b>{payslipData.salary?.netSalary || 0}</b></td>
                                            </tr>
                                            <tr>
                                                <td className="earnings" colSpan={1} style={{ padding: "4px", textAlign: "left", background: "#d3d3d3", color: 'black', border: "1px solid black", width: "25%" }}><b>Net Salary (in words)</b></td>
                                                <td className="earnings" colSpan={3} style={{ textAlign: "left", border: "1px solid black" }}><b>{payslipData.inWords || ""}</b></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <span className="ms-4"><em>This is a computer-generated payslip and does not require authentication</em></span>
                            <div className="bottom" style={{ marginLeft: "50px", marginRight: "50px", marginTop: "1px", paddingBottom: "30px" }}>
                                &nbsp;&nbsp;
                            </div>
                            <div className="line" style={{ marginLeft: "20px", marginRight: "20px", color: "black " }}><hr /></div>
                            <div className="bottom" style={{ marginLeft: "50px", marginRight: "50px", marginTop: "20px", paddingBottom: "2px" }}>
                                <div className="line"></div>
                                <div className="company-details text-center" style={{ padding: "2px" }}>
                                    <h6>Company Address: {companyData.companyAddress}.</h6>
                                    <h6>Mobile No: {companyData.mobileNo}</h6>
                                    <h6>Email ID: {companyData.emailId}</h6>
                                </div>
                            </div>
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

export default PayslipDoc4;
