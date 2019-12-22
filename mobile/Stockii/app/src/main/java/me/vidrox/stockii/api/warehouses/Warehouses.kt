package me.vidrox.stockii.api.warehouses

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class WarehousesResponse (
    val count: Int?,
    val results: List<Warehouse>?
)

@JsonClass(generateAdapter = true)
data class Warehouse (
    val id: Int,
    val location: String,
    val working_from: String,
    val working_to: String,
    val weekends: Boolean,
    val phone: String?
)