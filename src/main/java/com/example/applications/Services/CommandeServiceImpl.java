package com.example.applications.Services;

import com.example.applications.Repository.CommandeRepository;
import com.example.applications.Repository.LigneCommandeRepository;
import com.example.applications.entities.Commande;
import com.example.applications.entities.LigneCommande;
import com.example.applications.entities.dto.CommandeDTO;
import com.example.applications.entities.dto.CommandeRequestDTO;
import com.example.applications.entities.dto.CommandeResponseDTO;
import com.example.applications.entities.dto.LigneCommandeDTO; // Add this import
import com.example.applications.entities.dto.LigneCommandeResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommandeServiceImpl implements CommandeService {
    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private LigneCommandeRepository ligneCommandeRepository;

    private static final Logger logger = LoggerFactory.getLogger(CommandeServiceImpl.class);

    @Override
    public Commande addCommande(Commande commande) {
        return commandeRepository.save(commande);
    }

    @Transactional
    @Override
    public Commande saveCommandeWithLigneCommandes(CommandeRequestDTO commandeRequestDTO) {
        logger.info("Received CommandeRequestDTO: {}", commandeRequestDTO);

        // Save the Commande entity
        Commande commande = commandeRepository.save(commandeRequestDTO.getCommande());

        // Process each LigneCommande from the request
        for (CommandeRequestDTO.LigneCommandeDTO ligneCommandeDTO : commandeRequestDTO.getLigneCommandes()) {
            logger.info("Processing LigneCommandeDTO: produit={}, qte={}, pu={}",
                    ligneCommandeDTO.getProduit(), ligneCommandeDTO.getQte(), ligneCommandeDTO.getPu());

            // Create a new LigneCommande entity
            LigneCommande ligneCommande = new LigneCommande();
            ligneCommande.setCommande(commande);
            ligneCommande.setProduit(ligneCommandeDTO.getProduit()); // Set produitId from the request
            ligneCommande.setQte(ligneCommandeDTO.getQte());
            ligneCommande.setPu(ligneCommandeDTO.getPu());

            // Calculate mntTotal (qte * pu)
            if (ligneCommande.getQte() != null && ligneCommande.getPu() != null) {
                try {
                    float pu = Float.parseFloat(ligneCommande.getPu());
                    ligneCommande.setMntTotal((int) (ligneCommande.getQte() * pu));
                } catch (NumberFormatException e) {
                    logger.error("Invalid pu format: {}", ligneCommande.getPu());
                    ligneCommande.setMntTotal(0);
                }
            }

            // Save the LigneCommande
            ligneCommandeRepository.save(ligneCommande);
        }

        return commande;
    }

    @Transactional
    @Override
    public Commande updateCommandeWithLigneCommandes(Long id, CommandeRequestDTO commandeRequestDTO) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande not found"));

        // Update basic fields
        commande.setNum(commandeRequestDTO.getCommande().getNum());
        commande.setDate(commandeRequestDTO.getCommande().getDate());
        commande.setMntTotalHT(commandeRequestDTO.getCommande().getMntTotalHT());
        commande.setMntTotalTTC(commandeRequestDTO.getCommande().getMntTotalTTC());
        commande.setMntTotalTVA(commandeRequestDTO.getCommande().getMntTotalTVA());
        commande.setConfirmation(commandeRequestDTO.getCommande().getConfirmation());

        // Save the updated Commande
        commandeRepository.save(commande);

        // Delete old LigneCommande records
        ligneCommandeRepository.deleteByCommande(commande);

        // Save new LigneCommande records
        for (CommandeRequestDTO.LigneCommandeDTO ligneCommandeDTO : commandeRequestDTO.getLigneCommandes()) {
            LigneCommande ligneCommande = new LigneCommande();
            ligneCommande.setCommande(commande);
            ligneCommande.setProduit(ligneCommandeDTO.getProduit()); // Set produitId from the request
            ligneCommande.setQte(ligneCommandeDTO.getQte());
            ligneCommande.setPu(ligneCommandeDTO.getPu());

            // Calculate mntTotal (qte * pu)
            if (ligneCommande.getQte() != null && ligneCommande.getPu() != null) {
                try {
                    float pu = Float.parseFloat(ligneCommande.getPu());
                    ligneCommande.setMntTotal((int) (ligneCommande.getQte() * pu));
                } catch (NumberFormatException e) {
                    logger.error("Invalid pu format: {}", ligneCommande.getPu());
                    ligneCommande.setMntTotal(0);
                }
            }

            ligneCommandeRepository.save(ligneCommande);
        }

        return commande;
    }

    @Transactional
    @Override
    public CommandeResponseDTO getCommandeWithLigneCommandes(Long id) {
        Commande commande = commandeRepository.findById(id).orElse(null);
        if (commande == null) {
            return null; // Commande not found
        }

        CommandeResponseDTO commandeResponse = new CommandeResponseDTO();
        commandeResponse.setId(commande.getId());
        commandeResponse.setNum(commande.getNum());
        commandeResponse.setDate(commande.getDate());
        commandeResponse.setFournisseur(commande.getFournisseur());
        commandeResponse.setMntTotalHT(commande.getMntTotalHT());
        commandeResponse.setMntTotalTTC(commande.getMntTotalTTC());
        commandeResponse.setMntTotalTVA(commande.getMntTotalTVA());

        List<LigneCommandeResponseDTO> ligneCommandes = ligneCommandeRepository.findByCommandeId(id)
                .stream()
                .map(this::convertToLigneCommandeResponseDTO)
                .collect(Collectors.toList());
        commandeResponse.setLigneCommandes(ligneCommandes);

        return commandeResponse;
    }

    private LigneCommandeResponseDTO convertToLigneCommandeResponseDTO(LigneCommande ligneCommande) {
        LigneCommandeResponseDTO dto = new LigneCommandeResponseDTO();
        dto.setId(ligneCommande.getId());
        dto.setQte(ligneCommande.getQte());
        dto.setProduitId(ligneCommande.getProduitId()); // Set produitId
        dto.setPu(ligneCommande.getPu());
        return dto;
    }

    @Override
    public void deleteCommande(Long id) {
        commandeRepository.deleteById(id);
    }

    @Override
    public Commande updateCommande(Commande commande, Long id) throws MessagingException {
        commande.setId(id);
        return commandeRepository.save(commande);
    }

    @Override
    public List<CommandeDTO> getAllCommande() {
        List<Commande> commandes = commandeRepository.findAll();
        return commandes.stream()
                .map(commande -> new CommandeDTO(
                        commande.getId(),
                        commande.getNum(),
                        commande.getDate(),
                        commande.getMntTotalHT(),
                        commande.getMntTotalTTC(),
                        commande.getMntTotalTVA(),
                        (commande.getFournisseur() != null) ? commande.getFournisseur().getEmail() : null,
                        commande.getConfirmation()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public CommandeDTO getCommandeById(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande not found"));
        return new CommandeDTO(
                commande.getId(),
                commande.getNum(),
                commande.getDate(),
                commande.getMntTotalHT(),
                commande.getMntTotalTTC(),
                commande.getMntTotalTVA(),
                (commande.getFournisseur() != null) ? commande.getFournisseur().getEmail() : null,
                commande.getConfirmation()
        );
    }

    @Transactional
    @Override
    public Commande confirmCommande(Long id) {
        logger.info("Confirming commande with ID: {}", id);

        // Retrieve the Commande by ID
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande not found with ID: " + id));

        // Update the confirmation field to true
        commande.setConfirmation(true);

        // Save the updated Commande
        return commandeRepository.save(commande);
    }

    @Override
    public List<LigneCommandeDTO> getAllLigneCommandes() {
        logger.info("Fetching all LigneCommande entries");
        List<LigneCommande> ligneCommandes = ligneCommandeRepository.findAll();
        return ligneCommandes.stream()
                .map(lc -> new LigneCommandeDTO(
                        lc.getId(),
                        lc.getProduitId(),
                        lc.getCommande() != null ? lc.getCommande().getId() : null, // Extract commandeId
                        lc.getQte(),
                        lc.getMntTotal(),
                        lc.getPu()
                ))
                .collect(Collectors.toList());
    }
}