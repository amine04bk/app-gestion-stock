package com.example.applications.entities.dto;

import com.example.applications.entities.Commande;
import com.example.applications.entities.LigneCommande;

import java.util.List;

public class CommandeRequestDTO {
    private Commande commande;
    private List<LigneCommandeDTO> ligneCommandes; // Use a DTO for LigneCommande to map the request

    // Getters and Setters
    public Commande getCommande() {
        return commande;
    }

    public void setCommande(Commande commande) {
        this.commande = commande;
    }

    public List<LigneCommandeDTO> getLigneCommandes() {
        return ligneCommandes;
    }

    public void setLigneCommandes(List<LigneCommandeDTO> ligneCommandes) {
        this.ligneCommandes = ligneCommandes;
    }

    // Nested DTO for LigneCommande to match the frontend request structure
    public static class LigneCommandeDTO {
        private Long produit; // Match the "produit" field from the frontend request
        private Long project;
        private Float qte;
        private String pu;

        // Getters and Setters
        public Long getProduit() {
            return produit;
        }

        public void setProduit(Long produit) {
            this.produit = produit;
        }

        public Long getProject() {
            return project;
        }

        public void setProject(Long project) {
            this.project = project;
        }

        public Float getQte() {
            return qte;
        }

        public void setQte(Float qte) {
            this.qte = qte;
        }

        public String getPu() {
            return pu;
        }

        public void setPu(String pu) {
            this.pu = pu;
        }
    }
}