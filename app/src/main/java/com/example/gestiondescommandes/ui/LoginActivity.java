package com.example.gestiondescommandes.ui;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log; // Import Log for debugging
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.gestiondescommandes.R;
import com.example.gestiondescommandes.api.ApiService;
import com.example.gestiondescommandes.models.Fournisseur;
import com.example.gestiondescommandes.storage.StorageService;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.util.List;

public class LoginActivity extends AppCompatActivity {
    private static final String TAG = "LoginActivity"; // Tag for logging
    private EditText emailEditText, passwordEditText;
    private Button loginButton;
    private ProgressBar loadingProgressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        emailEditText = findViewById(R.id.emailEditText);
        passwordEditText = findViewById(R.id.passwordEditText);
        loginButton = findViewById(R.id.loginButton);
        loadingProgressBar = findViewById(R.id.loadingProgressBar);

        fetchFournisseurs();

        loginButton.setOnClickListener(v -> login());
    }

    private void fetchFournisseurs() {
        loadingProgressBar.setVisibility(View.VISIBLE);
        Log.d(TAG, "Fetching fournisseurs from API..."); // Debug log
        ApiService.fetchFournisseurs().enqueue(new Callback<List<Fournisseur>>() {
            @Override
            public void onResponse(Call<List<Fournisseur>> call, Response<List<Fournisseur>> response) {
                loadingProgressBar.setVisibility(View.GONE);
                Log.d(TAG, "API Response Code: " + response.code()); // Log response code
                if (response.isSuccessful() && response.body() != null) {
                    fournisseurs = response.body();
                    Log.d(TAG, "Fournisseurs fetched successfully. Count: " + fournisseurs.size()); // Log success
                    for (Fournisseur f : fournisseurs) {
                        Log.d(TAG, "Fournisseur: " + f.getEmail()); // Log each fournisseur's email
                    }
                } else {
                    Log.e(TAG, "API Error: " + response.message()); // Log error message
                    Toast.makeText(LoginActivity.this, "Erreur de chargement des fournisseurs", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Fournisseur>> call, Throwable t) {
                loadingProgressBar.setVisibility(View.GONE);
                Log.e(TAG, "API Call Failed: " + t.getMessage(), t); // Log failure with stack trace
                Toast.makeText(LoginActivity.this, "Erreur: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private List<Fournisseur> fournisseurs;

    private void login() {
        String email = emailEditText.getText().toString().trim();
        String password = passwordEditText.getText().toString().trim();

        Log.d(TAG, "Attempting login with email: " + email); // Log login attempt
        boolean isValid = fournisseurs != null && fournisseurs.stream()
                .anyMatch(f -> f.getEmail().equals(email));

        if (isValid && email.equals(password)) {
            Log.d(TAG, "Login successful for email: " + email); // Log successful login
            StorageService.saveEmail(this, email);
            startActivity(new Intent(this, CommandesActivity.class));
            finish();
        } else {
            Log.w(TAG, "Login failed: Invalid credentials"); // Log failed login
            Toast.makeText(this, R.string.invalid_credentials, Toast.LENGTH_SHORT).show();
        }
    }
}