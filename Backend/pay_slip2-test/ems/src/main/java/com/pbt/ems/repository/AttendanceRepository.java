package com.pbt.ems.repository;

import com.pbt.ems.entity.Attendance;
import com.pbt.ems.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance,String> {
    @Query("SELECT MAX(a.attendanceId) FROM Attendance a")
    String findHighestAttendanceId();

    List<Attendance> findByEmployee(Employee employee);

    List<Attendance> findByEmployeeAndMonthAndYear(Employee employee, String month, Long year);

}
