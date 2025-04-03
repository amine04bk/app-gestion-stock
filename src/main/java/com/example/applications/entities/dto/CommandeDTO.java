package com.example.applications.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommandeDTO {
    private Long id;
    private String num;
    private String date;
    private Float mntTotalHT;
    private Float mntTotalTTC;
    private Float mntTotalTVA;
    private String fournisseurEmail;
    private Boolean confirmation;   // Nouvelle colonne
}
