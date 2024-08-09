import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import LayOut from "../../LayOut/LayOut";
import { useNavigate } from "react-router-dom";
import {
  EmployeeGetApi,
  EmployeeGetApiById,
  EmployeePayslipsGet,
  EmployeePayslipDeleteById,
} from "../../Utils/Axios";
import { Eye, XSquareFill } from "react-bootstrap-icons"; 
import { toast, Bounce } from "react-toastify";
import DataTable from "react-data-table-component";
import DeletePopup from "../../Utils/DeletePopup";
const ViewPaySlips = () => {
  const { control, formState: { errors } } = useForm();
  const [employees, setEmployees] = useState([]);
  const [showFields, setShowFields] = useState(false);
  const [employeeSalaryView, setEmployeeSalaryView] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState({});
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPayslipId, setSelectedPayslipId] = useState("");
  const [refreshData, setRefreshData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await EmployeeGetApi();
        const filteredData = data
          .filter((employee) => employee.firstName !== null)
          .map(({ id, firstName, lastName }) => ({
            label: `${firstName} ${lastName}`,
            value: id,
          }));
        setEmployees(filteredData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const currentYear = new Date().getFullYear();
  const startYear = 2000;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => ({
      value: (startYear + index).toString(),
      label: (startYear + index).toString(),
    })
  ).reverse();
  const months = Array.from({ length: 12 }, (_, index) => ({
    value: {
      value: (index + 1).toString().padStart(2, "0"),
      label: new Date(2000, index, 1).toLocaleString("default", {
        month: "long",
      }),
    },
    label: new Date(2000, index, 1).toLocaleString("default", {
      month: "long",
    }),
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedEmployeeId) {
          const [employeeDetailsResponse, payslipsResponse] = await Promise.all(
            [
              EmployeeGetApiById(selectedEmployeeId),
              EmployeePayslipsGet(
                selectedEmployeeId,
                selectedMonth,
                selectedYear
              ),
            ]
          );
          setSelectedEmployeeDetails(employeeDetailsResponse.data);
          setEmployeeSalaryView(payslipsResponse.data.data);
        } else {
          setSelectedEmployeeDetails({});
          setEmployeeSalaryView([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSelectedEmployeeDetails({});
        setEmployeeSalaryView([]);
      }
    };

    fetchData();
  }, [selectedEmployeeId, selectedMonth, selectedYear, refreshData]);

  const handleGoClick = () => {
    if (selectedEmployeeId || selectedMonth || selectedYear)
      setShowSpinner(true);
    setTimeout(() => {
      setShowFields(true);
      setShowSpinner(false);
    }, 2000);
  };

  const handleViewSalary = (employeeId, payslipId) => {
    navigate(`/payslip?employeeId=${employeeId}&payslipId=${payslipId}`, {
      state: {
        employeeDetails: selectedEmployeeDetails, // Pass selected employee details
      },
    });
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
      await EmployeePayslipDeleteById(selectedEmployeeId, selectedPayslipId);
      toast.success("Payslip deleted successfully!", {
        position: "top-right",
        transition: Bounce,
        hideProgressBar: true,
        theme: "colored",
        autoClose: 3000,
      });
      handleCloseDeleteModal();
      setRefreshData(prev => !prev);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const handleApiErrors = (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.message
    ) {
      const errorMessage = error.response.data.error.message;
      toast.error(errorMessage);
    } else {
      toast.error("Network Error !");
    }
    console.error(error.response);
  };
  const columns = [
    {
      name: <h6><b>S No</b></h6>,
      selector: (row, index) => index + 1,
      width: "150px",
    },
    {
      name: <h6><b>Net Amount</b></h6>,
      selector: row => parseFloat(row.salary.netSalary).toFixed(2),
      sortable: true,
      width: "250px",
    },
    {
      name: <h6><b>Month</b></h6>,
      selector: row => row.month,
      sortable: true,
      width: "200px",
    },
    {
      name: <h6><b>Year</b></h6>,
      selector: row => row.year,
      sortable: true,
      width: "200px",
    },
    {
      name: <h6><b>Actions</b></h6>,
      cell: row => (
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
            title="View Payslip"
          >
            <Eye size={22} color="green" />
          </button>
        </div>
      ),
    },
  ];
  return (
    <LayOut>
      <div className="container-fluid p-0">
        <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
          <div className="col">
            <h1 className="h3 mb-3">
              <strong> PaySlips</strong>
            </h1>
          </div>
          <div className="col-auto" style={{ paddingBottom: '20px' }}>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="/main">Home</a>
                </li>
                <li className="breadcrumb-item active">PayRoll</li>
                <li className="breadcrumb-item active">PaySlips</li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="card mb-3">
          <div className="card-body justify-content-around">
            <div className="row d-flex justify-content-around">
              <div className="col-12 col-md-3">
                <div className="form-group">
                  <label className="form-label">Select Employee</label>
                  <Controller
                    name="employeeId"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={employees}
                        value={employees.find((option) => option.value === field.value) || ""}
                        onChange={(val) => {
                          field.onChange(val.value);
                          setSelectedEmployeeId(val.value);
                        }}
                        placeholder="Select Employee"
                      />
                    )}
                  />
                  {errors.employeeId && (
                    <p className="errorMsg">Employee Name is required</p>
                  )}
                </div>
              </div>

              <div className="col-12 col-md-3">
                <div className="form-group">
                  <label className="form-label">Select Year</label>
                  <Select
                    options={years}
                    value={years.find((option) => option.value === selectedYear)}
                    onChange={(selectedOption) => setSelectedYear(selectedOption.value)}
                    placeholder="Select Year"
                  />
                </div>
              </div>

              <div className="col-12 col-md-3">
                <div className="form-group">
                  <label className="form-label">Select Month</label>
                  <Select
                    options={months}
                    value={months.find((option) => option.label === selectedMonth)}
                    onChange={(selectedOption) => setSelectedMonth(selectedOption.label)}
                    placeholder="Select Month"
                  />
                </div>
              </div>

              <div className="col-12 col-md-3 mt-4">
                <div className="form-group">
                  <button
                    type="button"
                    style={{marginTop:"10px"}}
                    className="btn btn-primary btn-block"
                    onClick={handleGoClick}
                    disabled={!selectedEmployeeId || !selectedMonth || !selectedYear}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

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
          <div className="spinner-container" style={{ margin: "15% 0 0 45%" }}>
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        )}
      </div>
    </LayOut>
  );
};
export default ViewPaySlips;