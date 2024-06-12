package com.pbt.ems.controller;

import com.pbt.ems.entity.Designation;
import com.pbt.ems.request.DesignationRequest;
import com.pbt.ems.service.DesignationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@CrossOrigin(origins="*")
@RequestMapping("/designation")
public class DesignationController {

    @Autowired
    public DesignationController(DesignationService designationService) {
        this.designationService = designationService;
    }
    private final DesignationService designationService;

    @PostMapping("/add")
    public ResponseEntity<?> createDesignation(@RequestBody DesignationRequest designationRequest){
        return designationService.createDesignation(designationRequest);
    }

    @GetMapping("/all")
    public List<Designation> getAllDesignation(){
        return designationService.getAllDesignation();
    }

    @GetMapping("/{id}")
    public Optional<Designation> getById(@PathVariable int id){
        return designationService.getById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateById(@PathVariable int id,@RequestBody DesignationRequest designationRequest){
        return designationService.updateById(id,designationRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable int id){
        return designationService.deleteById(id);
    }

}
