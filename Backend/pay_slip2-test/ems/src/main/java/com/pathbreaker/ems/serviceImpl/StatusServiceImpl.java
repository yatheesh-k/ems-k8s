package com.pathbreaker.payslip.serviceImpl;

import com.pathbreaker.payslip.entity.Status;
import com.pathbreaker.payslip.repository.StatusRepository;
import com.pathbreaker.payslip.service.StatusService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class StatusServiceImpl implements StatusService {

    @Autowired
    private StatusServiceImpl(StatusRepository statusRepository){
        this.statusRepository =statusRepository;
    }
    private final StatusRepository statusRepository;

    @Override
    public List<Status> getAllStatus() {
        List<Status> statusEntities = statusRepository.findAll();
        return statusEntities;
    }


}
