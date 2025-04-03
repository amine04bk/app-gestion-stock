package com.example.applications.Repository;

import com.example.applications.entities.Commande;
import com.example.applications.entities.LigneCommande;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LigneCommandeRepository extends JpaRepository<LigneCommande,Long> {
    void deleteByCommande(Commande Commande);
    List<LigneCommande> findByCommande(Commande Commande);

    List<LigneCommande> findByCommandeId(Long CommandeId);

}

