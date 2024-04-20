package com.example.applications.controller;

import com.example.applications.Services.HistoriqueService;
import com.example.applications.entities.Historique;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/notification")
@CrossOrigin(origins = "*")
@RestController
public class NotificationStorageController {

    private final HistoriqueService historiqueService;

    public NotificationStorageController(HistoriqueService historiqueService) {
        this.historiqueService = historiqueService;
    }


    @GetMapping("/{userID}")
    public ResponseEntity<List<Historique>> getNotificationsByUserID(@PathVariable Long userID) {
        return ResponseEntity.ok(historiqueService.getNotificationsByUserID(userID));
    }

    @PatchMapping("/read/{notifID}")
    public ResponseEntity changeNotifStatusToRead(@PathVariable String notifID) {
        return ResponseEntity.ok(historiqueService.changeNotifStatusToRead(notifID));
    }


}