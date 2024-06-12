package com.pbt.ems.mappers;

import com.pbt.ems.entity.Attendance;
import com.pbt.ems.request.*;
import com.pbt.ems.response.AttendanceResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

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
