import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import LayOut from "../LayOut/LayOut";
import { useNavigate } from "react-router-dom";
import { Eye, XSquareFill } from "react-bootstrap-icons";
import { toast, Bounce } from "react-toastify";
import DataTable from "react-data-table-component";
import DeletePopup from "../Utils/DeletePopup";
import { EmployeePayslipGetById, EmployeePayslipDeleteById, EmployeePayslipsGet } from "../Utils/Axios";
import { userId } from "../Utils/Auth";

const EmployeePayslips = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [employees, setEmployees] = useState([]);
  const [showFields, setShowFields] = useState(false);
  const [employeeSalaryView, setEmployeeSalaryView] = useState([]);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState({});
  const [showSpinner, setShowSpinner] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPayslipId, setSelectedPayslipId] = useState("");
  const [refreshData, setRefreshData] = useState(false);

  const navigate = useNavigate();
  const id = userId;

  useEffect(() => {
    const fetchEmployeePayslips = async () => {
      try {
        const response = await EmployeePayslipsGet(id);
        setEmployeeSalaryView(response.data);
      } catch (error) {
        handleApiErrors(error);
      }
    };

    fetchEmployeePayslips();
  }, [id, refreshData]);

  const handleGoClick = () => {
    setShowSpinner(true);

    setTimeout(() => {
      setShowFields(true);
      setShowSpinner(false);
    }, 2000);
  };

  const handleViewSalary = async (employeeId, payslipId) => {
    try {
      const response = await EmployeePayslipGetById(employeeId, payslipId);
      setSelectedEmployeeDetails(response.data);
      navigate(`/payslip?employeeId=${employeeId}&payslipId=${payslipId}`, {
        state: {
          employeeDetails: response.data,
        },
      });
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedPayslipId("");
  };

  const handleShowDeleteModal = (payslipId) => {
    setSelectedPayslipId(payslipId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await EmployeePayslipDeleteById(id, selectedPayslipId);
      toast.success("Payslip deleted successfully!", {
        position: "top-right",
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 3000,
      });
      handleCloseDeleteModal();
      setRefreshData((prev) => !prev); // Toggle refreshData state
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const handleApiErrors = (error) => {
    if (error.response) {
      const status = error.response.status;
      let errorMessage = "";

      switch (status) {
        case 403:
          errorMessage = "Session TimeOut !";
          navigate("/");
          break;
        case 404:
          errorMessage = "Resource Not Found !";
          break;
        case 406:
          errorMessage = "Invalid Details !";
          break;
        case 500:
          errorMessage = "Server Error !";
          break;
        default:
          errorMessage = "An Error Occurred !";
          break;
      }

      toast.error(errorMessage, {
        position: "top-right",
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 3000,
      });
    } else {
      toast.error("Network Error !", {
        position: "top-right",
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 3000,
      });
    }
    console.error(error.response);
  };

  const columns = [
    {
      name: (
        <h6>
          <b>S No</b>
        </h6>
      ),
      selector: (row, index) => index + 1,
      width: "150px",
    },
    {
      name: (
        <h6>
          <b>Net Amount</b>
        </h6>
      ),
      selector: (row) => parseFloat(row.salary.netSalary).toFixed(2),
      sortable: true,
    },
    {
      name: (
        <h6>
          <b>Month</b>
        </h6>
      ),
      selector: (row) => row.month,
      sortable: true,
    },
    {
      name: (
        <h6>
          <b>Year</b>
        </h6>
      ),
      selector: (row) => row.year,
      sortable: true,
    },
    {
      name: (
        <h6>
          <b>Actions</b>
        </h6>
      ),
      cell: (row) => (
        <div>
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: "transparent",
              border: "none",
              padding: "0",
              marginLeft: "5px",
            }}
            onClick={() => handleViewSalary(row.employeeId, row.payslipId)}
          >
            <Eye size={22} color="green" />
          </button>
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: "transparent",
              border: "none",
              padding: "0",
              marginLeft: "5px",
            }}
            onClick={() => handleShowDeleteModal(row.payslipId)}
          >
            <XSquareFill size={22} color="#da542e" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <h1 className="mb-4">Employee Payslip List</h1>

        {showFields && employeeSalaryView.length > 0 && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mt-2">
                {" "}
                Payslip Details:
                {`${selectedEmployeeDetails.firstName} ${selectedEmployeeDetails.lastName}`}{" "}
              </h5>
              <div
                className="dropdown-divider"
                style={{ borderTopColor: "#d7d9dd" }}
              />
              <DataTable
                columns={columns}
                data={employeeSalaryView}
                pagination
                highlightOnHover
                pointerOnHover
                fixedHeader
                responsive
                dense
                noHeader
              />
            </div>
          </div>
        )}

        {showFields && employeeSalaryView.length === 0 && (
          <div className="alert alert-info mt-4">
            No payslips found for this employee.
          </div>
        )}

        <DeletePopup
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleConfirm={handleDelete}
          id={selectedPayslipId}
          pageName="Payslip"
        />

        {showSpinner && (
          <div className="spinner-container">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        )}
      </div>
    </LayOut>
  );
};

export default EmployeePayslips;
