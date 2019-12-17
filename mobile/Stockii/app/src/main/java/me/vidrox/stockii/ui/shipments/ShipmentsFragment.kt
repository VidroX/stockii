package me.vidrox.stockii.ui.shipments

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import me.vidrox.stockii.R
import me.vidrox.stockii.ui.main.ShipmentsViewModel

class ShipmentsFragment : Fragment() {

    companion object {
        fun newInstance() = ShipmentsFragment()
    }

    private lateinit var viewModel: ShipmentsViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.shipments_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(ShipmentsViewModel::class.java)
        // TODO: Use the ViewModel
    }

}
