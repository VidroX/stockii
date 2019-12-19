package me.vidrox.stockii.ui.main

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.Navigation
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.bottomnavigation.BottomNavigationView
import me.vidrox.stockii.R
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.NavigationUI.setupActionBarWithNavController
import me.vidrox.stockii.api.user.User

class MainFragment : Fragment() {

    companion object {
        fun newInstance() = MainFragment()
    }

    private lateinit var viewModel: MainViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.main_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(activity!!).get(MainViewModel::class.java)

        if (context != null) {
            val user: User? = User.get(context!!)
            viewModel.user.value = user
        }

        setupBottomNavigationBar()
    }

    private fun setupBottomNavigationBar() {
        val bottomNavigationView = activity?.findViewById<BottomNavigationView>(R.id.main_bottom_nav)
        val fragmentContainer = activity?.findViewById<View>(R.id.auth_container)
        if (fragmentContainer != null) {
            val navController = Navigation.findNavController(fragmentContainer)

            val appBarConfiguration = AppBarConfiguration(
                setOf(
                    R.id.warehouses_fragment, R.id.products_fragment, R.id.shipments_fragment
                )
            )
            setupActionBarWithNavController(
                (activity as AppCompatActivity),
                navController,
                appBarConfiguration
            )

            bottomNavigationView?.setupWithNavController(navController)
        }
    }

}
