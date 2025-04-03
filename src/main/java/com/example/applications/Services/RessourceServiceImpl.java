package com.example.applications.Services;


import com.example.applications.Repository.RessourceRepository;
import com.example.applications.entities.Ressource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RessourceServiceImpl implements RessourceService {
    @Autowired
    RessourceRepository ressourceRepository;


    @Override
    public List<Ressource> getAllRessource() {
        return ressourceRepository.findAll();
    }

    @Override
    public Ressource addRessource(Ressource ressource) {
        return ressourceRepository.save(ressource);
    }

    @Override
    public void deleteRessource(Long id) {
        ressourceRepository.deleteById(id);

    }

    @Override
    public Ressource findById(Long id) {
        return ressourceRepository.findById(id).get();
    }

    public Ressource updateRessource(Ressource ressource, Long id)  {
        ressource.setId(id);
        Ressource ressourceToUpdate = ressourceRepository.findById(id).get();
        return ressourceRepository.save(ressource);
    }
}

