import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewPDFs = () => {
  const [pdfUrls, setPdfUrls] = useState([]);

  useEffect(() => {
    // Fetch PDF URLs from the API
    axios.get(`http://192.168.1.163:8092/payslip/image/{employeeId}/{id}`)
      .then(response => {
        setPdfUrls(response.data); // Assuming the API returns an array of URLs
      })
      .catch(error => {
        console.error('Error fetching PDF URLs:', error);
      });
  }, []);

  return (
    <div>
      {pdfUrls.map((pdfUrl, index) => (
        <div key={index} className="pdf-container">
          <iframe
            src={pdfUrl}
            title={`PDF Viewer ${index + 1}`}
            width="100%"
            height="500px"
            style={{ border: 'none' }}
          ></iframe>
        </div>
      ))}
    </div>
  );
};

export default ViewPDFs;
