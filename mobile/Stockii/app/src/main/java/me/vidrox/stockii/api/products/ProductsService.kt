package me.vidrox.stockii.api.products

import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.PUT
import retrofit2.http.Query
import retrofit2.http.FormUrlEncoded
import retrofit2.http.Path
import retrofit2.http.Field

interface ProductsService {
    @GET("products/")
    suspend fun getProducts(
        @Query("offset") offset: Int,
        @Query("ordering") ordering: String
    ): Response<ProductsResponse>

    @FormUrlEncoded
    @PUT("products/{id}/")
    suspend fun updateProduct(
        @Path("id") id: Int,
        @Field("warehouse") warehouse: Int
    ): Response<ProductsResponse>
}