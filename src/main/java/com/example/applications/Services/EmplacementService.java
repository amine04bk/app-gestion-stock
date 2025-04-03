package com.example.applications.Services;

import com.example.applications.entities.Emplacement;

import javax.mail.MessagingException;
import java.util.List;

public interface EmplacementService {
    List<Emplacement> getAllEmplacement ();
    Emplacement addEmplacement (Emplacement emplacement);
    public void deleteEmplacement(Long id);
    Emplacement findById (Long id);
    Emplacement updateEmplacement(Emplacement emplacement , Long id) throws MessagingException;


}
