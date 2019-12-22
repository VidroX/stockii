package me.vidrox.stockii.utils

import java.io.IOException

data class ApiException(val responseCode: Int, val errorCode: Int, val errorMessage: String) : IOException(errorMessage)