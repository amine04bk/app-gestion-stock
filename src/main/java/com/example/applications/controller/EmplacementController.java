package com.example.applications.controller;

import com.example.applications.Services.EmplacementService;
import com.example.applications.entities.Emplacement;
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
@RequestMapping("/emplacement")
public class EmplacementController {
    @Autowired
    EmplacementService emplacementService;
    @GetMapping("/getAllEmplacement")
    @ResponseBody
    public List<Emplacement> getAllEmplacement() {
        List<Emplacement> list = emplacementService.getAllEmplacement();
        return list;
    }

    @GetMapping("/getEmplacementById/{id}")
    @ResponseBody
    public Emplacement getEmplacementById(@PathVariable("id")Long id){
        return emplacementService.findById(id);
    }

    @DeleteMapping("/deleteEmplacement/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse> deleteEmplacement(@PathVariable("id") Long id) {
        try {
            emplacementService.deleteEmplacement(id);
            ApiResponse response = new ApiResponse("Emplacement supprimé avec succès.", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (DataIntegrityViolationException e) {
            ApiResponse response = new ApiResponse("Impossible de supprimer ce emplacement", HttpStatus.CONFLICT.value());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @PostMapping("/addEmplacement")
    @ResponseBody
    public Emplacement addEmplacement(@RequestBody Emplacement emplacement){
        return emplacementService.addEmplacement(emplacement);
    }
    @PutMapping(value="/updateEmplacement/{id}")
    public Emplacement updateEmplacement(@PathVariable (name="id") Long id, @RequestBody Emplacement emplacement) throws MessagingException {

        return emplacementService.updateEmplacement(emplacement,id);
    }





}

