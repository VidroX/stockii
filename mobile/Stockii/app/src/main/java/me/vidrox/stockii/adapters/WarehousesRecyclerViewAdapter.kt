package me.vidrox.stockii.adapters

import android.os.Handler
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import coil.api.load
import kotlinx.android.synthetic.main.warehouse_card.view.*
import me.vidrox.stockii.R
import me.vidrox.stockii.api.warehouses.Warehouse
import me.vidrox.stockii.listeners.Constants
import me.vidrox.stockii.listeners.RecyclerViewItemClickListener
import kotlin.collections.ArrayList
import kotlin.collections.HashMap

class WarehousesRecyclerViewAdapter(var warehouses: ArrayList<Warehouse?>, var warehouseIcons: HashMap<Warehouse, Int>) :
    RecyclerView.Adapter<WarehousesRecyclerViewAdapter.WarehousesViewHolder>() {

    var itemClickListener: RecyclerViewItemClickListener<Warehouse>? = null

    fun updateData(newWarehouses: List<Warehouse>, newIcons: HashMap<Warehouse, Int>, clearItems: Boolean) {
        if (clearItems) {
            warehouses.clear()
            warehouseIcons.clear()
        }

        warehouses.addAll(newWarehouses)
        warehouseIcons = newIcons
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): WarehousesViewHolder {
        return if (viewType == Constants.VIEW_TYPE_ITEM) {
            val view = LayoutInflater.from(parent.context).inflate(R.layout.warehouse_card, parent, false)
            WarehousesViewHolder(view)
        } else {
            val view = LayoutInflater.from(parent.context).inflate(R.layout.list_progress, parent, false)
            WarehousesViewHolder(view)
        }
    }

    override fun getItemCount(): Int = warehouses.size

    fun setLoading(isLoading: Boolean) {
        if (isLoading) {
            if (warehouses.size > 0) {
                Handler().post {
                    warehouses.add(null)
                    notifyItemInserted(warehouses.size - 1)
                }
            }
        } else {
            if (warehouses.size != 0) {
                warehouses.removeAt(warehouses.size - 1)
                notifyItemRemoved(warehouses.size)
            }
        }
    }

    override fun onBindViewHolder(holder: WarehousesViewHolder, position: Int) {
        if (holder.itemViewType == Constants.VIEW_TYPE_ITEM) {
            val warehouseMap = warehouseIcons[warehouses[position]]
            var icon = R.drawable.indicator_gray
            if (warehouseMap != null) {
                icon = warehouseMap
            }
            holder.bind(warehouses[position]!!, icon, itemClickListener)
        }
    }

    override fun getItemViewType(position: Int): Int {
        return if (warehouses[position] == null) {
            Constants.VIEW_TYPE_LOADING
        } else {
            Constants.VIEW_TYPE_ITEM
        }
    }

    class WarehousesViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        private val warehouseLocation = view.warehouse_location
        private val warehouseWorkingFrom = view.warehouse_working_from
        private val warehousePhone = view.warehouse_phone
        private val warehouseStatus = view.warehouse_status

        fun bind(warehouse: Warehouse, icon: Int, itemClickListener: RecyclerViewItemClickListener<Warehouse>?) {
            val workingText: String =
                itemView.context.getString(R.string.working_from) + " " + warehouse.working_from +
                        " " + itemView.context.getString(R.string.to) + " " + warehouse.working_to

            warehouseLocation.text = warehouse.location
            warehouseWorkingFrom.text = workingText
            warehousePhone.text = warehouse.phone
            warehouseStatus.load(icon)
            itemView.setOnClickListener { itemClickListener?.onClick(warehouse) }
        }
    }
}