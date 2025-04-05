package com.example.gestiondescommandes.models;

public class Fournisseur {
    private int id;
    private String name;
    private String email;
    private String adress;
    private String tel;

    public Fournisseur(int id, String name, String email, String adress, String tel) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.adress = adress;
        this.tel = tel;
    }

    public String getEmail() {
        return email;
    }
}