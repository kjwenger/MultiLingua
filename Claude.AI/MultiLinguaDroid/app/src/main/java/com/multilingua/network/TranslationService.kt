package com.multilingua.network

import android.util.Log
import com.multilingua.data.model.TranslationResponse
import com.multilingua.data.model.TranslationResult
import com.multilingua.data.repository.SettingsRepository
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope

class TranslationService(private val settingsRepository: SettingsRepository) {

    companion object {
        private const val TAG = "TranslationService"
    }

    private suspend fun translate(text: String, source: String, target: String): String {
        return try {
            val baseUrl = settingsRepository.getLibreTranslateUrl()
            Log.d(TAG, "Using LibreTranslate URL: $baseUrl")

            val api = ApiClient.getLibreTranslateApi(baseUrl)
            val request = TranslateRequest(
                text = text,
                source = source,
                target = target
            )

            val response = api.translate(request)
            if (response.isSuccessful) {
                response.body()?.translatedText ?: ""
            } else {
                Log.e(TAG, "Translation error: ${response.code()} - ${response.message()}")
                ""
            }
        } catch (e: Exception) {
            Log.e(TAG, "Translation exception", e)
            ""
        }
    }

    private suspend fun getAlternatives(text: String, source: String, target: String): List<String> {
        val alternatives = mutableListOf<String>()

        try {
            val variations = listOf(
                text,
                text.lowercase(),
                text.replaceFirstChar { it.uppercase() } + text.substring(1).lowercase(),
                "the $text",
                "a $text",
                "$text.",
                "$text!",
                "$text?",
                text.uppercase(),
                text.trim()
            )

            for (variation in variations) {
                val result = translate(variation, source, target)
                if (result.isNotEmpty() && !alternatives.contains(result)) {
                    alternatives.add(result)
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error getting alternatives", e)
        }

        return alternatives.take(10)
    }

    suspend fun translateFromLanguage(
        text: String,
        sourceLanguage: String
    ): TranslationResponse = coroutineScope {
        val results = mutableMapOf<String, TranslationResult>()
        val targets = mutableListOf<Pair<String, String>>()

        if (sourceLanguage != "en") targets.add("english" to "en")
        if (sourceLanguage != "de") targets.add("german" to "de")
        if (sourceLanguage != "fr") targets.add("french" to "fr")
        if (sourceLanguage != "it") targets.add("italian" to "it")
        if (sourceLanguage != "es") targets.add("spanish" to "es")

        // Parallel translation
        val translationJobs = targets.map { (key, code) ->
            async {
                val translatedText = translate(text, sourceLanguage, code)
                val alternatives = getAlternatives(text, sourceLanguage, code)
                key to TranslationResult(translatedText, alternatives)
            }
        }

        translationJobs.awaitAll().forEach { (key, result) ->
            results[key] = result
        }

        TranslationResponse(
            english = results["english"],
            german = results["german"],
            french = results["french"],
            italian = results["italian"],
            spanish = results["spanish"]
        )
    }

    suspend fun translateToAllLanguages(text: String): TranslationResponse = coroutineScope {
        val germanDeferred = async {
            val translatedText = translate(text, "en", "de")
            val alternatives = getAlternatives(text, "en", "de")
            TranslationResult(translatedText, alternatives)
        }

        val frenchDeferred = async {
            val translatedText = translate(text, "en", "fr")
            val alternatives = getAlternatives(text, "en", "fr")
            TranslationResult(translatedText, alternatives)
        }

        val italianDeferred = async {
            val translatedText = translate(text, "en", "it")
            val alternatives = getAlternatives(text, "en", "it")
            TranslationResult(translatedText, alternatives)
        }

        val spanishDeferred = async {
            val translatedText = translate(text, "en", "es")
            val alternatives = getAlternatives(text, "en", "es")
            TranslationResult(translatedText, alternatives)
        }

        TranslationResponse(
            german = germanDeferred.await(),
            french = frenchDeferred.await(),
            italian = italianDeferred.await(),
            spanish = spanishDeferred.await()
        )
    }
}
