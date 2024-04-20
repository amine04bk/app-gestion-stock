package com.example.applications.Repository;

import com.example.applications.entities.Historique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface HistoriqueRepository extends JpaRepository<Historique, String> {
    Optional<Historique> findById(String id);

    List<Historique> findByUserToId(Long id);
    List<Historique> findByDeliveredFalse();


    List<Historique> findByUserFromIdAndDeliveredFalse(Long id);

    List<Historique> findByDeliveredResponsableFalse();
}
