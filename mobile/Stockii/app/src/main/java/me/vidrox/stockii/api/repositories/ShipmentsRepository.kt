package me.vidrox.stockii.api.repositories

import android.content.Context
import me.vidrox.stockii.api.ApiRequest
import me.vidrox.stockii.api.ApiService
import me.vidrox.stockii.api.shipments.ShipmentsResponse

class ShipmentsRepository : ApiRequest() {

    suspend fun getShipments(offset: Int, ordering: String, context: Context?): ShipmentsResponse {
        return request {
            ApiService.getShipmentsService(context).getShipments(offset, ordering)
        }
    }

}