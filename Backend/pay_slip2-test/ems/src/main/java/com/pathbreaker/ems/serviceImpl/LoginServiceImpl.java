package com.pathbreaker.payslip.serviceImpl;

import com.pathbreaker.payslip.entity.*;
import com.pathbreaker.payslip.exception.Exceptions;
import com.pathbreaker.payslip.exception.NotFoundException;
import com.pathbreaker.payslip.repository.*;
import com.pathbreaker.payslip.request.LoginRequest;
import com.pathbreaker.payslip.response.ResultLoginResponse;
import com.pathbreaker.payslip.response.ResultResponse;
import com.pathbreaker.payslip.service.LoginService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class LoginServiceImpl implements LoginService {

    @Autowired
    public LoginServiceImpl(EmployeeRepository loginRepository,
                            JavaMailSenderImpl javaMailSender,
                            UserRepository userLoginRepository,
                            CompanyRepository companyRepository,
                            SuperAdminRepository superAdminRepository,
                            @Value("${fixed.otp}") Long fixedOtp){
        this.loginRepository = loginRepository;
        this.userLoginRepository = userLoginRepository;
        this.companyRepository = companyRepository;
        this.superAdminRepository = superAdminRepository;
        this.fixedOtp = fixedOtp;
        otpExpiryMap = new HashMap<>();
        this.javaMailSender = javaMailSender;
    }
    private final Map<Long, LocalDateTime> otpExpiryMap;
    private final JavaMailSenderImpl javaMailSender;
    private final EmployeeRepository loginRepository;
    private final UserRepository userLoginRepository;
    private final CompanyRepository companyRepository;
    private final SuperAdminRepository superAdminRepository;
    private final Long fixedOtp;

    @Override
    public ResponseEntity<?> sendOtpToEmail(LoginRequest loginRequest) {
        try {
            Employee employeeLogin = loginRepository.findByEmailId(loginRequest.getEmailId());
            Company companyLogin = companyRepository.findByEmailId(loginRequest.getEmailId());
            Optional<User> userLogin = userLoginRepository.findByEmailId(loginRequest.getEmailId());
            User user = userLogin.get();
            SuperAdmin superAdmin = superAdminRepository.findByEmailId(loginRequest.getEmailId());

            String storedPassword = null;
            String userType = null;

            if (employeeLogin != null) {
                storedPassword = employeeLogin.getPassword();
                userType = "Employee";
            } else if (companyLogin != null) {
                storedPassword = companyLogin.getPassword();
                userType = "Company";
            } else if (userLogin != null) {
                storedPassword = userLogin.get().getPassword();
                userType = "User";
            }
            else if (superAdmin != null) {
                storedPassword = superAdmin.getPassword();
                userType = "Super Admin";
            }else {
                log.info("EmailId not found: {}", loginRequest.getEmailId());
                ResultResponse result = new ResultResponse();
                result.setResult("EmailId not found");
                throw new NotFoundException(HttpStatus.NOT_FOUND, "EmailId not found");
            }

            if (storedPassword == null) {
                log.info("Password is null for emailId: {}", loginRequest.getEmailId());
                ResultResponse result = new ResultResponse();
                result.setResult("Password is null for emailId: " + loginRequest.getEmailId());
                throw new NotFoundException(HttpStatus.NOT_FOUND, "Password not found for emailId");
            }

            if (!loginRequest.getPassword().equals(storedPassword)) {
                log.info("Incorrect password for emailId: {}", loginRequest.getEmailId());
                ResultResponse result = new ResultResponse();
                result.setResult("Incorrect password");
                throw new NotFoundException(HttpStatus.NOT_ACCEPTABLE, "Incorrect password for emailId: " + loginRequest.getEmailId());
            }

            Long otp = fixedOtp; // Generate or fetch your OTP here
            sendOtpByEmail(loginRequest.getEmailId(), otp);
            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

            // Update the expiry time based on user type
            switch (userType) {
                case "Employee":
                    employeeLogin.getEmployeeLogin().setExpiryTime(expiryTime);
                    loginRepository.save(employeeLogin);
                    break;
                case "Company":
                    companyLogin.getCompanyLogin().setExpiryTime(expiryTime);
                    companyRepository.save(companyLogin);
                    break;
                case "User":
                    user.getUserLoginEntity().setExpiryTime(expiryTime);
                    userLoginRepository.save(user);
                    break;
                case "Super Admin":
                    superAdmin.setExpiryTime(expiryTime);
                    superAdminRepository.save(superAdmin);
                    break;
            }

            otpExpiryMap.put(otp, expiryTime);

            log.info("OTP sent to emailId: {}", loginRequest.getEmailId());
            ResultResponse result = new ResultResponse();
            result.setResult("OTP sent successfully to " + loginRequest.getEmailId() + ". Please login with the OTP.");
            return ResponseEntity.ok(result);
        } catch (Exceptions ex) {
            log.warn("An error occurred during OTP sending to emailId: {}", loginRequest.getEmailId(), ex);
            throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred during OTP sending to emailId: " + loginRequest.getEmailId());
        }
    }


    @Override
    public ResponseEntity<?> loginAdmin(LoginRequest loginRequest) {
        try {
            // Find login entities for employee, company, and user
            Employee employeeLogin = loginRepository.findByEmailId(loginRequest.getEmailId());
            Company companyLogin = companyRepository.findByEmailId(loginRequest.getEmailId());
            Optional<User> userLogin = userLoginRepository.findByEmailId(loginRequest.getEmailId());
            User user = userLogin.get();
            SuperAdmin superAdmin = superAdminRepository.findByEmailId(loginRequest.getEmailId());

            Object loginEntity = null;
            String userType = null;

            if (employeeLogin != null) {
                loginEntity = employeeLogin;
                userType = "Employee";
            } else if (companyLogin != null) {
                loginEntity = companyLogin;
                userType = "Company";
            } else if (userLogin != null) {
                loginEntity = userLogin;
                userType = "User";
            } else if (superAdmin != null) {
                loginEntity = superAdmin;
                userType = "Super Admin";
            } else {
                ResultResponse result = new ResultResponse();
                result.setResult("Email ID not found");
                log.info("Email ID not found: {}", loginRequest.getEmailId());
                throw new NotFoundException(HttpStatus.NOT_FOUND, "Email ID not found");
            }

            LocalDateTime expiryTime = null;

            if (loginEntity instanceof EmployeeLogin) {
                expiryTime = ((EmployeeLogin) loginEntity).getExpiryTime();
            } else if (loginEntity instanceof CompanyLogin) {
                expiryTime = ((CompanyLogin) loginEntity).getExpiryTime();
            } else if (loginEntity instanceof UserLogin) {
                expiryTime = ((UserLogin) loginEntity).getExpiryTime();
            } else if (loginEntity instanceof SuperAdmin) {
                expiryTime = ((SuperAdmin) loginEntity).getExpiryTime();
            }

            System.out.println("The login OTP will expire in: " + expiryTime);

            if (expiryTime == null || LocalDateTime.now().isAfter(expiryTime)) {
                // OTP has expired
                otpExpiryMap.remove(loginRequest.getOtp());
                ResultResponse result = new ResultResponse();
                result.setResult("OTP has expired");
                log.info("OTP has expired");
                throw new NotFoundException(HttpStatus.NOT_ACCEPTABLE, "OTP has expired");
            }

            // OTP is valid within the 5-minute window
            if (loginEntity instanceof EmployeeLogin) {
                ((EmployeeLogin) loginEntity).setLastLoginTime(new Date());
                loginRepository.save((Employee) loginEntity);
            } else if (loginEntity instanceof CompanyLogin) {
                ((CompanyLogin) loginEntity).setLastLoginTime(new Date());
                companyRepository.save((Company) loginEntity);
            } else if (loginEntity instanceof UserLogin) {
                ((UserLogin) loginEntity).setLastLoginTime(new Date());
                userLoginRepository.save((User) loginEntity);
            } else if (loginEntity instanceof SuperAdmin) {
                ((SuperAdmin) loginEntity).setLastLoginTime(new Date());
                superAdminRepository.save((SuperAdmin) loginEntity);
            }

            otpExpiryMap.remove(loginRequest.getOtp());

            ResultLoginResponse result = new ResultLoginResponse();
            log.info("Login successful to the email ID: {}", loginRequest.getEmailId());
            result.setResult("Login successful to the email ID: " + loginRequest.getEmailId());
            result.setRole(userType);

            if (loginEntity instanceof EmployeeLogin) {
                result.setId(((EmployeeLogin) loginEntity).getEmployee().getEmployeeId());
                result.setName(((EmployeeLogin) loginEntity).getEmployee().getFirstName() + " " + ((EmployeeLogin) loginEntity).getEmployee().getLastName());
                // Get company logo for employee
                String imagePath = ((EmployeeLogin) loginEntity).getEmployee().getCompany().getImageFile();  // assuming this returns the image path
                try {
                    byte[] logoBytes = Files.readAllBytes(Paths.get(imagePath));
                    if (logoBytes != null) {
                        String base64Logo = Base64.getEncoder().encodeToString(logoBytes);
                        result.setImageFile(base64Logo);
                    }
                } catch (IOException e) {
                    log.error("Error reading company logo image: ", e);
                    throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR, "Error reading company logo image");
                }
            } else if (loginEntity instanceof CompanyLogin) {
                CompanyLogin company = (CompanyLogin) loginEntity;
                result.setId(company.getCompany().getCompanyId());
                result.setName(company.getCompany().getCompanyName());

                // Convert company logo to base64
                String imagePath = company.getCompany().getImageFile();  // assuming this returns the image path
                try {
                    byte[] logoBytes = Files.readAllBytes(Paths.get(imagePath));
                    if (logoBytes != null) {
                        String base64Logo = Base64.getEncoder().encodeToString(logoBytes);
                        result.setImageFile(base64Logo);
                    }
                } catch (IOException e) {
                    log.error("Error reading company logo image: ", e);
                    throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR, "Error reading company logo image");
                }
            } else if (loginEntity instanceof UserLogin) {
                result.setId(((UserLogin) loginEntity).getUserEntity().getUserId());
                result.setName(((UserLogin) loginEntity).getUserEntity().getUserName());
                // Get company logo for user
                String imagePath = ((UserLogin) loginEntity).getUserEntity().getCompany().getImageFile();  // assuming this returns the image path
                try {
                    byte[] logoBytes = Files.readAllBytes(Paths.get(imagePath));
                    if (logoBytes != null) {
                        String base64Logo = Base64.getEncoder().encodeToString(logoBytes);
                        result.setImageFile(base64Logo);
                    }
                } catch (IOException e) {
                    log.error("Error reading company logo image: ", e);
                    throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR, "Error reading company logo image");
                }
            } else if (loginEntity instanceof SuperAdmin) {
                result.setName(((SuperAdmin) loginEntity).getName());
            }
            return ResponseEntity.ok(result);
        }catch (Exception ex) {
            log.warn("An error occurred during the login: {}", ex);
            throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred during the login: " + ex);
        }
    }

    public void sendOtpByEmail(String emailId, Long otp) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(emailId);
        mailMessage.setSubject("One Time Password for login on PaySlips Application.");
        mailMessage.setText("Dear "+emailId+" ,"+"\n\n"+"Your OTP for login is : " + otp+"\n\n"+
                " Above OTP is valid for 5 minutes, pls do not share OTP with anyone."+"\n\n"+
                "Sincerely,"+"\n\n"+"PaySlip Team"+"\n"+"Mobile: +1234567890"+"\n"+"Website: payslips.com");

        javaMailSender.send(mailMessage);
        log.info("OTP sent successfully to: {}", emailId);
    }
    private Long generateOtp() {
        Random random = new Random();
        Long otp = 100000 + random.nextLong(900000);
        return otp;
    }


}
