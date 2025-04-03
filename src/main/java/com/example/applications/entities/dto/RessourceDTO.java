package com.example.applications.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RessourceDTO {
    private Long id;
    private String name;
    private String description;
    private String price;
    private CategorieDTO categories;
    private EmplacementDTO emplacements;
}
