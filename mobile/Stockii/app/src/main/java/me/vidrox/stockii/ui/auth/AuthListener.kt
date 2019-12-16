package me.vidrox.stockii.ui.auth

import me.vidrox.stockii.api.user.User

interface AuthListener {

    fun onRequest()
    fun onSuccess(result: User)
    fun onError(responseCode: Int, errorCode: Int, errorMessage: String)

}