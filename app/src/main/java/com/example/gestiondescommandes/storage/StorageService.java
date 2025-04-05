package com.example.gestiondescommandes.storage;

import android.content.Context;
import android.content.SharedPreferences;

public class StorageService {
    private static final String PREFS_NAME = "UserPrefs";
    private static final String KEY_EMAIL = "userEmail";

    public static void saveEmail(Context context, String email) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(KEY_EMAIL, email).apply();
    }

    public static String getEmail(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getString(KEY_EMAIL, null);
    }

    public static void clearUser(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().remove(KEY_EMAIL).apply();
    }
}