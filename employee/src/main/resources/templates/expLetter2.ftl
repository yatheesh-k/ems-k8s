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
        .content {
            margin: 20px;
        }
        .responsibilities {
            margin-top: 20px;
            list-style-type: disc;
            margin-left: 40px;
        }
    </style>
</head>
<body>

    <div class="watermark">
        <img src="${blurredImage}" alt="Blurred Company Logo" />
    </div>

    <div class="logo">
        <img style="height: 120px; width: 120px;" src="${request.image}" alt="Company Logo" />
    </div>

    <div class="header"><b>EXPERIENCE CERTIFICATE</b></div>
    <div class="date">Date: <b>${request.date}</b></div>
    <div class="title"><b>TO WHOMSOEVER IT MAY CONCERN</b></div>
    <div class="content">
        <p>It is to certify that ${employee.firstName} ${employee.lastName}, was employed at ${company[0].companyName}from
           ${employee.dateOfHiring} to ${request.date} as a
           <#if employee.designationName?has_content>
               ${employee.designationName}
           <#else>
               null
           </#if>
           with the period of 4 months and 18 days.
        </p>
        <p>As a {employee.designation}, {employee.firstName} performed the following responsibilities:</p>
        <ul class="responsibilities">
            <li>Designing and architecting the backend systems based on requirements and scalability needs.</li>
            <li>Writing clean, efficient, and maintainable code using Java and related technologies like Spring Framework, Hibernate, etc.</li>
            <li>Designing and implementing database schemas, writing SQL queries, and managing database interactions.</li>
            <li>Creating RESTful APIs to facilitate communication between the frontend and backend systems.</li>
            <li>Implementing security measures such as authentication, authorization, and data encryption to protect the backend systems from unauthorized access and attacks.</li>
            <li>Documenting code, APIs, and system architecture for other developers and for future reference.</li>
            <li>Deploying backend applications to production environments, monitoring system performance, and handling bug fixes and updates as needed.</li>
            <li>Working closely with frontend developers, designers, and other stakeholders to ensure smooth integration and functionality of the entire application.</li>
        </ul>
        <p>We are sure that their hard work will help them to excel in whatever they choose to do next in their life. They have shown good commitment throughout their time with our company. We wish him all the best in his future endeavours.</p>

        <div>For ${company[0].companyName}</div>

        <div style="margin-top:100px">Authorized Signature</div>
    </div>
</body>
</html>
