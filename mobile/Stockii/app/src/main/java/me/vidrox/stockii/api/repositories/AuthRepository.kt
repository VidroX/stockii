package me.vidrox.stockii.api.repositories

import android.content.Context
import me.vidrox.stockii.api.ApiRequest
import me.vidrox.stockii.api.ApiService
import me.vidrox.stockii.api.user.User
import me.vidrox.stockii.api.user.UserResponse

class AuthRepository : ApiRequest() {

    suspend fun login(email: String, password: String, context: Context?): UserResponse {
        return request {
            ApiService.getUserService(context).login(email, password, "True", "False")
        }
    }

    suspend fun logout(context: Context): UserResponse {
        User.clear(context)
        return request {
            ApiService.getUserService(context).logout()
        }
    }

}