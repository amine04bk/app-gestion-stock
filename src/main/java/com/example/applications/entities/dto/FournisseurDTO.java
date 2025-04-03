package com.example.applications.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FournisseurDTO {
    private Long id;
    private String name;
    private String email;
    private String adress;
    private String tel;
}
