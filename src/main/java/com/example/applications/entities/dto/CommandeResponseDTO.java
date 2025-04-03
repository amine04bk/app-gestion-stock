package com.example.applications.entities.dto;

import com.example.applications.entities.Fournisseur;

import java.util.List;

public class CommandeResponseDTO {
    private Long id;
    private String num;
    private String date;
    private List<LigneCommandeResponseDTO> ligneCommandes;
    private Fournisseur fournisseur;
    private Float mntTotalHT;
    private Float mntTotalTTC;
    private Float mntTotalTVA;

    // Default constructor
    public CommandeResponseDTO() {}

    // Constructor with parameters
    public CommandeResponseDTO(Long id, String num, String date, List<LigneCommandeResponseDTO> ligneCommandes,
                                Fournisseur fournisseur, Float mntTotalHT, Float mntTotalTTC, Float mntTotalTVA) {
        this.id = id;
        this.num = num;
        this.date = date;
        this.ligneCommandes = ligneCommandes;
        this.fournisseur = fournisseur;
        this.mntTotalHT = mntTotalHT;
        this.mntTotalTTC = mntTotalTTC;
        this.mntTotalTVA = mntTotalTVA;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNum() {
        return num;
    }

    public void setNum(String num) {
        this.num = num;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<LigneCommandeResponseDTO> getLigneCommandes() {
        return ligneCommandes;
    }

    public void setLigneCommandes(List<LigneCommandeResponseDTO> ligneCommandes) {
        this.ligneCommandes = ligneCommandes;
    }

    public Fournisseur getFournisseur() {
        return fournisseur;
    }

    public void setFournisseur(Fournisseur fournisseur) {
        this.fournisseur = fournisseur;
    }

    public Float getMntTotalHT() {
        return mntTotalHT;
    }

    public void setMntTotalHT(Float mntTotalHT) {
        this.mntTotalHT = mntTotalHT;
    }

    public Float getMntTotalTTC() {
        return mntTotalTTC;
    }

    public void setMntTotalTTC(Float mntTotalTTC) {
        this.mntTotalTTC = mntTotalTTC;
    }

    public Float getMntTotalTVA() {
        return mntTotalTVA;
    }

    public void setMntTotalTVA(Float mntTotalTVA) {
        this.mntTotalTVA = mntTotalTVA;
    }
}
