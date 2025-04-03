package com.example.applications.Services;


import com.example.applications.entities.Ressource;

import javax.mail.MessagingException;
import java.util.List;

public interface RessourceService {
    List<Ressource> getAllRessource();
    Ressource addRessource(Ressource ressource);
    public void deleteRessource(Long id);
    Ressource findById (Long id);
    Ressource updateRessource(Ressource ressource , Long id) throws MessagingException;


}
