package me.vidrox.stockii.ui.products

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import kotlinx.android.synthetic.main.product_info.view.*
import kotlinx.android.synthetic.main.products_fragment.*
import me.vidrox.stockii.Config
import me.vidrox.stockii.R
import me.vidrox.stockii.adapters.ProductsRecyclerViewAdapter
import me.vidrox.stockii.api.products.Product
import me.vidrox.stockii.listeners.LoadMoreListener
import me.vidrox.stockii.listeners.PageRequestListener
import me.vidrox.stockii.listeners.RecyclerScrollListener
import me.vidrox.stockii.listeners.RecyclerViewItemClickListener

class ProductsFragment : Fragment(), PageRequestListener<List<Product>>, RecyclerViewItemClickListener<Product>, LoadMoreListener {

    companion object {
        fun newInstance() = ProductsFragment()
    }

    private lateinit var viewModel: ProductsViewModel
    private lateinit var progress: LinearLayout
    private lateinit var mLayoutManager: LinearLayoutManager
    private var productsAdapter = ProductsRecyclerViewAdapter(arrayListOf())
    private var page = 0
    private var refreshing = false
    private var mScrollListener: RecyclerScrollListener? = null

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
        progress = activity!!.findViewById(R.id.products_progress) as LinearLayout

        viewModel.requestListener = this

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

}
