package com.multilingua.data.repository

import androidx.lifecycle.LiveData
import com.multilingua.data.database.AppDatabase
import com.multilingua.data.model.Translation

class TranslationRepository(private val database: AppDatabase) {

    private val translationDao = database.translationDao()

    val allTranslations: LiveData<List<Translation>> = translationDao.getAllTranslations()

    suspend fun insert(translation: Translation): Long {
        return translationDao.insert(translation)
    }

    suspend fun update(translation: Translation) {
        translationDao.update(translation)
    }

    suspend fun delete(translation: Translation) {
        translationDao.delete(translation)
    }

    suspend fun deleteById(id: Long) {
        translationDao.deleteById(id)
    }

    suspend fun getById(id: Long): Translation? {
        return translationDao.getTranslationById(id)
    }
}
