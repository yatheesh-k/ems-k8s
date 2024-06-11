import React, { useState } from 'react';
import SideNav from '../../ScreenPages/SideNav';
import Header from '../../ScreenPages/Header';
import Footer from '../../ScreenPages/Footer';
import Select from 'react-select';
import { Controller, useForm } from 'react-hook-form';

const AttendanceReport = () => {
    const { register, control, handleSubmit, formState: { errors } } = useForm();
    const currentYear = new Date().getFullYear();
    const startYear = 2000;
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, index) => startYear + index);
    const months = Array.from({ length: 12 }, (_, index) => ({
        value: (index + 1).toString().padStart(2, '0'),
        label: new Date(2000, index, 1).toLocaleString('default', { month: 'long' }),
    }));
    const options = years.map((year) => ({
        value: year,
        label: year.toString(),
    })).reverse();

    const [selectedYear, setSelectedYear] = useState({ value: currentYear, label: currentYear.toString() });
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [calendar, setCalendar] = useState([]);

    const handleYearChange = (selectedOption) => {
        setSelectedYear(selectedOption);
    };

    const handleMonthChange = (selectedOption) => {
        setSelectedMonth(selectedOption);
    };

    const generateCalendar = (month, year) => {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const startingDay = firstDay.getDay();

        const days = [];
        let currentDate = 1;

        // Fill in the days before the 1st day of the month
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        // Fill in the days of the month
        while (currentDate <= lastDay.getDate()) {
            days.push(currentDate);
            currentDate++;
        }

        // Fill in the days after the last day of the month
        while (days.length % 7 !== 0) {
            days.push(null);
        }

        setCalendar(chunkArray(days, 7));
    };

    const chunkArray = (arr, size) => {
        const chunkedArray = [];
        for (let i = 0; i < arr.length; i += size) {
            chunkedArray.push(arr.slice(i, i + size));
        }
        return chunkedArray;
    };

    const handleDayClick = (date) => {
        // Handle day click logic here
        date.target.style.backgroundColor = 'grey';
    };

    const onSubmit = (data) => {
        generateCalendar(selectedMonth.value, selectedYear.value);
    };

    return (
        <div className='wrapper'>
            <SideNav />
            <div className='main'>
                <Header />
                <main className="content">
                    <div className="container-fluid p-0">
                        <h1 className="h3 mb-3"><strong>Attendance Report</strong></h1>
                        <div className="row">
                            <div className='col-12'>
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">Employee Details</h5>
                                        <hr />
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="row">
                                                <div className="col-3">
                                                    <label className="form-label">Employee Name</label>
                                                    <select className="form-select" {...register("employeeName", { required: true })}>
                                                        <option value="">Select Employee</option>
                                                        <option value="1">Employee 1</option>
                                                        <option value="2">Employee 2</option>
                                                    </select>
                                                    {errors.employeeName && <p className="errorMsg">Employee Name is required</p>}
                                                </div>
                                                <div className='col-lg-1'></div>
                                                <div className='col-12 col-md-6 col-lg-3 mb-3'>
                                                    <label className="form-label">Select Month</label>
                                                    <Controller
                                                        name="month"
                                                        control={control}
                                                        defaultValue={null}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                options={months}
                                                                placeholder="Select Month"
                                                                onChange={(val) => {
                                                                    field.onChange(val);
                                                                    handleMonthChange(val);
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    {errors.month && <p className="errorMsg">Month is required</p>}
                                                </div>
                                                <div className='col-lg-1'></div>
                                                <div className='col-12 col-md-6 col-lg-3 mb-3'>
                                                    <label className="form-label">Select Financial Year</label>
                                                    <Controller
                                                        name="financialYear"
                                                        control={control}
                                                        defaultValue={selectedYear}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                options={options}
                                                                placeholder="Select Year"
                                                                onChange={(val) => {
                                                                    field.onChange(val);
                                                                    handleYearChange(val);
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    {errors.financialYear && <p className="errorMsg">Year is required</p>}
                                                </div>
                                                <div>
                                                    <button className='btn btn-primary btn-lg' style={{ marginLeft: '82%', marginTop: '15px' }} type='submit'>Submit</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                {calendar.length > 0 && (
                                    <div className="card">
                                        <div className="card-header">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Sunday</th>
                                                        <th>Monday</th>
                                                        <th>Tuesday</th>
                                                        <th>Wednesday</th>
                                                        <th>Thursday</th>
                                                        <th>Friday</th>
                                                        <th>Saturday</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {calendar.map((week, index) => (
                                                        <tr key={index}>
                                                            {week.map((day, dayIndex) => (
                                                                <td key={dayIndex} onClick={handleDayClick}>
                                                                    {day !== null ? day : ''}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default AttendanceReport;
