package com.example.applications.Services;

import com.example.applications.entities.TypeRegle;
import com.example.applications.entities.User;


import java.util.List;

public interface TypeRegleService {
    List<TypeRegle> getAllTypeRegle ();
    TypeRegle addTypeRegle (TypeRegle typeRegle);
    public void deleteTypeRegle(Long id);
    TypeRegle findByID (Long id);
    TypeRegle updateTypeRegle(TypeRegle typeRegle ,Long id) ;
}
