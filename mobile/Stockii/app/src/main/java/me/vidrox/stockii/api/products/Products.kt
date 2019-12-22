package me.vidrox.stockii.api.products

import com.squareup.moshi.JsonClass
import me.vidrox.stockii.api.warehouses.Warehouse

@JsonClass(generateAdapter = true)
data class ProductsResponse (
    val status: Int?,
    val count: Int?,
    val results: List<Product>?
)

@JsonClass(generateAdapter = true)
data class Product (
    val id: Int,
    val limit: ProductLimit?,
    val warehouse: Warehouse,
    val name: String,
    val quantity: Int
)

@JsonClass(generateAdapter = true)
data class ProductLimit (
    val id: Int,
    val min_amount: Int,
    val max_amount: Int
)