package me.vidrox.stockii.api.user

import retrofit2.Response
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST

interface UserService {
    @FormUrlEncoded
    @POST("auth/login/")
    suspend fun login(
        @Field("email") email: String,
        @Field("password") password: String,
        @Field("return_token") return_token: String,
        @Field("full_user_data") full_user_data: String
    ): Response<UserResponse>

    @FormUrlEncoded
    @POST("auth/logout/")
    suspend fun logout(): Response<UserResponse>
}