package com.example.applications.entities;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "regle")
public class Regle implements Serializable {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long id_user;

    private String libelleR;

    private String description;

    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private TypeRegle Tr;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(	name = "utilisateur_regle",
            joinColumns = @JoinColumn(name = "idR"),
            inverseJoinColumns = @JoinColumn(name = "id"))
    private Set<User> utilisateurs = new HashSet<>();


}