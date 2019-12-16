package me.vidrox.stockii.ui.auth

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import me.vidrox.stockii.R
import me.vidrox.stockii.api.user.User
import me.vidrox.stockii.databinding.AuthFragmentBinding
import me.vidrox.stockii.ui.main.MainFragment

class AuthFragment : Fragment(), AuthListener {

    companion object {
        fun newInstance() = AuthFragment()
    }

    private lateinit var viewModel: AuthViewModel
    private lateinit var dataBinding: AuthFragmentBinding
    private lateinit var progress: LinearLayout

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        dataBinding = DataBindingUtil.inflate(inflater, R.layout.auth_fragment, container, false)
        return dataBinding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        (activity as AppCompatActivity).supportActionBar?.title = activity?.getString(R.string.log_in)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        viewModel = ViewModelProviders.of(this).get(AuthViewModel::class.java)

        progress = activity?.findViewById(R.id.mainProgressBar) as LinearLayout

        dataBinding.viewmodel = viewModel

        viewModel.authListener = this
    }

    override fun onRequest() {
        progress.visibility = View.VISIBLE
        Log.w("AuthRequest", "Request started")
    }

    override fun onSuccess(result: User) {
        progress.visibility = View.GONE
        Log.w("AuthRequest", "Request succeeded")
        Log.w("AuthRequest", result.toString())

        fragmentManager?.beginTransaction()?.replace(R.id.container, MainFragment.newInstance())?.commitNow()
    }

    override fun onError(responseCode: Int, errorCode: Int, errorMessage: String) {
        progress.visibility = View.GONE
        Log.e("AuthRequest", "Request failed")
        Log.e("AuthRequest", "Response code: $responseCode")
        Log.e("AuthRequest", "Error code: $errorCode")
        Log.e("AuthRequest", "Error message: $errorMessage")
    }
}
