package com.example.applications.Services;

import com.example.applications.Repository.FournisseurRepository;
import com.example.applications.entities.dto.FournisseurDTO;
import com.example.applications.entities.Fournisseur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.mail.MessagingException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FournisseurServiceImpl implements FournisseurService {
    @Autowired
    FournisseurRepository fournisseurRepository;

    @Override
    public Fournisseur addFournisseur(Fournisseur fournisseur) {
        return fournisseurRepository.save(fournisseur);
    }

    @Override
    public void deleteFournisseur(Long id) {
        fournisseurRepository.deleteById(id);

    }

    @Override
    public Fournisseur findById(Long id) {
        return fournisseurRepository.findById(id).get();
    }

    @Override
    public Fournisseur updateFournisseur(Fournisseur fournisseur, Long id) throws MessagingException {
        fournisseur.setId(id);
        Fournisseur fournisseurToUpdate = fournisseurRepository.findById(id).get();
        return fournisseurRepository.save(fournisseur);
    }
    /***Start DTO ***/
    @Override
    public List<FournisseurDTO> getAllFournisseur() {
        List<Fournisseur> fournisseurs = fournisseurRepository.findAll();
        return fournisseurs.stream()
                .map(fournisseur -> new FournisseurDTO(
                        fournisseur.getId(),
                        fournisseur.getName(),
                        fournisseur.getEmail(),
                        fournisseur.getAdress(),
                        fournisseur.getTel()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public FournisseurDTO getFournisseurById(Long id) {
        Fournisseur fournisseur = fournisseurRepository.findById(id).get();
        return new FournisseurDTO(
                fournisseur.getId(),
                fournisseur.getName(),
                fournisseur.getEmail(),
                fournisseur.getAdress(),
                fournisseur.getTel());
    }
    /***End DTO ***/
}

