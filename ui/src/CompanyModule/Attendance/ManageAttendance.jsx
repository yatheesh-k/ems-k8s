import React, { useState } from 'react';
import LayOut from '../../LayOut/LayOut';
import { AttendanceManagementApi } from '../../Utils/Axios';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

const ManageAttendance = () => {
  const {
    register,
    formState: { errors },
    reset
  } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await AttendanceManagementApi(formData);
      toast.success('Attandance added Successfully.');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to Add Attandence.');
    }
  };

  return (
    <LayOut>
      <div className="container-fluid p-0">
        <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
          <div className="col">
            <h1 className="h3 mb-3">
              <strong>Attendance Management</strong>
            </h1>
          </div>
          <div className="col-auto" style={{ paddingBottom: '20px' }}>
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
              <div className="card-header">
                <h5 className="card-title">Manage Attendance</h5>
                <div className="dropdown-divider" style={{ borderTopColor: '#d7d9dd' }} />
                <div className="card-body" style={{ padding: '0 0 0 25%' }}>
                  <div className="mb-4">
                    <div className="row align-items-center">
                      <div className="col-6 col-md-6 col-lg-6 mt-3" style={{ width: '400px' }}>
                        <label className="form-label">Select Attendance File</label>
                        <input
                          className="form-control"
                          type="file"
                          accept=".xlsx" // Only allow .xlsx files
                          onChange={handleFileChange}
                          // {...register("attendanceFile", { // Changed from "firstName" to "attendanceFile"
                          //   required: "Attendance file is required",
                          //   validate: {
                          //     isValidFile: (value) => {
                          //       const file = value[0]; // Access the first file
                          //       return file && file.name.endsWith('.xlsx') || "Please upload a valid .xlsx file";
                          //     }
                          //   },
                          // })}
                        />
                        {errors.attendanceFile && ( 
                          <p className="errorMsg">{errors.attendanceFile.message}</p>
                        )}
                      </div>

                      <div className="col-6 col-md-6 col-lg-6 mt-5">
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayOut>
  );
};

export default ManageAttendance;