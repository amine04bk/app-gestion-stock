package com.example.applications.controller;

import com.example.applications.Services.CategorieService;
import com.example.applications.entities.Categorie;
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
@RequestMapping("/categorie")
public class CategorieController {
    @Autowired
    CategorieService CategorieService;
    @GetMapping("/getAllCategorie")
    @ResponseBody
    public List<Categorie> getAllCategorie() {
        List<Categorie> list = CategorieService.getAllCategorie();
        return list;
    }

    @GetMapping("/getCategorieById/{id}")
    @ResponseBody
    public Categorie getCategorieById(@PathVariable("id")Long id){
        return CategorieService.findById(id);
    }

    @DeleteMapping("/deleteCategorie/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse> deleteCategorie(@PathVariable("id") Long id) {
        try {
            CategorieService.deleteCategorie(id);
            ApiResponse response = new ApiResponse("Categorie supprimé avec succès", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (DataIntegrityViolationException e) {
            ApiResponse response = new ApiResponse("Impossible de supprimer ce categorie", HttpStatus.CONFLICT.value());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @PostMapping("/addCategorie")
    @ResponseBody
    public Categorie addCategorie(@RequestBody Categorie categorie){
        return CategorieService.addCategorie(categorie);
    }
    @PutMapping(value="/updateCategorie/{id}")
    public Categorie updateCategorie(@PathVariable (name="id") Long id, @RequestBody Categorie categorie) throws MessagingException {

        return CategorieService.updateCategorie(categorie,id);
    }





}

