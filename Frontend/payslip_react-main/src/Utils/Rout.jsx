import React from 'react'
import { Route, Routes } from 'react-router';
import CompanyLogin from '../Company/CompanyLogin';
import Login from '../ScreenPages/Login';
import EmpLogin from '../EmpPaySlips/EmpLogin';
import CompanyRegistration from '../Company/CompanyRegistration'
import CompanyView from '../Company/CompanyView';
import Body from '../ScreenPages/Body';
import Department from '../Components/Department';
import Designation from '../Components/Designation';
import EmployeeView from '../Components/EmployeeView';
import EmployeeReg from '../Components/EmployeeReg';
import PaySlipsView from '../Components/PaySlipsView';
// import PaySlipReg from '../Components/PaySlipReg';
import RelievingReg from '../Components/RelievingReg';
import UserReg from '../Components/UserReg';
import UsersView from '../Components/UsersView';
import ManageSalary from '../Components/PayRoll/ManageSalary';
import SalaryList from '../Components/PayRoll/SalaryList';
import NewIncrement from '../Components/PayRoll/NewIncrement';
import IncrementList from '../Components/PayRoll/IncrementList';
import ManageAttendence from '../Components/Attendance/ManageAttendence';
import AttendanceReport from '../Components/Attendance/AttendanceReport';
import Calendar from '../Components/Attendance/Calendar';
import RelievingView from '../Components/RelivingView';
import AttandenceList from '../Components/Attendance/AttendenceList';
import SalaryStructure from '../Components/PayRoll/SalaryStructure';
import { SalaryProvider } from '../Context/SalaryContext';
import GeneratePaySlip from '../Components/PayRoll/GeneratePaySlip'
import EmpPaySlip from '../EmpPaySlips/EmpPaySlip';
import CompanyReg1 from '../Company/CompanyRegistration';
import CompanyReg from '../Company/CompanyReg';
// import Protected from './Protected';

const Rout = () => {
  return (
  <Routes>
    {/**Login */}
    <Route path='/superadmin/login' element={<CompanyLogin/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
    <Route path='/emp/login' element={<EmpLogin/>}></Route>
    {/* <Route element={<Protected/>}> */}
         {/** Super Admin*/}
        <Route path='/companyRegistration' element={<CompanyRegistration/>}></Route>
        <Route path='/companyview' element={<CompanyView/>}></Route>
        {/** Company Admin */}
        <Route path="/main" element={<Body/>}></Route>
        <Route path="/department" element={<Department/>}></Route>
        <Route path="/designation" element={<Designation/>}></Route>
        <Route path="/employeeview" element={<EmployeeView/>}></Route>
        <Route path="/employeeRegistration" element={<EmployeeReg/>}></Route>
        <Route path="/payslipview/" element={<PaySlipsView/>}> </Route>
        {/* <Route path="/payslipRegistration" element={<PaySlipRegs/>}></Route> */}
        <Route path="/relievingview" element={<RelievingView/>}></Route>
        <Route path="/relievingRegistration" element={<RelievingReg/>}></Route>
        <Route path="/usersRegistration" element={<UserReg/>}></Route>
        <Route path="/usersView"  element={<UsersView/>}></Route>
        <Route path='/manageSalary' element={<SalaryProvider><ManageSalary/></SalaryProvider>}></Route>
        <Route path='/salaryList' element={<SalaryList/>}></Route>
        <Route path="/newIncrement" element={<NewIncrement/>}></Route>
        <Route path="/incrementList" element={<IncrementList/>}></Route>
        <Route path="/attendanceManagement" element={<ManageAttendence/>}></Route>
        <Route path="/attendanceList" element={<AttandenceList/>}></Route>
        <Route path="/attendanceReport" element={<AttendanceReport/>}></Route>
        <Route path="/calendar" element={<Calendar/>}></Route>
        <Route path='/salaryStructure' element={<SalaryProvider><SalaryStructure/></SalaryProvider>}></Route>
        <Route path='/generatePaySlip' element={<GeneratePaySlip/>}></Route>
        <Route path='/emppayslip' element={<EmpPaySlip/>}></Route>
        <Route path='/companyReg1' element={<CompanyReg/>}></Route>
        {/* </Route> */}
    {/**Employee */}
  </Routes>
  )
}

export default Rout