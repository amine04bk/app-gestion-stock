package com.example.gestiondescommandes.ui;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import com.example.gestiondescommandes.R;
import com.example.gestiondescommandes.api.ApiService;
import com.example.gestiondescommandes.models.Commande;
import com.example.gestiondescommandes.storage.StorageService;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CommandesActivity extends AppCompatActivity {
    private SwipeRefreshLayout swipeRefreshLayout;
    private ListView commandesListView;
    private List<Commande> commandes = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_commandes);

        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        commandesListView = findViewById(R.id.commandesListView);

        setTitle(R.string.commandes_title);

        swipeRefreshLayout.setOnRefreshListener(this::fetchCommandes);

        commandesListView.setOnItemClickListener((parent, view, position, id) -> {
            Commande commande = commandes.get(position);
            Intent intent = new Intent(this, CommandeDetailsActivity.class);
            intent.putExtra("commande", (Serializable) commande);
            startActivity(intent);
        });

        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
    }

    @Override
    protected void onResume() {
        super.onResume();
        fetchCommandes(); // Refresh every time the activity becomes visible
    }

    @Override
    public boolean onSupportNavigateUp() {
        logout();
        return true;
    }

    private void fetchCommandes() {
        Log.d("CommandesActivity", "Starting fetchCommandes...");
        swipeRefreshLayout.setRefreshing(true);
        String email = StorageService.getEmail(this);
        Log.d("CommandesActivity", "Fetching commandes for email: " + email);
        ApiService.fetchCommandes().enqueue(new Callback<List<Commande>>() {
            @Override
            public void onResponse(Call<List<Commande>> call, Response<List<Commande>> response) {
                Log.d("CommandesActivity", "API Response received. Code: " + response.code());
                swipeRefreshLayout.setRefreshing(false);
                if (response.isSuccessful() && response.body() != null) {
                    Log.d("CommandesActivity", "Filtering commandes...");
                    commandes = response.body().stream()
                            .filter(cmd -> cmd.getFournisseurEmail().equals(email))
                            .collect(Collectors.toList());
                    Log.d("CommandesActivity", "Filtered commandes count: " + commandes.size());
                    updateListView();
                } else {
                    Log.e("CommandesActivity", "API Error: " + response.message());
                    Toast.makeText(CommandesActivity.this, "Erreur: " + response.message(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Commande>> call, Throwable t) {
                Log.e("CommandesActivity", "API Call Failed: " + t.getMessage(), t);
                swipeRefreshLayout.setRefreshing(false);
                Toast.makeText(CommandesActivity.this, "Erreur: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void updateListView() {
        Log.d("CommandesActivity", "Updating ListView with " + commandes.size() + " items");
        ArrayAdapter<Commande> adapter = new ArrayAdapter<Commande>(this, R.layout.item_commande, R.id.commandeNumberTextView, commandes) {

            @Override
            public View getView(int position, View convertView, ViewGroup parent) {
                View view = super.getView(position, convertView, parent);
                TextView numberTextView = view.findViewById(R.id.commandeNumberTextView);
                TextView totalTextView = view.findViewById(R.id.commandeTotalTextView);
                Commande commande = getItem(position);
                numberTextView.setText("Commande #" + commande.getNumber());
                totalTextView.setText("Total TTC: " + commande.getMntTotalTTC() + " DT");
                return view;
            }
        };
        commandesListView.setAdapter(adapter);
        Log.d("CommandesActivity", "ListView updated");
    }

    private void logout() {
        StorageService.clearUser(this);
        startActivity(new Intent(this, LoginActivity.class));
        finish();
    }
}
