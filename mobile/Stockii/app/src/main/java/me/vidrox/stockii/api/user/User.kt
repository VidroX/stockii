package me.vidrox.stockii.api.user

import android.content.Context
import android.util.Log
import com.squareup.moshi.JsonClass
import com.squareup.moshi.Moshi
import me.vidrox.stockii.Config
import me.vidrox.stockii.utils.Crypto
import java.text.ParseException
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.*

@JsonClass(generateAdapter = true)
data class UserResponse (
    val status_code: Int?,
    val status: Int?,
    val message: String,
    val data: User?
)

@JsonClass(generateAdapter = true)
data class UserData (
    val id: Int,
    val email: String,
    val mobile_phone: String,
    val last_name: String,
    val first_name: String,
    val patronymic: String?,
    val is_superuser: Boolean,
    val is_active: Boolean,
    val date_joined: String
)

@JsonClass(generateAdapter = true)
data class User(
    val user: UserData?,
    val token: String?,
    val token_expiry: String?
) {
    fun save(context: Context): Boolean {
        try {
            val sharedPref = context.getSharedPreferences(Config.USER_SHARED_PREFERENCES, Context.MODE_PRIVATE)

            val moshi = Moshi.Builder().build()
            val jsonAdapter = moshi.adapter(UserData::class.java)

            with(sharedPref.edit()) {
                putString(Crypto.encode64(".Data"), if (user != null) Crypto.encode64(jsonAdapter.toJson(user)) else "")
                putString(Crypto.encode64(".Token"), if (token != null) Crypto.encode64(token) else "")
                putString(Crypto.encode64(".TokenExpiry"), if (token_expiry != null) Crypto.encode64(token_expiry) else "")

                apply()
            }
        } catch (ex: Exception) {
            Log.e("UserSession_Save", ex.toString())
            return false
        }

        return true
    }

    companion object {
        fun get(context: Context): User? {
            try {
                val sharedPref = context.getSharedPreferences(
                    Config.USER_SHARED_PREFERENCES,
                    Context.MODE_PRIVATE
                )

                val moshi = Moshi.Builder().build()
                val jsonAdapter = moshi.adapter<UserData>(UserData::class.java)

                val userDataString = sharedPref.getString(Crypto.encode64(".Data"), null)
                val userToken = sharedPref.getString(Crypto.encode64(".Token"), null)
                val userTokenExpiry = sharedPref.getString(Crypto.encode64(".TokenExpiry"), null)

                if (userDataString != null && userDataString.isNotEmpty() &&
                    userToken != null && userToken.isNotEmpty() &&
                    userTokenExpiry != null && userTokenExpiry.isNotEmpty()
                ) {

                    val decryptedUserData = Crypto.decode64(userDataString)
                    val decryptedUserToken = Crypto.decode64(userToken)
                    val decryptedUserTokenExpiry = Crypto.decode64(userTokenExpiry)

                    val userData = jsonAdapter.fromJson(decryptedUserData)

                    return User(userData, decryptedUserToken, decryptedUserTokenExpiry)

                }
            } catch (ex: Exception) {
                Log.e("UserSession_Get", ex.toString())
                return null
            }

            return null
        }

        fun clear(context: Context): Boolean {
            try {
                val sharedPref = context.getSharedPreferences(
                    Config.USER_SHARED_PREFERENCES,
                    Context.MODE_PRIVATE
                )

                with(sharedPref.edit()) {
                    remove(Crypto.encode64(".Data"))
                    remove(Crypto.encode64(".Token"))
                    remove(Crypto.encode64(".TokenExpiry"))

                    apply()
                }
            } catch (ex: Exception) {
                Log.e("UserSession_Clear", ex.toString())
                return false
            }

            return true
        }

        fun isTokenExpired(user: User?): Boolean {
            if (user?.token != null && user.token_expiry != null) {
                // EEE, dd-MMM-yyyy HH:mm:ss z -> Sat, 21-Dec-2019 08:02:24 GMT
                // EEE, d MMM yyyy HH:mm:ss Z -> Wed, 4 Jul 2001 12:08:56 -0700

                val formatter = SimpleDateFormat("EEE, dd-MMM-yyyy HH:mm:ss z", Locale.US)
                try {
                    val currentDate = Calendar.getInstance()
                    val date: Date = formatter.parse(user.token_expiry)!!

                    if (currentDate.after(date)) {
                        return true
                    }
                } catch (e: ParseException) {
                    e.printStackTrace()
                }
            }

            return false
        }
    }
}