package me.vidrox.stockii.api

import android.content.Context
import me.vidrox.stockii.api.user.UserService
import me.vidrox.stockii.api.warehouses.WarehousesService

object ApiService {
    fun getUserService(context: Context?): UserService = ApiFactory.getRetrofit(context).create(UserService::class.java)

    fun getWarehousesService(context: Context?): WarehousesService = ApiFactory.getRetrofit(context).create(WarehousesService::class.java)
}