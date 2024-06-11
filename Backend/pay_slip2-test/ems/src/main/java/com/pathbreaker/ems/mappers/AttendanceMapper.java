package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.Attendance;
import com.pathbreaker.payslip.entity.Employee;
import com.pathbreaker.payslip.request.*;
import com.pathbreaker.payslip.response.AttendanceResponse;
import com.pathbreaker.payslip.response.EmployeeResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AttendanceMapper {
    Attendance entityToRequest(AttendanceRequest attendanceRequest);

    @Mappings({
            @Mapping(target = "attendanceId", source = "attendance.attendanceId"),
            @Mapping(target = "month", source = "attendance.month"),
            @Mapping(target = "year", source = "attendance.year"),
            @Mapping(target = "totalWorkingDays", source = "attendance.totalWorkingDays"),
            @Mapping(target = "lop", source = "attendance.lop"),
            @Mapping(target = "employee", source = "attendance.employee"),
    })
    AttendanceResponse responseToEntity(Attendance attendance);

    Attendance updateEntityFromRequest(AttendanceRequest attendanceRequest, @MappingTarget Attendance attendanceEntity);

    AttendanceRequest entityToRequest(Attendance attendance);
}
