package me.vidrox.stockii.api

import android.content.Context
import me.vidrox.stockii.api.user.UserService

object ApiService {
    fun getUserService(context: Context?): UserService = ApiFactory.getRetrofit(context).create(UserService::class.java)
}