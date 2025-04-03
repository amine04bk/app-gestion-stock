package com.example.applications.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "commande")
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "num")
    private String num;

    @Column(name = "date")
    private String date;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL)
    private List<LigneCommande> ligneCommande;

    @ManyToOne
    @JoinColumn(name = "frs_id", nullable = false)
    private Fournisseur fournisseur;

    @Column(name = "mnt_totalht")
    private Float mntTotalHT;

    @Column(name = "mnt_totalttc")
    private Float mntTotalTTC;

    @Column(name = "mnt_totaltva")
    private Float mntTotalTVA;

    @Column(name = "confirmation", nullable = false)
    private Boolean confirmation = false;
}
