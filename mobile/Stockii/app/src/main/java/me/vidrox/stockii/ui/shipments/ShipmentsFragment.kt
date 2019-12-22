package me.vidrox.stockii.ui.shipments

import android.graphics.drawable.Drawable
import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.DrawableCompat
import androidx.recyclerview.widget.LinearLayoutManager
import kotlinx.android.synthetic.main.shipment_info.view.*
import kotlinx.android.synthetic.main.shipments_fragment.*
import me.vidrox.stockii.Config
import me.vidrox.stockii.R
import me.vidrox.stockii.adapters.ShipmentsRecyclerViewAdapter
import me.vidrox.stockii.api.shipments.Shipment
import me.vidrox.stockii.listeners.LoadMoreListener
import me.vidrox.stockii.listeners.PageRequestListener
import me.vidrox.stockii.listeners.RecyclerScrollListener
import me.vidrox.stockii.listeners.RecyclerViewItemClickListener
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.HashMap

class ShipmentsFragment : Fragment(), PageRequestListener<List<Shipment>>,
    RecyclerViewItemClickListener<Shipment>, LoadMoreListener {

    companion object {
        fun newInstance() = ShipmentsFragment()
    }

    private fun isShipmentOverdue(shipment: Shipment): Boolean {
        val formatter = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        try {
            val currentDate = Calendar.getInstance()
            val date: Date? = formatter.parse(shipment.approximate_delivery)

            currentDate.set(Calendar.HOUR_OF_DAY, 0)
            currentDate.set(Calendar.MINUTE, 0)
            currentDate.set(Calendar.SECOND, 0)
            currentDate.set(Calendar.MILLISECOND, 0)

            if (currentDate.time.after(date)) {
                return true
            }

            return false
        } catch (e: ParseException) {
            e.printStackTrace()

            return false
        }
    }

    private fun calculateIcons(shipments: List<Shipment>): HashMap<Shipment, Drawable> {
        val result: HashMap<Shipment, Drawable> = HashMap()

        for (shipment in shipments) {
            var icon: Drawable? = ContextCompat.getDrawable(requireContext(), R.drawable.ic_close_black_24dp)
            when (shipment.status) {
                1 -> {
                    if (isShipmentOverdue(shipment)) {
                        icon = ContextCompat.getDrawable(requireContext(), R.drawable.ic_close_black_24dp)
                        if (icon != null) {
                            DrawableCompat.setTint(
                                icon,
                                ContextCompat.getColor(requireContext(), R.color.colorError)
                            )
                        }
                    } else {
                        icon = ContextCompat.getDrawable(requireContext(), R.drawable.ic_local_shipping_black_24dp)
                        if (icon != null) {
                            DrawableCompat.setTint(
                                icon,
                                ContextCompat.getColor(requireContext(), R.color.colorWarning)
                            )
                        }
                    }
                }
                2 -> {
                    icon = ContextCompat.getDrawable(requireContext(), R.drawable.ic_check_black_24dp)
                    if (icon != null) {
                        DrawableCompat.setTint(
                            icon,
                            ContextCompat.getColor(requireContext(), R.color.colorSuccess)
                        )
                    }
                }
                else -> {
                    if (icon != null) {
                        DrawableCompat.setTint(
                            icon,
                            ContextCompat.getColor(requireContext(), R.color.colorError)
                        )
                    }
                }
            }

            if (icon != null) {
                result[shipment] = icon
            }
        }

        return result
    }

    private lateinit var viewModel: ShipmentsViewModel
    private lateinit var progress: LinearLayout
    private lateinit var mLayoutManager: LinearLayoutManager
    private var shipmentsAdapter = ShipmentsRecyclerViewAdapter(arrayListOf(), hashMapOf())
    private var page = 0
    private var refreshing = false
    private var mScrollListener: RecyclerScrollListener? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.shipments_fragment, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        mLayoutManager = LinearLayoutManager(context)

        shipments_recycler.apply {
            layoutManager = mLayoutManager
            adapter = shipmentsAdapter
        }

        mScrollListener = RecyclerScrollListener(mLayoutManager)
        mScrollListener?.setOnLoadMoreListener(this)

        shipments_recycler.addOnScrollListener(mScrollListener!!)

        shipments_recycler.setHasFixedSize(true)
        shipments_recycler.setItemViewCacheSize(20)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        (activity as AppCompatActivity).supportActionBar?.title = activity?.getString(R.string.shipments)

        viewModel = ViewModelProviders.of(this).get(ShipmentsViewModel::class.java)
        progress = activity!!.findViewById(R.id.shipments_progress) as LinearLayout

        viewModel.requestListener = this

        shipmentsAdapter.itemClickListener = this

        shipments_recycler_wrapper.setOnRefreshListener {
            refresh()
            viewModel.getShipments(0)
        }

        if (viewModel.shipmentsLiveData.value.isNullOrEmpty() || viewModel.shipmentsLiveData.value!!.size <= 0) {
            viewModel.getShipments(0)
        }

        if (!viewModel.shipmentsLiveData.value.isNullOrEmpty() && viewModel.shipmentsLiveData.value != shipmentsAdapter.shipments) {
            shipmentsAdapter.updateData(viewModel.shipmentsLiveData.value!!, calculateIcons(viewModel.shipmentsLiveData.value!!), true)
        }
    }

    private fun refresh() {
        refreshing = true
        page = 0
        shipments_recycler.removeOnScrollListener(mScrollListener!!)
        mScrollListener = RecyclerScrollListener(mLayoutManager)
        mScrollListener?.setOnLoadMoreListener(this)
        shipments_recycler.addOnScrollListener(mScrollListener!!)
        viewModel.reset()
    }

    override fun onLoadMore() {
        if (!viewModel.lastPage.value!! && viewModel.shipmentsLiveData.value!!.size >= Config.API_ROW_COUNT) {
            viewModel.getShipments(viewModel.page.value!!)
        }
    }

    override fun onRequest() {
        if (viewModel.shipmentsLiveData.value.isNullOrEmpty() || viewModel.shipmentsLiveData.value!!.size <= 0) {
            if (!refreshing) {
                progress.visibility = View.VISIBLE
            }
        } else {
            if (!viewModel.lastPage.value!! && viewModel.shipmentsLiveData.value!!.size >= Config.API_ROW_COUNT) {
                shipmentsAdapter.setLoading(true)
            }
        }
    }

    override fun onSuccess(result: List<Shipment>?, count: Int?) {
        progress.visibility = View.GONE
        shipmentsAdapter.setLoading(false)

        if (!result.isNullOrEmpty()) {
            viewModel.shipmentsLiveData.value!!.addAll(result)
            if (refreshing) {
                shipmentsAdapter.updateData(
                    result,
                    calculateIcons(viewModel.shipmentsLiveData.value!!),
                    true
                )
            } else {
                shipmentsAdapter.updateData(
                    result,
                    calculateIcons(viewModel.shipmentsLiveData.value!!),
                    false
                )
            }
            page++
            viewModel.page.value = page
        } else {
            viewModel.lastPage.value = true
        }

        if (refreshing) {
            shipments_recycler_wrapper.isRefreshing = false
            refreshing = false
        }
    }

    override fun onError(responseCode: Int, errorCode: Int, errorMessage: String) {
        progress.visibility = View.GONE
        shipmentsAdapter.setLoading(false)

        if (refreshing) {
            shipments_recycler_wrapper.isRefreshing = false
            refreshing = false
        }
    }

    override fun onClick(itemData: Shipment?) {
        if (itemData != null) {
            val dialogBuilder = AlertDialog.Builder(context!!)
            val inflater = requireActivity().layoutInflater
            val view = inflater.inflate(R.layout.shipment_info, null)

            view.name.text = itemData.product.name
            view.provider.text = itemData.provider.name
            view.warehouse_location.text = itemData.product.warehouse.location
            view.quantity.text = itemData.quantity.toString()

            when(itemData.status) {
                1 -> {
                    if (isShipmentOverdue(itemData)) {
                        view.status.text = getString(R.string.overdue)
                        view.status.setTextColor(ContextCompat.getColor(requireContext(), R.color.colorError))
                    } else {
                        view.status.text = getString(R.string.shipping_to_warehouse)
                        view.status.setTextColor(ContextCompat.getColor(requireContext(), R.color.colorWarning))
                    }
                }
                2 -> {
                    view.status.text = getString(R.string.arrived)
                    view.status.setTextColor(ContextCompat.getColor(requireContext(), R.color.colorSuccess))
                }
                else -> {
                    view.status.text = getString(R.string.shipping_to_warehouse)
                    view.status.setTextColor(ContextCompat.getColor(requireContext(), R.color.colorWarning))
                }
            }

            dialogBuilder.setView(view)
                .setCancelable(true)
                .setPositiveButton(getString(R.string.ok)) { dialog, _ -> dialog.cancel() }

            val alert = dialogBuilder.create()
            alert.setTitle(getString(R.string.shipment_information))
            alert.show()
        }
    }

    override fun onLongClick(view: View, itemData: Shipment?) {

    }

}
