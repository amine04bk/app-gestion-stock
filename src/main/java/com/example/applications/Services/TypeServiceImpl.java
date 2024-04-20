package com.example.applications.Services;

import com.example.applications.Repository.TypeRegleRepository;
import com.example.applications.entities.TypeRegle;
import com.example.applications.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class TypeServiceImpl implements TypeRegleService{
    @Autowired
    TypeRegleRepository typeRegleRepository;
    @Override
    public List<TypeRegle> getAllTypeRegle() {

        return typeRegleRepository.findAll();
    }

    @Override
    public TypeRegle addTypeRegle(TypeRegle typeRegle) {
        return typeRegleRepository.save(typeRegle);
    }

    @Override
    public void deleteTypeRegle(Long id) {
        typeRegleRepository.deleteById(id);

    }

    @Override
    public TypeRegle findByID(Long id) {
        return typeRegleRepository.findById(id).get();
    }

    @Override
    public TypeRegle updateTypeRegle(TypeRegle typeRegle, Long id) {
        typeRegle.setId(id);
        return typeRegleRepository.save(typeRegle);
    }
}
