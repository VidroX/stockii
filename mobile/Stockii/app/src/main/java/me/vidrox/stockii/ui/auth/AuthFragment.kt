package me.vidrox.stockii.ui.auth

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.navigation.fragment.findNavController
import me.vidrox.stockii.Config
import me.vidrox.stockii.R
import me.vidrox.stockii.api.user.User
import me.vidrox.stockii.databinding.AuthFragmentBinding
import me.vidrox.stockii.ui.main.MainFragment
import me.vidrox.stockii.ui.main.MainViewModel

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

        (activity as AppCompatActivity).supportActionBar?.title = activity?.getString(R.string.log_into_stockii)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        // action_authFragment_to_mainFragment

        val mainViewModel = ViewModelProviders.of(activity!!).get(MainViewModel::class.java)
        mainViewModel.user.value = null
        if (context != null) {
            val user = User.get(context!!)
            if (user != null) {
                val navController = findNavController()
                val direction = AuthFragmentDirections.actionAuthFragmentToMainFragment()
                navController.navigate(direction)
            }
        }

        viewModel = ViewModelProviders.of(this).get(AuthViewModel::class.java)

        progress = activity?.findViewById(R.id.mainProgressBar) as LinearLayout

        dataBinding.viewmodel = viewModel

        viewModel.authListener = this
    }

    override fun onRequest() {
        if (Config.DEBUG_TO_LOG) {
            Log.w("AuthRequest", "Request started")
        }

        dataBinding.authBoxEmail.error = null
        dataBinding.authBoxPassword.error = null
        progress.visibility = View.VISIBLE
    }

    override fun onSuccess(result: User?) {
        if (Config.DEBUG_TO_LOG) {
            Log.w("AuthRequest", "Request succeeded")
            Log.w("AuthRequest", result.toString())
        }

        progress.visibility = View.GONE

        Toast.makeText(context, getString(R.string.logged_in_successfully), Toast.LENGTH_SHORT).show()

        result?.save(context!!)

        val navController = findNavController()
        val direction = AuthFragmentDirections.actionAuthFragmentToMainFragment()
        navController.navigate(direction)
    }

    override fun onError(responseCode: Int, errorCode: Int, errorMessage: String) {
        if (Config.DEBUG_TO_LOG) {
            Log.e("AuthRequest", "Request failed")
            Log.e("AuthRequest", "Response code: $responseCode")
            Log.e("AuthRequest", "Error code: $errorCode")
            Log.e("AuthRequest", "Error message: $errorMessage")
        }

        progress.visibility = View.GONE

        when (errorCode) {
            AuthInternalErrorCodes.BOTH_FIELDS_EMPTY -> {
                dataBinding.authBoxEmail.error = getString(R.string.field_empty)
                dataBinding.authBoxPassword.error = getString(R.string.field_empty)
            }
            AuthInternalErrorCodes.EMAIL_FIELD_EMPTY -> {
                dataBinding.authBoxEmail.error = getString(R.string.field_empty)
            }
            AuthInternalErrorCodes.PASSWORD_FIELD_EMPTY -> {
                dataBinding.authBoxPassword.error = getString(R.string.field_empty)
            }
            10 -> {
                dataBinding.authBoxEmail.error = getString(R.string.email_or_pass_incorrect)
                dataBinding.authBoxPassword.error = getString(R.string.email_or_pass_incorrect)
            }
        }
    }
}
