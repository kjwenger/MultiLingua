package com.multilingua.data.database

import androidx.lifecycle.LiveData
import androidx.room.*
import com.multilingua.data.model.Translation

@Dao
interface TranslationDao {

    @Query("SELECT * FROM translations ORDER BY english ASC")
    fun getAllTranslations(): LiveData<List<Translation>>

    @Query("SELECT * FROM translations WHERE id = :id")
    suspend fun getTranslationById(id: Long): Translation?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(translation: Translation): Long

    @Update
    suspend fun update(translation: Translation)

    @Delete
    suspend fun delete(translation: Translation)

    @Query("DELETE FROM translations WHERE id = :id")
    suspend fun deleteById(id: Long)

    @Query("SELECT * FROM translations ORDER BY english DESC")
    fun getAllTranslationsDescending(): LiveData<List<Translation>>
}
