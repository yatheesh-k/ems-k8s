package com.pathbreaker.payslip.serviceImpl;

import com.pathbreaker.payslip.entity.*;
import com.pathbreaker.payslip.exception.Exceptions;
import com.pathbreaker.payslip.exception.NotFoundException;
import com.pathbreaker.payslip.mappers.AttendanceMapper;
import com.pathbreaker.payslip.mappers.PaySlipMapper;
import com.pathbreaker.payslip.repository.AttendanceRepository;
import com.pathbreaker.payslip.repository.CompanyRepository;
import com.pathbreaker.payslip.repository.EmployeeRepository;
import com.pathbreaker.payslip.repository.PaySlipRepository;
import com.pathbreaker.payslip.request.AttendanceRequest;
import com.pathbreaker.payslip.request.PaySlipsRequest;
import com.pathbreaker.payslip.response.*;
import com.pathbreaker.payslip.service.PaySlipService;
import com.pathbreaker.payslip.service.SalaryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.w3c.dom.Document;
import org.xhtmlrenderer.resource.XMLResource;
import org.xhtmlrenderer.swing.Java2DRenderer;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@Slf4j
public class PaySlipServiceImpl implements PaySlipService {

    @Autowired
    public PaySlipServiceImpl(PaySlipRepository paySlipRepository,
                              PaySlipMapper paySlipMapper,
                              AttendanceRepository attendanceRepository, EmployeeRepository employeeRepository,
                              CompanyRepository companyRepository, SalaryService salaryService,
                              AttendanceMapper attendanceMapper,
                              @Value("${file.upload.path}") String filePath) {
        this.paySlipRepository = paySlipRepository;
        this.paySlipMapper = paySlipMapper;
        this.attendanceRepository = attendanceRepository;
        this.companyRepository = companyRepository;
        this.salaryService = salaryService;
        this.attendanceMapper = attendanceMapper;
        this.PATH = filePath;
        this.employeeRepository = employeeRepository;
    }

    private final PaySlipMapper paySlipMapper;
    private final PaySlipRepository paySlipRepository;
    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;
    private final SalaryService salaryService;
    private final AttendanceMapper attendanceMapper;
    private String PATH;



    @Override
    public List<PaySlipsResponse> getPayslipByCompanyId(String companyId) {
        Optional<Company> company = companyRepository.findById(companyId);
        if (company == null || company.isEmpty()) {
            throw new NotFoundException(HttpStatus.NOT_FOUND,"Company ID cannot be null or empty");
        }
        // Fetch employees by companyId
        List<Employee> employees = employeeRepository.findByCompany(company.get());
        if (employees.isEmpty()) {
            throw new NotFoundException(HttpStatus.NOT_FOUND,"No employees found for the given company ID");
        }
        // Fetch payslips for each employee
        List<PaySlip> paySlips = new ArrayList<>();
        for (Employee employee : employees) {
            List<PaySlip> employeePaySlips = paySlipRepository.findByEmployeeId(employee.getEmployeeId());
            paySlips.addAll(employeePaySlips);
        }
        // Map payslip entities to response DTOs
        List<PaySlipsResponse> paySlipsResponses = paySlips.stream()
                .map(paySlipMapper::entityToResponse)
                .collect(Collectors.toList());

        log.info("The retrieved Payslip details are " + paySlipsResponses.size());

        return paySlipsResponses;
    }

