package me.vidrox.stockii.listeners

interface PageRequestListener<T: Any> {

    fun onRequest()
    fun onSuccess(result: T?, count: Int?)
    fun onError(responseCode: Int, errorCode: Int, errorMessage: String)

}