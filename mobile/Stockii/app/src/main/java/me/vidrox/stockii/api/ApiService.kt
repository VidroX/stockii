package me.vidrox.stockii.api

import android.content.Context
import me.vidrox.stockii.api.user.UserService

class ApiService {
    companion object {
        fun getUserService(context: Context?): UserService = ApiFactory.getRetrofit(context).create(UserService::class.java)
    }
}