package me.vidrox.stockii.ui.products

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.os.Handler
import android.text.Editable
import android.text.TextWatcher
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.bottomsheet.BottomSheetDialog
import kotlinx.android.synthetic.main.move_product.view.*
import kotlinx.android.synthetic.main.product_info.view.*
import kotlinx.android.synthetic.main.products_fragment.*
import me.vidrox.stockii.Config
import me.vidrox.stockii.R
import me.vidrox.stockii.adapters.ProductsRecyclerViewAdapter
import me.vidrox.stockii.adapters.WarehousesAutoSuggestAdapter
import me.vidrox.stockii.api.products.Product
import me.vidrox.stockii.api.products.ProductsResponse
import me.vidrox.stockii.api.warehouses.Warehouse
import me.vidrox.stockii.listeners.*
import me.vidrox.stockii.ui.warehouses.WarehousesViewModel

class ProductsFragment : Fragment(), PageRequestListener<List<Product>>, RecyclerViewItemClickListener<Product>, LoadMoreListener, SearchRequestListener<List<Warehouse>> {

    companion object {
        private const val TRIGGER_AUTO_COMPLETE :   Int    = 100
        private const val AUTO_COMPLETE_DELAY   :   Long   = 300

        fun newInstance() = ProductsFragment()
    }

    private lateinit var viewModel: ProductsViewModel
    private lateinit var warehousesViewModel: WarehousesViewModel
    private lateinit var progress: LinearLayout
    private lateinit var mLayoutManager: LinearLayoutManager
    private lateinit var autoSuggestAdapter: WarehousesAutoSuggestAdapter
    private var productsAdapter = ProductsRecyclerViewAdapter(arrayListOf())
    private var page = 0
    private var refreshing = false
    private var mScrollListener: RecyclerScrollListener? = null
    private var handler: Handler = Handler()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.products_fragment, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        mLayoutManager = LinearLayoutManager(context)

        products_recycler.apply {
            layoutManager = mLayoutManager
            adapter = productsAdapter
        }

        mScrollListener = RecyclerScrollListener(mLayoutManager)
        mScrollListener?.setOnLoadMoreListener(this)
        products_recycler.addOnScrollListener(mScrollListener!!)

        products_recycler.setHasFixedSize(true)
        products_recycler.setItemViewCacheSize(20)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        (activity as AppCompatActivity).supportActionBar?.title = activity?.getString(R.string.products)

        viewModel = ViewModelProviders.of(this).get(ProductsViewModel::class.java)
        warehousesViewModel = ViewModelProviders.of(this).get(WarehousesViewModel::class.java)
        progress = activity!!.findViewById(R.id.products_progress) as LinearLayout
        autoSuggestAdapter = WarehousesAutoSuggestAdapter(requireContext(), R.layout.support_simple_spinner_dropdown_item, arrayListOf())

        viewModel.requestListener = this
        warehousesViewModel.searchListener = this

        productsAdapter.itemClickListener = this

        products_recycler_wrapper.setOnRefreshListener {
            refresh()
            viewModel.getProducts(0)
        }

        if (viewModel.productsLiveData.value.isNullOrEmpty() || viewModel.productsLiveData.value!!.size <= 0) {
            viewModel.getProducts(0)
        }

