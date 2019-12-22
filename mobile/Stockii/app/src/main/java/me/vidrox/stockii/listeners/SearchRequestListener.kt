package me.vidrox.stockii.listeners

interface SearchRequestListener<T: Any> {

    fun onSearchRequest()
    fun onSearchSuccess(result: T?, count: Int?)
    fun onSearchError(responseCode: Int, errorCode: Int, errorMessage: String)

}