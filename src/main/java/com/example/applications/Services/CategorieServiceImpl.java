package com.example.applications.Services;

import com.example.applications.Repository.CategorieRepository;
import com.example.applications.entities.Categorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.util.List;

@Service
public class CategorieServiceImpl implements CategorieService {
    @Autowired
    CategorieRepository categorieRepository;


    @Override
    public List<Categorie> getAllCategorie() {
        return categorieRepository.findAll();
    }

    @Override
    public Categorie addCategorie(Categorie categorie) {
        return categorieRepository.save(categorie);
    }

    @Override
    public void deleteCategorie(Long id) {
        categorieRepository.deleteById(id);

    }

    @Override
    public Categorie findById(Long id) {
        return categorieRepository.findById(id).get();
    }

    public Categorie updateCategorie(Categorie categorie, Long id) throws MessagingException {
        categorie.setId(id);
        Categorie categorieToUpdate = categorieRepository.findById(id).get();
        return categorieRepository.save(categorie);
    }
}

