import React, { useEffect, useState } from 'react';
import { EmployeeSalaryGetApi } from '../../Utils/Axios';
import { useLocation } from 'react-router-dom';
import LayOut from '../../LayOut/LayOut';
import { ChevronRight } from 'react-bootstrap-icons';

const EmployeeSalaryList = () => {
  const [employeeSalaryView, setEmployeeSalaryView] = useState([]);
  const [expanded, setExpanded] = useState({});
  const location = useLocation();
  const { id } = location.state || {};

  useEffect(() => {
    if (id) {
      EmployeeSalaryGetApi(id).then(response => {
        setEmployeeSalaryView(response.data.data);
      });
    }
  }, [id]);

  const toggleExpand = (index) => {
    setExpanded(prevState => ({ ...prevState, [index]: !prevState[index] }));
  };

  return (
    <LayOut>
      <div className="container mt-4">
        <h1 className="mb-4">Employee Salary List</h1>
        {employeeSalaryView.length > 0 ? (
          employeeSalaryView.map((item, index) => (
            <div key={index} className="card mb-3">
              <div className="card-header d-flex justify-content-between align-items-center" onClick={() => toggleExpand(index)} style={{ cursor: 'pointer' }}>
                <h5 className="mb-0"> {index + 1}. Net Salary: {item.netSalary}</h5>
                <ChevronRight size={18} />
              </div>
              {expanded[index] && (
                <div className="card-body">
                  <div className="row mb-3">
                    <div>
                      <h3>Salary</h3>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>Fixed Amount:</label>
                        <input type="text" className="form-control" value={item.fixedAmount} readOnly />
                      </div>
                    </div>
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>Variable Amount:</label>
                        <input type="text" className="form-control" value={item.variableAmount} readOnly />
                      </div>
                    </div>
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>Gross Amount:</label>
                        <input type="text" className="form-control" value={item.grossAmount} readOnly />
                      </div>
                    </div>
                  </div>
                  <hr/>
                  <div className="row mb-3">
                    <div className="col mb-1">
                      <h3>Allowances</h3>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>Travel Allowance:</label>
                        <input type="text" className="form-control" value={item.allowances.travelAllowance} readOnly />
                      </div>
                    </div>
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>PF Contribution (Employee):</label>
                        <input type="text" className="form-control" value={item.allowances.pfContributionEmployee} readOnly />
                      </div>
                    </div>
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>HRA:</label>
                        <input type="text" className="form-control" value={item.allowances.hra} readOnly />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>Special Allowance:</label>
                        <input type="text" className="form-control" value={item.allowances.specialAllowance} readOnly />
                      </div>
                    </div>
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>Other Allowances:</label>
                        <input type="text" className="form-control" value={item.allowances.otherAllowances} readOnly />
                      </div>
                    </div>
                    <div className="col-12 mb-3">
                      <div className="form-group">
                        <label>Total Earnings:</label>
                        <input type="text" className="form-control" value={item.totalEarnings} readOnly />
                      </div>
                    </div>
                  </div>
                  <hr/>
                  <div className="row mt-4 mb-3">
                    <div className="col mb-1">
                      <h3>Deductions</h3>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>PF (Employee):</label>
                        <input type="text" className="form-control" value={item.deductions.pfEmployee} readOnly />
                      </div>
                    </div>
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>PF (Employer):</label>
                        <input type="text" className="form-control" value={item.deductions.pfEmployer} readOnly />
                      </div>
                    </div>
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>LOP:</label>
                        <input type="text" className="form-control" value={item.deductions.lop} readOnly />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>PF Tax:</label>
                        <input type="text" className="form-control" value={item.deductions.pfTax} readOnly />
                      </div>
                    </div>
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>Income Tax:</label>
                        <input type="text" className="form-control" value={item.deductions.incomeTax} readOnly />
                      </div>
                    </div>
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>Total Tax:</label>
                        <input type="text" className="form-control" value={item.deductions.totalTax} readOnly />
                      </div>
                    </div>
                  </div>
                  <hr/>
                  <div className="row mt-4 mb-3">
                    <div className="col mb-1">
                      <h3>Net Amount</h3>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col mb-3">
                      <div className="form-group">
                        <input type="text" className="form-control" value={item.netSalary} readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No salary data available.</p>
        )}
      </div>
    </LayOut>
  );
};

export default EmployeeSalaryList;
