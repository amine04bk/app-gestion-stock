package com.example.applications.Services;

import com.example.applications.Repository.EmplacementRepository;
import com.example.applications.entities.Emplacement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.util.List;

@Service
public class EmplacementServiceImpl implements EmplacementService {
    @Autowired
    EmplacementRepository EmplacementRepository;


    @Override
    public List<Emplacement> getAllEmplacement() {
        return EmplacementRepository.findAll();
    }

    @Override
    public Emplacement addEmplacement(Emplacement Emplacement) {
        return EmplacementRepository.save(Emplacement);
    }

    @Override
    public void deleteEmplacement(Long id) {
        EmplacementRepository.deleteById(id);

    }

    @Override
    public Emplacement findById(Long id) {
        return EmplacementRepository.findById(id).get();
    }

    public Emplacement updateEmplacement(Emplacement Emplacement, Long id) throws MessagingException {
        Emplacement.setId(id);
        Emplacement EmplacementToUpdate = EmplacementRepository.findById(id).get();
        return EmplacementRepository.save(Emplacement);
    }
}

