import React, { useState } from 'react';
import LayOut from '../../LayOut/LayOut';

const Template = () => {
    const date = new Date().toLocaleDateString();

    // State for editable fields
    const [isEditing, setIsEditing] = useState(false);
    const [recipientName, setRecipientName] = useState("[Recipient's Name]");
    const [fatherName, setFatherName] = useState("[Recipient's Father's Name]");
    const [address, setAddress] = useState("[Recipient's Address]");
    const [cityStateZip, setCityStateZip] = useState("[City, State, Zip]");
    const [contactNumber, setContactNumber] = useState("[Contact Number]");
    const [role, setRole] = useState("[Role]");
    const [joiningDate, setJoiningDate] = useState("[Joining date]");
    const [location, setLocation] = useState("[Location]");
    const [grossAmount, setGrossAmount] = useState("[Gross Amount]");
    const [companyName, setCompanyName] = useState("[Company Name]");

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        // Here you can add any logic to save the edited data
        setIsEditing(false);
    };

    return (
        <LayOut>
            <div className='card'>
                <div className='card-body'>
                    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                        <div style={{ textAlign: "right" }}>
                            <img src='assets/img/pathbreaker_logo.png' alt="" style={{ height: "100px", width: "250px" }} />
                        </div>
                        <h1 style={{ textAlign: "center", fontFamily: "serif", textDecoration: "underline", paddingTop: "30px" }}>Private & Confidential</h1>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <p>Date: {date}</p>
                            <p>Ref No: {date}</p>
                        </div>
                        <p><strong>To, {isEditing ? <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} /> : recipientName}</strong></p>
                        <p><strong>D/o {isEditing ? <input type="text" value={fatherName} onChange={e => setFatherName(e.target.value)} /> : fatherName}</strong></p>
                        <p><strong>{isEditing ? <input type="text" value={address} onChange={e => setAddress(e.target.value)} /> : address}</strong></p>
                        <p><strong>{isEditing ? <input type="text" value={cityStateZip} onChange={e => setCityStateZip(e.target.value)} /> : cityStateZip}</strong></p>
                        <p><strong>Contact Number: {isEditing ? <input type="text" value={contactNumber} onChange={e => setContactNumber(e.target.value)} /> : contactNumber}</strong></p>
                        <div style={{ margin: '40px 0' }}>
                            <p>Subject: Offer of Employment</p>
                            <p>Dear {isEditing ? <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} /> : recipientName},</p>

                            <p>
                                We welcome you to our pursuit of excellence and we feel proud to have a professional of your stature as a member of the <strong>{isEditing ? <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} /> : companyName}</strong> family and wish you a long, rewarding and satisfying career with us.
                            </p>

                            <p>
                                On behalf of <strong>{isEditing ? <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} /> : companyName}</strong>, hereinafter referred to as ‘the Company’, we are pleased to extend an offer for the position of <strong>{isEditing ? <input type="text" value={role} onChange={e => setRole(e.target.value)} /> : role}</strong> in our organization with the following mentioned details:
                            </p>

                            <ul style={{ listStyleType: "none", paddingLeft: "20px" }}>
                                <li>&rarr; You would join us on or before <strong>{isEditing ? <input type="text" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} /> : joiningDate}</strong> or else this offer would be null and void.</li>
                                <li>&rarr; You will be deployed at our office site and your job location would be at <strong>{isEditing ? <input type="text" value={location} onChange={e => setLocation(e.target.value)} /> : location}</strong>.</li>
                                <li>&rarr; Your gross compensation per annum is <strong>{isEditing ? <input type="text" value={grossAmount} onChange={e => setGrossAmount(e.target.value)} /> : grossAmount}</strong>.</li>
                            </ul>
                            <ul>
                                <li><strong>The proposed compensation details are attached as Annexure ’1’, and details of required documents at the time of joining are attached as Annexure ’2’.</strong></li>
                            </ul>
                            <p>
                                You will also be governed by all other instructions/rules/policies of the company, which are not specifically mentioned in this letter. For clarification, if any, regarding these instructions/rules/policies please get in touch with HR Department.
                            </p>
                            <p>
                                <strong>Probation Period:</strong> Probation period will be six months. Your service will get confirmed/extended/terminated depending upon your performance shown in the probation period and feedback received through the confirmation appraisal process.
                            </p>
                            <p>
                                <strong>Attendance:</strong> Attendance cycle will be from 26th to 25th of every month. Any employee joining after 20th of the month, their salary will be processed along with next month payroll. Any employee working as an RPO or Outdoor duty for continuous period needs to submit their approved attendance/timesheet on 25th of every month to their respective HR Team. Delay in receiving the approved attendance/timesheet will result in delay in payment of your salary.
                            </p>
                            <p>
                                <strong>Statutory benefits:</strong> You will be governed as per the respective acts of ESIC, PF, and Bonus, Gratuity etc as per the rules in force from time to time.
                            </p>
                            <p>
                                <strong>Background Check:</strong> The Company reserves the right to verify the information furnished by you in your application for employment and through other documents. If it is found that you have misinterpreted any information in your application or have furnished any false information or have concealed/suppressed any relevant material facts, your services are liable to terminate any time, without any notice or compensation in lieu thereof. You will also not be eligible for any relieving or experience letter for your tenure with the Company.
                            </p>
                            <p style={{ textAlign: "center" }}>CIN:- U72900AP2022PTC122622</p>
                            <hr />
                            <div style={{ textAlign: "center" }}>
                                <p>Pathbreaker Technologies</p>
                                <p style={{ marginTop: "-15px" }}>2nd floor, Shilpi Valley, Nasuja, Plot.no. 36, Hyderabad, Telangana 500081</p>
                                <p style={{ marginTop: "-15px" }}>PH: 040 48583619, Email: info@pathbreakertech.com | Web: https://pathbreakertech.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card'>
                <div className='card-body'>
                    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                        <div style={{ textAlign: "right" }}>
                            <img src='assets/img/pathbreaker_logo.png' alt="" style={{ height: "100px", width: "250px" }} />
                        </div>
                        <p style={{ paddingTop: "30px" }}>
                            <strong>Place of Employment and Transfer:</strong>
                            You acknowledge and agree that you may be assigned or liable to be transferred or deputed from one place to another and / or from one department / business unit to another or any other subsidiary / associate establishment / or their contractors and clients either existing or to be set up in future anywhere in India or abroad purely at the discretion of the management depending upon the needs and requirement of the Company. On such assignment, transfer or deputation you will be governed by the Rules and Regulations and other working / service conditions as applicable at the place of deployment including to consent to add / or agree to certain other agreements. The Company will seek to give you reasonable notice of extensive travel requirements, and to take into account your personal circumstances where appropriate.
                        </p>
                        <p>
                            <strong> Leave and Holidays:</strong>
                            Public/festival holidays would be divided into fixed holidays and an optional holiday (floater) for per Calendar year, Total Number of holidays may vary as per work location and / or operation
                        </p>
                        <p>
                            You would be eligible for the annual leaves of 21 days (on pro rata basis) i.e. you would be eligible for the leaves of 1.75 days per month for every calendar (January to December) year. However, you can utilize the same only after completion of probation period with VBRS. These leaves of six months will get credited to your leave balance account.
                        </p>
                        <p>
                            <strong> Un-availed Leave cannot be encashed at the end of your service.</strong> Leaves can be accumulated till the end of calendar year only.
                        </p>
                        <p>
                            <strong>Change in Contact details:</strong>
                            Any change of residential / communication address or change of primary contact details like email ID, contact number should be intimated to the HR department officially within 3 days from the date of such change. Your communication details as indicated shall be the correct address for sending all communication to you unless otherwise intimated in writing by you. Communication addressed to you at the above address shall deem to have been duly served.
                        </p>
                        <p>
                            <strong> Cessation of Services and Notice Period:</strong>
                            If you wish to leave the services of the Company you may do so under the following conditions:
                            You need to share formal resignation email during working hours to VBRS HR Team after formal discussion with your reporting manager. Resignation sent on weekly / public holidays, after working hours will be considered with effect from next business day. Resignation will not be considered if you have tendered the same while being on leave. You need to serve 30 days’ notice period from the date of resignation based on designation.
                        </p>
                        <p>
                            <strong> Notice Period without Cause:</strong>
                        </p>
                        <p style={{ marginTop: "-15px" }}>
                            In the event that the employment is ceased without cause, you will be provided 30 days’ notice prior to such cessation or paid severance pay in lieu of thereof equivalent to the consolidated compensation package for period of 60 days calculated on the basis of last gross salary.
                        </p>
                        <ul>
                            <li>
                                A letter of appointment shall be issued to you within 15 days of joining, subjecting the completion of all joining formalities and submission of all documents required.
                            </li>
                        </ul>
                        <p>
                            You are requested to keep the compensation information highly confidential.
                        </p>
                        <p style={{ marginTop: "-15px" }}>
                            We look forward to your joining <strong>[Company Name]</strong> soon.
                        </p>
                        <p>
                            Would appreciate you acknowledging the receipt of this offer and kindly <strong>send us your acceptance of this offer by a written mail and signed copy within the next 24 hours.</strong>
                        </p>
                        <p>
                            Please do not hesitate to contact us in case you have any queries.
                        </p>
                        <p style={{ textAlign: "center" }}>CIN:- U72900AP2022PTC122622</p>
                        <hr />
                        <div style={{ textAlign: "center" }}>
                            <p>Pathbreaker Technologies</p>
                            <p style={{ marginTop: "-15px" }}>2nd floor, Shilpi Valley, Nasuja, Plot.no. 36, Hyderabad, Telangana 500081</p>
                            <p style={{ marginTop: "-15px" }}>PH: 040 48583619, Email: info@pathbreakertech.com | Web: https://pathbreakertech.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card'>
                <div className='card-body'>
                    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                        <div style={{ textAlign: "right" }}>
                            <img src='assets/img/pathbreaker_logo.png' alt="" style={{ height: "100px", width: "250px" }} />
                        </div>
                        <h3 style={{ textAlign: "center", fontFamily: "serif", textDecoration: "underline", paddingTop: "30px" }}>Annexure - 1</h3>
                        <p>
                            Fixed Salary breakup
                        </p>
                    </div>
                    <table>
                        <tr>
                            <th>Particulars</th>
                            <th>Per Month (INR)</th>
                            <th>Per Annum (INR)</th>
                        </tr>
                        <tr>
                            <td>Basic</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>HRA</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Medical Reimb</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Conveyance All</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Special allowance</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Phone Allowance</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Travel Allowance</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><strong>Gross Salary</strong> </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>PF Employer Contribution</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>ESIC Employer Contribution</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><strong>Gross CTC</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>ESIC Employer Contribution</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>PT</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Insurance</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>ESIC Employee Contribution</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><strong>Total Deductions</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><strong>Net Salary (Pre-Taxation)</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                    <p style={{ paddingTop: "30px" }}>
                        Net Salary (Pretaxation) may vary due to change in applicable statutory deductions such as P. Tax, PF, ESIC, LWF etc.
                    </p>
                    <p>
                        * Income Tax, Professional Tax and other applicable taxes shall be deducted from the salary on a monthly basis as per Government Policy.
                    </p>
                    <p>
                        * Income Tax deduction is subjected to timely submission of the investment details.
                    </p>
                    <p>
                        * Pan Card submission is mandatory for the disbursement of the salary.
                    </p>
                    <p style={{ textAlign: "center" }}>CIN:- U72900AP2022PTC122622</p>
                    <hr />
                    <div style={{ textAlign: "center" }}>
                        <p>Pathbreaker Technologies</p>
                        <p style={{ marginTop: "-15px" }}>2nd floor, Shilpi Valley, Nasuja, Plot.no. 36, Hyderabad, Telangana 500081</p>
                        <p style={{ marginTop: "-15px" }}>PH: 040 48583619, Email: info@pathbreakertech.com | Web: https://pathbreakertech.com</p>
                    </div>
                </div>
            </div>
            <div className='card'>
                <div className='card-body'>
                    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                        <div style={{ textAlign: "right" }}>
                            <img src='assets/img/pathbreaker_logo.png' alt="" style={{ height: "100px", width: "250px" }} />
                        </div>
                        <h3 style={{ textAlign: "center", fontFamily: "serif", textDecoration: "underline", paddingTop: "30px" }}>Annexure - 2</h3>
                        <p>
                            List of Joining Documents (Original Copies of all certificates are required for verification)
                        </p>
                        <p><strong>
                            Educational Certificates
                        </strong>
                        </p>
                        <ul style={{ marginTop: "-15px" }}>
                            <li>10"& 12" Certificate</li>
                            <li>Diploma / Graduation Level / Post Graduation Certifications</li>
                            <li>Any Other Certification/ Diploma</li>
                        </ul>
                        <p><strong>
                            Work Experience Related Details
                        </strong></p>
                        <ul style={{ marginTop: "-15px" }}>
                            <li>Accepted designation letter of the last organization</li>
                            <li>Relieving letter from previous employer</li>
                            <li>Experience / Appointment letter of the last organization</li>
                        </ul>
                        <p><strong>
                            Photographs Required
                        </strong></p>
                        <ul style={{ marginTop: "-15px" }}>
                            <li>3 Passport Size Photograph</li>
                            <li>2 Postcard Size Photograph (Need to produce if ESI is Applicable)</li>
                        </ul>
                        <p><strong>
                            Address Proof (Any one of the following can be taken as an address proof)
                        </strong></p>
                        <ul style={{ marginTop: "-15px" }}>
                            <li>Ration Card / Voter ID Card</li>
                            <li>AADHAR Card</li>
                        </ul>
                    </div>
                    <table>
                        <tr>
                            <td colSpan={2}>Fill the following information and Submit on your Date of Joining along with your other documents.</td>

                        </tr>
                        <tr>
                            <td>Emergency Contact No.</td>
                            <td>Emergency Contact No.</td>
                        </tr>
                        <tr>
                            <td>Blood Group (Self)</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>PAN Card No (Mandatory)</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Marital Status (Single /Married)</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Husband’s / Wife’s Full Name </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Husband’s / Wife’s Date of Birth, Age </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Husband’s / Wife’s blood group</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Father's Full Name </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Father's Date of Birth, Age</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Mother's Full Name </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Mother's Date of Birth, Age</td>
                            <td></td>
                        </tr>
                    </table>
                    <p style={{ marginTop: "30px" }}><strong>Please Note:</strong></p>
                    <ul style={{listStyleType:"none"}}>
                        <li>Completion and submission of all the above-mentioned documents/forms, which would be given to you along with the joining kit, is mandatory.</li>
                        <li style={{paddingTop:"15px"}}>Noncompliance with this would entail your joining kit being declared as incomplete for which you as
                            the employee would be solely responsible. Consequently, this would delay/impact on joining process.
                        </li>
                        <li style={{paddingTop:"15px"}}>Your present and permanent addresses/ contact details, as mentioned in your application form, are put on company’s record. You would be expected to inform the company about any change in your address and telephone numbers.</li>
                    </ul>
                    <p style={{ textAlign: "center" }}>CIN:- U72900AP2022PTC122622</p>
                    <hr />
                    <div style={{ textAlign: "center" }}>
                        <p>Pathbreaker Technologies</p>
                        <p style={{ marginTop: "-15px" }}>2nd floor, Shilpi Valley, Nasuja, Plot.no. 36, Hyderabad, Telangana 500081</p>
                        <p style={{ marginTop: "-15px" }}>PH: 040 48583619, Email: info@pathbreakertech.com | Web: https://pathbreakertech.com</p>
                    </div>
                </div>
            </div>
            {/* <div className="col-12 mt-4  d-flex justify-content-end" style={{ background: "none" }}>
                <button onClick={handleEditToggle}
                    className={
                        isEditing
                            ? "btn btn-secondary"
                            : "btn btn-danger bt-lg"
                    }>
                    {isEditing ? "Cancel" : "Edit"}{" "}
                </button>
                {isEditing && <button style={{ marginLeft: '20px' }} className='btn btn-primary' onClick={handleSave}>Save</button>}
            </div> */}
        </LayOut >
    );
};

export default Template;
