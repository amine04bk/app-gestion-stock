package com.example.applications.Services;
import com.example.applications.entities.Categorie;
import javax.mail.MessagingException;
import java.util.List;

public interface CategorieService {
    List<Categorie> getAllCategorie ();
    Categorie addCategorie (Categorie categorie);
    public void deleteCategorie(Long id);
    Categorie findById (Long id);
    Categorie updateCategorie(Categorie categorie ,Long id) throws MessagingException;


}
