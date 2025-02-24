<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <title>Invoice</title>
    <style>
        body {
            font-family: "Courier New", Courier, monospace;
            margin: 0;
            padding: 0;
            font-size: 20px;
            /* Reduced font size */
        }

        .container-fluid {
            margin-top: 20px;
            padding: 10px;
        }

        .row {
            margin-bottom: 10px;
        }

        .card {
            padding: 20px;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-left {
            text-align: left;
        }

        .font-medium {
            font-weight: 500;
        }

        .m-l-30 {
            margin-left: 30px;
        }

        .font-size-small {
            font-size: small;
        }

        .logo {
            width: 200px;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            right: 0;
            top: -50px;
            /* Adjust this value to move the logo higher */
        }

        .logo img {
            width: 100%;
            height: auto;
            object-fit: contain;
        }

        .table,
        .table th,
        .table td {
            border: 1px solid #ddd;
            border-collapse: collapse;
            padding: 6px;
            font-size: 11px;
            /* Reduced font size */
        }

        .table th {
            background-color: #f2f2f2;
        }

        .table td {
            text-align: right;
        }

        .company-details {
            text-align: right;
        }

        .customer-details {
            text-align: left;
        }

        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }

        .footer h6 {
            margin-top: 20px;
            text-align: left;
        }

        .footer .seal {
            width: 100px;
            height: auto;
            margin-left: 20px;
        }

        .payment-info {
            font-style: italic;
        }

        .company-bank-table td {
            text-align: left;
        }

        .table-responsive {
            margin-top: 20px;
        }

        .col-md-6 {
            width: 20%;
        }

        .col-md-12 {
            width: 100%;
        }

        .invoice-info {
            display: flex;
            justify-content: space-between;
        }
    </style>
</head>

