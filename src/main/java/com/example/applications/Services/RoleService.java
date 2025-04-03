package com.example.applications.Services;
import com.example.applications.entities.Role;
import java.util.List;

public interface RoleService {
    Role AddRole(Role role);
    public void DeleteRole(Long id);
    List<Role> getAllRole ();
    Role findById (Long id);
    Role updateRole(Role role, Long id);

}
