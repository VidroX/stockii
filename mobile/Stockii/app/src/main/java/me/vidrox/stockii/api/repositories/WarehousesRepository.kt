package me.vidrox.stockii.api.repositories

import android.content.Context
import me.vidrox.stockii.api.ApiRequest
import me.vidrox.stockii.api.ApiService
import me.vidrox.stockii.api.warehouses.WarehousesResponse

class WarehousesRepository : ApiRequest() {

    suspend fun getWarehouses(offset: Int, ordering: String, context: Context?): WarehousesResponse {
        return request {
            ApiService.getWarehousesService(context).getWarehouses(offset, ordering)
        }
    }

    suspend fun getWarehouses(offset: Int, ordering: String, search: String, context: Context?): WarehousesResponse {
        return request {
            ApiService.getWarehousesService(context).getWarehouses(offset, ordering, search)
        }
    }

}