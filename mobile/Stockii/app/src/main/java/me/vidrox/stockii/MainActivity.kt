package me.vidrox.stockii

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import me.vidrox.stockii.api.user.User
import me.vidrox.stockii.ui.auth.AuthFragment
import me.vidrox.stockii.ui.main.MainFragment

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_activity)
        if (savedInstanceState == null) {
            val user = User.get(applicationContext)

            if (user == null) {
                supportFragmentManager.beginTransaction()
                    .replace(R.id.container, AuthFragment.newInstance())
                    .commitNow()
            } else {
                supportFragmentManager.beginTransaction()
                    .replace(R.id.container, MainFragment.newInstance())
                    .commitNow()
            }
        }
    }

}
