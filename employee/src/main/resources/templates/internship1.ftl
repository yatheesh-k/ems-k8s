<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Internship Certificate</title>
    <style>
        .logo {
            text-align: right;
        }

        .logo img {
            max-width: 60px;
            height: 100px;
            margin-right: 5px;
            margin-bottom: 20px;
            margin-top: -10px;
        }

        .internship-text {
            text-align: center;
            /* Center the text */
            font-weight: bold;
            /* Make the text bold */
            font-size: 30px;
            margin-top: 70px;
            /* Adjust the font size if needed */
        }

        .date-info h5 {
            text-align: left;
            font-size: 15px;
        }

        .watermark {
            position: fixed;
            top: 40%;
            left: 20%;
            transform: translate(-50%, -50%) rotate(30deg);
            z-index: -1;
            width: 400px;
            height: auto;
            text-align: center;
        }

        .watermark img {
            width: 100%;
            height: auto;
            opacity: 0.05;
        }
        .details {
            font-size: 19px; /* Set your desired font size */
        }
    </style>
</head>

<body>
    <img src="${blurredImage}" alt="Company Logo" class="watermark" />
    <div class="logo">
        <img src="${company.imageFile}" alt="Company Logo" />
    </div>

    <h5 class="internship-text">Internship Experience Certificate</h5>
    <div class="date-info">
        <h5>Date: ${internship.date}</h5>
    </div>
    <h5 style="text-align:center; font-size: 15px;">TO WHOMSOEVER IT MAY CONCERN</h5>

    <div class = "details">
        <p>This letter is to certify that <b>${internship.employeeName}</b> has successfully completed his internship program of ${internship.period} in our
            organization’s <b>${internship.department}</b>.</p>
        <p>
            His internship tenure was from <b>${internship.startDate}</b> to <b>${internship.endDate}</b>.
        </p>
        <p>
            He has worked on a project titled <b>“${internship.projectTitle}”</b>. This project was aimed to launch
            petroleum products online. As part of the project, he has involved web development, as part of development
            he designed user interface screens, banners, mailers based on the design briefs.
        </p>
        <p>
            During his internship, he has demonstrated his skills with self-motivation to learn new skills. His
            performance exceeded our expectations and he was able to complete the project on time.
        </p>
        <p>
            We wish him all the success in his future endeavours.
        </p>
        <p style="margin-top: 50px;">For <span style="font-weight: bold; text-transform: uppercase;">${company.companyName}</span></p>
        <p style="margin-top: 110px;">Authorized Signature</p>
    </div>

</body>

</html>