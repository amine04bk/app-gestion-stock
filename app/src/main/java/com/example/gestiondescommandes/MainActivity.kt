package com.example.gestiondescommandes

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.example.gestiondescommandes.ui.WelcomeActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Redirect to WelcomeActivity
        ContextCompat.startActivity(this, Intent(this, WelcomeActivity::class.java), null)
        finish()
    }
}