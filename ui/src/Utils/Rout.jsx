import React from 'react'
import { Route, Routes } from 'react-router';
import EmsLogin from '../Login/EmsLogin';
import CompanyLogin from '../Login/CompanyLogin';
import CompanyRegistration from '../EMS Module/Company/CompanyRegistration';
import Body from '../LayOut/Body';
import CompanyView from '../EMS Module/Company/CompanyView';
import Department from '../Company Module/Department/Department';
import Designation from '../Company Module/Designation/Designation';
import EmployeeRegistration from '../Company Module/Employee/EmployeeRegistration';
import EmployeeView from '../Company Module/Employee/EmployeeView';
import ExistsEmpRegistration from '../Company Module/Existing Process/ExistsEmpRegistration';
import ExistsEmployeeView from '../Company Module/Existing Process/ExistsEmployesView';
import EmployeeSalaryStructure from '../Company Module/PayRoll/EmployeeSalaryStructure';
import GeneratePaySlip from '../Company Module/PayRoll/GeneratePaySlips';
import ViewPaySlips from '../Company Module/PayRoll/ViewPaySlips';
import AddIncrement from '../Company Module/PayRoll/Hike/AddIncrement';
import ViewIncrement from '../Company Module/PayRoll/Hike/ViewIncrementList';
import ManageAttendance from '../Company Module/Attendance/ManageAttendance';
import AttendanceList from '../Company Module/Attendance/AttendanceList';
import AttendanceReport from '../Company Module/Attendance/AttendanceReport';
import EmployeePayslips from '../Employee Module/EmployeePayslips';
import OfferLetter from '../Employee Module/OfferLetter';
import PaySlipLetter from '../Employee Module/PaySlipLetter';
import HikeLetter from '../Employee Module/HikeLetter';
import ExistingLetter from '../Employee Module/ExistingLetter';
import CompanySalaryStructure from '../Company Module/PayRoll/CompanySalaryStructure';
import EmployeeSalaryList from '../Company Module/PayRoll/EmployeeSalaryList';




const Rout = () => {
  return (
<Routes>
    <Route path='/emsAdmin/login' element={<EmsLogin/>}></Route>
    <Route path='/company/login' element={<CompanyLogin/>}></Route>
    <Route path='/main' element={<Body/>}></Route>
    <Route path='/companyRegistration' element={<CompanyRegistration/>}></Route>
    <Route path='/companyView' element={<CompanyView/>}></Route>
    <Route path='/department' element={<Department/>}></Route>
    <Route path='/designation' element={<Designation/>}></Route>
    <Route path='/employeeRegistration' element={<EmployeeRegistration/>}></Route>
    <Route path='/employeeView' element={<EmployeeView/>}></Route>
    <Route path='/existingProcess' element={<ExistsEmpRegistration/>}></Route> 
    <Route path='/existingList' element={<ExistsEmployeeView/>}></Route>
    {/* <Route path='/payroll'> */}
      <Route path='/companySalaryStructure' element={<CompanySalaryStructure/>}></Route>
      <Route path='/employeeSalaryStructure' element={<EmployeeSalaryStructure/>}></Route>
      <Route path='/employeeSalaryList' element={<EmployeeSalaryList/>}></Route>
      <Route path='/payslipGeneration' element={<GeneratePaySlip/>}></Route>
      <Route path='/payslipsList' element={<ViewPaySlips/>}></Route>
      <Route path='/increment' element={<AddIncrement/>}></Route>
      <Route path='/incrementList' element={<ViewIncrement/>}></Route>
    {/* </Route> */}
    {/* <Route path='/attendance'> */}
      <Route path='/addAttendance' element={<ManageAttendance/>}></Route>
      <Route path='/attendanceList' element={<AttendanceList/>}></Route>
      <Route path='/attendanceReport' element={<AttendanceReport/>}></Route>
    {/* </Route> */}
    <Route path='employeePayslip' element={<EmployeePayslips/>}></Route>
    <Route path='/offerLetter' element={<OfferLetter/>}></Route>
    <Route path='/payslipLetter' element={<PaySlipLetter/>}></Route> 
    <Route path='/hikeLetter' element={<HikeLetter/>}></Route>
    <Route path='/existingEmployee' element={<ExistingLetter/>}></Route>
</Routes>
  )
}

export default Rout