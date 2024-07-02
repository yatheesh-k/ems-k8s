package com.pb.employee.util;

import com.pb.employee.model.ResourceType;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
@Service
@Slf4j
public class ResourceIdUtils {

    /**
     * Generate a global resource ID
     *
     * @param id The ID of the resource
     */
    //todo-to make this static method
    public static String generateCompanyResourceId(String id) {
        return generateGlobalResourceId(ResourceType.COMPANY, id);
    }
    public static String generateEmployeeResourceId(String id) {
        return generateGlobalResourceId(ResourceType.EMPLOYEE, id);
    }
    public static String generateSalaryResourceId(String employeeId) {
        return generateGlobalResourceId(ResourceType.SALARY,employeeId);
    }
    public static String generateCompanyIndex(String name) {
        return Constants.INDEX_EMS+"_"+name;
    }

    public static String generateEMSAdminResourceId(String id) {
        return generateGlobalResourceId(ResourceType.EMS_ADMIN, id);
    }

    public static String generateDepartmentResourceId(String id) {
        return generateGlobalResourceId(ResourceType.DEPARTMENT, id);
    }

    public static String generateDesignationResourceId(String id) {
        return generateGlobalResourceId(ResourceType.DESIGNATION, id);
    }

    /**
     * Generate a global resource ID based on the resource type
     *
     * @param type The type of resource
     * @param args the values of attributes that uniquely identify the resource. The generator
     *             is sensitive to the order of the specified values
     */
    public static String generateGlobalResourceId(ResourceType type, Object... args) {
        boolean isCaseSensitive = false;
        String prefix = Constants.DEFAULT + "-";
        if (type == ResourceType.COMPANY) {
            prefix = Constants.COMPANY + "-";
        }
        if (type == ResourceType.EMPLOYEE) {
            prefix = Constants.EMPLOYEE + "-";
        }
        if (type == ResourceType.DEPARTMENT) {
            prefix = Constants.DEPARTMENT + "-";
        }
        if (type == ResourceType.SALARY) {
            prefix = Constants.SALARY + "-";

        }
        if (type == ResourceType.DESIGNATION) {
            prefix = Constants.DESIGNATION + "-";

        }
           
            StringBuilder md5Input = new StringBuilder();
            for (Object arg : args) {
                if (arg != null) {
                    if (md5Input.length() == 0) {
                        md5Input.append(arg.toString());
                    } else {
                        md5Input.append(":").append(arg.toString());
                    }
                }
            }
            String md5Hash;
            if (isCaseSensitive) {
                md5Hash = org.springframework.util.DigestUtils.md5DigestAsHex(md5Input.toString().getBytes()).toLowerCase();

            } else {
                md5Hash = org.springframework.util.DigestUtils.md5DigestAsHex(md5Input.toString().toLowerCase().getBytes()).toLowerCase();

            }
            return prefix + md5Hash;
        }

    public static String generateAttendanceId(String company, String employeeId) {
        return null;
    }
}
