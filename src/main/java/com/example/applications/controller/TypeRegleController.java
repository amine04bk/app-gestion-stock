package com.example.applications.controller;

import com.example.applications.Services.RegleServiceImpl;
import com.example.applications.Services.TypeServiceImpl;
import com.example.applications.entities.Regle;
import com.example.applications.entities.TypeRegle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/TypeRegle")
public class TypeRegleController {
    @Autowired
    TypeServiceImpl typeService;
    @GetMapping("/retrieve-all-typeregle")
    @ResponseBody
    public List<TypeRegle> getAllTypeRegle() {
        List<TypeRegle> list = typeService.getAllTypeRegle();
        return list;
    }
    @DeleteMapping("/remove-typeregle/{typeregle-id}")
    @ResponseBody
    public void removeTyperegle(@PathVariable("typeregle-id") Long id) {
        typeService.deleteTypeRegle(id);
    }
    @GetMapping("/retrieve-typeregle/{typeregle-id}")
    @ResponseBody
    public TypeRegle getTypeRegleById(@PathVariable("typeregle-id")Long id){
        return typeService.findByID(id);
    }
    @PostMapping("/Add-typeregle")
    @ResponseBody
    public TypeRegle addTypeRegle(@RequestBody TypeRegle typeRegle){

        return typeService.addTypeRegle(typeRegle);
    }
    @PutMapping(value="/modifyTypeRegle/{typeregle-id}")
    public TypeRegle modify(@PathVariable (name="typeregle-id") Long id, @RequestBody TypeRegle typeRegle)  {

        return typeService.updateTypeRegle(typeRegle, id);
    }
}
