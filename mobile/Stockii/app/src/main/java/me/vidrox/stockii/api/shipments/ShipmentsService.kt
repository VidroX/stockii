package me.vidrox.stockii.api.shipments

import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Query

interface ShipmentsService {
    @GET("shipments/")
    suspend fun getShipments(
        @Query("offset") offset: Int,
        @Query("ordering") ordering: String
    ): Response<ShipmentsResponse>
}