package com.example.applications.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "regleTemp")
public class RegleTemp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long id_regle;
    private Long id_user;
    private String libelleR;
    private String description;
    @Enumerated(EnumType.STRING)
    private ActionRegle actionType;

    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private TypeRegle Tr;


}
