package me.vidrox.stockii.api

interface RequestListener<T: Any> {

    fun onRequest()
    fun onSuccess(result: T?)
    fun onError(responseCode: Int, errorCode: Int, errorMessage: String)

}