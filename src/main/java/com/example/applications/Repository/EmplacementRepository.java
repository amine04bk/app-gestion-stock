package com.example.applications.Repository;


import com.example.applications.entities.Emplacement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmplacementRepository extends JpaRepository<Emplacement,Long> {
}

