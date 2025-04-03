package com.example.applications.Services;


import com.example.applications.Repository.RoleRepository;
import com.example.applications.entities.Role;
import com.example.applications.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {
    @Autowired
    RoleRepository roleRepository;

    @Override
    public Role AddRole(Role role) {
        return roleRepository.save(role);
    }
    @Override
    public void DeleteRole(Long id) {
         roleRepository.deleteById(id);

    }
    @Override
    public List<Role> getAllRole() {
        return roleRepository.findAll();
    }

    @Override
    public Role updateRole(Role role, Long id) {
        role.setId(id);
        return roleRepository.save(role);
    }

    public Role findById(Long id) {
        return roleRepository.findById(id).get();
    }
}
