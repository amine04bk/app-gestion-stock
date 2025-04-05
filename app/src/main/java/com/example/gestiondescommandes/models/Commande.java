package com.example.gestiondescommandes.models;

import com.google.gson.annotations.SerializedName;
import java.io.Serializable;

public class Commande implements Serializable { // Added Serializable
    private int id;
    @SerializedName("num")
    private String number;
    private String date;
    private double mntTotalHT;
    private double mntTotalTVA;
    private double mntTotalTTC;
    private String fournisseurEmail;
    private boolean confirmation;

    public Commande(int id, String number, String date, double mntTotalHT, double mntTotalTVA,
                    double mntTotalTTC, String fournisseurEmail, boolean confirmation) {
        this.id = id;
        this.number = number;
        this.date = date;
        this.mntTotalHT = mntTotalHT;
        this.mntTotalTVA = mntTotalTVA;
        this.mntTotalTTC = mntTotalTTC;
        this.fournisseurEmail = fournisseurEmail;
        this.confirmation = confirmation;
    }

    public int getId() {
        return id;
    }

    public String getNumber() {
        return number;
    }

    public String getDate() {
        return date;
    }

    public double getMntTotalHT() {
        return mntTotalHT;
    }

    public double getMntTotalTVA() {
        return mntTotalTVA;
    }

    public double getMntTotalTTC() {
        return mntTotalTTC;
    }

    public String getFournisseurEmail() {
        return fournisseurEmail;
    }

    public boolean isConfirmed() {
        return confirmation;
    }

    public void setConfirmation(boolean confirmation) {
        this.confirmation = confirmation;
    }
}