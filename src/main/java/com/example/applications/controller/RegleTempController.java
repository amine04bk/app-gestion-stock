package com.example.applications.controller;

import com.example.applications.Services.RegleTempService;
import com.example.applications.entities.ActionRegle;
import com.example.applications.entities.RegleTemp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/RegleTemp")
public class RegleTempController {
    @Autowired
    private RegleTempService regleTempService;
    @PostMapping("/add")
    public RegleTemp addRegleTemp(@RequestBody RegleTemp regleTemp) {
        return regleTempService.addOrUpdateRegleTempWithActionType(regleTemp, ActionRegle.AJOUT);
    }
    @PutMapping("/{id}")
    public RegleTemp updateRegleTemp(@PathVariable Long id, @RequestBody RegleTemp regleTemp) {
        regleTemp.setId(id);
        return regleTempService.addOrUpdateRegleTempWithActionType(regleTemp,ActionRegle.MODIFICATION);
    }
}
