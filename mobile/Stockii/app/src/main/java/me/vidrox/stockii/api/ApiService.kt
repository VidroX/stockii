package me.vidrox.stockii.api

import android.content.Context
import me.vidrox.stockii.api.products.Product
import me.vidrox.stockii.api.products.ProductsService
import me.vidrox.stockii.api.shipments.ShipmentsService
import me.vidrox.stockii.api.user.UserService
import me.vidrox.stockii.api.warehouses.WarehousesService

object ApiService {
    fun getUserService(context: Context?): UserService = ApiFactory.getRetrofit(context).create(UserService::class.java)

    fun getWarehousesService(context: Context?): WarehousesService = ApiFactory.getRetrofit(context).create(WarehousesService::class.java)

    fun getProductsService(context: Context?): ProductsService = ApiFactory.getRetrofit(context).create(ProductsService::class.java)

    fun getShipmentsService(context: Context?): ShipmentsService = ApiFactory.getRetrofit(context).create(ShipmentsService::class.java)
}