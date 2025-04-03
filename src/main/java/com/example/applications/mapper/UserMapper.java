package com.example.applications.mapper;

import com.example.applications.entities.dto.RoleDTO;
import com.example.applications.entities.dto.UserDTO;
import com.example.applications.entities.Role;
import com.example.applications.entities.User;

public class UserMapper {

    public static UserDTO toUserDTO(User user) {
//        return new UserDTO(
//                user.getId(),
//                user.getUsername(),
//                user.getEmail(),
//                user.getRoles().stream()
//                        .map(UserMapper::toRoleDTO)
//                        .collect(Collectors.toList())
//        );
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                UserMapper.toRoleDTO(user.getRole())
        );
    }

    public static RoleDTO toRoleDTO(Role role) {
        return new RoleDTO(
                role.getId(),
                role.getName()
        );
    }

    public static User toUserEntity(UserDTO userDTO) {
        return new User(
                userDTO.getUsername(),
                null,  // You may want to handle the password separately
                userDTO.getEmail()
        );
    }

    public static Role toRoleEntity(RoleDTO roleDTO) {
        return new Role(
                roleDTO.getId(),
                roleDTO.getName()
        );
    }
}
