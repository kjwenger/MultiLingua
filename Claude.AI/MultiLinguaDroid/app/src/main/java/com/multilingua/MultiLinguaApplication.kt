package com.multilingua

import android.app.Application
import com.multilingua.data.database.AppDatabase
import com.multilingua.data.repository.SettingsRepository
import com.multilingua.data.repository.TranslationRepository
import com.multilingua.network.TranslationService

class MultiLinguaApplication : Application() {

    val database: AppDatabase by lazy {
        AppDatabase.getDatabase(this)
    }

    val translationRepository: TranslationRepository by lazy {
        TranslationRepository(database)
    }

    val settingsRepository: SettingsRepository by lazy {
        SettingsRepository(database)
    }

    val translationService: TranslationService by lazy {
        TranslationService(settingsRepository)
    }
}
