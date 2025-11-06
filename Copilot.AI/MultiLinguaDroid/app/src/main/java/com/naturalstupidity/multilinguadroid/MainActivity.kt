package com.naturalstupidity.multilinguadroid

import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.app.AppCompatDelegate
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.floatingactionbutton.FloatingActionButton

class MainActivity : AppCompatActivity() {
    
    private lateinit var viewModel: TranslationViewModel
    private lateinit var adapter: TranslationAdapter
    private lateinit var recyclerView: RecyclerView
    private lateinit var fabAdd: FloatingActionButton
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        setSupportActionBar(findViewById(R.id.toolbar))
        
        viewModel = ViewModelProvider(this)[TranslationViewModel::class.java]
        
        recyclerView = findViewById(R.id.recyclerView)
        fabAdd = findViewById(R.id.fabAdd)
        
        adapter = TranslationAdapter(
            onTranslate = { entry, language -> 
                viewModel.translate(entry, language)
            },
            onDelete = { entry ->
                viewModel.deleteEntry(entry)
            },
            onUpdate = { entry ->
                viewModel.updateEntry(entry)
            }
        )
        
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = adapter
        
        viewModel.translations.observe(this) { translations ->
            adapter.submitList(translations)
        }
        
        viewModel.error.observe(this) { error ->
            error?.let {
                Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
            }
        }
        
        fabAdd.setOnClickListener {
            viewModel.addNewEntry()
        }
        
        loadTheme()
    }
    
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }
    
    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_sort -> {
                viewModel.sortByEnglish()
                true
            }
            R.id.action_theme -> {
                toggleTheme()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
    
    private fun loadTheme() {
        val prefs = getSharedPreferences("theme_prefs", MODE_PRIVATE)
        val isDarkMode = prefs.getBoolean("dark_mode", false)
        AppCompatDelegate.setDefaultNightMode(
            if (isDarkMode) AppCompatDelegate.MODE_NIGHT_YES 
            else AppCompatDelegate.MODE_NIGHT_NO
        )
    }
    
    private fun toggleTheme() {
        val prefs = getSharedPreferences("theme_prefs", MODE_PRIVATE)
        val isDarkMode = prefs.getBoolean("dark_mode", false)
        
        prefs.edit().putBoolean("dark_mode", !isDarkMode).apply()
        
        AppCompatDelegate.setDefaultNightMode(
            if (!isDarkMode) AppCompatDelegate.MODE_NIGHT_YES 
            else AppCompatDelegate.MODE_NIGHT_NO
        )
    }
}
