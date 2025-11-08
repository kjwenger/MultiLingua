package com.multilingua.ui.settings

import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.material.appbar.MaterialToolbar
import com.multilingua.MultiLinguaApplication
import com.multilingua.R
import com.multilingua.data.repository.SettingsRepository
import kotlinx.coroutines.launch

class SettingsActivity : AppCompatActivity() {

    private lateinit var settingsRepository: SettingsRepository
    private lateinit var spinnerUrlPreset: Spinner
    private lateinit var etCustomUrl: EditText
    private lateinit var btnSaveUrl: Button
    private lateinit var tvCurrentUrl: TextView

    private val urlPresets = listOf(
        "Environment Default" to SettingsRepository.VALUE_ENV_DEFAULT,
        "Localhost:5432" to SettingsRepository.URL_LOCALHOST,
        "LibreTranslate.com" to SettingsRepository.URL_LIBRETRANSLATE_COM,
        "Gertrun Synology" to SettingsRepository.URL_GERTRUN,
        "Custom URL" to "CUSTOM"
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        val app = application as MultiLinguaApplication
        settingsRepository = app.settingsRepository

        // Setup toolbar
        val toolbar = findViewById<MaterialToolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        toolbar.setNavigationOnClickListener { finish() }

        // Initialize views
        spinnerUrlPreset = findViewById(R.id.spinnerUrlPreset)
        etCustomUrl = findViewById(R.id.etCustomUrl)
        btnSaveUrl = findViewById(R.id.btnSaveUrl)
        tvCurrentUrl = findViewById(R.id.tvCurrentUrl)

        setupUrlPresetSpinner()
        loadCurrentSettings()

        btnSaveUrl.setOnClickListener {
            saveSettings()
        }
    }

    private fun setupUrlPresetSpinner() {
        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            urlPresets.map { it.first }
        )
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinnerUrlPreset.adapter = adapter

        spinnerUrlPreset.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                if (urlPresets[position].second == "CUSTOM") {
                    etCustomUrl.visibility = View.VISIBLE
                } else {
                    etCustomUrl.visibility = View.GONE
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {}
        }
    }

    private fun loadCurrentSettings() {
        lifecycleScope.launch {
            val currentUrl = settingsRepository.getLibreTranslateUrl()
            tvCurrentUrl.text = getString(R.string.current_url, currentUrl)

            // Set spinner selection
            val presetIndex = urlPresets.indexOfFirst { it.second == currentUrl }
            if (presetIndex != -1) {
                spinnerUrlPreset.setSelection(presetIndex)
            } else {
                // Custom URL
                spinnerUrlPreset.setSelection(urlPresets.size - 1)
                etCustomUrl.setText(currentUrl)
                etCustomUrl.visibility = View.VISIBLE
            }
        }
    }

    private fun saveSettings() {
        lifecycleScope.launch {
            val selectedPosition = spinnerUrlPreset.selectedItemPosition
            val preset = urlPresets[selectedPosition]

            val urlToSave = if (preset.second == "CUSTOM") {
                etCustomUrl.text.toString().trim()
            } else {
                preset.second
            }

            if (urlToSave.isNotEmpty()) {
                settingsRepository.saveSetting(SettingsRepository.KEY_LIBRETRANSLATE_URL, urlToSave)
                tvCurrentUrl.text = getString(R.string.current_url, urlToSave)
                Toast.makeText(this@SettingsActivity, "Settings saved", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
