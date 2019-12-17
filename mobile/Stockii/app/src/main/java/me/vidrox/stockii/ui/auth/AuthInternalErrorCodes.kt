package me.vidrox.stockii.ui.auth

object AuthInternalErrorCodes {
    private const val BASE_PREFIX = 1000

    const val UNEXPECTED_ERROR = BASE_PREFIX + 0
    const val EMAIL_FIELD_EMPTY = BASE_PREFIX + 1
    const val PASSWORD_FIELD_EMPTY = BASE_PREFIX + 2
    const val BOTH_FIELDS_EMPTY = BASE_PREFIX + 3
}