package com.example.gestiondescommandes.api;

import com.example.gestiondescommandes.models.Commande;
import com.example.gestiondescommandes.models.Fournisseur;
import com.example.gestiondescommandes.models.LigneCommande;
import com.example.gestiondescommandes.models.Ressource;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.GET;
import retrofit2.http.PUT;
import retrofit2.http.Path;

import java.util.List;

public class ApiService {
    private interface ApiInterface {
        @GET("fournisseur/getAllFournisseur")
        Call<List<Fournisseur>> getFournisseurs();

        @GET("commande/getAllCommande")
        Call<List<Commande>> getCommandes();

        @GET("commande/getAllLigneCommandes")
        Call<List<LigneCommande>> getLigneCommandes();

        @GET("ressource/getAllRessource")
        Call<List<Ressource>> getRessources();

        @PUT("commande/confirmation/{id}")
        Call<Void> confirmCommande(@Path("id") int commandeId);
    }

    private static ApiInterface apiInterface;

    private static ApiInterface getApiInterface() {
        if (apiInterface == null) {
            String baseUrl = "http://192.168.70.253:8091/";
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl(baseUrl)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
            apiInterface = retrofit.create(ApiInterface.class);
        }
        return apiInterface;
    }

    public static Call<List<Fournisseur>> fetchFournisseurs() {
        return getApiInterface().getFournisseurs();
    }

    public static Call<List<Commande>> fetchCommandes() {
        return getApiInterface().getCommandes();
    }

    public static Call<List<LigneCommande>> fetchLigneCommandes() {
        return getApiInterface().getLigneCommandes();
    }

    public static Call<List<Ressource>> fetchRessources() {
        return getApiInterface().getRessources();
    }

    public static Call<Void> confirmCommande(int commandeId) {
        return getApiInterface().confirmCommande(commandeId);
    }
}