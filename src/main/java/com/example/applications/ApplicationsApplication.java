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
                Role role = new Role();
                role.setName("ROLE_USER");
                roleRepository.save(role);
                Role role2 = new Role();
                role2.setName("ROLE_ADMIN");
                roleRepository.save(role2);
                Role roleResponsable= new Role();
                roleResponsable.setName("ROLE_RESPONSABLE");
                roleRepository.save(roleResponsable);
                Role roleGestionnaire= new Role();
                roleGestionnaire.setName("ROLE_GESTIONNAIRE");
                roleRepository.save(roleGestionnaire);


            }
            if (!userRepository.existsByEmail("Seif@gmail.com")) {
                String bcrypt = webSecurityConfig.passwordEncoder().encode("12345678");
                List<Role> rolesAdmin = new ArrayList<>();
                Role r = roleRepository.findByName("ROLE_ADMIN")
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                rolesAdmin.add(r);
                User user = new User();
                user.setRoles(rolesAdmin);
                user.setUsername("Seif");
                user.setPassword(bcrypt);
                user.setEmail("Seif@gmail.com");
                userRepository.save(user);
            }
        };
    }


}
