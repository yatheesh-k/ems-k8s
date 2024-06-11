import React, { useEffect, useState } from 'react';
import Footer from '../../ScreenPages/Footer';
import Header from '../../ScreenPages/Header';
import SideNav from '../../ScreenPages/SideNav';
import axios from 'axios';

const Calendar = () => {
  const currentDate = new Date();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [view, setView] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [absentDates, setAbsentDates] = useState([]); // State to keep track of absent dates
  const [submittedDates, setSubmittedDates] = useState([]);


  // Function to handle month change
  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  // Function to handle year change
  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  // Function to handle employee change
  const handleEmployeeChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  // Function to handle search button click
  const handleSearchClick = () => {
    setShowCalendar(true); // Show calendar when search button is clicked
  };

  const handleDateClick = (day) => {
    if (absentDates.includes(day)) {
      setAbsentDates(absentDates.filter(date => date !== day));
      setSubmittedDates(submittedDates.filter(date => date !== day)); // Remove date from submittedDates if already submitted
    } else {
      setAbsentDates([...absentDates, day]);
      setSubmittedDates([...submittedDates, day]); // Add date to submittedDates
    }
  };
  

  // Generate days in a month
  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Generate options for months
  const generateMonthOptions = () => {
    return Array.from({ length: 12 }, (_, index) => (
      <option key={index} value={index}>
        {new Date(currentDate.getFullYear(), index, 1).toLocaleString('default', { month: 'long' })}
      </option>
    ));
  };

  // Generate options for years
  const generateYearOptions = () => {
    const years = [];
    const currentYear = currentDate.getFullYear();
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
      years.push(
        <option key={year} value={year}>
          {year}
        </option>
      );
    }
    return years;
  };

  // Generate calendar cells
  const generateCalendarCells = () => {
    const totalDays = daysInMonth(selectedMonth, selectedYear);
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let calendarCells = [];
    // Add day names
    daysOfWeek.forEach((day) => {
      calendarCells.push(
        <div key={`day-${day}`} className="day-header">
          {day}
        </div>
      );
    });

    // Fill empty cells before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarCells.push(<div key={`empty-${i}`} className="empty-cell"></div>);
    }

    // Generate calendar cells for each day
    for (let day = 1; day <= totalDays; day++) {
      const isAbsent = absentDates.includes(day);
      calendarCells.push(
        <div
          key={`day-${day}`}
          className={`calendar-cell ${isAbsent ? 'absent' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }
    return calendarCells;
  };

  useEffect(() => {
    axios.get(`http://192.168.1.163:8092/employee/all`)
      .then((response) => {
        console.log(response.data);
        const filteredEmployees = response.data.filter(user => {
          // Convert user.status to a string before using includes()
          const statusString = String(user.status);
          // Check if the statusString contains '2'
          return !statusString.includes('2');
        });
        console.log("Filtered employees:", filteredEmployees);
        const formattedEmployeeList = filteredEmployees.map(user => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.employeeId,
        }));
        console.log('Formatted employee list:', formattedEmployeeList);
        setView(formattedEmployeeList);
      })
      .catch((errors) => {
        console.log(errors);
      });
  }, []);

  const handleSubmit = async () => {
    let datesToSubmit = submittedDates;
    // If no dates are selected, submit absence as 0
    if (datesToSubmit.length === 0) {
      datesToSubmit = [0]; // Submit absence as 0
    }
  
    // Check if there are selected dates to be submitted
    if (datesToSubmit.length > 0 && selectedEmployee && selectedMonth !== null && selectedYear !== null) {
      const requestData = {
        employeeId: selectedEmployee,
        month: selectedMonth,
        year: selectedYear,
        absentDates: datesToSubmit,
      };
  
      try {
        const response = await axios.post('http://your-api-endpoint', requestData);
        console.log('API Response:', response.data);
  
        // Reset the submitted dates after successful submission
        setSubmittedDates([]);
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    } else {
      console.log('Please select an employee and/or dates before submitting.');
    }
  };
  
  

  return (
    <div className='wrapper'>
      <SideNav />
      <div className='main'>
        <Header />
        <main className="content">
          <div className="container-fluid p-0">
            <h1 className="h3 mb-3"><strong>Attendance List</strong></h1>
            <div className="row">
              <div className="col-12 col-lg-12 col-xxl-12 d-flex">
                <div className="card flex-fill">
                  <div className="card-header">
                    <h6>Search filters</h6>
                    <div className='row'>
                      <div className='col-12 col-md-6 col-lg-3 mt-3'>
                        <label className="form-label">Select Employee Name</label>
                        <select onChange={handleEmployeeChange} className='form-select'>
                          <option value="">Select Employee</option>
                          {view.map(employee => (
                            <option key={employee.value} value={employee.value}>
                              {employee.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='col-12 col-md-6 col-lg-3 mt-3'>
                        <label className="form-label">Select Month</label>
                        <select value={selectedMonth} onChange={handleMonthChange} className='form-select'>
                          {generateMonthOptions()}
                        </select>
                      </div>
                      <div className='col-12 col-md-6 col-lg-3 mt-3'>
                        <label className="form-label">Select Year</label>
                        <select value={selectedYear} onChange={handleYearChange} className='form-select'>
                          {generateYearOptions()}
                        </select>
                      </div>
                      <div className='col-12 col-md-6 col-lg-3 mt-5'>
                        <button onClick={handleSearchClick} className="btn btn-primary w-100">Search</button>
                      </div>
                    </div>
                  </div>
                  <div className="calendar-container m-3">
                    {showCalendar && generateCalendarCells()}
                  </div>
                  <div className='col-12 col-md-6 col-lg-3 m-3 align-items-end'>
  <button onClick={handleSubmit} className="btn btn-primary w-100">Submit</button>
</div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Calendar;
