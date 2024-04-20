package com.example.applications.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Table(name = "historique")
public class Historique {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type")
    private ActionRegle actionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "action_date")
    private LocalDateTime actionDate;

    @Column(name = "regle_id")
    private Long regleId;

    @Column(name = "delivered")
    private boolean delivered;

    @Column(name = "deliveredResponsable")
    private boolean deliveredResponsable;

    @Column(name = "read_")
    private boolean read;
    @Column(name = "content")
    private String content;
    @ManyToOne
    @JoinColumn(name = "user_to_id")
    @JsonIgnore
    private User userTo;

    @ManyToOne
    @JoinColumn(name = "user_from_id")
    @JsonIgnore
    private User userFrom;

}

