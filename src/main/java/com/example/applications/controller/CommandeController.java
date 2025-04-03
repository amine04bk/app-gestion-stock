package com.example.applications.controller;

import com.example.applications.Services.CommandeService;
import com.example.applications.entities.Commande;
import com.example.applications.entities.dto.CommandeDTO;
import com.example.applications.entities.dto.CommandeRequestDTO;
import com.example.applications.entities.dto.CommandeResponseDTO;
import com.example.applications.entities.dto.LigneCommandeDTO; // Add this import
import com.example.applications.mapper.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@CrossOrigin("*")
@RestController
@RequestMapping("/commande")
public class CommandeController {
    @Autowired
    CommandeService commandeService;
    private static final Logger logger = LoggerFactory.getLogger(CommandeController.class);

    @GetMapping("/getAllCommande")
    @ResponseBody
    public List<CommandeDTO> getAllCommande() {
        List<CommandeDTO> list = commandeService.getAllCommande();
        return list;
    }

    @GetMapping("/getCommandeById/{id}")
    @ResponseBody
    public CommandeDTO getCommandeById(@PathVariable("id") Long id) {
        return commandeService.getCommandeById(id);
    }

    @PostMapping("/addCommande")
    @ResponseBody
    public ResponseEntity<Commande> addCommande(@RequestBody CommandeRequestDTO commandeRequestDTO) {
        logger.info("Received request body for /addCommande: {}", commandeRequestDTO);
        Commande savedCommande = commandeService.saveCommandeWithLigneCommandes(commandeRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCommande);
    }

    @PostMapping("/saveWithLigneCommandes")
    public ResponseEntity<Commande> createCommandeWithLigneCommandes(@RequestBody CommandeRequestDTO commandeRequestDTO) {
        logger.info("Received request body for /saveWithLigneCommandes: {}", commandeRequestDTO);
        Commande savedCommande = commandeService.saveCommandeWithLigneCommandes(commandeRequestDTO);
        return ResponseEntity.ok(savedCommande);
    }

    @PutMapping("/updateWithLigneCommandes/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse> updateCommandeWithLigneCommandes(@PathVariable Long id, @RequestBody CommandeRequestDTO commandeRequestDTO) {
        try {
            Commande updatedCommande = commandeService.updateCommandeWithLigneCommandes(id, commandeRequestDTO);
            ApiResponse response = new ApiResponse("Commande updated successfully.", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (DataIntegrityViolationException e) {
            ApiResponse response = new ApiResponse("impossible de updated Commande", HttpStatus.CONFLICT.value());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @GetMapping("/getCommandeWithLigneCommandes/{id}")
    @ResponseBody
    public ResponseEntity<CommandeResponseDTO> getCommandeWithLigneCommandes(@PathVariable Long id) {
        CommandeResponseDTO commandeResponse = commandeService.getCommandeWithLigneCommandes(id);
        return commandeResponse != null ? ResponseEntity.ok(commandeResponse) : ResponseEntity.notFound().build();
    }

    @PutMapping(value = "/updateCommande/{id}")
    public Commande updateCommande(@PathVariable(name = "id") Long id, @RequestBody Commande commande) throws MessagingException {
        return commandeService.updateCommande(commande, id);
    }

    @DeleteMapping("/deleteCommande/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse> deleteCommande(@PathVariable("id") Long id) {
        try {
            commandeService.deleteCommande(id);
            ApiResponse response = new ApiResponse("Commande supprimé avec succès", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (DataIntegrityViolationException e) {
            ApiResponse response = new ApiResponse("Impossible de supprimer ce commande", HttpStatus.CONFLICT.value());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @PutMapping("/confirmation/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse> confirmCommande(@PathVariable("id") Long id) {
        try {
            logger.info("Received request to confirm commande with ID: {}", id);
            Commande confirmedCommande = commandeService.confirmCommande(id);
            ApiResponse response = new ApiResponse("Commande confirmed successfully.", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error confirming commande with ID: {}", id, e);
            ApiResponse response = new ApiResponse("Commande not found or could not be confirmed.", HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Updated endpoint to fetch all LigneCommande entries as DTOs
    @GetMapping("/getAllLigneCommandes")
    @ResponseBody
    public List<LigneCommandeDTO> getAllLigneCommandes() {
        logger.info("Fetching all LigneCommande entries");
        return commandeService.getAllLigneCommandes();
    }
}