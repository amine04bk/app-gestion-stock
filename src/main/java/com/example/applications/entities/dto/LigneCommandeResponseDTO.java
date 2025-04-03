package com.example.applications.entities.dto;

public class LigneCommandeResponseDTO {
    private Long id;
    private Long produitId;  // Store produitId here
    private String pu;  // Unit price
    private Float qte;  // Quantity
    private Long projectId;  // Assuming projectId is relevant

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

    public String getPu() {
        return pu;
    }

    public void setPu(String pu) {
        this.pu = pu;
    }

    public Float getQte() {
        return qte;
    }

    public void setQte(Float qte) {
        this.qte = qte;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}
