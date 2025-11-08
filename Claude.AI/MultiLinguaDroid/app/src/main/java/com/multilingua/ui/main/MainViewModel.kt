package com.multilingua.ui.main

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.viewModelScope
import com.google.gson.Gson
import com.multilingua.MultiLinguaApplication
import com.multilingua.data.model.Translation
import kotlinx.coroutines.launch

class MainViewModel(application: Application) : AndroidViewModel(application) {

    private val app = application as MultiLinguaApplication
    private val repository = app.translationRepository
    private val translationService = app.translationService
    private val gson = Gson()

    val allTranslations: LiveData<List<Translation>> = repository.allTranslations

    fun insert(translation: Translation) = viewModelScope.launch {
        repository.insert(translation)
    }

    fun update(translation: Translation) = viewModelScope.launch {
        repository.update(translation.copy(updatedAt = System.currentTimeMillis()))
    }

    fun delete(translation: Translation) = viewModelScope.launch {
        repository.delete(translation)
    }

    fun translateFromLanguage(translation: Translation, sourceLanguage: String, callback: (Translation?) -> Unit) {
        viewModelScope.launch {
            try {
                val sourceText = when(sourceLanguage) {
                    "en" -> translation.english
                    "de" -> translation.german
                    "fr" -> translation.french
                    "it" -> translation.italian
                    "es" -> translation.spanish
                    else -> return@launch
                }

                if (sourceText.isBlank()) return@launch

                val response = translationService.translateFromLanguage(sourceText, sourceLanguage)

                val updated = translation.copy(
                    english = response.english?.translatedText ?: translation.english,
                    german = response.german?.translatedText ?: translation.german,
                    french = response.french?.translatedText ?: translation.french,
                    italian = response.italian?.translatedText ?: translation.italian,
                    spanish = response.spanish?.translatedText ?: translation.spanish,
                    englishProposals = response.english?.let { gson.toJson(it.alternatives) } ?: translation.englishProposals,
                    germanProposals = response.german?.let { gson.toJson(it.alternatives) } ?: translation.germanProposals,
                    frenchProposals = response.french?.let { gson.toJson(it.alternatives) } ?: translation.frenchProposals,
                    italianProposals = response.italian?.let { gson.toJson(it.alternatives) } ?: translation.italianProposals,
                    spanishProposals = response.spanish?.let { gson.toJson(it.alternatives) } ?: translation.spanishProposals,
                    updatedAt = System.currentTimeMillis()
                )

                repository.update(updated)
                callback(updated)
            } catch (e: Exception) {
                callback(null)
            }
        }
    }
}
