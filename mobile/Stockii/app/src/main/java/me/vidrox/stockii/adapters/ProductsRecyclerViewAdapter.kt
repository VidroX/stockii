package me.vidrox.stockii.adapters

import android.os.Handler
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.product_card.view.*
import me.vidrox.stockii.R
import me.vidrox.stockii.api.products.Product
import me.vidrox.stockii.listeners.Constants
import me.vidrox.stockii.listeners.RecyclerViewItemClickListener
import kotlin.collections.ArrayList

class ProductsRecyclerViewAdapter(var products: ArrayList<Product?>) :
    RecyclerView.Adapter<ProductsRecyclerViewAdapter.ProductsViewHolder>() {

    var itemClickListener: RecyclerViewItemClickListener<Product>? = null

    fun updateData(newProducts: List<Product>, clearItems: Boolean) {
        if (clearItems) {
            products.clear()
        }

        products.addAll(newProducts)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductsViewHolder {
        return if (viewType == Constants.VIEW_TYPE_ITEM) {
            val view = LayoutInflater.from(parent.context).inflate(R.layout.product_card, parent, false)
            ProductsViewHolder(view)
        } else {
            val view = LayoutInflater.from(parent.context).inflate(R.layout.list_progress, parent, false)
            ProductsViewHolder(view)
        }
    }

    override fun getItemCount(): Int = products.size

    fun setLoading(isLoading: Boolean) {
        if (isLoading) {
            if (products.size > 0) {
                Handler().post {
                    products.add(null)
                    notifyItemInserted(products.size - 1)
                }
            }
        } else {
            if (products.size != 0) {
                products.removeAt(products.size - 1)
                notifyItemRemoved(products.size)
            }
        }
    }

    override fun onBindViewHolder(holder: ProductsViewHolder, position: Int) {
        if (holder.itemViewType == Constants.VIEW_TYPE_ITEM) {
            holder.bind(products[position]!!, itemClickListener)
        }
    }

    override fun getItemViewType(position: Int): Int {
        return if (products[position] == null) {
            Constants.VIEW_TYPE_LOADING
        } else {
            Constants.VIEW_TYPE_ITEM
        }
    }

    class ProductsViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        private val productName = view.product_name
        private val productLocation = view.product_warehouse
        private val productQuantity = view.product_amount

        fun bind(product: Product, itemClickListener: RecyclerViewItemClickListener<Product>?) {
            val amountText: String =
                itemView.context.getString(R.string.quantity) + ": " + product.quantity

            productName.text = product.name
            productLocation.text = product.warehouse.location
            productQuantity.text = amountText
            itemView.setOnClickListener { itemClickListener?.onClick(product) }
        }
    }
}