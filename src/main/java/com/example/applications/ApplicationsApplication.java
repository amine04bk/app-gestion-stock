package com.example.applications;

import com.example.applications.Repository.RoleRepository;
import com.example.applications.Repository.UserRepository;
import com.example.applications.entities.Role;
import com.example.applications.entities.User;
import com.example.applications.security.WebSecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class ApplicationsApplication {
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    WebSecurityConfig webSecurityConfig;

    public static void main(String[] args) {
        SpringApplication.run(ApplicationsApplication.class, args);
    }
    @Bean
    CommandLineRunner start() {

        return args -> {
            System.out.println("run");
            List<Role> roles = (List<Role>) roleRepository.findAll();
            if (roles.isEmpty()) {
                Role roleAdmin = new Role();
                roleAdmin.setName("Admin");
                roleRepository.save(roleAdmin);

            }
            if (!userRepository.existsByEmail("khalil@gmail.com")) {
                String bcrypt = webSecurityConfig.passwordEncoder().encode("123");
//                List<Role> rolesAdmin = new ArrayList<>();
                Role r = roleRepository.findByName("Admin")
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//                rolesAdmin.add(r);
                User user = new User();
                //user.setRoles(rolesAdmin);
                user.setRole(r);
                user.setUsername("khalil");
                user.setPassword(bcrypt);
                user.setEmail("khalil@gmail.com");
                userRepository.save(user);
          }
        };
    }


}
