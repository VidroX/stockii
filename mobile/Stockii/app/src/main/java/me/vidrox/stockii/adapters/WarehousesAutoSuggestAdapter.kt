package me.vidrox.stockii.adapters

import android.content.Context
import android.widget.ArrayAdapter
import android.widget.Filter
import android.widget.Filterable
import me.vidrox.stockii.api.warehouses.Warehouse

class WarehousesAutoSuggestAdapter(context: Context, resource: Int, var warehouses: ArrayList<Warehouse>) : ArrayAdapter<String>(context, resource), Filterable {
    override fun getCount(): Int {
        return warehouses.size
    }

    override fun getItem(position: Int): String? {
        return warehouses[position].location
    }

    fun setData(newWarehouseList: List<Warehouse>) {
        warehouses.clear()
        warehouses.addAll(newWarehouseList)
    }

    fun getWarehouse(position: Int): Warehouse {
        return warehouses[position]
    }

    override fun getFilter(): Filter {
        return object: Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val filterResults = FilterResults()

                if (constraint != null) {
                    filterResults.values = warehouses
                    filterResults.count = warehouses.size
                }

                return filterResults
            }

            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                if (results != null && results.count > 0) {
                    notifyDataSetChanged()
                } else {
                    notifyDataSetInvalidated()
                }
            }
        }
    }
}