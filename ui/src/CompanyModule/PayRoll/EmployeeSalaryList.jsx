import React, { useEffect, useState } from 'react';
import { EmployeeSalaryGetApi, EmployeeSalaryPatchApiById } from '../../Utils/Axios';
import { useLocation, useNavigate } from 'react-router-dom';
import LayOut from '../../LayOut/LayOut';
import { PencilSquare } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../Context/AuthContext';
import { company } from '../../Utils/Auth';

const EmployeeSalaryList = () => {
  const { handleSubmit, reset, register } = useForm({ mode: "onChange" });
  const { user } = useAuth("");
  const [employeeSalaryView, setEmployeeSalaryView] = useState([]);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [editingId, setEditingId] = useState("");
  const [salaryId, setSalaryId] = useState("");
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    if (id) {
      EmployeeSalaryGetApi(id).then(response => {
        setEmployeeSalaryView(response.data.data);
        // Assuming the response has a salaryId field
        if (response.data.data.length > 0) {
          setSalaryId(response.data.data[0].salaryId);  // Adjust this based on your response structure
        }
      });
    }
  }, [id]);

  const companyName = localStorage.getItem("company");

  const onSubmit = async (data) => {
    try {
      const { fixedAmount, variableAmount, grossAmount, allowances, deductions, netSalary } = data;
  
      if (!id || !salaryId) {
        toast.error("Employee ID or Salary ID is missing.");
        return;
      }
  
      const formData = {
        companyName,
        fixedAmount,
        variableAmount,
        grossAmount,
        allowances,
        deductions,
        netSalary
      };

      console.log("FormData:", formData);
  
      await EmployeeSalaryPatchApiById(id, salaryId, formData);
  
      toast.success('Salary Updated Successfully');
      reset();
      setEditingId(null);
    } catch (error) {
      handleApiErrors(error);
    }
  };

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
                <PencilSquare size={22} color='#2255a4' />
              </div>
              {expanded[index] && (
                <div className="card-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" name="id" value={id} ref={register()} />
                    <input type="hidden" name="salaryId" value={salaryId} ref={register()} />

                    <div className="row">
                      <div className="col mb-3">
                        <div className="form-group">
                          <label>Fixed Amount:</label>
                          <input type="text" className="form-control" defaultValue={item.fixedAmount} {...register('fixedAmount')} />
                        </div>
                      </div>
                      <div className="col mb-3">
                        <div className="form-group">
                          <label>Variable Amount:</label>
                          <input type="text" className="form-control" defaultValue={item.variableAmount} {...register('variableAmount')} />
                        </div>
                      </div>
                      <div className="col mb-3">
                        <div className="form-group">
                          <label>Gross Amount:</label>
                          <input type="text" className="form-control" defaultValue={item.grossAmount} readOnly />
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
                          <input type="text" className="form-control" defaultValue={item.basicSalary} readOnly />
                        </div>
                      </div>
                      <div className="col mb-3">
                        <div className="form-group">
                          <label>Travel Allowance:</label>
                          <input type="text" className="form-control" defaultValue={item.allowances.travelAllowance} {...register('allowances.travelAllowance')} />
                        </div>
                      </div>
                      <div className="col mb-3">
                        <div className="form-group">
                          <label>HRA:</label>
                          <input type="text" className="form-control" defaultValue={item.allowances.hra} {...register('allowances.hra')} />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col mb-3">
                        <div className="form-group">
                          <label>Special Allowance:</label>
                          <input type="text" className="form-control" defaultValue={item.allowances.specialAllowance} {...register('allowances.specialAllowance')} />
                        </div>
                      </div>
                      <div className="col mb-3">
                        <div className="form-group">
                          <label>Other Allowances:</label>
                          <input type="text" className="form-control" defaultValue={item.allowances.otherAllowances} {...register('allowances.otherAllowances')} />
                        </div>
                      </div>
                      <div className="col-12 mb-3">
                        <div className="form-group">
                          <label>Total Earnings:</label>
                          <input type="text" className="form-control" defaultValue={item.totalEarnings} readOnly />
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
                          <input type="text" className="form-control" defaultValue={item.deductions.pfEmployee} {...register('deductions.pfEmployee')} />
                        </div>
                      </div>
                      <div className="col mb-3">
                        <div className="form-group">
                          <label>PF (Employer):</label>
                          <input type="text" className="form-control" defaultValue={item.deductions.pfEmployer} {...register('deductions.pfEmployer')} />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col mb-3">
                        <div className="form-group">
                          <label>PF Tax:</label>
                          <input type="text" className="form-control" defaultValue={item.deductions.pfTax} readOnly />
                        </div>
                      </div>
                      <div className="col mb-3">
                        <div className="form-group">
                          <label>Income Tax:</label>
                          <input type="text" className="form-control" defaultValue={item.deductions.incomeTax} readOnly />
                        </div>
                      </div>
                      <div className="col mb-3">
                        <div className="form-group">
                          <label>Total Tax:</label>
                          <input type="text" className="form-control" defaultValue={item.deductions.totalTax} readOnly />
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
                          <input type="text" className="form-control" defaultValue={item.netSalary} readOnly />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 text-end" style={{ marginTop: "60px" }}>
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </div>
                  </form>
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
