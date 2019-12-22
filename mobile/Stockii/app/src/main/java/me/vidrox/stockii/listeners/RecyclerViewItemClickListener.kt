package me.vidrox.stockii.listeners

import android.view.View

interface RecyclerViewItemClickListener<T> {
    fun onClick(itemData: T?)
    fun onLongClick(view: View, itemData: T?)
}