package com.naturalstupidity.multilinguadroid

data class TranslationEntry(
    val id: Long = 0,
    var english: String = "",
    var french: String = "",
    var italian: String = "",
    var spanish: String = "",
    var frenchOptions: List<String> = emptyList(),
    var italianOptions: List<String> = emptyList(),
    var spanishOptions: List<String> = emptyList()
)