<body>
    <div class="container-fluid">
        <!-- Header Section -->
        <div class="row">
            <div class="col-md-12">
                <!-- Company Logo - Top Right -->
                <div class="company-details" style="position:absolute ; top: -20px; right: 10px;">
                    <#if imageFile??>
                        <img src="${invoice.company.imageFile}" alt="Company Logo" />
                        <#else>
                            <img src="Image" alt="Company Logo" />
                    </#if>
                </div>
            </div>
        </div>
        <!-- Invoice Heading Section -->
        <div style="position: relative; top: 10px; left: 0%; text-align: center;">
            <h3 style="margin: 0;">Invoice</h3> <!-- Removed margin for precise top positioning -->
        </div>

        <div style="position: absolute; top: 0; width: 100%; text-align: left; margin-left: 20px;">
            <h6 style="margin: 0;"><b>Pan Number:</b>${invoice.company.panNo}</h6>
            <h6 style="margin: 0;"><b>GST Number:</b>${invoice.company.gstNo}</h6>
        </div>
        <!-- Customer and Invoice Details Section -->
        <div
            style="position: relative; top: 20px; left: 20px; text-align: left; font-size: 20px; width: 38%; word-wrap: break-word; word-break: break-word; overflow-wrap: break-word;">
            <!-- Customer Details (Left Side) -->
            <div>
                <h6 style="margin: 5px;"><b>Billed To,</b></h6>
                <h6 style="margin: 0;" class="font-medium">${invoice.customer.customerName}</h6>
                <h6 style="margin: 0;"><b>Email:</b> ${invoice.customer.email}</h6>
                <h6 style="margin: 0;"><b>Contact No:</b> ${invoice.customer.mobileNumber}</h6>
                <h6 style="margin: 0;"><b>GST:</b> ${invoice.customer.customerGstNo!0}</h6>
                <h6
                    style="margin: 0; word-wrap: break-word; word-break: break-word; white-space: normal; overflow-wrap: break-word;">
                    <b>Address:</b> ${invoice.customer.address}, ${invoice.customer.state}
                </h6>
            </div>
        </div>
        <div style="position: relative; top: -70px; right: 0; margin-left: auto; text-align: right; font-size: 20px;">
            <div>
                <h6 style="margin: 0;"><b>Invoice Number:</b> ${invoice.invoiceNo}</h6>
                <h6 style="margin: 0;"><b>Invoice Date:</b> ${invoice.invoiceDate}</h6>
                <h6 style="margin: 0;"><b>Due Date:</b> ${invoice.dueDate}</h6>
            </div>
        </div>
        <!-- Product Details Table -->
        <div class="table-responsive" style="margin-left: 10px; position: relative; top: -10px;">
            <table class="table" style="width: 100%;">
                <thead>
                 <tr>
                     <th class="text-center">S.NO</th>

                     <#if invoice.productColumns?? && invoice.productColumns?size gt 0>
                         <#list invoice.productColumns as column>
                             <th class="text-center">${column.title}</th>  <!-- Extract only 'title' -->
                         </#list>
                     </#if>
                 </tr>
                </thead>
                <tbody>
                    <#if invoice.productData?? && invoice.productData?size gt 0>
                           <#list invoice.productData as product>
                               <tr>
                                   <td class="text-center">${product_index + 1}</td>  <!-- Serial Number -->

                                   <#if invoice.productColumns??>
                                       <#list invoice.productColumns as column>
                                           <td class="text-center">${product[column.key]!'-'}</td>  <!-- Get value using key from productColumns -->
                                       </#list>
                                   </#if>
                               </tr>
                           </#list>
                       <#else>
                           <tr>
                               <td colspan="7" style="font-size: 13px;">No orders available.</td>
                           </tr>
                       </#if>
                    <tr style="text-align: right;">
                        <td colspan="6" style="text-align: right; font-size: 13px;"><strong>Total Amount</strong></td>
                        <td style="text-align: right; font-size: 13px;">${invoice.subTotal}</td>
                    </tr>

                 <#assign iGstValue = (invoice.iGst?has_content && invoice.iGst?matches("^[0-9.]+$"))?then(invoice.iGst?number, 0) />
                 <#assign cGstValue = (invoice.cGst?has_content && invoice.cGst?matches("^[0-9.]+$"))?then(invoice.cGst?number, 0) />
                 <#assign sGstValue = (invoice.sGst?has_content && invoice.sGst?matches("^[0-9.]+$"))?then(invoice.sGst?number, 0) />

                 <#if iGstValue gt 0>
                     <tr>
                         <td colspan="6" style="text-align: right; font-size: 13px;"><strong>IGST</strong> (18%)</td>
                         <td>${iGstValue}</td>
                     </tr>
                 <#elseif cGstValue gt 0 && sGstValue gt 0>
                     <tr>
                         <td colspan="6" style="text-align: right; font-size: 13px;"><strong>CGST</strong> (9%)</td>
                         <td>${cGstValue}</td>
                     </tr>
                     <tr>
                         <td colspan="6" style="text-align: right; font-size: 13px;"><strong>SGST</strong> (9%)</td>
                         <td>${sGstValue}</td>
                     </tr>
                 </#if>
               <#assign iGstValue = (iGst??)?then(iGst?number, 0) />
               <#assign cGstValue = (cGst??)?then(cGst?number, 0) />
               <#assign sGstValue = (sGst??)?then(sGst?number, 0) />

               <#if iGstValue gt 0>
                   <tr>
                       <td colspan="6" style="text-align: right; font-size: 13px;"><strong>IGST</strong> (18%)</td>
                       <td>${iGstValue}</td>
                   </tr>
               <#elseif cGstValue gt 0 && sGstValue gt 0>
                   <tr>
                       <td colspan="6" style="text-align: right; font-size: 13px;"><strong>CGST</strong> (9%)</td>
                       <td>${cGstValue}</td>
                   </tr>
                   <tr>
                       <td colspan="6" style="text-align: right; font-size: 13px;"><strong>SGST</strong> (9%)</td>
                       <td>${sGstValue}</td>
                   </tr>
               <#else>
                   <tr>
                       <td colspan="7" style="text-align: right;">GST Not Found</td>
                   </tr>
               </#if>



                    <tr style="background-color:#f5f5f5;">
                        <th class="text-right" colspan="6" style="font-size: 13px;"><b>Grand Total</b></th>
                        <th class="text-right" style="font-size: 13px;"><b>${invoice.grandTotal}</b></th>
                    </tr>
                    <tr>
                        <th colspan="7" class="text-center" style="font-size: 13px;">The Payment should be made
                            favouring <b>${invoice.company.companyName}</b> or Direct deposit information given above.</th>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="position: relative; bottom: -20px; left: 10px; text-align: left; font-size: 15px;">
            <!-- Customer Details (Left Side) -->
            <div>
              <#if invoice.bank??>
                  <tr>
                      <td style="font-weight: bold;">Bank Name</td>
                      <td>${invoice.bank.bankName! ''}</td>
                  </tr>
                  <tr>
                      <td style="font-weight: bold;">Account Type</td>
                      <td>${invoice.bank.accountType! ''}</td>
                  </tr>
                  <tr>
                      <td style="font-weight: bold;">Account No</td>
                      <td>${invoice.bank.accountNumber! ''}</td>
                  </tr>
                  <tr>
                      <td style="font-weight: bold;">IFSC Code</td>
                      <td>${invoice.bank.ifscCode! ''}</td>
                  </tr>
                  <tr>
                      <td style="font-weight: bold;">Branch</td>
                      <td>${invoice.bank.branch! ''}</td>
                  </tr>
              <#else>
                  <tr>
                      <td colspan="2" style="font-size: 13px;">No bank details available.</td>
                  </tr>
              </#if>


            </div>
        </div>
        <!-- Authorized Signature and Seal -->
        <div style="position: relative; bottom: -10px; right: 0; text-align: right;">
            <div class="row">
                <div class="footer-content"
                    style="display: flex; align-items: center; justify-content: flex-end; text-align: right;">
                    <h6 style="margin: 0; font-weight: bold;">${invoice.company.companyName}</h6>
                    <#if stampImage?? && stampImage !="">
                        <img style="margin: -5; width: 100px; height:150px; margin-right: 40px; height: auto;"
                            src="${invoice.company.imageFile}" alt="Seal" />
                        <h6 style="margin: 0; font-weight: bold;">Authorized Signature:</h6>
                        <#else>
                            <p style="font-size: 13px; color: gray;">No authorized signature available.</p>
                    </#if>
                </div>
            </div>
        </div>
        <div style="position: absolute; bottom: -130px; width: 100%;  text-align: center;">
            <b style="display: inline-block; margin-bottom: 5px;">${invoice.company.cinNo!''}</b>
            <div style="border-top: 1px solid #ccc;">
                <h6
                    style="margin: 0; word-wrap: break-word; word-break: break-word; white-space: normal; text-align: center;">
                    <b>${invoice.company.companyName}</b>
                </h6>
               <h6 style="margin: 0; word-wrap: break-word; word-break: break-word; white-space: normal; width: 100%; text-align: left; margin-left: 20px;">
                   <b>${invoice.company.companyAddress}</b><br/>
                   <b>${invoice.company.mobileNo}</b><br/>
                   <b>${invoice.company.emailId}</b>
               </h6>

            </div>
        </div>
    </div>
</body>

</html>