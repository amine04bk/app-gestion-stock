package com.example.applications.Services;

import com.example.applications.Repository.HistoriqueRepository;
import com.example.applications.Repository.UserRepository;
import com.example.applications.entities.Historique;
import com.example.applications.entities.Role;
import com.example.applications.entities.User;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.scheduler.Schedulers;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PushNotificationService {
    @Autowired
    private final HistoriqueRepository historiqueRepository;
    @Autowired
    UserRepository userRepository;
    public PushNotificationService(HistoriqueRepository historiqueRepository) {
        this.historiqueRepository = historiqueRepository;
    }


    private List<Historique> getNotifs(Long userID) {
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new RuntimeException("User not found"));

            List<Role> roles = user.getRoles();
        if (user != null && !user.getRoles().isEmpty()) {

            // Use roleName as needed

            if (roles.get(0).getName().equals("ROLE_RESPONSABLE")) {
                var notifs = historiqueRepository.findByDeliveredResponsableFalse();
                notifs.forEach(x -> x.setDeliveredResponsable(true));
                historiqueRepository.saveAll(notifs);
                return notifs;
            } else  {
                var notifs = historiqueRepository.findByUserFromIdAndDeliveredFalse(userID);
                // Filter notifications where status is not null
                List<Historique> filteredNotifs = notifs.stream()
                        .filter(x -> x.getStatus() != null)
                        .collect(Collectors.toList());

                // Update delivered status for filtered notifications
                filteredNotifs.forEach(notification -> notification.setDelivered(true));

                // Save the updated notifications
                historiqueRepository.saveAll(filteredNotifs);
                return filteredNotifs;
            }
        }

        return null;
    }

    public Flux<ServerSentEvent<List<Historique>>> getNotificationsByUserToID(Long userID) {

        if (userID != null  ) {
            return Flux.interval(Duration.ofSeconds(1))
                    .publishOn(Schedulers.boundedElastic())
                    .map(sequence -> ServerSentEvent.<List<Historique>>builder().id(String.valueOf(sequence))
                            .event("user-list-event").data(getNotifs(userID))
                            .build());
        }

        return Flux.interval(Duration.ofSeconds(1)).map(sequence -> ServerSentEvent.<List<Historique>>builder()
                .id(String.valueOf(sequence)).event("user-list-event").data(new ArrayList<>()).build());
    }
}