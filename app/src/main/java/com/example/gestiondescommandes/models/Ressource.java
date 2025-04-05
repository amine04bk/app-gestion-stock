package com.example.gestiondescommandes.models;

public class Ressource {
    private int id;
    private String name;
    private double price;

    public Ressource(int id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}