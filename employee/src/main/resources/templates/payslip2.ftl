<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Pay Slip</title>
    <style>
        @page {
            size: A4;
            margin: 6mm;
        }
        body {
            margin: 0;
            padding: 0;
        }
        .main {
            width: 100%;
            box-sizing: border-box;
        }
        .pdfPage {
            width: 100%;
            margin: 0 auto;
            box-sizing: border-box;
        }
         .top {
         display: flex;
         justify-content: space-between; /* Aligns the content on opposite ends */
         align-items: center; /* Align items vertically in the center */
         margin-bottom: 20px;
         }
        .date-info {
            text-align: left;
            flex: 1;
        }
        .logo {
            text-align: end;
            flex-shrink: 0;
            margin-bottom:20px;
            margin-top:0px;
            margin-left:300px
        }
        .logo img {
            max-width: 120px;
            height: 100px;
            display: flex;
        }
        .details {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }
        .details table {
            width: 100%;
            border-collapse: collapse;
        }
        .details th, .details td {
            border: 0.5px solid black;
            padding: 4px;
            text-align: left;
        }
        .employee-details {
            text-align: center;
        }
        .text {
            margin: 20px 0;
        }
        .address {
            margin-top: 160px;
            text-align: center;
        }
          th {
                    background-color: #ffcc80; /* Light orange background */
                    color: black; /* Text color */
                    padding: 8px;
                }
                .company {
                margin-top: 30px;
                }
    </style>
</head>
<body>
    <div class="main">
        <div class="pdfPage">
            <table>
                <tr>
                    <td>
                        <div class="date-info">
                            <h4 id="month-year">${payslipEntity.month}-${payslipEntity.year} Pay Slip</h4>
                            <h4 id="employee-name"> Name: ${employee.firstName} ${employee.lastName}</h4>
                        </div>
                    </td>
                    <td>
                        <div class="logo">
                            <img src="${company.imageFile}"/>
                        </div>
                    </td>
                </tr>
            </table>

            <div class="details">
                <table>
                    <tr>
                        <th colspan="4" class="employee-details">Employee Details</th>
                    </tr>
                    <tr>
                        <th>EmployeeId</th>
                        <td>${employee.employeeId}</td>
                        <th>Joining Date</th>
                        <td>${employee.dateOfHiring}</td>
                    </tr>
                    <tr>
                        <th>Department</th>
                        <td>${employee.departmentName}</td>
                        <th>PAN</th>
                        <td>${employee.panNo}</td>
                    </tr>
                    <tr>
                        <th>Designation</th>
                        <td>${employee.designationName}</td>
                        <th>UAN</th>
                        <td>${employee.uanNo}</td>
                    </tr>
                    <tr>
                         <th>Bank ACC No</th>
                         <td>${employee.accountNo}</td>
                        <th>IFSC</th>
                        <td>${employee.ifscCode}</td>
                    </tr>
                    <tr>
                    <th>Bank Name:</th>
                                            <td>${employee.bankName}</td>
                                            <th>Location</th>
                                            <td>${employee.location}</td>
                    </tr>
                </table>
            </div>

            <div class="details">
                <table>
            <tr>
                       <th>Days Paid</th>
                       <td>${payslipEntity.attendance.totalWorkingDays?number}</td>
                       <th>Days Present</th>
                       <td>${payslipEntity.attendance.noOfWorkingDays?number}</td>
                       <th>LOP Days</th>
                       <td>
                           <#assign totalWorkingDays = payslipEntity.attendance.totalWorkingDays?number>
                           <#assign noOfWorkingDays = payslipEntity.attendance.noOfWorkingDays?number>
                           <#if (totalWorkingDays - noOfWorkingDays) < 0>
                               N/A
                           <#else>
                               ${totalWorkingDays - noOfWorkingDays}
                           </#if>
                       </td>
                   </tr>

                </table>
            </div>

            <div class="details">
                <table>
                    <tr>
                        <th class="earnings">Earnings (A)</th>
                        <th class="earnings">Amount</th>
                        <th class="deductions">Deductions (B)</th>
                        <th class="deductions">Amount</th>
                    </tr>
                    <tr>
                        <td>Basic Salary</td>
                        <td>${payslipEntity.salary.basicSalary}</td>
                        <td>PF Employee</td>
                        <td>${payslipEntity.salary.deductions.pfEmployee}</td>
                    </tr>
                    <tr>
                        <td>HRA</td>
                        <td>${payslipEntity.salary.allowances.hra}</td>
                        <td>PF Employer</td>
                        <td>${payslipEntity.salary.deductions.pfEmployer}</td>
                    </tr>
                    <tr>
                        <td>Travel Allowance</td>
                        <td>${payslipEntity.salary.allowances.travelAllowance}</td>
                        <td>LOP</td>
                        <td>${payslipEntity.salary.deductions.lop}</td>
                    </tr>
                    <tr>
                        <td>PF Contribution Employee</td>
                        <td>${payslipEntity.salary.allowances.pfContributionEmployee}</td>
                        <td>Total Deductions (B)</td>
                        <td>${payslipEntity.salary.deductions.totalDeductions}</td>
                    </tr>
                    <tr>
                        <td>Special Allowance</td>
                        <td>${payslipEntity.salary.allowances.specialAllowance}</td>
                        <th class="deductions">Taxes (C)</th>
                         <th class="deductions">Amount</th>
                    </tr>
                    <tr>
                        <td>Other Allowances</td>
                        <td>${payslipEntity.salary.allowances.otherAllowances}</td>
                        <td>Professional Tax</td>
                        <td>${payslipEntity.salary.deductions.pfTax}</td>
                    </tr>
                    <tr>
                        <td>Total Earnings (A)</td>
                        <td>${payslipEntity.salary.totalEarnings}</td>
                        <td>Income Tax</td>
                        <td>${payslipEntity.salary.deductions.incomeTax}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Total Tax (C)</td>
                        <td>${payslipEntity.salary.deductions.totalTax}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <th>Net Pay (A-B-C)</th>
                        <td><strong>${payslipEntity.salary.netSalary}</strong></td>
                    </tr>
                    <tr>
                        <th>Net Salary (In Words)</th>
                        <td colspan="3"><strong>${payslipEntity.inWords}</strong></td>
                    </tr>
                </table>
            </div>

           <div class="text">
               <p><em>This is computer-generated payslip and does not require authentication</em></p>
           </div>
           <div class="address">
               <hr/>
               <p class="company">
                  Company Address: ${company.companyAddress}<br/>
                   Mobile No: ${company.mobileNo}<br />
                   Email ID: ${company.emailId}
               </p>
           </div>

        </div>
    </div>
</body>
</html>
