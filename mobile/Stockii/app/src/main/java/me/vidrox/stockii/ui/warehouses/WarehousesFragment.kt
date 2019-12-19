package me.vidrox.stockii.ui.warehouses

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import kotlinx.android.synthetic.main.warehouses_fragment.*
import me.vidrox.stockii.Config
import me.vidrox.stockii.R
import me.vidrox.stockii.adapters.WarehousesRecyclerViewAdapter
import me.vidrox.stockii.api.RequestListener
import me.vidrox.stockii.api.warehouses.Warehouse

class WarehousesFragment : Fragment(), RequestListener<List<Warehouse>> {

    companion object {
        fun newInstance() = WarehousesFragment()
    }

    private lateinit var viewModel: WarehousesViewModel
    private lateinit var progress: LinearLayout

    private val warehousesAdapter = WarehousesRecyclerViewAdapter(arrayListOf())

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.warehouses_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(WarehousesViewModel::class.java)
        progress = activity!!.findViewById(R.id.warehouses_progress) as LinearLayout

        viewModel.requestListener = this

        warehouses_recycler.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = warehousesAdapter
        }

        val warehouseLiveDataObserver = Observer<List<Warehouse>> { newWarehouseList ->
            if (Config.DEBUG_TO_LOG) {
                Log.w("WarehouseListChanged", newWarehouseList.toString())
            }

            if (warehousesAdapter.warehouses != newWarehouseList) {
                warehousesAdapter.updateWarehouses(newWarehouseList, false)
            }
        }
        viewModel.warehousesLiveData.observe(this, warehouseLiveDataObserver)

        if (viewModel.warehousesLiveData.value.isNullOrEmpty()) {
            viewModel.getWarehouses(0)
        }
    }

    override fun onRequest() {
        if (viewModel.warehousesLiveData.value.isNullOrEmpty()) {
            progress.visibility = View.VISIBLE
        }
    }

    override fun onSuccess(result: List<Warehouse>?) {
        progress.visibility = View.GONE
        if (!result.isNullOrEmpty()) {
            viewModel.warehousesLiveData.value = result
        }
    }

    override fun onError(responseCode: Int, errorCode: Int, errorMessage: String) {
        progress.visibility = View.GONE
    }
}
