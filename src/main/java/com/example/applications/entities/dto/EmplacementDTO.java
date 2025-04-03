package com.example.applications.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmplacementDTO {
    private Long id;
    private String code;
    private String libelle;
    private String adresse;
}
