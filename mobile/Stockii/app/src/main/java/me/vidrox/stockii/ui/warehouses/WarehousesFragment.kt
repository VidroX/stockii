package me.vidrox.stockii.ui.warehouses

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.appcompat.app.AlertDialog
import androidx.recyclerview.widget.LinearLayoutManager
import kotlinx.android.synthetic.main.warehouse_info.view.*
import kotlinx.android.synthetic.main.warehouses_fragment.warehouses_recycler
import me.vidrox.stockii.Config
import me.vidrox.stockii.R
import me.vidrox.stockii.adapters.WarehousesRecyclerViewAdapter
import me.vidrox.stockii.listeners.PageRequestListener
import me.vidrox.stockii.api.warehouses.Warehouse
import me.vidrox.stockii.listeners.RecyclerScrollListener
import me.vidrox.stockii.listeners.LoadMoreListener
import me.vidrox.stockii.listeners.RecyclerViewItemClickListener
import java.util.Calendar
import kotlin.collections.HashMap

class WarehousesFragment : Fragment(), PageRequestListener<List<Warehouse>>, RecyclerViewItemClickListener<Warehouse>{

    companion object {
        fun newInstance() = WarehousesFragment()
    }

    private fun calculateIcons(warehouses: List<Warehouse>): HashMap<Warehouse, Int> {
        val result: HashMap<Warehouse, Int> = HashMap()

        for (warehouse in warehouses) {
            val workingFromArray = warehouse.working_from.split(":")
            val workingToArray = warehouse.working_to.split(":")
            val workingOnWeekends = warehouse.weekends

            val todayDate = Calendar.getInstance()
            val isWeekend =
                todayDate.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY || todayDate.get(
                    Calendar.DAY_OF_WEEK
                ) == Calendar.SUNDAY
            val workingDateFrom = Calendar.getInstance()
            workingDateFrom.set(Calendar.HOUR_OF_DAY, workingFromArray[0].toInt(10))
            workingDateFrom.set(Calendar.MINUTE, workingFromArray[1].toInt(10))
            workingDateFrom.set(Calendar.MILLISECOND, workingFromArray[2].toInt(10))
            val workingDateTo = Calendar.getInstance()
            workingDateTo.set(Calendar.HOUR_OF_DAY, workingToArray[0].toInt(10))
            workingDateTo.set(Calendar.MINUTE, workingToArray[1].toInt(10))
            workingDateTo.set(Calendar.MILLISECOND, workingToArray[2].toInt(10))

            if (workingOnWeekends) {
                if (todayDate.after(workingDateFrom) && todayDate.before(workingDateTo)) {
                    result[warehouse] = R.drawable.indicator_green
                } else {
                    result[warehouse] = R.drawable.indicator_gray
                }
            } else {
                if (!isWeekend && todayDate.after(workingDateFrom) && todayDate.before(workingDateTo)) {
                    result[warehouse] = R.drawable.indicator_green
                } else {
                    result[warehouse] = R.drawable.indicator_gray
                }
            }
        }

        return result
    }

    private lateinit var viewModel: WarehousesViewModel
    private lateinit var progress: LinearLayout
    private var warehousesAdapter = WarehousesRecyclerViewAdapter(arrayListOf(), hashMapOf())
    private var page = 0

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.warehouses_fragment, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val mLayoutManager = LinearLayoutManager(context)

        warehouses_recycler.apply {
            layoutManager = mLayoutManager
            adapter = warehousesAdapter
        }

        val scrollListener = RecyclerScrollListener(mLayoutManager)
        scrollListener.setOnLoadMoreListener(object : LoadMoreListener {
            override fun onLoadMore() {
                if (!viewModel.lastPage.value!! && viewModel.warehousesLiveData.value!!.size >= Config.API_ROW_COUNT) {
                    viewModel.getWarehouses(viewModel.page.value!!)
                }
            }
        })

        warehouses_recycler.addOnScrollListener(scrollListener)

        warehouses_recycler.setHasFixedSize(true)
        warehouses_recycler.setItemViewCacheSize(20)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(WarehousesViewModel::class.java)
        progress = activity!!.findViewById(R.id.warehouses_progress) as LinearLayout

        viewModel.requestListener = this

        warehousesAdapter.itemClickListener = this

        if (viewModel.warehousesLiveData.value.isNullOrEmpty() || viewModel.warehousesLiveData.value!!.size <= 0) {
            viewModel.getWarehouses(0)
        }

        if (!viewModel.warehousesLiveData.value.isNullOrEmpty() && viewModel.warehousesLiveData.value != warehousesAdapter.warehouses) {
            warehousesAdapter.updateData(viewModel.warehousesLiveData.value!!, calculateIcons(viewModel.warehousesLiveData.value!!), true)
        }
    }

    override fun onRequest() {
        if (viewModel.warehousesLiveData.value.isNullOrEmpty() || viewModel.warehousesLiveData.value!!.size <= 0) {
            progress.visibility = View.VISIBLE
        } else {
            if (!viewModel.lastPage.value!! && viewModel.warehousesLiveData.value!!.size >= Config.API_ROW_COUNT) {
                warehousesAdapter.setLoading(true)
            }
        }
    }

    override fun onSuccess(result: List<Warehouse>?, count: Int?) {
        progress.visibility = View.GONE
        warehousesAdapter.setLoading(false)
        if (!result.isNullOrEmpty()) {
            viewModel.warehousesLiveData.value!!.addAll(result)
            warehousesAdapter.updateData(result, calculateIcons(viewModel.warehousesLiveData.value!!), false)
            page++
            viewModel.page.value = page
        } else {
            viewModel.lastPage.value = true
        }
    }

    override fun onError(responseCode: Int, errorCode: Int, errorMessage: String) {
        progress.visibility = View.GONE
        warehousesAdapter.setLoading(false)
    }

    override fun onClick(itemData: Warehouse?) {
        if (itemData != null) {
            val dialogBuilder = AlertDialog.Builder(context!!)
            val inflater = requireActivity().layoutInflater
            val view = inflater.inflate(R.layout.warehouse_info, null)

            view.location.text = itemData.location
            view.working_from.text = itemData.working_from
            view.working_to.text = itemData.working_to
            view.phone.text = itemData.phone
            view.working_on_weekends.text = if (itemData.weekends) getString(R.string.yes) else getString(R.string.no)

            dialogBuilder.setView(view)
                .setCancelable(true)
                .setPositiveButton(getString(R.string.ok)) { dialog, _ -> dialog.cancel() }

            val alert = dialogBuilder.create()
            alert.setTitle(getString(R.string.warehouse_information))
            alert.show()
        }
    }
}
