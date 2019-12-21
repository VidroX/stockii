package me.vidrox.stockii.api.products

import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Query

interface ProductsService {
    @GET("products/")
    suspend fun getProducts(
        @Query("offset") offset: Int,
        @Query("ordering") ordering: String
    ): Response<ProductsResponse>
}