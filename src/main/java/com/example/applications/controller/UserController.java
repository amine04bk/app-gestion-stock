package com.example.applications.controller;

import com.example.applications.Repository.UserRepository;
import com.example.applications.Services.UserServiceImpl;
import com.example.applications.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/retrieve-all-user")
    @ResponseBody
    public List<User> getAllUsers() {
        List<User> list = userService.RetreiveAllUser();
        return list;
    }
    @DeleteMapping("/remove-user/{user-id}")
    @ResponseBody
    public void removeUser(@PathVariable("user-id") Long id) {
        userService.DeleteUser(id);

    }
    @GetMapping("/retrieve-user/{user-id}")
    @ResponseBody
    public User getUserById(@PathVariable("user-id")Long id){
        return userService.findById(id);
    }

    @PostMapping("/Add-user")
    @ResponseBody
    public User addUser(@Valid @RequestBody User user){

        return userRepository.save(user);

        //return userService.Adduser(user);
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




    @GetMapping("/retrieve-username/{id}")
    @ResponseBody
    public User getusername(@PathVariable("id") String username) {

        return userService.getById(username);
    }


}
