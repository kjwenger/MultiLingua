package com.multilingua.data.model

data class TranslationResult(
    val translatedText: String,
    val alternatives: List<String> = emptyList()
)

data class TranslationResponse(
    val english: TranslationResult? = null,
    val german: TranslationResult? = null,
    val french: TranslationResult? = null,
    val italian: TranslationResult? = null,
    val spanish: TranslationResult? = null
)
