package com.example.applications.Services;

import com.example.applications.Repository.HistoriqueRepository;
import com.example.applications.entities.Historique;
import lombok.extern.slf4j.Slf4j;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@Slf4j
public class HistoriqueService {
    @Autowired
    private HistoriqueRepository historiqueRepository;




    public Historique createNotificationStorage(Historique historique) {
        return historiqueRepository.save(historique);
    }


    public Historique getNotificationsByID(String id) {
        return historiqueRepository.findById(id).orElseThrow(() -> new RuntimeException("notification not found!"));
    }

    public List<Historique> getNotificationsByUserIDNotRead(Long userID) {
        return historiqueRepository.findByUserFromIdAndDeliveredFalse(userID);
    }


    public List<Historique> getNotificationsByUserID(Long userID) {
        return historiqueRepository.findByUserToId(userID);
    }

    public Historique changeNotifStatusToRead(String notifID) {
        var notif = historiqueRepository.findById(notifID)
                .orElseThrow(() -> new RuntimeException("not found!"));
        notif.setRead(true);
        return historiqueRepository.save(notif);
    }

    public void clear() {
        historiqueRepository.deleteAll();
    }
}
