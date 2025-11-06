package com.naturalstupidity.multilinguadroid

import android.content.Context
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

class TranslationRepository(private val context: Context) {
    
    private val prefs = context.getSharedPreferences("translations_db", Context.MODE_PRIVATE)
    private val gson = Gson()
    
    private val api: LibreTranslateApi by lazy {
        Retrofit.Builder()
            .baseUrl("http://10.0.2.2:5432/") // Android emulator localhost
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(LibreTranslateApi::class.java)
    }
    
    suspend fun getAllTranslations(): List<TranslationEntry> = withContext(Dispatchers.IO) {
        val json = prefs.getString("translations", "[]") ?: "[]"
        val array = gson.fromJson(json, Array<TranslationEntry>::class.java)
        array.toList()
    }
    
    suspend fun insertTranslation(entry: TranslationEntry) = withContext(Dispatchers.IO) {
        val list = getAllTranslations().toMutableList()
        val newEntry = entry.copy(id = System.currentTimeMillis())
        list.add(newEntry)
        saveAll(list)
    }
    
    suspend fun updateTranslation(entry: TranslationEntry) = withContext(Dispatchers.IO) {
        val list = getAllTranslations().toMutableList()
        val index = list.indexOfFirst { it.id == entry.id }
        if (index >= 0) {
            list[index] = entry
            saveAll(list)
        }
    }
    
    suspend fun deleteTranslation(entry: TranslationEntry) = withContext(Dispatchers.IO) {
        val list = getAllTranslations().toMutableList()
        list.removeIf { it.id == entry.id }
        saveAll(list)
    }
    
    private fun saveAll(list: List<TranslationEntry>) {
        val json = gson.toJson(list)
        prefs.edit().putString("translations", json).apply()
    }
    
    suspend fun translateText(text: String, targetLang: String): List<String> = withContext(Dispatchers.IO) {
        if (text.isBlank()) return@withContext emptyList()
        
        try {
            val request = TranslateRequest(
                q = text,
                source = "en",
                target = targetLang,
                format = "text",
                alternatives = 4
            )
            
            val response = api.translate(request)
            
            val results = mutableListOf(response.translatedText)
            response.alternatives?.let { alts ->
                results.addAll(alts.take(4))
            }
            
            results.distinct().take(5)
        } catch (e: Exception) {
            listOf("Translation error: ${e.message}")
        }
    }
}

data class TranslateRequest(
    val q: String,
    val source: String,
    val target: String,
    val format: String = "text",
    val alternatives: Int = 4
)

data class TranslateResponse(
    val translatedText: String,
    val alternatives: List<String>? = null
)

interface LibreTranslateApi {
    @POST("translate")
    suspend fun translate(@Body request: TranslateRequest): TranslateResponse
}
