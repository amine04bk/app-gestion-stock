package com.example.gestiondescommandes.ui;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import androidx.appcompat.app.AppCompatActivity;
import com.example.gestiondescommandes.R;
import com.example.gestiondescommandes.storage.StorageService;

public class WelcomeActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);

        new Handler().postDelayed(() -> {
            String userEmail = StorageService.getEmail(this);
            if (userEmail != null) {
                startActivity(new Intent(this, CommandesActivity.class));
            } else {
                startActivity(new Intent(this, LoginActivity.class));
            }
            finish();
        }, 2000); // 2 seconds delay
    }
}