package me.vidrox.stockii.api

import android.content.Context
import android.util.Log
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import me.vidrox.stockii.Config
import me.vidrox.stockii.api.user.User
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import java.util.concurrent.TimeUnit

private class AuthInterceptor(private val context: Context) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        var newRequest = chain.request()

        val user = User.get(context)

        if (user != null) {
            newRequest = newRequest
                .newBuilder()
                .header("Authorization", "Bearer " + user.token)
                .build()
        }

        if (Config.DEBUG_TO_LOG) {
            Log.w("APIIntercetpor", newRequest.toString())
        }

        return chain.proceed(newRequest)
    }
}

object ApiFactory {
    fun getRetrofit(context: Context?) : Retrofit {
        var okHttpClient: OkHttpClient =
            OkHttpClient
                .Builder()
                .readTimeout(60, TimeUnit.SECONDS)
                .connectTimeout(60, TimeUnit.SECONDS)
                .build()

        if (context != null) {
            okHttpClient = OkHttpClient
                .Builder()
                .addInterceptor(AuthInterceptor(context))
                .readTimeout(60, TimeUnit.SECONDS)
                .connectTimeout(60, TimeUnit.SECONDS)
                .build()
        }

        val moshi: Moshi =
            Moshi.Builder()
                .add(KotlinJsonAdapterFactory())
                .build()

        return Retrofit.Builder()
            .client(okHttpClient)
            .baseUrl(Config.API_BASE_URL)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
    }
}