package me.vidrox.stockii

object InternalErrorCodes {
    private const val BASE_PREFIX = 100

    const val UNEXPECTED_ERROR = BASE_PREFIX + 0
    const val NO_RESULTS = BASE_PREFIX + 1
    const val NOT_FOUND = BASE_PREFIX + 2

    private const val BASE_PREFIX_AUTH = 1000

    const val EMAIL_FIELD_EMPTY = BASE_PREFIX_AUTH + 1
    const val PASSWORD_FIELD_EMPTY = BASE_PREFIX_AUTH + 2
    const val BOTH_FIELDS_EMPTY = BASE_PREFIX_AUTH + 3
}