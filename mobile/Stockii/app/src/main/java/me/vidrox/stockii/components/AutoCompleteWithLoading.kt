package me.vidrox.stockii.components

import android.content.Context
import android.util.AttributeSet
import android.view.View
import android.widget.ProgressBar
import androidx.appcompat.widget.AppCompatAutoCompleteTextView

class AutoCompleteWithLoading : AppCompatAutoCompleteTextView {
    private var loading: ProgressBar? = null

    constructor(context: Context?) : super(context)
    constructor(context: Context?, attrs: AttributeSet?) : super(context, attrs)
    constructor(context: Context?, attrs: AttributeSet?, defStyleAttr: Int) : super(
        context,
        attrs,
        defStyleAttr
    )

    fun setLoadingView(view: ProgressBar?) {
        loading = view
    }

    override fun performFiltering(text: CharSequence?, keyCode: Int) {
        loading?.visibility = View.VISIBLE
        super.performFiltering(text, keyCode)
    }

    override fun onFilterComplete(count: Int) {
        loading?.visibility = View.GONE
        super.onFilterComplete(count)
    }
}