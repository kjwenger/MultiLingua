package com.multilingua.data.model

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "translations")
data class Translation(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,

    @ColumnInfo(name = "english")
    val english: String = "",

    @ColumnInfo(name = "german")
    val german: String = "",

    @ColumnInfo(name = "french")
    val french: String = "",

    @ColumnInfo(name = "italian")
    val italian: String = "",

    @ColumnInfo(name = "spanish")
    val spanish: String = "",

    @ColumnInfo(name = "english_proposals")
    val englishProposals: String = "[]",

    @ColumnInfo(name = "german_proposals")
    val germanProposals: String = "[]",

    @ColumnInfo(name = "french_proposals")
    val frenchProposals: String = "[]",

    @ColumnInfo(name = "italian_proposals")
    val italianProposals: String = "[]",

    @ColumnInfo(name = "spanish_proposals")
    val spanishProposals: String = "[]",

    @ColumnInfo(name = "created_at")
    val createdAt: Long = System.currentTimeMillis(),

    @ColumnInfo(name = "updated_at")
    val updatedAt: Long = System.currentTimeMillis()
)
