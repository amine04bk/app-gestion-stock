package com.example.applications.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ligne_commande")
public class LigneCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "produit_id", nullable = true)
    private Long produitId; // Store produitId directly

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "commande_id", nullable = true)
    private Commande commande;

    private Float qte;
    private Integer mntTotal;
    private String pu; // Unit Price

    // Method to match the frontend's expectation of "produit"
    public Long getProduit() {
        return this.produitId;
    }

    public void setProduit(Long produitId) {
        this.produitId = produitId;
    }
}