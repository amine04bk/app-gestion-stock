package com.example.applications.Services;

import com.example.applications.Repository.RegleTempReposiroty;
import com.example.applications.entities.ActionRegle;
import com.example.applications.entities.Regle;
import com.example.applications.entities.RegleTemp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegleTempService {
    @Autowired
    private RegleTempReposiroty regleTempRepository;

    public List<RegleTemp> getAllRegleTemp() {
        return regleTempRepository.findAll();
    }

    public RegleTemp getRegleTempById(Long id) {
        return regleTempRepository.findById(id).orElse(null);
    }

    public RegleTemp addOrUpdateRegleTempWithActionType(RegleTemp regleTemp, ActionRegle actionType) {
        regleTemp.setActionType(actionType);
        return regleTempRepository.save(regleTemp);
    }



    public RegleTemp updateRegleTemp(RegleTemp regleTemp, Long id) {
        regleTemp.setId(id);
        return regleTempRepository.save(regleTemp);
    }



    public void deleteRegleTemp(Long id) {
        regleTempRepository.deleteById(id);
    }
}
