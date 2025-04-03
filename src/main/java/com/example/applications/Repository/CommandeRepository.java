package com.example.applications.Repository;

import com.example.applications.entities.Commande;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommandeRepository extends JpaRepository<Commande,Long> {
}