    @Override
    public List<PaySlipsResponse> getByEmployeeId(String employeeId) {
        try {
            // Fetch all payroll records for the specified employee ID
            List<PaySlip> paySlips = paySlipRepository.findByEmployeeId(employeeId);

            if (paySlips.isEmpty()) {
                throw new NotFoundException(HttpStatus.NOT_FOUND, "No Payslip found for the employee with ID " + employeeId);
            }

            // Map the payroll entities to response DTOs
            List<PaySlipsResponse> responses = paySlips.stream()
                    .map(paySlipMapper::entityToResponse)
                    .collect(Collectors.toList());

            log.info("Retrieving PaySlips details for employee ID : {}", employeeId);
            return responses;
        } catch (Exceptions ex) {
            // Handle other exceptions
            String message = "An error occurred while retrieving PaySlips for employee ID: " + employeeId;
            log.error(message, ex);
            throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR, message);
        }

    }

    @Override
    public ResponseEntity<?> generatePayslip(String companyId, String employeeId, PaySlipsRequest paySlipsRequest) throws IOException {
        try {
            // Check if the company exists
            Optional<Company> company = companyRepository.findById(companyId);
            if (!company.isPresent()) {
                log.warn("Company with ID {} not found.", companyId);
                throw new NotFoundException(HttpStatus.NOT_FOUND, "Company not found.");
            }

            // Validate if the payslip already exists
            Optional<PaySlip> existingPaySlip = paySlipRepository.findByEmployeeIdAndMonthAndYear(
                    employeeId, paySlipsRequest.getMonth(), paySlipsRequest.getYear());
            if (existingPaySlip.isPresent()) {
                log.warn("Payslip already exists for employee ID {} for the month {} and year {}.",
                        employeeId, paySlipsRequest.getMonth(), paySlipsRequest.getYear());
                throw new NotFoundException(HttpStatus.NOT_ACCEPTABLE, "Payslip already exists for the given month and year.");
            }

            // Retrieve the salary details for the employee
            SalaryResponse allSalaries = salaryService.getSalariesByEmpId(employeeId);
            if (allSalaries == null) {
                log.warn("No Salary details found for employee {}.", employeeId);
                throw new NotFoundException(HttpStatus.NOT_FOUND, "No Salary details found for the employee.");
            }

            // Retrieve the employee details
            Optional<Employee> employee = employeeRepository.findByEmployeeIdAndCompany(employeeId, company.get());
            if (!employee.isPresent()) {
                log.warn("Employee with ID {} not found in company {}.", employeeId, companyId);
                throw new NotFoundException(HttpStatus.NOT_FOUND, "Employee not found in the specified company.");
            }

            // Retrieve the attendance for the given month and financial year
            List<Attendance> attendance = attendanceRepository.findByEmployeeAndMonthAndYear(employee.get(), paySlipsRequest.getMonth(), paySlipsRequest.getYear());
            if (attendance == null || attendance.isEmpty()) {
                log.warn("No Attendance found for employee {} for the month {} and year {}.",
                        employeeId, paySlipsRequest.getMonth(), paySlipsRequest.getYear());
                throw new NotFoundException(HttpStatus.NOT_FOUND, "No Attendance found for the given month and year.");
            }

            // Map the Attendance list to AttendanceRequest list
            List<AttendanceRequest> attendanceRequests = attendance.stream()
                    .map(attendanceMapper::entityToRequest)
                    .collect(Collectors.toList());

            // Generate HTML content from the template
            String htmlContent = generatePayslipHtml(allSalaries, attendanceRequests, paySlipsRequest);
            BufferedImage image = convertHtmlToImage(htmlContent);

            // Define output path for the image using employee ID as the file name
            String outputPath = PATH + "payslip_" + employeeId + "_" + paySlipsRequest.getMonth() + "_" + paySlipsRequest.getYear() + ".jpg";

            // Save the image to the specified directory
            File outputFile = new File(outputPath);
            ImageIO.write(image, "jpg", outputFile); // Save as JPG

            // Save the payslip details in the repository
            PaySlip paySlip = paySlipMapper.entityToRequest(paySlipsRequest);
            paySlip.setEmployeeId(employeeId);
            paySlip.setFilePaths(outputPath);
            paySlipRepository.save(paySlip);

            // Return a successful response
            ResultResponse result = new ResultResponse();
            log.info("Pay slip generation successful.");
            result.setResult("Pay slip generation successful.");
            return ResponseEntity.ok(result);
        } catch (NotFoundException ex) {
            log.error("Not found error: " + ex.getMessage(), ex);
            throw new NotFoundException(HttpStatus.NOT_FOUND, "Not found error: " + ex.getMessage());
        } catch (IOException ex) {
            log.error("An I/O error occurred while generating the pay slip: " + ex.getMessage(), ex);
            throw ex;
        } catch (Exceptions ex) {
            log.error("An error occurred while generating the pay slip: " + ex.getMessage(), ex);
            throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR,"An error occurred while generating the pay slip: " + ex.getMessage());
        }
    }


    // Method to convert HTML content to image using Flying Saucer
    private BufferedImage convertHtmlToImage(String htmlContent) throws IOException {
        BufferedImage image;
        try (ByteArrayInputStream input = new ByteArrayInputStream(htmlContent.getBytes());
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Document document = XMLResource.load(input).getDocument();
            Java2DRenderer renderer = new Java2DRenderer(document, 1250, 1500);
            image = renderer.getImage();
        }
        return image;
    }

    private String generatePayslipHtml(SalaryResponse allSalaries,List<AttendanceRequest> attendance,PaySlipsRequest paySlipsRequest) {
        StringBuilder htmlBuilder = new StringBuilder();

        htmlBuilder.append("<!DOCTYPE html>");
        htmlBuilder.append("<html lang=\"en\">");
        htmlBuilder.append("<head>");
        htmlBuilder.append("<meta charset=\"UTF-8\"/>");
        htmlBuilder.append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>");
        htmlBuilder.append("<title>Document</title>");


        htmlBuilder.append("<style>");
        htmlBuilder.append("body { background-color: rgb(216, 213, 213); background-size: cover; }");
        htmlBuilder.append(".main { height: 100%; margin-left: 130px; }");
        htmlBuilder.append(".top { display: flex; justify-content: space-between; align-items: center; margin-left:50px}"); // Use space-between to separate elements
        htmlBuilder.append(".top table { border: none; margin-top:60px }"); // Prevent logo from shrinking
        htmlBuilder.append(".top td { width:50%; border:none; }"); // Prevent logo from shrinking
        htmlBuilder.append(".logo { height: 120px; margin-left: 180px; margin-top: 50px; }"); // Prevent logo from shrinking
        htmlBuilder.append(".time { margin-top: 80px;}");
        htmlBuilder.append("img { height: 100px; }");
        htmlBuilder.append(".address { text-align: center; padding: 90px; }");
        htmlBuilder.append(".pdfPage { background-color: white; height: auto; width: 1000px; border-color: black; }");
        htmlBuilder.append(".head { height: 50px; width: 100%; background-color: rgb(230, 230, 235); text-align: center; }");
        htmlBuilder.append(".head h4 { padding: 15px; }");
        htmlBuilder.append(".details { display: flex; padding: 10px 40px; }");
        htmlBuilder.append(".table th { padding: 4px; width: 160px; }");

        htmlBuilder.append("table { border-collapse: collapse; border: 1px solid black; width: 100%; }");
        htmlBuilder.append("th, td { border: 1px solid black; padding: 4px; text-align: left; }");
        htmlBuilder.append(".employee-details { font-weight: bold; text-align: center; padding: 4px }");
        htmlBuilder.append(".text { margin-left: 40px; padding-bottom: 90px; }");
        htmlBuilder.append(".earnings { background-color: rgb(230, 230, 230); }");
        htmlBuilder.append(".deductions { background-color: rgb(237, 246, 252); }");
        htmlBuilder.append(".title { background-color: rgb(184, 199, 153); }");
        htmlBuilder.append(".line { margin: 0 50px; }");
        htmlBuilder.append("</style>");

        htmlBuilder.append("</head>");
        htmlBuilder.append("<body>");
        htmlBuilder.append("<div class=\"main\">");
        htmlBuilder.append("<div class=\"pdfPage\">");

        htmlBuilder.append("<div class=\"top\">");

        htmlBuilder.append("<table>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<td>");


        htmlBuilder.append("<div class=\"time\">");
        htmlBuilder.append("<h4 id=\"month-year\">").append(paySlipsRequest.getMonth()+" / "+paySlipsRequest.getYear()).append("</h4>");
        htmlBuilder.append("<h4 id=\"employee-name\">").append(allSalaries.getEmployee().getFirstName()+" "+allSalaries.getEmployee().getLastName()).append("</h4>");
        htmlBuilder.append("</div>");
        htmlBuilder.append("</td>");

        htmlBuilder.append("<td>");
        htmlBuilder.append("<div class=\"logo\">");
        String imagePath = allSalaries.getEmployee().getCompany().getImageFile();
        String base64Image = convertImageToBase64(imagePath);
        if (base64Image != null) {
            htmlBuilder.append("<img src=\"data:image/png;base64,").append(base64Image).append("\"/>");
        } else {
            // Handle the case where the image could not be converted
            htmlBuilder.append("<img src=\"placeholder.png\" alt=\"No Image Available\"/>");
        }        htmlBuilder.append("</div>");
        htmlBuilder.append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("</table>");


        htmlBuilder.append("</div>");
        htmlBuilder.append("<div class=\"details\">");
        htmlBuilder.append("<table>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th colspan=\"4\" class=\"employee-details\" style=\"background-color: rgb(230, 230, 235)\">Employee Details</th>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>EmployeeId</th>");
        htmlBuilder.append("<td id=\"employee-id\">").append(allSalaries.getEmployee().getEmployeeId()).append("</td>");
        htmlBuilder.append("<th>Joining Date</th>");
        htmlBuilder.append("<td id=\"joining-date\">").append(allSalaries.getEmployee().getDateOfHiring()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Date Of Birth</th>");
        htmlBuilder.append("<td id=\"date-of-birth\">").append(allSalaries.getEmployee().getDateOfBirth()).append("</td>");
        htmlBuilder.append("<th>PAN</th>");
        htmlBuilder.append("<td id=\"pan\">").append(allSalaries.getEmployee().getPanNo()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Department</th>");
        htmlBuilder.append("<td id=\"department\">").append(allSalaries.getEmployee().getDepartment()).append("</td>");
        htmlBuilder.append("<th>UAN</th>");
        htmlBuilder.append("<td id=\"uan\">").append(allSalaries.getEmployee().getUanNo()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Designation</th>");
        htmlBuilder.append("<td id=\"designation\">").append(allSalaries.getEmployee().getDesignation()).append("</td>");
        htmlBuilder.append("<th>Location</th>");
        htmlBuilder.append("<td id=\"location\">").append(allSalaries.getEmployee().getLocation()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<td colspan=\"4\" class=\"employee-details\">Bank ACC No: &nbsp;&nbsp;&nbsp;").append(allSalaries.getEmployee().getAccountNo()).append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; IFSC: &nbsp;&nbsp;").append(allSalaries.getEmployee().getIfscCode()).append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Bank: &nbsp;&nbsp;&nbsp; ").append(allSalaries.getEmployee().getBankName()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("</table>");
        htmlBuilder.append("</div>");


        htmlBuilder.append("<div class=\"details\">");
        htmlBuilder.append("<table>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Total Working Days</th>");
        htmlBuilder.append("<td id=\"total-working-days\">").append(attendance.get(0).getTotalWorkingDays()).append("</td>");
        htmlBuilder.append("<th>Working Days</th>");
        htmlBuilder.append("<td id=\"working-days\">").append(attendance.get(0).getTotalWorkingDays()-attendance.get(0).getLop()).append("</td>");
        htmlBuilder.append("<th>Lop</th>");
        htmlBuilder.append("<td id=\"lop\">").append(attendance.get(0).getLop()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("</table>");
        htmlBuilder.append("</div>");


        htmlBuilder.append("<div class=\"details\">");
        htmlBuilder.append("<table>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th class=\"earnings\">Earnings (A)</th>");
        htmlBuilder.append("<th class=\"earnings\">Amount</th>");
        htmlBuilder.append("<th class=\"deductions\">Deductions (B)</th>");
        htmlBuilder.append("<th class=\"deductions\">Amount</th>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Basic Salary</th>");
        htmlBuilder.append("<td id=\"basic-salary\">").append(allSalaries.getAllowances().getBasicSalary()).append("</td>");
        htmlBuilder.append("<th>PF Employee</th>");
        htmlBuilder.append("<td id=\"pf-employee\">").append(allSalaries.getDeductions().getPfEmployee()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Travel Allowances</th>");
        htmlBuilder.append("<td id=\"travel-allowance\">").append(allSalaries.getAllowances().getTravelAllowance()).append("</td>");
        htmlBuilder.append("<th>PF Employer</th>");
        htmlBuilder.append("<td id=\"pf-employer\">").append(allSalaries.getDeductions().getPfEmployer()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>PF Contribution Employee</th>");
        htmlBuilder.append("<td id=\"pf-contribution-employee\">").append(allSalaries.getAllowances().getPfContributionEmployee()).append("</td>");
        htmlBuilder.append("<th>Total PF (B)</th>");
        htmlBuilder.append("<td id=\"total-pf\">").append(allSalaries.getDeductions().getTotalDeductions()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Special Allowance</th>");
        htmlBuilder.append("<td id=\"special-allowance\">").append(allSalaries.getAllowances().getSpecialAllowance()).append("</td>");
        htmlBuilder.append("<th colspan=\"2\" class=\"deductions\">Tax Deductions (C)</th>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Other Allowances</th>");
        htmlBuilder.append("<td id=\"other-allowances\">").append(allSalaries.getAllowances().getOtherAllowances()).append("</td>");
        htmlBuilder.append("<th>LOP</th>");
        htmlBuilder.append("<td id=\"lop-deduction\">").append(allSalaries.getDeductions().getLop()*attendance.get(0).getLop()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Total Earnings (A)</th>");
        htmlBuilder.append("<td id=\"total-earnings\">").append(allSalaries.getAllowances().getTotalEarnings()).append("</td>");
        htmlBuilder.append("<th>Professional Tax</th>");
        htmlBuilder.append("<td id=\"professional-tax\">").append(allSalaries.getDeductions().getPfTax()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<td></td>");
        htmlBuilder.append("<td></td>");
        htmlBuilder.append("<th>Income Tax</th>");
        htmlBuilder.append("<td id=\"income-tax\">").append(allSalaries.getDeductions().getIncomeTax()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<td></td>");
        htmlBuilder.append("<td></td>");
        htmlBuilder.append("<th>Total Tax (C)</th>");
        htmlBuilder.append("<td id=\"total-tax\">").append(allSalaries.getDeductions().getTotalTax()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr class=\"net\">");
        htmlBuilder.append("<th>NET PAY</th>");
        htmlBuilder.append("<th colspan=\"2\" class=\"employee-details\">A - B - C</th>");
        htmlBuilder.append("<th id=\"net-pay\">").append(allSalaries.getDeductions().getNetSalary()-allSalaries.getDeductions().getLop()).append("</th>");
        htmlBuilder.append("</tr>");
        String netPayWords = numberToWords(allSalaries.getDeductions().getNetSalary()-allSalaries.getDeductions().getLop());
        htmlBuilder.append("<tr>");htmlBuilder.append("<td colspan=\"4\" class=\"employee-details\">In Words: ").append(netPayWords).append("</td>");
        htmlBuilder.append("</tr>");

        htmlBuilder.append("</table>");
        htmlBuilder.append("</div>");


        htmlBuilder.append("<div class=\"text\">");
        htmlBuilder.append("<p>This is a computer-generated pay slip and does not require authentication.</p>");
        htmlBuilder.append("</div>");

        htmlBuilder.append("<div class=\"address\">");
        htmlBuilder.append("<hr/>");
        htmlBuilder.append("<p>").append(allSalaries.getEmployee().getCompany().getCompanyName()).append("</p>");
        htmlBuilder.append("<p>").append(allSalaries.getEmployee().getCompany().getCompanyAddress()).append("</p>");
        htmlBuilder.append("<p>Phone No: ").append(allSalaries.getEmployee().getCompany().getMobileNo()).append("</p>");
        htmlBuilder.append("<p>Email: ").append(allSalaries.getEmployee().getCompany().getEmailId()).append("</p>");
        htmlBuilder.append("</div>");

        htmlBuilder.append("</div>");
        htmlBuilder.append("</div>");
        htmlBuilder.append("</body>");
        htmlBuilder.append("</html>");

        return htmlBuilder.toString();
    }

    // Arrays to hold words for single-digit, double-digit, and below-hundred numbers
    String[] singleDigit = {"", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"};
    String[] doubleDigit = {"Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"};
    String[] belowHundred = {"Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"};

    private String numberToWords(Double n) {
        double num = n; // Convert Double to double
        if (num < 0) {
            return "Minus " + numberToWords(-num);
        }
        if (num == 0) {
            return "Zero";
        }

        // Recursive function to translate the number into words
        StringBuilder word = new StringBuilder();
        word.append(translate((int) num));

        // Get the result by translating the given number
        return word.toString().trim() + ".";
    }

    // Translate method to convert the number into words
    private String translate(int n) {
        StringBuilder word = new StringBuilder();

        if (n < 10) {
            word.append(singleDigit[n]).append(' ');
        } else if (n < 20) {
            word.append(doubleDigit[n - 10]).append(' ');
        } else if (n < 100) {
            String rem = translate(n % 10);
            word.append(belowHundred[(n - n % 10) / 10 - 2]).append(' ').append(rem);
        } else if (n < 1000) {
            word.append(singleDigit[n / 100]).append(" Hundred ").append(translate(n % 100));
        } else if (n < 100000) {
            word.append(translate(n / 1000)).append(" Thousand ").append(translate(n % 1000));
        } else if (n < 10000000) { // Correct range for "Lakh"
            word.append(translate(n / 100000)).append(" Lakh ").append(translate(n % 100000));
        } else if (n < 1000000000) {
            word.append(translate(n / 10000000)).append(" Crore ").append(translate(n % 10000000));
        } else {
            word.append(translate(n / 1000000000)).append(" Billion ").append(translate(n % 1000000000));
        }

        return word.toString();
    }

    private String convertImageToBase64(String imagePath) {
        try (FileInputStream imageInFile = new FileInputStream(new File(imagePath))) {
            // Read the image file into a byte array
            byte[] imageData = new byte[(int) new File(imagePath).length()];
            imageInFile.read(imageData);

            // Encode the byte array to a Base64 string
            return Base64.getEncoder().encodeToString(imageData);
        } catch (IOException e) {
            System.err.println("Error: Unable to read or encode the image file. " + e.getMessage());
            return null;
        }
    }

    @Override
    public ResponseEntity<byte[]> getPayslipById(Long payslipId, HttpServletRequest request) throws  IOException{
        try {
            Optional<PaySlip> paySlipUploadEntity = paySlipRepository.findById(payslipId);

            if (paySlipUploadEntity.isPresent()) {
                PaySlip entity = paySlipUploadEntity.get();
                String path = entity.getFilePaths();
                Path documentPath = Paths.get(path);

                // Check if the file exists
                if (!Files.exists(documentPath)) {
                    log.error("Pay slip Document with ID {} not found at path: {}", payslipId, path);
                    throw new NotFoundException(HttpStatus.NOT_FOUND, "The Document with ID " + payslipId + " not found");
                }

                // Convert the file to a PDF
                byte[] pdfBytes = convertToPdf(documentPath);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);

                // Set content disposition to "attachment" to trigger download
                String fileName = documentPath.getFileName().toString().replaceFirst("[.][^.]+$", ".pdf"); // replace the extension with .pdf

                // Addressing potential security headers
                String userAgent = request.getHeader(HttpHeaders.USER_AGENT);
                if (userAgent != null && userAgent.toLowerCase().contains("chrome")) {
                    // For Chrome, add "filename*" to handle special characters
                    headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"; filename*=UTF-8''" + URLEncoder.encode(fileName, "UTF-8").replace("+", "%20"));
                } else {
                    // For other browsers, use a standard approach
                    headers.setContentDispositionFormData("attachment", fileName);
                }
                log.info("Pay slip downloaded successfully...");

                return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            } else {
                log.error("Pay slip Document with ID {} not found", payslipId);
                throw new NotFoundException(HttpStatus.NOT_FOUND, "The Document with ID " + payslipId + " not found");
            }
        } catch (IOException e) {
            log.error("Error occurred while retrieving the document {}", e);
            throw new IOException("Error occurred while retrieving the document"+e);
        }
    }

    private byte[] convertToPdf(Path documentPath) throws IOException {
        BufferedImage image = ImageIO.read(documentPath.toFile());

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {

            PDPage page = new PDPage();
            document.addPage(page);

            PDImageXObject pdImage = LosslessFactory.createFromImage(document, image);
            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            // Calculate the scale factor to fit the image to the page
            float scale = Math.min(page.getMediaBox().getWidth() / pdImage.getWidth(),
                    page.getMediaBox().getHeight() / pdImage.getHeight());

            float x = (page.getMediaBox().getWidth() - pdImage.getWidth() * scale) / 2;
            float y = (page.getMediaBox().getHeight() - pdImage.getHeight() * scale) / 2;

            contentStream.drawImage(pdImage, x, y, pdImage.getWidth() * scale, pdImage.getHeight() * scale);
            contentStream.close();

            document.save(byteArrayOutputStream);

            return byteArrayOutputStream.toByteArray();
        }
    }

    @Override
    public ResponseEntity<byte[]> ViewPayslipById(Long payslipId) {

        try {
            Optional<PaySlip> paySlipUploadEntity = paySlipRepository.findById(payslipId);

            if (paySlipUploadEntity.isPresent()) {
                PaySlip paySlipUpload = paySlipUploadEntity.get();
                String filePath = paySlipUpload.getFilePaths();

                byte[] fileBytes = Files.readAllBytes(Paths.get(filePath));

                HttpHeaders headers = new HttpHeaders();
                // Determine content type based on file extension
                String contentType = Files.probeContentType(Paths.get(filePath));
                headers.setContentType(MediaType.parseMediaType(contentType));

                // Set content disposition to "inline" to display in the browser
                headers.setContentDisposition(ContentDisposition.builder("inline").filename(StringUtils.getFilename(filePath)).build());

                return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
            } else {
                log.error("Pay slip  showing Document with ID " + payslipId + " not found", payslipId);
                throw new NotFoundException(HttpStatus.NOT_FOUND, "The showing Document with ID " + payslipId + " not found");
            }
        } catch (IOException e) {
            // Log the exception for debugging purposes
            e.printStackTrace();
            log.error("Error occurred while showing the document " + e);
            throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR, "Error occurred while retrieving the document " + e);
        }
    }

    @Override
    public ResponseEntity<List<EmployeeSalaryResponse>> getByEmployeeDetails(String companyId, PaySlipsRequest paySlipsRequest) throws  IOException{
        try {
            Optional<Company> company = companyRepository.findById(companyId);
            List<EmployeeSalaryResponse> response = new ArrayList<>();

            if (company.isPresent()) {
                Company company1 = company.get();
                List<Employee> employees = company1.getEmployee(); // Assuming it's getEmployees() instead of getEmployee()

                String month = paySlipsRequest.getMonth();
                long year = paySlipsRequest.getYear();

                for (Employee employee : employees) {
                    List<Attendance> attendances = employee.getAttendance(); // Assuming getAttendances() returns a list of attendance records

                    for (Attendance attendance : attendances) {
                        // Assuming you have a method to compare month and year in EmployeeResponse
                        if (attendance.getMonth().equals(month) && attendance.getYear() == year) {
                            Employee employee1 = attendance.getEmployee();

                            List<Salary> salary = employee1.getSalary();
                            for (Salary salary1 : salary) {
                                EmployeeSalaryResponse employeeResponse2 = new EmployeeSalaryResponse();
                                employeeResponse2.setEmployeeId(employee.getEmployeeId());
                                employeeResponse2.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
                                employeeResponse2.setTotalWorkingDays(attendance.getTotalWorkingDays());
                                employeeResponse2.setLop(attendance.getLop());
                                employeeResponse2.setNetSalary(salary1.getDeductions().getNetSalary());
                                employeeResponse2.setMonth(month);
                                employeeResponse2.setYear(year);

                                response.add(employeeResponse2);
                                // Assuming you want to break the inner loop if a match is found for an employee
                                break;
                            }
                        }
                    }
                }
            } else {
                log.error("Pay slip  showing Document with ID " + companyId + " not found", companyId);
                throw new NotFoundException(HttpStatus.NOT_FOUND, "The showing Document with ID " + companyId + " not found");
            }

            return ResponseEntity.ok(response);
        }catch (Exceptions e) {
            log.error("Error occurred while retrieving the Employee Details {}", e);
            throw new IOException("Error occurred while retrieving Employee Details"+e);
        }
    }


}

