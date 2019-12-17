package me.vidrox.stockii.ui.warehouses

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import me.vidrox.stockii.R
import me.vidrox.stockii.ui.main.WarehousesViewModel

class WarehousesFragment : Fragment() {

    companion object {
        fun newInstance() = WarehousesFragment()
    }

    private lateinit var viewModel: WarehousesViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.warehouses_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(WarehousesViewModel::class.java)
        // TODO: Use the ViewModel
    }

}
