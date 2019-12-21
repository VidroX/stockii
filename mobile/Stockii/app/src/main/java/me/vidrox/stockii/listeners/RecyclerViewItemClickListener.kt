package me.vidrox.stockii.listeners

interface RecyclerViewItemClickListener<T> {
    fun onClick(itemData: T?)
}