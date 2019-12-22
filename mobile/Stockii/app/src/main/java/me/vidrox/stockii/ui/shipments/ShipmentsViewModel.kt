package me.vidrox.stockii.ui.shipments

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import me.vidrox.stockii.Config
import me.vidrox.stockii.InternalErrorCodes
import me.vidrox.stockii.api.repositories.ShipmentsRepository
import me.vidrox.stockii.api.shipments.Shipment
import me.vidrox.stockii.listeners.PageRequestListener
import me.vidrox.stockii.utils.ApiException
import me.vidrox.stockii.utils.Coroutines

class ShipmentsViewModel(application: Application) : AndroidViewModel(application) {
    var requestListener: PageRequestListener<List<Shipment>>? = null

    var page: MutableLiveData<Int> = MutableLiveData(0)
    var lastPage: MutableLiveData<Boolean> = MutableLiveData(false)
    var shipmentsLiveData: MutableLiveData<ArrayList<Shipment>> = MutableLiveData(arrayListOf())

    private val repository: ShipmentsRepository = ShipmentsRepository()

    fun reset() {
        page = MutableLiveData(0)
        lastPage = MutableLiveData(false)
        shipmentsLiveData = MutableLiveData(arrayListOf())
    }

    fun getShipments(page: Int) {
        val offset = page * Config.API_ROW_COUNT
        val ordering = "-id"

        requestListener?.onRequest()

        Coroutines.mainThread {
            try {
                val response = repository.getShipments(offset, ordering, getApplication())

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
