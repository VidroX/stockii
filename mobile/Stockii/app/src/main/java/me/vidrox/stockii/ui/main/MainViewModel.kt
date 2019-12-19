package me.vidrox.stockii.ui.main

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import me.vidrox.stockii.api.user.User

class MainViewModel : ViewModel() {
    val user: MutableLiveData<User?> = MutableLiveData()
}
