package me.vidrox.stockii.api.shipments

import com.squareup.moshi.JsonClass
import me.vidrox.stockii.api.products.Product

@JsonClass(generateAdapter = true)
data class ShipmentsResponse (
    val count: Int?,
    val results: List<Shipment>?
)

@JsonClass(generateAdapter = true)
data class Shipment (
    val id: Int,
    val product: Product,
    val provider: Provider,
    val quantity: Int,
    val start_date: String,
    val approximate_delivery: String,
    val status: Int
)

@JsonClass(generateAdapter = true)
data class Provider (
    val id: Int,
    val name: String,
    val working_from: String,
    val working_to: String,
    val average_delivery_time: Int,
    val weekends: Boolean,
    val phone: String?
)