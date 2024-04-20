package com.example.applications.Services;

import com.example.applications.Repository.HistoriqueRepository;
import com.example.applications.Repository.RegleRepository;
import com.example.applications.Repository.RegleTempReposiroty;
import com.example.applications.Repository.UserRepository;
import com.example.applications.entities.*;
import com.example.applications.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RegleServiceImpl {
    @Autowired
    RegleRepository regleRepository;
    @Autowired
    RegleTempReposiroty regleTempRepository;
    @Autowired
    HistoriqueService historiqueService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    HistoriqueRepository historiqueRepository;
    @Autowired
    private RegleTempService regleTempService;

    public List<Regle> getAllRegle() {
        return regleRepository.findAll();
    }
    public Regle findByID(Long id) {
        return regleRepository.findById(id).orElse(null);
    }
    public RegleTemp addRegleTempWithActionType(RegleTemp regleTemp, ActionRegle actionType) {
        return regleTempService.addOrUpdateRegleTempWithActionType(regleTemp, actionType);
    }
   public Regle addRegle(Long userId,Regle regle) {
       User user = userRepository.findById(userId)
               .orElseThrow(() -> new RuntimeException("User not found"));

        RegleTemp AjoutRegle = new RegleTemp();
        AjoutRegle.setId_user(userId);
        AjoutRegle.setLibelleR(regle.getLibelleR());
        AjoutRegle.setDescription(regle.getDescription());
        AjoutRegle.setTr(regle.getTr());
        AjoutRegle.setActionType(ActionRegle.AJOUT);
        regleTempRepository.save(AjoutRegle);
       historiqueService.createNotificationStorage(Historique.builder()
               .delivered(false)
               .content( user.getUsername() + " demande d'ajoute regle "  )
               .actionType(ActionRegle.AJOUT)
               .userFrom(user)
               .regleId(AjoutRegle.getId()).build());


       return regle;

    }



    public Regle updateRegle(Regle regle, Long id) {
      regle.setId(id);
       RegleTemp update_regle = new RegleTemp();
       update_regle.setId_regle(id);
       update_regle.setLibelleR(regle.getLibelleR());
       update_regle.setDescription(regle.getDescription());
       update_regle.setTr(regle.getTr());
       update_regle.setActionType(ActionRegle.MODIFICATION);
        Regle _regle =  regleRepository.findById(id).get();

        User user = userRepository.findById(_regle.getId_user())
                .orElseThrow(() -> new RuntimeException("User not found"));
        historiqueService.createNotificationStorage(Historique.builder()
                        .userId(user.getId())
                .delivered(false)
                .deliveredResponsable(false)
                .content( user.getUsername() + " demande de MODIFICATION regle "  )
                .actionType(ActionRegle.MODIFICATION)
                .status(Status.DEMANDE)
                .actionDate(LocalDateTime.now())
                .userFrom(user)
                .regleId(regle.getId()).build());


        return regle;
    }
    public void deleteRegle(Long id, Long userId) {
        Optional<Regle> regle = regleRepository.findById(id);
        RegleTemp regleTemp = new RegleTemp();
        regleTemp.setId_regle(id);
        regleTemp.setId_user(userId);
        regleTemp.setLibelleR(regle.get().getLibelleR());
        regleTemp.setDescription(regle.get().getDescription());
        regleTemp.setActionType(ActionRegle.SUPPRESSION);
        regleTempRepository.save(regleTemp);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        historiqueService.createNotificationStorage(Historique.builder()
                .delivered(false)
                .deliveredResponsable(false)
                .userId(user.getId())
                .content( user.getUsername() + " Demande SUPPRESSION regle "  )
                .actionType(ActionRegle.SUPPRESSION)
                .status(Status.DEMANDE)
                .actionDate(LocalDateTime.now())
                .userFrom(user).build());


    }

    public Regle approuverRegleTemp(Long id, Long userId) {
        RegleTemp regleTemp = regleTempService.getRegleTempById(id);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User getId_userFrom = userRepository.findById(regleTemp.getId_user())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (regleTemp != null && regleTemp.getActionType() == ActionRegle.AJOUT) {
            Regle regle = new Regle();
            regle.setId_user(regleTemp.getId_user());
            regle.setLibelleR(regleTemp.getLibelleR());
            regle.setDescription(regleTemp.getDescription());
            regle.setTr(regleTemp.getTr());
            // Ajoutez d'autres propriétés de Regle si nécessaire
            regle = regleRepository.save(regle);
            // Supprimer la règle temporaire une fois qu'elle est approuvée
            regleTempService.deleteRegleTemp(id);

            historiqueService.createNotificationStorage(Historique.builder()
                    .delivered(false)
                    .deliveredResponsable(true)
                    .content( user.getUsername() + " accepte Ajoute regle "  )
                    .actionType(ActionRegle.AJOUT)
                    .status(Status.APPROUVE)
                    .userId(userId)
                    .userFrom(getId_userFrom)
                    .actionDate(LocalDateTime.now())
                    .userTo(user).build());


            return regle;
        }else if (regleTemp != null && regleTemp.getActionType() == ActionRegle.MODIFICATION) {
            Regle regle = new Regle();
            regle.setLibelleR(regleTemp.getLibelleR());
            regle.setId_user(userId);
            regle.setDescription(regleTemp.getDescription());
            regle.setId(regleTemp.getId_regle());
            // Ajoutez d'autres propriétés de Regle si nécessaire
            regle = regleRepository.save(regle);
            // Supprimer la règle temporaire une fois qu'elle est approuvée
            regleTempService.deleteRegleTemp(id);
            historiqueService.createNotificationStorage(Historique.builder()
                    .delivered(false)
                    .deliveredResponsable(true)
                    .content( user.getUsername() + " accepte MODIFICATION regle "  )
                    .actionType(ActionRegle.MODIFICATION)
                    .status(Status.APPROUVE)
                    .userId(userId)
                    .userFrom(getId_userFrom)

                    .actionDate(LocalDateTime.now())
                    .userTo(user).build());

            return regle;
        }else if (regleTemp != null && regleTemp.getActionType() == ActionRegle.SUPPRESSION) {
            Long regleId = regleTemp.getId_regle();
           regleRepository.deleteById(regleId);
            historiqueService.createNotificationStorage(Historique.builder()
                    .delivered(false)
                    .deliveredResponsable(true)
                    .content( user.getUsername() + " accepte SUPPRESSION regle "  )
                    .actionType(ActionRegle.SUPPRESSION)
                    .status(Status.APPROUVE)
                    .userId(userId)
                    .userFrom(getId_userFrom)

                    .actionDate(LocalDateTime.now())
                    .userTo(user).build());
        }
        return null;
    }
    public void refuserRegleTemp(Long id, Long userId) {
        RegleTemp regleTemp = regleTempService.getRegleTempById(id);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User getId_userFrom = userRepository.findById(regleTemp.getId_user())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (regleTemp != null) {
            if (regleTemp.getActionType() == ActionRegle.AJOUT) {
                // Supprimez la règle temporaire
                regleTempService.deleteRegleTemp(id);
                System.out.println("Regle temporaire refusée avec succès.");
                historiqueService.createNotificationStorage(Historique.builder()
                        .delivered(false)
                        .deliveredResponsable(true)
                        .userId(user.getId())
                        .userFrom(getId_userFrom)
                        .content( user.getUsername() + " REFUSE AJOUT regle "  )
                        .actionType(ActionRegle.AJOUT)
                        .status(Status.REFUSE)
                        .actionDate(LocalDateTime.now())
                        .userTo(user).build());
            } else if (regleTemp.getActionType() == ActionRegle.MODIFICATION) {
                // Supprimez la règle temporaire
                regleTempService.deleteRegleTemp(id);
                System.out.println("Regle temporaire refusée avec succès.");
                historiqueService.createNotificationStorage(Historique.builder()
                        .delivered(false)
                        .deliveredResponsable(true)
                        .userId(user.getId())
                        .userFrom(getId_userFrom)
                        .content( user.getUsername() + " REFUSE MODIFICATION regle "  )
                        .actionType(ActionRegle.MODIFICATION)
                        .status(Status.REFUSE)
                        .actionDate(LocalDateTime.now())
                        .userTo(user).build());

            } else if (regleTemp.getActionType() == ActionRegle.SUPPRESSION) {
                // Supprimez la règle temporaire
                regleTempService.deleteRegleTemp(id);
                System.out.println("Regle temporaire refusée avec succès.");
                historiqueService.createNotificationStorage(Historique.builder()
                        .delivered(false)
                        .deliveredResponsable(true)
                        .userId(user.getId())
                        .userFrom(getId_userFrom)
                        .content( user.getUsername() + " REFUSE MODIFICATION regle "  )
                        .actionType(ActionRegle.MODIFICATION)
                        .status(Status.REFUSE)
                        .actionDate(LocalDateTime.now())
                        .userTo(user).build());

            }
        } else {
            System.out.println("La règle temporaire avec l'ID " + id + " n'a pas été trouvée.");
        }
    }
}





