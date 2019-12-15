package me.vidrox.stockii.api

import android.content.Context
import com.jakewharton.retrofit2.adapter.kotlin.coroutines.CoroutineCallAdapterFactory
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
        val newRequest = chain.request()

        val user = User.get(context)

        if (user != null) {
            newRequest
                .newBuilder()
                .header("Authorization", "Bearer " + user.token)
                .build()
        }

        return chain.proceed(newRequest)
    }
}

object ApiFactory {
    private fun getHttpClient(context: Context?): OkHttpClient {
        val okHttpClient = OkHttpClient().newBuilder()

        if (context != null) {
            okHttpClient.addInterceptor(AuthInterceptor(context))
        }

        return okHttpClient
            .readTimeout(60, TimeUnit.SECONDS)
            .connectTimeout(60, TimeUnit.SECONDS)
            .build()
    }

    fun getRetrofit(context: Context?) : Retrofit = Retrofit.Builder()
        .client(getHttpClient(context))
        .baseUrl(Config.API_BASE_URL)
        .addConverterFactory(MoshiConverterFactory.create())
        .addCallAdapterFactory(CoroutineCallAdapterFactory())
        .build()
}