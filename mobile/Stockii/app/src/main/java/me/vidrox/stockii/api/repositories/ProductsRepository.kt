package me.vidrox.stockii.api.repositories

import android.content.Context
import me.vidrox.stockii.api.ApiRequest
import me.vidrox.stockii.api.ApiService
import me.vidrox.stockii.api.products.ProductsResponse

class ProductsRepository : ApiRequest() {

    suspend fun getProducts(offset: Int, ordering: String, context: Context?): ProductsResponse {
        return request {
            ApiService.getProductsService(context).getProducts(offset, ordering)
        }
    }

    suspend fun updateProduct(id: Int, warehouse: Int, context: Context?): ProductsResponse {
        return request {
            ApiService.getProductsService(context).updateProduct(id, warehouse)
        }
    }

}