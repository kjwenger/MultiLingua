package com.multilingua.data.repository

import androidx.lifecycle.LiveData
import com.multilingua.data.database.AppDatabase
import com.multilingua.data.model.Setting

class SettingsRepository(private val database: AppDatabase) {

    private val settingDao = database.settingDao()

    companion object {
        const val KEY_LIBRETRANSLATE_URL = "libretranslate_url"
        const val KEY_THEME = "theme"

        const val VALUE_ENV_DEFAULT = "ENV_DEFAULT"
        const val URL_LOCALHOST = "http://10.0.2.2:5432" // Android emulator localhost
        const val URL_LIBRETRANSLATE_COM = "https://libretranslate.com"
        const val URL_GERTRUN = "https://libretranslate.gertrun.synology.me/"
    }

    suspend fun saveSetting(key: String, value: String) {
        settingDao.insert(Setting(key, value))
    }

    suspend fun getSetting(key: String): Setting? {
        return settingDao.getSetting(key)
    }

    fun getSettingLive(key: String): LiveData<Setting?> {
        return settingDao.getSettingLive(key)
    }

    suspend fun getValue(key: String): String? {
        return settingDao.getValue(key)
    }

    suspend fun deleteSetting(key: String) {
        settingDao.delete(key)
    }

    suspend fun getLibreTranslateUrl(): String {
        val url = getValue(KEY_LIBRETRANSLATE_URL)
        return if (url == null || url == VALUE_ENV_DEFAULT) {
            URL_LOCALHOST // Default for Android
        } else {
            url
        }
    }
}
