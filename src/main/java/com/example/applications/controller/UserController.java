package com.example.applications.controller;

import com.example.applications.Exception.EmailAlreadyExistsException;
import com.example.applications.Repository.RoleRepository;
import com.example.applications.Repository.UserRepository;
import com.example.applications.Services.UserServiceImpl;
import com.example.applications.entities.dto.UserDTO;
import com.example.applications.entities.User;
import com.example.applications.mapper.ApiResponse;
import com.example.applications.security.WebSecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    UserServiceImpl userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    WebSecurityConfig webSecurityConfig;
    @Autowired
    private RoleRepository roleRepository;
    @GetMapping("/retrieve-all-user")
    public List<User> getAllUsers() {
        List<User> list = userService.RetreiveAllUser();
        return list;
    }

    @GetMapping("/getAllUser")
    @ResponseBody
    public List<UserDTO> getAllUser() {
        List<UserDTO> list = userService.getAllUsers();
        return list;
    }
    @DeleteMapping("/deleteUser/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable("id") Long id) {
        try {
            userService.DeleteUser(id);
            ApiResponse response = new ApiResponse("Utilisateur supprimé avec succès", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (DataIntegrityViolationException e) {
            ApiResponse response = new ApiResponse("impossible de supprimer l'utilisateur", HttpStatus.CONFLICT.value());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }
    @GetMapping("/getUserById/{user-id}")
    @ResponseBody
    public User getUserById(@PathVariable("user-id")Long id){
        return userService.findById(id);
    }
    @PostMapping("/Add-user")
    public ResponseEntity<?> addUser(@RequestBody User user) {
        if (user.getId() == null) {
            // Create new user
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new EmailAlreadyExistsException("Email already exists");
            }
        } else {
            // Update existing user
            User existingUser = userRepository.findById(user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            if (!existingUser.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(user.getEmail())) {
                throw new EmailAlreadyExistsException("Email already exists");
            }
        }
        if (user.getId() == null || user.getPassword() != ""){
            String bcrypt = webSecurityConfig.passwordEncoder().encode(user.getPassword());
            user.setPassword(bcrypt);
        } else {
            User existingUser = userRepository.findById(user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            user.setPassword(existingUser.getPassword());
        }
        User savedUser = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @GetMapping("/find-by-username/{username}")
    @ResponseBody
    public User findByname(@PathVariable("username")String username){
        return userService.findByName(username);
    }
    @PutMapping(value="/modifyuser/{user-id}")
    public User modify(@PathVariable (name="user-id") Long id, @RequestBody User user) throws MessagingException {

        return userService.updateUser(user, id);
    }


}
