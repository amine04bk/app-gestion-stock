package com.example.applications.Services;

import com.example.applications.Repository.UserRepository;
import com.example.applications.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements Userservice {
    @Autowired
    UserRepository userRepository;

    @Override
    public List<User> RetreiveAllUser() {
        return userRepository.findAll();
    }

    @Override
    public User Adduser(User user) {
        return userRepository.save(user);
    }

    @Override
    public void DeleteUser(Long id) {
        userRepository.deleteById(id);
    }
    @Override
    public User findById(Long id) {
        return userRepository.findById(id).get();
    }

    @Override
    public User findByName(String username) {
        return null;
    }


    @Override
    public User updateUser(User user, Long id) throws MessagingException {
        user.setId(id);
       User userToUpdate= userRepository.findById(id).get();


        return userRepository.save(user);
    }

    @Override
    public User getById(String id) {
        return userRepository.findUserByUsername(id);

    }
    public Optional<User> getUserFromToken(String token) {
        // Récupérer l'authentification actuelle à partir du contexte de sécurité
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Vérifier si l'authentification est valide et si elle contient les informations de l'utilisateur
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                // L'authentification est une UserDetails, donc nous pouvons récupérer l'utilisateur à partir de là
                UserDetails userDetails = (UserDetails) principal;
                // Récupérer l'utilisateur à partir des informations de UserDetails
                // Remarque : vous devez implémenter votre propre logique pour récupérer l'utilisateur à partir du token
                // Cette logique peut dépendre de la façon dont les utilisateurs sont stockés et authentifiés dans votre application
                Optional<User> user = userRepository.findByUsername(userDetails.getUsername());
                return user;
            }
        }

        return null; // Gérer le cas où l'utilisateur n'est pas trouvé
    }


    }

