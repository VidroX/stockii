package me.vidrox.stockii.listeners

interface RequestListener<T: Any> {

    fun onRequest()
    fun onSuccess(result: T?)
    fun onError(responseCode: Int, errorCode: Int, errorMessage: String)

}