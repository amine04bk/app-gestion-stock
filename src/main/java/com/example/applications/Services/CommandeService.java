package com.example.applications.Services;

import com.example.applications.entities.Commande;
import com.example.applications.entities.LigneCommande;
import com.example.applications.entities.dto.CommandeDTO;
import com.example.applications.entities.dto.CommandeRequestDTO;
import com.example.applications.entities.dto.CommandeResponseDTO;
import com.example.applications.entities.dto.LigneCommandeDTO; // Add this import
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import java.util.List;

public interface CommandeService {
    Commande addCommande(Commande commande);

    @Transactional
    Commande saveCommandeWithLigneCommandes(CommandeRequestDTO commandeRequestDTO);

    @Transactional
    Commande updateCommandeWithLigneCommandes(Long id, CommandeRequestDTO commandeRequestDTO);

    @Transactional
    CommandeResponseDTO getCommandeWithLigneCommandes(Long id);

    void deleteCommande(Long id);

    Commande updateCommande(Commande commande, Long id) throws MessagingException;

    List<CommandeDTO> getAllCommande();

    CommandeDTO getCommandeById(Long id);

    @Transactional
    Commande confirmCommande(Long id);

    // Updated method to return LigneCommandeDTO
    List<LigneCommandeDTO> getAllLigneCommandes();
}