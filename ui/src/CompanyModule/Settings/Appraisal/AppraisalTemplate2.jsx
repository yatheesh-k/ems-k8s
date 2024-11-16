import React from 'react';

const AppraisalTemplate2 = ({
        companyLogo,
        companyAddress,
        companyName,
        contactNumber,
        mailId,
        employeeName,
        designation,
        employeeId,
        effectiveDate,
        salaryIncrease,
        allowances,
    
}) => {


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
    <div
        className="row justify-content-start"
        style={{
        position: "relative",
        top: "10px",  
        left:"20px", 
        zIndex: 10,
        }}
    >
    <img
      src={companyLogo}
      alt="Logo"
      style={{
        height: "70px",
        width: "160px",
        objectFit: "contain",   
      }}
    />
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
      <strong>{employeeName}</strong>
    </p>
    <p>
      <strong>{employeeId}</strong>
    </p>
    <p>
      Designation:<strong>{designation}</strong>
    </p>
  </div>
  <div className="col-6">
    <p className="mb-0 text-end">{new Date().toLocaleDateString()}</p>
  </div>
</div>
  
  {/* Content div */}
  <div
    style={{
      position: "relative",
      zIndex: 2, 
      backgroundColor: "rgba(255, 255, 255, 0.8)", 
      backdropFilter: "blur(2px)",     }}
  >
    <p className="p-2">
      Sub:<strong>Increament of Salary</strong>
    </p>
    <p className="p-2">
      Dear<strong>{employeeName}</strong>
    </p>

    <p>
      We would like to congratulate you on completion of One year period with us. We are pleased to inform you of your salary increase effective from{" "}
      <strong>{effectiveDate}</strong>. The amount of your salary increase is <strong>Rs. {salaryIncrease} pa</strong>. We understand this is a sustainable increase in your pay and we appreciate your hard work and dedication to the company. All other T&C are the same as per the original offer letter.
    </p>
    <table className="table border-collapse mb-5">
          <thead>
            <tr className='text-center'>
              <th>Particulars</th>
              <th>Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
  {allowances && Object.keys(allowances).map((key, index) => {
    const value = allowances[key];
    let allowanceAmount = 0;

    // Ensure salaryIncrease is a valid number
    if (isNaN(salaryIncrease)) {
      console.error('Invalid salaryIncrease value');
      return null; // Stop rendering if salaryIncrease is invalid
    }

    // Check if the value contains a '%' (percentage)
    if (typeof value === 'string' && value.includes('%')) {
      // Remove any spaces and the '%' character, then parse the number
      const percentageString = value.replace('%', '').trim(); // Clean the string
      const percentageValue = parseFloat(percentageString); // Parse the numeric value

      // Check if the percentage value is a valid number
      if (!isNaN(percentageValue)) {
        // Calculate the allowance as percentage of salaryIncrease
        allowanceAmount = (salaryIncrease * (percentageValue / 100));
      } else {
        allowanceAmount = 0; // If percentageValue is not valid, set allowanceAmount to 0
      }
    } else {
      // Otherwise, treat the value as a fixed amount (convert to number directly)
      allowanceAmount = parseFloat(value); // Convert fixed amount string to number
    }

    // Round the allowanceAmount to the nearest integer (if it's a valid number)
    const roundedAllowance = !isNaN(allowanceAmount) ? Math.round(allowanceAmount) : 0;

    return (
      <tr key={index}>
        <td>{key}</td>
        <td>{roundedAllowance}</td> {/* Display the rounded allowance amount */}
      </tr>
    );
  })}

  {/* Add a row for Gross Salary after the allowances */}
  {salaryIncrease && !isNaN(salaryIncrease) && (
    <tr>
      <td><strong>Gross Salary</strong></td>
      <td><strong>{Math.round(salaryIncrease)}</strong></td>
    </tr>
  )}
</tbody>
        </table>

    <p>
      We appreciate your initiative and expect you to take many more such responsibilities in future assignments to ensure company’s growth.
    </p>

    <div className="mt-5 pt-3">
      <p className="mb-5">With Best Wishes,</p>
      <div className="mt-5 pt-5">
        <p>Authorized Signature</p>
        <h4>{companyName},</h4>
        <p>{contactNumber} | {mailId},</p>
        <p>{companyAddress}.</p>
      </div>
    </div>
  </div>
</div>

    );
}

export default AppraisalTemplate2;
