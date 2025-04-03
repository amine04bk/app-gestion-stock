package com.example.applications.Repository;

import com.example.applications.entities.Fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FournisseurRepository extends JpaRepository<Fournisseur,Long> {
}

