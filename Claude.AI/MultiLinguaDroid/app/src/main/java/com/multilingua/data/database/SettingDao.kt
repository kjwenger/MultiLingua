package com.multilingua.data.database

import androidx.lifecycle.LiveData
import androidx.room.*
import com.multilingua.data.model.Setting

@Dao
interface SettingDao {

    @Query("SELECT * FROM settings WHERE key = :key")
    suspend fun getSetting(key: String): Setting?

    @Query("SELECT * FROM settings WHERE key = :key")
    fun getSettingLive(key: String): LiveData<Setting?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(setting: Setting)

    @Query("DELETE FROM settings WHERE key = :key")
    suspend fun delete(key: String)

    @Query("SELECT value FROM settings WHERE key = :key")
    suspend fun getValue(key: String): String?
}
