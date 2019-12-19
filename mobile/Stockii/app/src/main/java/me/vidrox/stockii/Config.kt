package me.vidrox.stockii

object Config {
    const val DEBUG_TO_LOG = true
    // -- API
    const val API_BASE_URL = "https://server.vidrox.me/api/"
    const val API_ROW_COUNT = 10
    // - User Session
    const val USER_SHARED_PREFERENCES = BuildConfig.APPLICATION_ID + ".User"
}