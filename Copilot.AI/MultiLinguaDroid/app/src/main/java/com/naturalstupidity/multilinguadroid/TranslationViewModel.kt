package com.naturalstupidity.multilinguadroid

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class TranslationViewModel(application: Application) : AndroidViewModel(application) {
    
    private val repository = TranslationRepository(application)
    
    private val _translations = MutableLiveData<List<TranslationEntry>>()
    val translations: LiveData<List<TranslationEntry>> = _translations
    
    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error
    
    init {
        loadTranslations()
    }
    
    private fun loadTranslations() {
        viewModelScope.launch {
            try {
                val entries = repository.getAllTranslations()
                _translations.postValue(entries)
            } catch (e: Exception) {
                _error.postValue("Failed to load translations: ${e.message}")
            }
        }
    }
    
    fun addNewEntry() {
        viewModelScope.launch {
            try {
                val newEntry = TranslationEntry()
                repository.insertTranslation(newEntry)
                loadTranslations()
            } catch (e: Exception) {
                _error.postValue("Failed to add entry: ${e.message}")
            }
        }
    }
    
    fun deleteEntry(entry: TranslationEntry) {
        viewModelScope.launch {
            try {
                repository.deleteTranslation(entry)
                loadTranslations()
            } catch (e: Exception) {
                _error.postValue("Failed to delete entry: ${e.message}")
            }
        }
    }
    
    fun updateEntry(entry: TranslationEntry) {
        viewModelScope.launch {
            try {
                repository.updateTranslation(entry)
                loadTranslations()
            } catch (e: Exception) {
                _error.postValue("Failed to update entry: ${e.message}")
            }
        }
    }
    
    fun translate(entry: TranslationEntry, targetLanguage: String) {
        viewModelScope.launch {
            try {
                val translations = repository.translateText(entry.english, targetLanguage)
                
                when (targetLanguage) {
                    "fr" -> {
                        entry.frenchOptions = translations
                        if (translations.isNotEmpty()) entry.french = translations[0]
                    }
                    "it" -> {
                        entry.italianOptions = translations
                        if (translations.isNotEmpty()) entry.italian = translations[0]
                    }
                    "es" -> {
                        entry.spanishOptions = translations
                        if (translations.isNotEmpty()) entry.spanish = translations[0]
                    }
                }
                
                updateEntry(entry)
            } catch (e: Exception) {
                _error.postValue("Translation failed: ${e.message}")
            }
        }
    }
    
    fun sortByEnglish() {
        val currentList = _translations.value ?: return
        val sorted = currentList.sortedBy { it.english.lowercase() }
        _translations.postValue(sorted)
    }
}
