package me.vidrox.stockii.ui.warehouses

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import me.vidrox.stockii.Config
import me.vidrox.stockii.InternalErrorCodes
import me.vidrox.stockii.api.repositories.WarehousesRepository
import me.vidrox.stockii.api.warehouses.Warehouse
import me.vidrox.stockii.listeners.PageRequestListener
import me.vidrox.stockii.utils.ApiException
import me.vidrox.stockii.utils.Coroutines

class WarehousesViewModel(application: Application) : AndroidViewModel(application) {
    var requestListener: PageRequestListener<List<Warehouse>>? = null

    var page: MutableLiveData<Int> = MutableLiveData(0)
    var lastPage: MutableLiveData<Boolean> = MutableLiveData(false)
    var warehousesLiveData: MutableLiveData<ArrayList<Warehouse>> = MutableLiveData(arrayListOf())

    private val repository: WarehousesRepository = WarehousesRepository()

    fun reset() {
        page = MutableLiveData(0)
        lastPage = MutableLiveData(false)
        warehousesLiveData = MutableLiveData(arrayListOf())
    }

    fun getWarehouses(page: Int) {
        val offset = page * Config.API_ROW_COUNT
        val ordering = "-id"

        requestListener?.onRequest()

        Coroutines.mainThread {
            try {
                val response = repository.getWarehouses(offset, ordering, getApplication())

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
