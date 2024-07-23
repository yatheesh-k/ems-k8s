package com.pb.employee.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
@Service
@Slf4j
public class TaxCalculatorUtils {

    public static double getOldTax(double salary)
    {
        // Lies under tax rebate limit
        if (salary <= 500000) {
            return 0;
        }
        if (salary <= 1000000) {
            return (salary - 500000) * 0.2
                    + (250000 * 0.05);
        }
        return (salary - 1000000) * 0.3 + (500000 * 0.2)
                + (250000 * 0.05);
    }

    public static double getNewTax(double salary)
    {
        // Lies under tax rebate limit
        if (salary <= 700000) {
            return 0;
        }
        if (salary <= 750000) {
            return (250000 * 0.05)
                    + (salary - 500000) * 0.1;
        }
        if (salary <= 1000000) {
            return (250000 * 0.05) + (250000 * 0.10)
                    + (salary - 750000) * 0.15;
        }
        if (salary <= 1250000) {
            return (250000 * 0.05) + (250000 * 0.10)
                    + (250000 * 0.15)
                    + (salary - 1000000) * 0.2;
        }
        if (salary <= 1500000) {
            return (250000 * 0.05) + (250000 * 0.10)
                    + (250000 * 0.15) + (250000 * 0.2)
                    + (salary - 1250000) * 0.25;
        }
        return (250000 * 0.05) + (250000 * 0.10)
                + (250000 * 0.15) + (250000 * 0.2)
                + (250000 * 0.25) + (salary - 1500000) * 0.3;
    }

    public static double getPfTax(double salary) {
        if (salary <= 15000) {
            // Return 0 if salary is less than or equal to 15000
            return 0;
        } else if (salary <= 20000) {
            // Return a fixed amount or percentage for salary between 15001 and 20000
            return 150*12;
        } else {
            // Return a different fixed amount or percentage for salary above 20000
            return 200*12;
        }
    }

}
