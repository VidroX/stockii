package me.vidrox.stockii.ui.products

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import me.vidrox.stockii.Config
import me.vidrox.stockii.InternalErrorCodes
import me.vidrox.stockii.api.products.Product
import me.vidrox.stockii.api.repositories.ProductsRepository
import me.vidrox.stockii.listeners.PageRequestListener
import me.vidrox.stockii.utils.ApiException
import me.vidrox.stockii.utils.Coroutines

class ProductsViewModel(application: Application) : AndroidViewModel(application) {
    var requestListener: PageRequestListener<List<Product>>? = null

    var page: MutableLiveData<Int> = MutableLiveData(0)
    var lastPage: MutableLiveData<Boolean> = MutableLiveData(false)
    var productsLiveData: MutableLiveData<ArrayList<Product>> = MutableLiveData(arrayListOf())

    private val repository: ProductsRepository = ProductsRepository()

    fun reset() {
        page = MutableLiveData(0)
        lastPage = MutableLiveData(false)
        productsLiveData = MutableLiveData(arrayListOf())
    }

    fun getProducts(page: Int) {
        val offset = page * Config.API_ROW_COUNT
        val ordering = "-id"

        requestListener?.onRequest()

        Coroutines.mainThread {
            try {
                val response = repository.getProducts(offset, ordering, getApplication())

                if (response.results != null && !response.results.isNullOrEmpty()) {
                    requestListener?.onSuccess(response.results, response.count)
                    return@mainThread
                }

                requestListener?.onError(0, InternalErrorCodes.NO_RESULTS, "No results found")
            }catch(e: ApiException){
                requestListener?.onError(e.responseCode, e.errorCode, e.errorMessage)
            }
        }
    }
}
