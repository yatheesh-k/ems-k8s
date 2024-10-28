package com.pb.employee.serviceImpl;

import com.pb.employee.common.ResponseBuilder;
import com.pb.employee.exception.EmployeeErrorMessageKey;
import com.pb.employee.exception.EmployeeException;
import com.pb.employee.exception.ErrorMessageHandler;
import com.pb.employee.opensearch.OpenSearchOperations;
import com.pb.employee.persistance.model.CompanyEntity;
import com.pb.employee.persistance.model.EmployeeEntity;
import com.pb.employee.request.*;
import com.pb.employee.service.ExperienceLetterService;
import com.pb.employee.util.Constants;
import com.pb.employee.util.ResourceIdUtils;
import com.pb.employee.util.SSLUtil;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.xhtmlrenderer.pdf.ITextRenderer;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.BufferedImageOp;
import java.awt.image.ConvolveOp;
import java.awt.image.Kernel;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.net.URL;
import java.util.*;
import java.util.List;

@Service
@Slf4j
public class ExperienceLetterServiceImpl implements ExperienceLetterService {

    @Autowired
    private OpenSearchOperations openSearchOperations;

    @Autowired
    private Configuration freeMarkerConfig;


    @Override
    public ResponseEntity<byte[]> downloadServiceLetter(HttpServletRequest request, int templateNo, ExperienceLetterFieldsRequest experienceLetterFieldsRequest) {
        List<CompanyEntity> companyEntity = null;
        EmployeeEntity employee = null;
        String index = ResourceIdUtils.generateCompanyIndex(experienceLetterFieldsRequest.getCompanyName());

        try {
            // Fetch employee details
            SSLUtil.disableSSLVerification();
            employee = openSearchOperations.getEmployeeById(experienceLetterFieldsRequest.getEmployeeId(), null, index);
            if (employee == null) {
                log.error("Employee does not exist with this Id: {}", experienceLetterFieldsRequest.getEmployeeId());
                throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.EMPLOYEE_NOT_FOUND), experienceLetterFieldsRequest.getEmployeeId()), HttpStatus.NOT_FOUND);
            }

            // Fetch company details
            companyEntity = openSearchOperations.getCompanyByData(null, Constants.COMPANY, experienceLetterFieldsRequest.getCompanyName());
            if (companyEntity.isEmpty()) {
                log.error("Company not found: {}", experienceLetterFieldsRequest.getCompanyName());
                throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.COMPANY_NOT_EXIST), experienceLetterFieldsRequest.getCompanyName()), HttpStatus.NOT_FOUND);
            }

            // Load the company image from a URL
            String imageUrl = experienceLetterFieldsRequest.getImage();
            BufferedImage originalImage = ImageIO.read(new URL(imageUrl));
            if (originalImage == null) {
                log.error("Failed to load image from URL: {}", imageUrl);
                throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.IMAGE_NOT_LOADED),experienceLetterFieldsRequest.getImage()), HttpStatus.NOT_FOUND);
            }

            // Apply the watermark effect
            float opacity = 0.5f;
            double scaleFactor = 1.6d;
            BufferedImage watermarkedImage = applyOpacity(originalImage, opacity, scaleFactor, 30);

            // Convert BufferedImage to Base64 string for HTML
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(watermarkedImage, "png", baos);
            String base64Image = Base64.getEncoder().encodeToString(baos.toByteArray());

            Map<String, Object> model = new HashMap<>();
            model.put(Constants.EMPLOYEE, employee);
            model.put(Constants.COMPANY, companyEntity);
            model.put(Constants.REQUEST, experienceLetterFieldsRequest);
            model.put(Constants. BLURRED_IMAGE, Constants.DATA + base64Image);

            // Determine the template name
            String templateName = switch (templateNo) {
                case 1 -> Constants.EXPERIENCE_LETTER;
                case 2 -> Constants.EXPERIENCE_LETTER_TWO;
                default -> throw new IllegalArgumentException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.INVALID_TEMPLATE_NUMBER));
            };

            // Fetch FreeMarker template
            Template template = freeMarkerConfig.getTemplate(templateName);

            // Process template to generate HTML content
            StringWriter stringWriter = new StringWriter();
            try {
                template.process(model, stringWriter);
            } catch (TemplateException e) {
                throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.FAILED_TO_PROCESS)), HttpStatus.NOT_FOUND);
            }
            String htmlContent = stringWriter.toString();

            // Convert HTML to PDF
            byte[] pdfBytes = generatePdfFromHtml(htmlContent);

            // Set HTTP headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.builder(Constants.ATTACHMENT).filename(Constants.EXPERIENCE_LETTER_PDF).build());

            // Return response with PDF content
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            log.error("Error generating service letter: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private BufferedImage applyOpacity(BufferedImage originalImage, float opacity, double scaleFactor, double rotationDegrees) {
        int newWidth = (int) (originalImage.getWidth() * scaleFactor);
        int newHeight = (int) (originalImage.getHeight() * scaleFactor);
        double radians = Math.toRadians(-rotationDegrees);

        int rotatedWidth = (int) Math.abs(newWidth * Math.cos(radians)) + (int) Math.abs(newHeight * Math.sin(radians));
        int rotatedHeight = (int) Math.abs(newWidth * Math.sin(radians)) + (int) Math.abs(newHeight * Math.cos(radians));

        BufferedImage watermarkedImage = new BufferedImage(rotatedWidth, rotatedHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = watermarkedImage.createGraphics();

        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);

        int centerX = rotatedWidth / 2;
        int centerY = rotatedHeight / 2;

        g2d.translate(centerX, centerY);
        g2d.rotate(radians);
        g2d.translate(-newWidth / 2, -newHeight / 2);

        Image scaledImage = originalImage.getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);
        g2d.drawImage(scaledImage, 0, 0, null);

        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, opacity));
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, rotatedWidth, rotatedHeight);

        g2d.dispose();

        return watermarkedImage;
    }

    public ResponseEntity<byte[]> uploadExperienceLetter(ExperienceLetterRequest request) {
        try {
            // Generate HTML from the FreeMarker template
            String htmlContent = generateHtmlFromTemplate(request);

            // Convert HTML to PDF
            byte[] pdfBytes = generatePdfFromHtml(htmlContent);

            // Set HTTP headers for PDF download
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                    ContentDisposition.builder("attachment")
                            .filename("experience_letter.pdf")
                            .build()
            );

            // Return the PDF as a response
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            // Log the error
            e.printStackTrace(); // Replace with a proper logging framework
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String generateHtmlFromTemplate(ExperienceLetterRequest request) throws Exception {
        Template template = freeMarkerConfig.getTemplate("dynamicExpLetter.ftl");
        return FreeMarkerTemplateUtils.processTemplateIntoString(template, request);
    }

    private byte[] generatePdfFromHtml(String html) throws IOException {
        // Escape unescaped ampersands
        html = html.replaceAll("&(?![a-zA-Z]{2,6};|#\\d{1,5};)", "&amp;");

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new IOException("Error generating PDF: " + e.getMessage(), e);
        }
    }
}