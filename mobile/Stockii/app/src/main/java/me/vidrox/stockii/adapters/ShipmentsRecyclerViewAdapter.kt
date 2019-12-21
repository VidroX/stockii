package me.vidrox.stockii.adapters

import android.graphics.drawable.Drawable
import android.os.Handler
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import coil.api.load
import kotlinx.android.synthetic.main.shipments_card.view.*
import me.vidrox.stockii.R
import me.vidrox.stockii.api.shipments.Shipment
import me.vidrox.stockii.listeners.Constants
import me.vidrox.stockii.listeners.RecyclerViewItemClickListener
import kotlin.collections.ArrayList
import kotlin.collections.HashMap

class ShipmentsRecyclerViewAdapter(var shipments: ArrayList<Shipment?>, var shipmentsIcons: HashMap<Shipment, Drawable>) :
    RecyclerView.Adapter<ShipmentsRecyclerViewAdapter.ShipmentsViewHolder>() {

    var itemClickListener: RecyclerViewItemClickListener<Shipment>? = null

    fun updateData(newShipments: List<Shipment>, newIcons: HashMap<Shipment, Drawable>, clearItems: Boolean) {
        if (clearItems) {
            shipments.clear()
            shipmentsIcons.clear()
        }

        shipments.addAll(newShipments)
        shipmentsIcons = newIcons
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ShipmentsViewHolder {
        return if (viewType == Constants.VIEW_TYPE_ITEM) {
            val view = LayoutInflater.from(parent.context).inflate(R.layout.shipments_card, parent, false)
            ShipmentsViewHolder(view)
        } else {
            val view = LayoutInflater.from(parent.context).inflate(R.layout.list_progress, parent, false)
            ShipmentsViewHolder(view)
        }
    }

    override fun getItemCount(): Int = shipments.size

    fun setLoading(isLoading: Boolean) {
        if (isLoading) {
            if (shipments.size > 0) {
                Handler().post {
                    shipments.add(null)
                    notifyItemInserted(shipments.size - 1)
                }
            }
        } else {
            if (shipments.size != 0) {
                shipments.removeAt(shipments.size - 1)
                notifyItemRemoved(shipments.size)
            }
        }
    }

    override fun onBindViewHolder(holder: ShipmentsViewHolder, position: Int) {
        if (holder.itemViewType == Constants.VIEW_TYPE_ITEM) {
            val shipment = shipments[position]!!
            val shipmentIcon = shipmentsIcons[shipment]!!

            holder.bind(shipment, shipmentIcon, itemClickListener)
        }
    }

    override fun getItemViewType(position: Int): Int {
        return if (shipments[position] == null) {
            Constants.VIEW_TYPE_LOADING
        } else {
            Constants.VIEW_TYPE_ITEM
        }
    }

    class ShipmentsViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        private val shipmentProductName = view.shipments_product
        private val shipmentProvider = view.shipments_provider
        private val shipmentWarehouseLocation = view.shipments_warehouse_location
        private val shipmentStatus = view.shipments_status

        fun bind(shipment: Shipment, icon: Drawable, itemClickListener: RecyclerViewItemClickListener<Shipment>?) {
            shipmentProductName.text = shipment.product.name
            shipmentWarehouseLocation.text = shipment.product.warehouse.location
            shipmentProvider.text = shipment.provider.name
            shipmentStatus.load(icon)
            itemView.setOnClickListener { itemClickListener?.onClick(shipment) }
        }
    }
}