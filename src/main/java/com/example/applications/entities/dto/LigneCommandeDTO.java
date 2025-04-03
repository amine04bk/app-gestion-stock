package com.example.applications.entities.dto;

public class LigneCommandeDTO {
    private Long id;
    private Long produitId;
    private Long commandeId; // Extracted from the Commande object
    private Float qte;
    private Integer mntTotal;
    private String pu;

    // Constructors
    public LigneCommandeDTO() {}

    public LigneCommandeDTO(Long id, Long produitId, Long commandeId, Float qte, Integer mntTotal, String pu) {
        this.id = id;
        this.produitId = produitId;
        this.commandeId = commandeId;
        this.qte = qte;
        this.mntTotal = mntTotal;
        this.pu = pu;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProduitId() {
        return produitId;
    }

    public void setProduitId(Long produitId) {
        this.produitId = produitId;
    }

    public Long getCommandeId() {
        return commandeId;
    }

    public void setCommandeId(Long commandeId) {
        this.commandeId = commandeId;
    }

    public Float getQte() {
        return qte;
    }

    public void setQte(Float qte) {
        this.qte = qte;
    }

    public Integer getMntTotal() {
        return mntTotal;
    }

    public void setMntTotal(Integer mntTotal) {
        this.mntTotal = mntTotal;
    }

    public String getPu() {
        return pu;
    }

    public void setPu(String pu) {
        this.pu = pu;
    }
}