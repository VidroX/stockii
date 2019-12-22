package me.vidrox.stockii.api

import android.util.Log
import me.vidrox.stockii.utils.ApiException
import org.json.JSONException
import org.json.JSONObject
import retrofit2.Response

abstract class ApiRequest {
    suspend fun<T: Any> request(call: suspend () -> Response<T>) : T{
        val response = call.invoke()

        if (response.isSuccessful) {
            return response.body()!!
        } else {
            val error = response.errorBody().toString()

            var errorCode = 0
            var errorMessage = ""

            error.let {
                try {
                    errorCode = JSONObject(it).getInt("status")
                    errorMessage = JSONObject(it).getString("message")
                } catch (e: JSONException) {
                    try {
                        errorCode = JSONObject(it).getInt("status_code")
                        errorMessage = JSONObject(it).getString("message")
                    } catch (e: JSONException) {
                        Log.e("JSONException", e.toString())
                    }
                    Log.e("JSONException", e.toString())
                }
            }

            throw ApiException(response.code(), errorCode, errorMessage)
        }
    }
}