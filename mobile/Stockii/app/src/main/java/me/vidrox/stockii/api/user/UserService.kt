package me.vidrox.stockii.api.user

import retrofit2.Response
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST

interface UserService {
    @FormUrlEncoded
    @POST("/auth/login/")
    suspend fun auth(
        @Field("email")
        email: String,
        @Field("password")
        password: String,
        @Field("return_token")
        returnToken: Boolean
    ): Response<UserResponse>
}