package com.example.applications.controller;

import com.example.applications.Services.RessourceService;
import com.example.applications.entities.Ressource;
import com.example.applications.mapper.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/ressource")
public class RessourceController {
    @Autowired
    RessourceService ressourceService;
    @GetMapping("/getAllRessource")
    @ResponseBody
    public List<Ressource> getAllRessource() {
        List<Ressource> list = ressourceService.getAllRessource();
        return list;
    }

    @GetMapping("/getRessourceById/{id}")
    @ResponseBody
    public Ressource getRessourceById(@PathVariable("id")Long id){
        return ressourceService.findById(id);
    }

    @DeleteMapping("/deleteRessource/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse> deleteRessource(@PathVariable("id") Long id) {
        try {
            ressourceService.deleteRessource(id);
            ApiResponse response = new ApiResponse("ressource supprimé avec succès", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (DataIntegrityViolationException e) {
            ApiResponse response = new ApiResponse("impossible de supprimer ce ressource", HttpStatus.CONFLICT.value());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }
    @PostMapping("/addRessource")
    @ResponseBody
    public Ressource addRessource(@RequestBody Ressource ressource){
        return ressourceService.addRessource(ressource);
    }
    @PutMapping(value="/updateRessource/{id}")
    public Ressource updateRessource(@PathVariable (name="id") Long id, @RequestBody Ressource ressource) throws MessagingException {

        return ressourceService.updateRessource(ressource,id);
    }


}

