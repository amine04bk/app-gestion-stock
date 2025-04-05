package com.example.gestiondescommandes.models;

public class LigneCommande {
    private int id;
    private Integer produitId;
    private Integer commandeId;
    private Double qte;
    private double pu;

    public LigneCommande(int id, Integer produitId, Integer commandeId, Double qte, double pu) {
        this.id = id;
        this.produitId = produitId;
        this.commandeId = commandeId;
        this.qte = qte;
        this.pu = pu;
    }

    public Integer getProduitId() {
        return produitId;
    }

    public Integer getCommandeId() {
        return commandeId;
    }

    public Double getQte() {
        return qte;
    }

    public double getPu() {
        return pu;
    }
}