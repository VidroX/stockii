package me.vidrox.stockii.api.warehouses

import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Query

interface WarehousesService {
    @GET("warehouses/")
    suspend fun getWarehouses(
        @Query("offset") offset: Int,
        @Query("ordering") ordering: String
    ): Response<WarehousesResponse>

    @GET("warehouses/")
    suspend fun getWarehouses(
        @Query("offset") offset: Int,
        @Query("ordering") ordering: String,
        @Query("name") name: String
    ): Response<WarehousesResponse>
}