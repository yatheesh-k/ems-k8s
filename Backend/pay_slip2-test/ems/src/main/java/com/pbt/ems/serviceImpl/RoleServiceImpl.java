package com.pbt.ems.serviceImpl;

import com.pbt.ems.entity.Role;
import com.pbt.ems.repository.RoleRepository;
import com.pbt.ems.service.RoleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleServiceImpl(RoleRepository roleRepository){
        this.roleRepository =roleRepository;
    }
    private final RoleRepository roleRepository;


    @Override
    public List<Role> getAllRoles() {
        List<Role> roleEntities = roleRepository.findAll();
        return roleEntities;
    }

}
