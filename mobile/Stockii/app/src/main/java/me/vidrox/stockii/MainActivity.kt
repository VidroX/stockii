package me.vidrox.stockii

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.View
import android.widget.LinearLayout
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import androidx.navigation.findNavController
import me.vidrox.stockii.api.user.User
import me.vidrox.stockii.ui.auth.AuthListener
import me.vidrox.stockii.ui.auth.AuthViewModel
import me.vidrox.stockii.ui.main.MainFragmentDirections
import me.vidrox.stockii.ui.main.MainViewModel

class MainActivity : AppCompatActivity(), AuthListener {

    private lateinit var viewModel: MainViewModel
    private lateinit var authViewModel: AuthViewModel
    private var user: User? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_activity)

        authViewModel = ViewModelProviders.of(this).get(AuthViewModel::class.java)
        viewModel = ViewModelProviders.of(this).get(MainViewModel::class.java)

        val userObserver = Observer<User?> { newUser ->
            user = newUser
            invalidateOptionsMenu()

            if (Config.DEBUG_TO_LOG) {
                Log.w("UserChanged", newUser.toString())
            }
        }
        viewModel.user.observe(this, userObserver)
        authViewModel.authListener = this
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        if (user != null) {
            val inflater: MenuInflater = menuInflater
            inflater.inflate(R.menu.toolbar_user_menu, menu)

            return true
        }
        return false
    }

    override fun onPrepareOptionsMenu(menu: Menu): Boolean {
        val item = menu.findItem(R.id.user_name)
        item.isEnabled = false

        if (user != null) {
            val userData = user!!.user!!
            item.title = userData.last_name + " " + userData.first_name
        }

        return super.onPrepareOptionsMenu(menu)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.logout_button -> {
                authViewModel.onLogoutBtnClick(applicationContext)
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    override fun onSupportNavigateUp() =
        findNavController(R.id.container).navigateUp()

    override fun onRequest() {
        val progress = findViewById<LinearLayout?>(R.id.mainFragmentProgressBar)
        progress?.visibility = View.VISIBLE
    }

    override fun onSuccess(result: User?) {
        User.clear(applicationContext)

        val progress = findViewById<LinearLayout?>(R.id.mainFragmentProgressBar)
        progress?.visibility = View.GONE

        val direction = MainFragmentDirections.actionMainFragmentToAuthFragment()
        val navController = findNavController(R.id.container)
        navController.navigate(direction)
    }

    override fun onError(responseCode: Int, errorCode: Int, errorMessage: String) {
        User.clear(applicationContext)

        val progress = findViewById<LinearLayout?>(R.id.mainFragmentProgressBar)
        progress?.visibility = View.GONE

        val direction = MainFragmentDirections.actionMainFragmentToAuthFragment()
        val navController = findNavController(R.id.container)
        navController.navigate(direction)
    }
}
