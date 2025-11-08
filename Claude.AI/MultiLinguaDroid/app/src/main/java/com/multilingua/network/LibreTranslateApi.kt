package com.multilingua.network

import com.google.gson.annotations.SerializedName
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

data class TranslateRequest(
    @SerializedName("q") val text: String,
    @SerializedName("source") val source: String,
    @SerializedName("target") val target: String,
    @SerializedName("format") val format: String = "text",
    @SerializedName("api_key") val apiKey: String? = null
)

data class TranslateResponse(
    @SerializedName("translatedText") val translatedText: String
)

interface LibreTranslateApi {

    @POST("translate")
    suspend fun translate(@Body request: TranslateRequest): Response<TranslateResponse>
}
