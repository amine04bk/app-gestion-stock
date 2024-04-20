package com.example.applications.controller;

import com.example.applications.Services.RegleServiceImpl;
import com.example.applications.entities.Regle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/Regle")
public class RegleController {
    @Autowired
    RegleServiceImpl regleService;
    @GetMapping("/retrieve-all-regle")
    @ResponseBody
    public List<Regle> getAllRegle() {
        List<Regle> list = regleService.getAllRegle();
        return list;
    }
   @DeleteMapping("/remove-regle/{regle-id}/{userId}")
    @ResponseBody
    public void removeRegle(@PathVariable("regle-id") Long id, @PathVariable Long userId) {
       regleService.deleteRegle(id, userId);
   }
    @GetMapping("/retrieve-regle/{regle-id}")
    @ResponseBody
    public Regle getRegleById(@PathVariable("regle-id")Long id){
        return regleService.findByID(id);
    }
    @PostMapping("/{userId}/Add-regle")
    @ResponseBody
    public Regle addRegle(@PathVariable Long userId,@RequestBody Regle regle){

        return regleService.addRegle(userId,regle);
    }
    @PutMapping(value="/modifyRegle/{regle-id}")
    public Regle modify(@PathVariable (name="regle-id") Long id, @RequestBody Regle regle)  {

        return regleService.updateRegle(regle, id);
    }
    @PreAuthorize("hasRole('RESPONSABLE')")
    @PutMapping("/approuver/{id}/{userId}")
    public Regle approuverRegleTemp(@PathVariable Long id, @PathVariable Long userId) {
        return regleService.approuverRegleTemp(id, userId);
    }
    @PreAuthorize("hasRole('RESPONSABLE')")
    @RequestMapping(method = RequestMethod.DELETE, value = "/refuser/{id}/{userId}")
    public ResponseEntity<String> refuserRegleTemp(@PathVariable Long id, @PathVariable Long userId) {
        regleService.refuserRegleTemp(id, userId);
        return ResponseEntity.ok("La règle temporaire a été refusée avec succès.");
    }
}
