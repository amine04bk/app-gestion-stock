package com.example.gestiondescommandes.ui;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.gestiondescommandes.R;
import com.example.gestiondescommandes.api.ApiService;
import com.example.gestiondescommandes.models.Commande;
import com.example.gestiondescommandes.models.LigneCommande;
import com.example.gestiondescommandes.models.Ressource;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CommandeDetailsActivity extends AppCompatActivity {
    private static final String TAG = "CommandeDetailsActivity";
    private Commande commande;
    private List<LigneCommande> ligneCommandes = new ArrayList<>();
    private List<Ressource> ressources = new ArrayList<>();
    private TextView confirmationStatusTextView, errorTextView;
    private TableLayout tableLayout;
    private Button acceptButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_commande_details);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }

        commande = (Commande) getIntent().getSerializableExtra("commande");
        if (commande == null) {
            Log.e(TAG, "Commande is null");
            Toast.makeText(this, "Erreur: Commande non trouvée", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        setTitle("Commande #" + commande.getNumber());

        confirmationStatusTextView = findViewById(R.id.confirmationStatusTextView);
        errorTextView = findViewById(R.id.errorTextView);
        tableLayout = findViewById(R.id.tableLayout);
        acceptButton = findViewById(R.id.acceptButton);

        ((TextView) findViewById(R.id.numeroCommandeTextView)).setText(commande.getNumber());
        ((TextView) findViewById(R.id.fournisseurTextView)).setText(commande.getFournisseurEmail());
        ((TextView) findViewById(R.id.dateTextView)).setText(commande.getDate());
        ((TextView) findViewById(R.id.mntTotalHTTextView)).setText(commande.getMntTotalHT() + " DT");
        ((TextView) findViewById(R.id.mntTotalTVATextView)).setText(commande.getMntTotalTVA() + " DT");
        ((TextView) findViewById(R.id.mntTotalTTCTextView)).setText(commande.getMntTotalTTC() + " DT");

        updateConfirmationStatus();

        if (commande.isConfirmed()) {
            acceptButton.setEnabled(false);
        }

        acceptButton.setOnClickListener(v -> acceptCommande());

        fetchLigneCommandes();
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }

    private void fetchLigneCommandes() {
        Log.d(TAG, "Fetching ligne commandes...");
        ApiService.fetchLigneCommandes().enqueue(new Callback<List<LigneCommande>>() {
            @Override
            public void onResponse(Call<List<LigneCommande>> call, Response<List<LigneCommande>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    ligneCommandes = response.body().stream()
                            .filter(lc -> lc.getCommandeId() != null && lc.getCommandeId() == commande.getId())
                            .collect(Collectors.toList());
                    fetchRessources();
                } else {
                    showError("Erreur de chargement des lignes de commande");
                }
            }

            @Override
            public void onFailure(Call<List<LigneCommande>> call, Throwable t) {
                Log.e(TAG, "LigneCommandes fetch failed: " + t.getMessage());
                showError("Erreur: " + t.getMessage());
            }
        });
    }

    private void fetchRessources() {
        Log.d(TAG, "Fetching ressources...");
        ApiService.fetchRessources().enqueue(new Callback<List<Ressource>>() {
            @Override
            public void onResponse(Call<List<Ressource>> call, Response<List<Ressource>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    ressources = response.body();
                    displayLigneCommandes();
                } else {
                    showError("Erreur de chargement des ressources");
                }
            }

            @Override
            public void onFailure(Call<List<Ressource>> call, Throwable t) {
                Log.e(TAG, "Ressources fetch failed: " + t.getMessage());
                showError("Erreur: " + t.getMessage());
            }
        });
    }

    private void displayLigneCommandes() {
        if (ligneCommandes.isEmpty()) {
            showError("Aucune ligne de commande trouvée");
            return;
        }

        tableLayout.removeAllViews();

        TableRow headerRow = new TableRow(this);
        headerRow.setBackgroundColor(getResources().getColor(R.color.grey));
        headerRow.addView(createTextView("Produit", true));
        headerRow.addView(createTextView("Quantité", true));
        headerRow.addView(createTextView("Prix Unitaire", true));
        tableLayout.addView(headerRow);

        for (LigneCommande lc : ligneCommandes) {
            Ressource ressource = ressources.stream()
                    .filter(r -> r.getId() == lc.getProduitId())
                    .findFirst()
                    .orElse(new Ressource(-1, "Inconnu", 0.0));

            TableRow row = new TableRow(this);
            row.setBackgroundColor(getResources().getColor(R.color.white));
            row.addView(createTextView(ressource.getName(), false));
            row.addView(createTextView(lc.getQte() != null ? lc.getQte().toString() : "N/A", false));
            row.addView(createTextView(lc.getPu() + " DT", false));
            tableLayout.addView(row);
        }
    }

    private TextView createTextView(String text, boolean isHeader) {
        TextView textView = new TextView(this);
        textView.setText(text);
        textView.setPadding(10, 10, 10, 10);
        textView.setTextSize(16);
        if (isHeader) {
            textView.setTextColor(getResources().getColor(R.color.white));
            textView.setTypeface(null, android.graphics.Typeface.BOLD);
        }
        return textView;
    }

    private void acceptCommande() {
        Log.d(TAG, "Accepting commande ID: " + commande.getId());

        ApiService.confirmCommande(commande.getId()).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    commande.setConfirmation(true);
                    updateConfirmationStatus();
                    acceptButton.setEnabled(false);
                    Toast.makeText(CommandeDetailsActivity.this, R.string.commande_accepted_success, Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(CommandeDetailsActivity.this, R.string.commande_accept_error, Toast.LENGTH_SHORT).show();
                    Log.e(TAG, "Erreur de confirmation: code " + response.code());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(CommandeDetailsActivity.this, "Erreur: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e(TAG, "API failure: " + t.getMessage(), t);
            }
        });
    }

    private void updateConfirmationStatus() {
        confirmationStatusTextView.setText(commande.isConfirmed() ? R.string.commande_confirmed : R.string.commande_not_confirmed);
        confirmationStatusTextView.setTextColor(getResources().getColor(commande.isConfirmed() ? R.color.green : R.color.red));
    }

    private void showError(String message) {
        errorTextView.setText(message);
        errorTextView.setVisibility(View.VISIBLE);
    }
}
