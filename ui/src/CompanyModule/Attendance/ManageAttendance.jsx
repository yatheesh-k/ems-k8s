import React, { useState } from "react";
import LayOut from "../../LayOut/LayOut";
import { AttendanceManagementApi } from "../../Utils/Axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Download } from "react-bootstrap-icons";
import * as XLSX from "xlsx";

const ManageAttendance = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("file", data.attendanceFile[0]); // Assuming single file upload
    try {
      const response = await AttendanceManagementApi(formData);

      if (response.data.path) {
        toast.success(response.data.message);
        reset(); // Reset form after successful submission
      } else {
        toast.error(response.data.error.message);
      }
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
  const exportToExcel = () => {
    const headers = [
      "EmployeeId",
      "First Name",
      "Last Name",
      "EmailId",
      "Month",
      "Year",
      "No of Working Days",
      "Total Working Days",
    ];
    const data = [headers];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Data");

    XLSX.writeFile(wb, "attendance_data.xlsx");
  };

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
          <div className="col">
            <h1 className="h3 mb-3"><strong>Attendance Management</strong></h1>
          </div>
          <div className="col-auto" style={{ paddingBottom: "20px" }}>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="/main">Home</a>
                </li>
                <li className="breadcrumb-item active">Attendance</li>
                <li className="breadcrumb-item active">Manage Attendance</li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title">Manage Attendance</h5>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={exportToExcel}
                >
                  Download Sample Attendance <Download size={20} className="ml-1" />
                </button>
              </div>
              <div className="dropdown-divider" style={{ borderTopColor: "#d7d9dd" }} />
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <div className="row d-flex justify-content-center">
                      <div className="col-6 col-md-6 col-lg-6 mt-3" style={{ maxWidth: "400px" }}>
                        <label className="form-label">Select Attendance File</label>
                        <input
                          className="form-control"
                          type="file"
                          accept=".xlsx"

                          {...register("attendanceFile", {
                            required: "Upload Attendance file",
                          })}
                        />
                        {errors.attendanceFile && (
                          <p className="errorMsg">{errors.attendanceFile.message}</p>
                        )}
                      </div>
                      <div className="col-4 col-md-4 col-lg-4 mt-5">
                        <button
                          type="submit" // Change type to submit to trigger form onSubmit
                          className="btn btn-primary"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayOut>
  );
};

export default ManageAttendance;
