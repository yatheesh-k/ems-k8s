package com.pathbreaker.payslip.repository;

import com.pathbreaker.payslip.entity.Attendance;
import com.pathbreaker.payslip.entity.Dashboard;
import com.pathbreaker.payslip.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance,String> {
    @Query("SELECT MAX(a.attendanceId) FROM Attendance a")
    String findHighestAttendanceId();

    List<Attendance> findByEmployee(Employee employee);

    List<Attendance> findByEmployeeAndMonthAndYear(Employee employee, String month, Long year);

}