        if (!viewModel.productsLiveData.value.isNullOrEmpty() && viewModel.productsLiveData.value != productsAdapter.products) {
            productsAdapter.updateData(viewModel.productsLiveData.value!!, true)
        }
    }

    private fun refresh() {
        refreshing = true
        page = 0
        products_recycler.removeOnScrollListener(mScrollListener!!)
        mScrollListener = RecyclerScrollListener(mLayoutManager)
        mScrollListener?.setOnLoadMoreListener(this)
        products_recycler.addOnScrollListener(mScrollListener!!)
        viewModel.reset()
    }

    override fun onLoadMore() {
        if (!viewModel.lastPage.value!! && viewModel.productsLiveData.value!!.size >= Config.API_ROW_COUNT) {
            viewModel.getProducts(viewModel.page.value!!)
        }
    }

    override fun onRequest() {
        if (viewModel.productsLiveData.value.isNullOrEmpty() || viewModel.productsLiveData.value!!.size <= 0) {
            if (!refreshing) {
                progress.visibility = View.VISIBLE
            }
        } else {
            if (!viewModel.lastPage.value!! && viewModel.productsLiveData.value!!.size >= Config.API_ROW_COUNT) {
                productsAdapter.setLoading(true)
            }
        }
    }

    override fun onSuccess(result: List<Product>?, count: Int?) {
        progress.visibility = View.GONE
        productsAdapter.setLoading(false)

        if (!result.isNullOrEmpty()) {
            viewModel.productsLiveData.value!!.addAll(result)
            if (refreshing) {
                productsAdapter.updateData(result, true)
            } else {
                productsAdapter.updateData(result, false)
            }
            page++
            viewModel.page.value = page
        } else {
            viewModel.lastPage.value = true
        }

        if (refreshing) {
            products_recycler_wrapper.isRefreshing = false
            refreshing = false
        }
    }

    override fun onError(responseCode: Int, errorCode: Int, errorMessage: String) {
        progress.visibility = View.GONE
        productsAdapter.setLoading(false)

        if (refreshing) {
            products_recycler_wrapper.isRefreshing = false
            refreshing = false
        }
    }

    override fun onClick(itemData: Product?) {
        if (itemData != null) {
            val dialogBuilder = AlertDialog.Builder(context!!)
            val inflater = requireActivity().layoutInflater
            val view = inflater.inflate(R.layout.product_info, null)

            view.name.text = itemData.name
            view.location.text = itemData.warehouse.location
            view.quantity.text = itemData.quantity.toString()

            if (itemData.limit != null) {
                view.limits_1.visibility = View.GONE
                view.limits_wrapper.visibility = View.VISIBLE
                view.limits_wrapper_min.text = itemData.limit.min_amount.toString()
                view.limits_wrapper_max.text = itemData.limit.max_amount.toString()
            }

            dialogBuilder.setView(view)
                .setCancelable(true)
                .setPositiveButton(getString(R.string.ok)) { dialog, _ -> dialog.cancel() }

            val alert = dialogBuilder.create()
            alert.setTitle(getString(R.string.product_information))
            alert.show()
        }
    }

    override fun onLongClick(view: View, itemData: Product?) {
        if (itemData != null) {
            val dialogView = layoutInflater.inflate(R.layout.product_actions, null)
            val menu = BottomSheetDialog(requireContext())
            var selectedWarehouse: Warehouse? = null
            menu.setContentView(dialogView)
            menu.show()

            val mainProgress = requireActivity().findViewById<LinearLayout?>(R.id.mainFragmentProgressBar)
            mainProgress?.visibility = View.GONE

            menu.findViewById<Button>(R.id.button_move_product)?.setOnClickListener {
                val dialogBuilder = AlertDialog.Builder(requireContext())
                val inflater = requireActivity().layoutInflater
                val alertDialogView = inflater.inflate(R.layout.move_product, null)

                alertDialogView.warehouse_autocomplete.threshold = 2
                alertDialogView.warehouse_autocomplete.setLoadingView(alertDialogView.warehouse_autocomplete_loading)
                alertDialogView.warehouse_autocomplete.setAdapter(autoSuggestAdapter)
                alertDialogView.warehouse_autocomplete.setOnItemClickListener { _: AdapterView<*>?, _: View?, position: Int, _: Long ->
                    selectedWarehouse = autoSuggestAdapter.getWarehouse(position)
                }
                alertDialogView.warehouse_autocomplete.addTextChangedListener(object: TextWatcher {
                    override fun afterTextChanged(s: Editable?) {}
                    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

                    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                        selectedWarehouse = null
                        handler.removeMessages(TRIGGER_AUTO_COMPLETE)
                        handler.sendEmptyMessageDelayed(TRIGGER_AUTO_COMPLETE, AUTO_COMPLETE_DELAY)
                    }
                })

                handler = Handler {
                    if (it.what == TRIGGER_AUTO_COMPLETE) {
                        val searchText = alertDialogView.warehouse_autocomplete.text
                        if (!searchText.isNullOrEmpty()) {
                            warehousesViewModel.getWarehouses(0, searchText.toString())
                        }
                    }

                    false
                }

                dialogBuilder.setView(alertDialogView)
                    .setCancelable(false)
                    .setNegativeButton(getString(R.string.cancel)) { dialog, _ ->
                        dialog.cancel()
                    }
                    .setPositiveButton(getString(R.string.move), null)

                val alertDialog = dialogBuilder.create()

                alertDialog.setOnShowListener {
                    val positiveButton = alertDialog.getButton(AlertDialog.BUTTON_POSITIVE)
                    positiveButton.setOnClickListener {
                        if (selectedWarehouse == null) {
                            Toast.makeText(requireContext(), getString(R.string.please_select_warehouse), Toast.LENGTH_SHORT).show()
                        } else {
                            viewModel.updateProduct(itemData.id, selectedWarehouse!!.id)
                            viewModel.updateRequestListener = object : RequestListener<ProductsResponse> {
                                override fun onRequest() {
                                    mainProgress?.visibility = View.VISIBLE
                                }

                                override fun onSuccess(result: ProductsResponse?) {
                                    Toast.makeText(requireContext(), getString(R.string.product_moved), Toast.LENGTH_SHORT).show()
                                    mainProgress?.visibility = View.GONE
                                    alertDialog.cancel()
                                    products_recycler_wrapper.isRefreshing = true
                                    refresh()
                                    viewModel.getProducts(0)
                                }

                                override fun onError(responseCode: Int, errorCode: Int, errorMessage: String) {
                                    Toast.makeText(requireContext(), getString(R.string.cannot_move_product), Toast.LENGTH_SHORT).show()
                                    mainProgress?.visibility = View.GONE
                                }
                            }
                        }
                    }
                }

                alertDialog.setTitle(getString(R.string.move_product))
                alertDialog.show()

                menu.dismiss()
            }
        }
    }

    override fun onSearchRequest() {}

    override fun onSearchSuccess(result: List<Warehouse>?, count: Int?) {
        if (!result.isNullOrEmpty()) {
            autoSuggestAdapter.setData(result)
            autoSuggestAdapter.notifyDataSetChanged()
        }
    }

    override fun onSearchError(responseCode: Int, errorCode: Int, errorMessage: String) {
        autoSuggestAdapter.setData(arrayListOf())
        autoSuggestAdapter.notifyDataSetChanged()
    }
}
