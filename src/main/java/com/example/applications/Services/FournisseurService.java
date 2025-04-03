package com.example.applications.Services;


import com.example.applications.entities.dto.FournisseurDTO;
import com.example.applications.entities.Fournisseur;

import javax.mail.MessagingException;
import java.util.List;

public interface FournisseurService {

    Fournisseur addFournisseur (Fournisseur fournisseur);
    public void deleteFournisseur(Long id);
    Fournisseur findById (Long id);
    Fournisseur updateFournisseur(Fournisseur fournisseur , Long id) throws MessagingException;

    List<FournisseurDTO> getAllFournisseur ();
    FournisseurDTO getFournisseurById (Long id);

}
