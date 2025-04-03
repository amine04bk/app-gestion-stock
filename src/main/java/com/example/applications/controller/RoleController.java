package com.example.applications.controller;

import com.example.applications.Services.RoleService;
import com.example.applications.entities.Role;
import com.example.applications.mapper.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/role")
public class RoleController {
    @Autowired
    RoleService roleService;
    @GetMapping("/getAllRole")
    @ResponseBody
    public List<Role> getAllRole() {
        List<Role> list = roleService.getAllRole();
        return list;
    }

    @GetMapping("/getRoleById/{id}")
    @ResponseBody
    public Role getRoleById(@PathVariable("id")Long id){
        return roleService.findById(id);
    }

    @DeleteMapping("/deleteRole/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse> removeRole(@PathVariable("id") Long id) {
        try {
            roleService.DeleteRole(id);
            ApiResponse response = new ApiResponse("Role supprimé avec succès", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (DataIntegrityViolationException e) {
            ApiResponse response = new ApiResponse("impossible de supprimer role", HttpStatus.CONFLICT.value());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }
    @PostMapping("/addRole")
    @ResponseBody
    public Role addRole(@RequestBody Role role){
        return roleService.AddRole(role);
    }
    @PutMapping(value="/modifyrole/{role-id}")
    public Role modify(@PathVariable (name="role-id") Long id, @RequestBody Role role) {

        return roleService.updateRole(role, id);
    }





}

