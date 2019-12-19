package me.vidrox.stockii.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.warehouse_card.view.*
import me.vidrox.stockii.R
import me.vidrox.stockii.api.warehouses.Warehouse

class WarehousesRecyclerViewAdapter(var warehouses: ArrayList<Warehouse>) :
    RecyclerView.Adapter<WarehousesRecyclerViewAdapter.WarehousesViewHolder>() {

    fun updateWarehouses(newWarehouses: List<Warehouse>, clearItems: Boolean) {
        if (clearItems) {
            warehouses.clear()
        }

        warehouses.addAll(newWarehouses)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = WarehousesViewHolder(
        LayoutInflater.from(parent.context).inflate(R.layout.warehouse_card, parent, false)
    )

    override fun getItemCount(): Int = warehouses.size

    override fun onBindViewHolder(holder: WarehousesViewHolder, position: Int) {
        holder.bind(warehouses[position])
    }

    class WarehousesViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        private val warehouseLocation = view.warehouse_location
        private val warehouseWorkingFrom = view.warehouse_working_from
        private val warehousePhone = view.warehouse_phone

        fun bind(warehouse: Warehouse) {
            val workingText: String =
                itemView.context.getString(R.string.working_from) + " " + warehouse.working_from +
                        " " + itemView.context.getString(R.string.to) + " " + warehouse.working_to

            warehouseLocation.text = warehouse.location
            warehouseWorkingFrom.text = workingText
            warehousePhone.text = warehouse.phone
        }
    }
}