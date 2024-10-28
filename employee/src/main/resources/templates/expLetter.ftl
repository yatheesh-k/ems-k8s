<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Experience Certificate</title>
    <style>
        body {
            position: relative;
        }
         .watermark {
                    position: absolute;
                    top: 40%;
                    left: 15%; /* Move watermark to the left side */
                    transform: translateY(-10%); /* Adjust vertical position if needed */
                    opacity: 0.9; /* Adjust the opacity for visibility */
                    z-index: -1; /* Make sure the watermark is behind other content */
         }
        .header {
            text-align: center;
            margin-top: 20px;
        }
        .logo {
            text-align: right;
            padding: 20px;
            background-size: contain;
        }
        .date {
            margin: 30px 0px 0px 20px;
        }
        .title {
            margin-top: 30px;
            text-align: center;
        }
    </style>
</head>
<body>

    <div class="watermark">
    <img src="${blurredImage}" alt="Blurred Company Logo" />
    </div>

    <div class="logo">
        <img style="height: 120px; width: 120px; " src="${request.image}" alt="Company Logo" />
    </div>

    <div class="header"><b>EXPERIENCE CERTIFICATE</b></div>
    <div class="date">Date: <b>${request.date}</b></div>
    <div class="title"><b>TO WHOMSOEVER IT MAY CONCERN</b></div>
    <div class="content">
        <p>This is to certify that ${employee.firstName} was employed with our company ${company[0].companyName} from ${employee.dateOfHiring} to ${request.date}
        <#if employee.designationName?has_content>
            as a ${employee.designationName}.
        </#if>
        </p>
        <p>We found ${employee.firstName} to be very dedicated to the work assigned. He was result-oriented, professional, and sincere. He carries excellent interpersonal skills and knowledge which helped in completing many valuable business assignments. He is a true team player and a fun-loving individual who mixed well with both his seniors and juniors.</p>
        <p>We wish him all the best for future ventures. Please feel free to contact us for any other information required.</p>

        <div>For company ${company[0].companyName}</div>

         <div style="margin-top:100px">Authorized Signature</div>
    </div>
</body>
</html>
