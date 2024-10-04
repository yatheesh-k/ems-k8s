<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pay Slip</title>
    <style>
        @page {
            size: A4;
            margin: 6mm;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: Georgia, 'Times New Roman', Times, serif;
        }

        #month-year {
            text-align: center;
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
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .date-info {
            text-align: left;
            flex: 1;
        }

        .logo {
            text-align: end;
            flex-shrink: 0;
            margin-top: 0px;
        }

        .logo img {
            margin-top: 20px;
            max-width: 120px;
            height: 100px;
            display: flex;
        }

        .details {
            width: 100%;
            margin-bottom: 20px;

        }

        .details table {
            width: 100%;
        }

        .details th,
        .details td {
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
            background-color: #D3D3D3;
            color: black;
            padding: 8px;
        }

        .right {
            text-align: right;
        }

        .company {
            margin-top: 30px;
        }


        #earningsTable {
            border: none;
        }

        .details ,.table-main{
            border: 2px solid black;
        }
        .table-child{
            border: 2px solid black;
        }
        #earnings-amount{
            margin-bottom: 20px;
        }


    </style>
</head>

<body>
    <div class="main">
        <div class="pdfPage">
            <table>
                <tr>
                    <td>
                        <div class="logo">
                            <img src="${company.imageFile}" alt="Company Logo" />
                        </div>
                    </td>
                </tr>
            </table>

            <div class="details">
                <table class="table-main">
                    <tr>
                        <th colspan="4" class="employee-details"><b>${company.companyName}</b></th>
                    </tr>
                    <tr>
                        <td colspan="4" id="month-year">Payslip for ${payslipEntity.month}-${payslipEntity.year}</td>
                    </tr>
                    <tr>
                        <th>EmployeeId</th>
                        <td>${employee.employeeId}</td>
                        <th>Name</th>
                        <td>${employee.firstName} ${employee.lastName}</td>
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
                        <th>Bank Name</th>
                        <td>${employee.bankName}</td>
                        <th>Location</th>
                        <td>${employee.location}</td>
                    </tr>
                    <tr>
                        <th>STD Days</th>
                        <td>${payslipEntity.attendance.totalWorkingDays}</td>
                        <th>Worked Days</th>
                        <td>${payslipEntity.attendance.noOfWorkingDays}</td>
                    </tr>
                    <tr>
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
                        <th>Date of Birth</th>
                        <td>${employee.dateOfBirth}</td>
                    </tr>
                </table>
            </div>

            <!-- Earnings and Deductions side by side -->
            <div class="details">
                <table class="table-child">
                    <tr>
                        <th>Earnings (A)</th>
                        <th>Amount (A)</th>
                        <th>Deductions (B)</th>
                        <th>Amount (B)</th>
                    </tr>
                     <tr>
                        <td>Basic Salary</td>
                        <td>${payslipEntity.salary.basicSalary}</td>
                     </tr>
                           <tr>
                               <td class="earnings">
                                   <table>
                                       <#list payslipEntity.salary.allowances as allowanceKey, allowanceValue>
                                           <#if allowanceValue?? && (allowanceValue?is_number || (allowanceValue?is_string && allowanceValue?trim?length > 0))>
                                               <#if allowanceKey != "class">
                                                   <tr>
                                                       <td>${allowanceKey?replace("_", " ")?capitalize}</td> <!-- Field Name -->
                                                   </tr>
                                               </#if>
                                           </#if>
                                       </#list>

                                       <tr>
                                           <td><strong>Total Earnings (A)</strong></td>
                                       </tr>
                                   </table>
                               </td>
                               <td class="amount">
                                   <table id="earnings-amount">
                                       <#list payslipEntity.salary.allowances as allowanceKey, allowanceValue>
                                           <#if allowanceValue?? && (allowanceValue?is_number || (allowanceValue?is_string && allowanceValue?trim?length > 0))>
                                               <#if allowanceKey != "class">
                                                   <tr>
                                                       <td>${allowanceValue}</td> <!-- Amount corresponding to Field Name -->
                                                   </tr>
                                               </#if>
                                           </#if>
                                       </#list>
                                       <tr>
                                           <!-- Basic Salary Amount -->
                                       </tr>
                                       <tr>
                                           <td><strong>${payslipEntity.salary.totalEarnings}</strong></td> <!-- Total Earnings Amount -->
                                       </tr>
                                   </table>
                               </td>
                               <td class="deductions">
                                   <table>
                                       <#list payslipEntity.salary.deductions as deductionKey, deductionValue>
                                           <#if deductionValue?? && (deductionValue?is_number || (deductionValue?is_string && deductionValue?trim?length > 0))>
                                               <#if deductionKey != "class">
                                                   <tr>
                                                       <td>${deductionKey?replace("_", " ")?capitalize}</td> <!-- Deduction Field Name -->
                                                   </tr>
                                               </#if>
                                           </#if>
                                       </#list>
                                       <tr>
                                           <td><strong>Total Deductions (B)</strong></td>
                                       </tr>
                                   </table>
                               </td>
                               <td class="amount">
                                   <table>
                                       <#list payslipEntity.salary.deductions as deductionKey, deductionValue>
                                           <#if deductionValue?? && (deductionValue?is_number || (deductionValue?is_string && deductionValue?trim?length > 0))>
                                               <#if deductionKey != "class">
                                                   <tr>
                                                       <td>${deductionValue}</td> <!-- Amount corresponding to Deduction Field Name -->
                                                   </tr>
                                               </#if>
                                           </#if>
                                       </#list>
                                       <tr>
                                           <td><strong>${payslipEntity.salary.deductions.totalDeductions}</strong></td> <!-- Total Deductions Amount -->
                                       </tr>
                                   </table>
                               </td>
                           </tr>
                     <!-- Net Pay Row -->
                    <tr>
                        <th class="net-border">Net Pay (A-B)</th>
                        <td><strong>${payslipEntity.salary.netSalary}</strong></td>
                    </tr>
                    <tr>
                        <th>Net Salary (In Words)</th>
                        <td colspan="3"><strong>${payslipEntity.inWords}</strong></td>
                    </tr>
                </table>
            </div>

            <div class="text">
                <p><em>This is a computer-generated payslip and does not require authentication.</em></p>
            </div>

            <div class="address">
                <hr />
                <p class="company">
                    Company Address: ${company.companyAddress}<br />
                    Mobile No: ${company.mobileNo}<br />
                    Email ID: ${company.emailId}
                </p>
            </div>
        </div>
    </div>
</body>

</html>