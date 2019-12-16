package me.vidrox.stockii.ui.auth

import android.view.View
import androidx.lifecycle.ViewModel
import me.vidrox.stockii.api.repositories.AuthRepository
import me.vidrox.stockii.utils.ApiException
import me.vidrox.stockii.utils.Coroutines

class AuthViewModel : ViewModel() {
    var authListener: AuthListener? = null
    var email: String? = null
    var password: String? = null

    private val repository: AuthRepository = AuthRepository()

    fun onLoginBtnClick(view: View) {
        authListener?.onRequest()

        if (email.isNullOrEmpty()) {
            authListener?.onError(0, AuthInternalErrorCodes.EMAIL_FIELD_EMPTY, "E-Mail field is empty")

            return
        }

        if (password.isNullOrEmpty()) {
            authListener?.onError(0, AuthInternalErrorCodes.PASSWORD_FIELD_EMPTY, "Password field is empty")

            return
        }

        Coroutines.mainThread {
            try {
                val response = repository.login(email!!, password!!, view.context)

                if (response.status_code == 2 || response.status == 2) {
                    response.data?.let {
                        authListener?.onSuccess(it)
                        it.save(view.context)
                        return@mainThread
                    }
                }

                when {
                    response.status_code != null -> authListener?.onError(0, response.status_code, response.message)
                    response.status != null -> authListener?.onError(0, response.status, response.message)
                    else -> authListener?.onError(0, 0, response.message)
                }
            }catch(e: ApiException){
                authListener?.onError(e.responseCode, e.errorCode, e.errorMessage)
            }
        }
    }
}
