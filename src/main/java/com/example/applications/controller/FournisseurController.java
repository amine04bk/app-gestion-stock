package com.example.applications.controller;

import com.example.applications.Services.FournisseurService;
import com.example.applications.entities.dto.FournisseurDTO;
import com.example.applications.entities.Fournisseur;
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
@RequestMapping("/fournisseur")
public class FournisseurController {
    @Autowired
    FournisseurService fournisseurService;

//    @GetMapping("/getAllFournisseur")
//    @ResponseBody
//    public List<Fournisseur> getAllFournisseur() {
//        List<Fournisseur> list = fournisseurService.getAllFournisseur();
//        return list;
//    }
    @GetMapping("/getAllFournisseur")
    @ResponseBody
    public List<FournisseurDTO> getAllFournisseur() {
        List<FournisseurDTO> list = fournisseurService.getAllFournisseur();
        return list;
    }

//    @GetMapping("/getFournisseurById/{id}")
//    @ResponseBody
//    public Fournisseur getFournisseurById(@PathVariable("id")Long id){
//        return fournisseurService.findById(id);
//    }
    @GetMapping("/getFournisseurById/{id}")
    @ResponseBody
    public FournisseurDTO getFournisseurById(@PathVariable("id")Long id){
        return fournisseurService.getFournisseurById(id);
    }

    @DeleteMapping("/deleteFournisseur/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse> deleteFournisseur(@PathVariable("id") Long id) {
        try {
            fournisseurService.deleteFournisseur(id);
            ApiResponse response = new ApiResponse("Fournisseur supprimé avec succès", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (DataIntegrityViolationException e) {
            ApiResponse response = new ApiResponse("Impossible de supprimer ce Fournisseur", HttpStatus.CONFLICT.value());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }
    @PostMapping("/addFournisseur")
    @ResponseBody
    public Fournisseur addFournisseur(@RequestBody Fournisseur Fournisseur){
        return fournisseurService.addFournisseur(Fournisseur);
    }
    @PutMapping(value="/updateFournisseur/{id}")
    public Fournisseur updateFournisseur(@PathVariable (name="id") Long id, @RequestBody Fournisseur Fournisseur) throws MessagingException {

        return fournisseurService.updateFournisseur(Fournisseur,id);
    }





}

