package com.multilingua.ui.main

import android.content.Intent
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.appbar.MaterialToolbar
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.multilingua.R
import com.multilingua.data.model.Translation
import com.multilingua.ui.adapters.TranslationAdapter
import com.multilingua.ui.settings.SettingsActivity
import java.util.*

class MainActivity : AppCompatActivity(), TextToSpeech.OnInitListener {

    private lateinit var viewModel: MainViewModel
    private lateinit var adapter: TranslationAdapter
    private lateinit var recyclerView: RecyclerView
    private lateinit var emptyTextView: View
    private lateinit var tts: TextToSpeech

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Setup toolbar
        val toolbar = findViewById<MaterialToolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)

        // Initialize TTS
        tts = TextToSpeech(this, this)

        // Initialize ViewModel
        viewModel = ViewModelProvider(this)[MainViewModel::class.java]

        // Setup RecyclerView
        recyclerView = findViewById(R.id.recyclerView)
        emptyTextView = findViewById(R.id.emptyTextView)

        adapter = TranslationAdapter(
            onTranslate = { translation, sourceLang ->
                handleTranslate(translation, sourceLang)
            },
            onSpeak = { text, langCode ->
                speak(text, langCode)
            },
            onTextChanged = { translation, field, newValue ->
                handleTextChanged(translation, field, newValue)
            },
            onDelete = { translation ->
                viewModel.delete(translation)
                Toast.makeText(this, R.string.deleted, Toast.LENGTH_SHORT).show()
            }
        )

        recyclerView.adapter = adapter
        recyclerView.layoutManager = LinearLayoutManager(this)

        // Observe translations
        viewModel.allTranslations.observe(this) { translations ->
            adapter.submitList(translations)
            if (translations.isEmpty()) {
                recyclerView.visibility = View.GONE
                emptyTextView.visibility = View.VISIBLE
            } else {
                recyclerView.visibility = View.VISIBLE
                emptyTextView.visibility = View.GONE
            }
        }

        // FAB click listener
        findViewById<FloatingActionButton>(R.id.fabAdd).setOnClickListener {
            val newTranslation = Translation()
            viewModel.insert(newTranslation)
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_settings -> {
                startActivity(Intent(this, SettingsActivity::class.java))
                true
            }
            R.id.action_sort -> {
                // Sort functionality would go here
                Toast.makeText(this, "Sort clicked", Toast.LENGTH_SHORT).show()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun handleTranslate(translation: Translation, sourceLang: String) {
        Toast.makeText(this, R.string.translating, Toast.LENGTH_SHORT).show()

        viewModel.translateFromLanguage(translation, sourceLang) { result ->
            runOnUiThread {
                if (result != null) {
                    Toast.makeText(this, "Translation complete", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this, R.string.translation_error, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun handleTextChanged(translation: Translation, field: String, newValue: String) {
        val updated = when (field) {
            "english" -> translation.copy(english = newValue)
            "german" -> translation.copy(german = newValue)
            "french" -> translation.copy(french = newValue)
            "italian" -> translation.copy(italian = newValue)
            "spanish" -> translation.copy(spanish = newValue)
            else -> return
        }
        viewModel.update(updated)
    }

    private fun speak(text: String, langCode: String) {
        if (text.isBlank()) return

        val locale = when (langCode) {
            "en" -> Locale.US
            "de" -> Locale.GERMAN
            "fr" -> Locale.FRENCH
            "it" -> Locale.ITALIAN
            "es" -> Locale("es", "ES")
            else -> Locale.US
        }

        tts.language = locale
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, null)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts.language = Locale.US
        }
    }

    override fun onDestroy() {
        tts.shutdown()
        super.onDestroy()
    }
}
