import React, { useEffect, useState } from 'react';
import { EmployeeSalaryGetApi } from '../../Utils/Axios';
import { useLocation, useNavigate } from 'react-router-dom';
import LayOut from '../../LayOut/LayOut';
import { ChevronRight } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

const EmployeeSalaryList = () => {
  const [employeeSalaryView, setEmployeeSalaryView] = useState([]);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  useEffect(() => {
    if (id) {
      EmployeeSalaryGetApi(id).then(response => {
        setEmployeeSalaryView(response.data.data);
      })
    }
  }, [id]);

  const handleApiErrors = (error) => {
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
      const errorMessage = error.response.data.error.message;
      toast.error(errorMessage);
    } else {
      toast.error("Network Error !");
    }
    console.error(error.response);
  };

  const toggleExpand = (index) => {
    setExpanded(prevState => ({ ...prevState, [index]: !prevState[index] }));
  };

  const handleNavigateToRegister = () => {
    navigate('/employeeSalaryStructure');
  };

  return (
    <LayOut>
      <div className="container mt-4">
        <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
          <div className="col">
            <h1 className="h3 mb-3"><strong>Employee Salary List</strong> </h1>
          </div>
          <div className="col-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="/main">Home</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/employeeView">Employee View</a>
                </li>
                <li className="breadcrumb-item active">
                  Employee Salary List
                </li>
              </ol>
            </nav>
          </div>
        </div>
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
                  <hr />
                  <div className="row mb-3">
                    <div className="col mb-1">
                      <h3>Allowances</h3>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>Basic Salary:</label>
                        <input type="text" className="form-control" value={item.basicSalary} readOnly />
                      </div>
                    </div>
                    <div className="col mb-3">
                      <div className="form-group">
                        <label>Travel Allowance:</label>
                        <input type="text" className="form-control" value={item.allowances.travelAllowance} readOnly />
                      </div>
                    </div>
                    {/* <div className="col mb-3">
                      <div className="form-group">
                        <label>PF Contribution (Employee):</label>
                        <input type="text" className="form-control" value={item.allowances.pfContributionEmployee} readOnly />
                      </div>
                    </div> */}
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
                  <hr />
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
                  <hr />
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
          <div className='text-center mt-5'>
            <button className="btn btn-primary" onClick={handleNavigateToRegister}>Go to Salary Register</button>
            <p className='mt-2 fw-bold'>No salary data available.</p>
          </div>
        )}
      </div>
    </LayOut>
  );
};
export default EmployeeSalaryList;