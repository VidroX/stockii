package me.vidrox.stockii

object Config {
    const val DEBUG_TO_LOG = true
    // -- API
    const val API_BASE_URL = "https://server.vidrox.me/api/"
    // - User Session
    const val USER_SHARED_PREFERENCES = BuildConfig.APPLICATION_ID + ".User"
}