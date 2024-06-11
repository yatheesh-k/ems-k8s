package com.pathbreaker.payslip.serviceImpl;


import com.pathbreaker.payslip.entity.Company;
import com.pathbreaker.payslip.entity.CompanyLogin;
import com.pathbreaker.payslip.entity.Salary;
import com.pathbreaker.payslip.exception.Exceptions;
import com.pathbreaker.payslip.exception.NotFoundException;
import com.pathbreaker.payslip.mappers.CompanyMapper;
import com.pathbreaker.payslip.repository.CompanyRepository;
import com.pathbreaker.payslip.request.CompanyRequest;
import com.pathbreaker.payslip.request.CompanyUpdateRequest;
import com.pathbreaker.payslip.response.CompanyResponse;
import com.pathbreaker.payslip.response.ResultResponse;
import com.pathbreaker.payslip.response.SalaryResponse;
import com.pathbreaker.payslip.service.CompanyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CompanyServiceImpl implements CompanyService {
    @Autowired
    public CompanyServiceImpl(CompanyRepository companyRepository, CompanyMapper companyMapper) {
        this.companyRepository = companyRepository;
        this.companyMapper = companyMapper;
    }
    private final CompanyRepository companyRepository;

    private final CompanyMapper companyMapper;

    @Value("${file.upload.path}")
    private String folderPath;

    @Override
    public ResponseEntity<?> registerCompany(CompanyRequest companyRequest, MultipartFile multipartFile) {
        try {
            // Check if a company with the same email ID or company name already exists
            boolean emailExists = companyRepository.existsByEmailId(companyRequest.getEmailId());
            boolean companyNameExists = companyRepository.existsByCompanyName(companyRequest.getCompanyName());
            System.out.println(emailExists);
            System.out.println(companyNameExists);

            if (emailExists) {
                log.info("Email ID already exists: {}", companyRequest.getEmailId());
                ResultResponse result = new ResultResponse();
                result.setResult("Email ID already exists");
                throw new NotFoundException(HttpStatus.BAD_REQUEST,"Email ID already Exists");
            }

            if (companyNameExists) {
                log.info("Company name already exists: {}", companyRequest.getCompanyName());
                ResultResponse result = new ResultResponse();
                result.setResult("Company name already exists");
                throw new NotFoundException(HttpStatus.BAD_REQUEST,"Company name already exists");
            }

            // Generate a new company ID
            String highestCompanyId = companyRepository.findHighestCompanyId();
            int digit = 1;
            if (highestCompanyId != null) {
                digit = Integer.parseInt(highestCompanyId.substring(3)) + 1;
            }
            String format = "COM%03d";
            String companyId = String.format(format, digit);
            companyRequest.setCompanyId(companyId);

            // Map the request to an entity
            Company company = companyMapper.entityToRequest(companyRequest);
            CompanyLogin companyLogin = new CompanyLogin();
            companyLogin.setCompany(company);
            company.setCompanyLogin(companyLogin);

            // Handle the multipart file if it exists
            if (!multipartFile.isEmpty()) {
                multiPartFileStore(multipartFile, company);
            }

            // Save the company entity to the repository
            companyRepository.save(company);

            // Prepare the success response
            ResultResponse result = new ResultResponse();
            log.info("Company registration is successful: {}", companyRequest.getCompanyId());
            result.setResult("Company registration is successful");
            return ResponseEntity.ok(result);

        } catch (Exceptions e) {
            String message = "An error occurred during company registration: " + e.getMessage();
            log.error(message, e);
            throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR, message);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }



    @Override
    public List<CompanyResponse> getCompanies() throws IOException {
        List<Company> salaryList = companyRepository.findAll();

        List<CompanyResponse> companyResponses = salaryList.stream()
                .map(company -> {
                    CompanyResponse response = companyMapper.entityToResponse(company);
                    try {
                        convertImageToBase64(response);
                    } catch (IOException e) {
                        throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR,"Error occured while converting to Base 64");
                    }
                    return response;
                })
                .collect(Collectors.toList());


        log.info("The retrieved Company details are : {} ", companyResponses.size());

        return companyResponses;
    }

    @Override
    public CompanyResponse getCompanyById(String companyId){
          Optional<Company> company = companyRepository.findById(companyId);
           if (company.isPresent()){
               Company company1 = company.get();
               CompanyResponse companyResponse = companyMapper.entityToResponse(company1);

                   try {
                       convertImageToBase64(companyResponse);
                   } catch (IOException e) {
                       throw new RuntimeException(e);
                   }
                   log.info("The Retrieved company details of Id : {}",companyId);

               return companyResponse;

           }else{
                log.warn("The company not found with " + companyId);
                throw new NotFoundException(HttpStatus.NOT_FOUND, "The company with " + companyId + " not found");
           }

    }

    @Override
    public ResponseEntity<?> updateCompanyById(String companyId, CompanyUpdateRequest companyUpdateRequest, MultipartFile file) throws IOException {
        try {
            Optional<Company> companyEntityOptional = companyRepository.findById(companyId);

            if (companyEntityOptional.isPresent()) {
                Company company = companyEntityOptional.get();
                // Update the existing resource with the new data from the request
                Company company1 = companyMapper.updateEntityFromRequest(companyUpdateRequest, company);

                if (file != null && !file.isEmpty()) {
                    String companyName = company1.getCompanyId();
                    String fileName = companyName + "_" + file.getOriginalFilename();
                    String filePath = folderPath + fileName;

                    // Check if there is an existing file to delete
                    if (company1.getImageFile() != null) {
                        Path existingFilePath = Paths.get(company1.getImageFile());
                        try {
                            Files.delete(existingFilePath);
                        } catch (NotFoundException e) {
                            log.warn("No such file exists to delete: ");
                        } catch (IOException e) {
                            log.error("Error deleting existing file: {} " , e);
                            throw new IOException("Error deleting existing file: " + existingFilePath, e);
                        }
                    }
                    // Save the new file
                    file.transferTo(new File(filePath));
                    company1.setImageFile(filePath);
                }
                // Save the updated resource to the database
                companyRepository.save(company1);

                ResultResponse result = new ResultResponse();
                log.info("Company Details updated successfully for companyId: {} " ,companyId);
                result.setResult("Company Details updated successfully for CompanyId: " + companyId);

                return ResponseEntity.ok(result);
            } else {
                log.warn("The company not found with companyId: " + companyId);
                throw new NotFoundException(HttpStatus.NOT_FOUND, "The company with companyId: " + companyId + " not found");
            }
        } catch (Exceptions ex) {
            log.error("An error occurred while updating the company with companyId: " + companyId, ex);
            throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while updating the company with companyId: " + companyId+" "+ex);
        }
    }


    @Override
    public ResponseEntity<?> deleteCompanyById(String companyId) {
        try {
            Optional<Company> existingCompanyOptional = companyRepository.findById(companyId);

            if (existingCompanyOptional.isPresent()) {
                Company company = existingCompanyOptional.get();

                // Delete the resource
                companyRepository.delete(company);

                ResultResponse result = new ResultResponse();
                log.info("Company deletion is successful for companyId: " + companyId);
                result.setResult("Company details deleted is successful.....");

                return ResponseEntity.ok(result);
            } else {
                log.warn("The company not found with "+companyId);
                throw new NotFoundException(HttpStatus.NOT_FOUND, "The employee with " + companyId + " not found");
            }
        } catch (Exceptions ex) {
            log.warn("An error occurred while deleting the company "+companyId);
            throw new NotFoundException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while deleting the company "+companyId);
        }
    }

    public ResponseEntity<?> multiPartFileStore(MultipartFile file,Company company) throws IOException {
        if(!file.isEmpty()){
            String filename = folderPath+company.getCompanyId()+"_"+file.getOriginalFilename();
             file.transferTo(new File(filename));
             company.setImageFile(filename);

            return ResponseEntity.ok(filename);
        }else{
            ResultResponse response = new ResultResponse();
            response.setResult("Please give the company logo");
            return ResponseEntity.ok(response);
        }
    }

    public ResponseEntity<?> base64Format(String file) throws IOException {

        if(!file.isEmpty()){
            byte[] filePaths = Files.readAllBytes(Paths.get(file));
            file = Base64.getEncoder().encodeToString(filePaths);
            return ResponseEntity.ok(file);
        }else {
           ResultResponse response = new ResultResponse();
           response.setResult("Empty file");
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    private void convertImageToBase64(CompanyResponse companyResponse) throws IOException {
        if (companyResponse.getImageFile() != null && !companyResponse.getImageFile().isEmpty()) {
            ResponseEntity<?> base64Response = base64Format(companyResponse.getImageFile());
            if (base64Response.getStatusCode() == HttpStatus.OK) {
                String base64EncodedImage = (String) base64Response.getBody();
                companyResponse.setImageFile(base64EncodedImage);
            } else {
                // Handle error if necessary
                log.error("Failed to convert image to base64 for company: {}", companyResponse.getCompanyId());
            }
        }
    }
}
