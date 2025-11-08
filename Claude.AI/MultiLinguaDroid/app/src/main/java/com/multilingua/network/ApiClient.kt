package com.multilingua.network

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {

    private const val DEFAULT_BASE_URL = "http://10.0.2.2:5432/" // Android emulator localhost

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    private var currentBaseUrl: String = DEFAULT_BASE_URL
    private var retrofitInstance: Retrofit? = null

    fun getRetrofit(baseUrl: String = currentBaseUrl): Retrofit {
        if (retrofitInstance == null || currentBaseUrl != baseUrl) {
            currentBaseUrl = baseUrl
            retrofitInstance = Retrofit.Builder()
                .baseUrl(ensureTrailingSlash(baseUrl))
                .client(okHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
        }
        return retrofitInstance!!
    }

    fun getLibreTranslateApi(baseUrl: String = currentBaseUrl): LibreTranslateApi {
        return getRetrofit(baseUrl).create(LibreTranslateApi::class.java)
    }

    private fun ensureTrailingSlash(url: String): String {
        return if (url.endsWith("/")) url else "$url/"
    }
}
