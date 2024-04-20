package com.example.applications.controller;

import com.example.applications.Services.PushNotificationService;
import com.example.applications.entities.Historique;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;

@RestController
@RequestMapping("/push-notifications")
@CrossOrigin(origins = "*")
@Slf4j
public class PushNotificationController {

    private final PushNotificationService service;

    public PushNotificationController(PushNotificationService service) {
        this.service = service;
    }

    @GetMapping("/{userID}")
    public Flux<ServerSentEvent<List<Historique>>> streamLastMessage(@PathVariable Long userID) {
        return service.getNotificationsByUserToID(userID);
    }

}