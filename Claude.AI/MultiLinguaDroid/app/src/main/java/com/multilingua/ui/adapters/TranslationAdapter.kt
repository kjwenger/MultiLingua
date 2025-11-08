package com.multilingua.ui.adapters

import android.os.Handler
import android.os.Looper
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.multilingua.R
import com.multilingua.data.model.Translation

class TranslationAdapter(
    private val onTranslate: (Translation, String) -> Unit,
    private val onSpeak: (String, String) -> Unit,
    private val onTextChanged: (Translation, String, String) -> Unit,
    private val onDelete: (Translation) -> Unit
) : ListAdapter<Translation, TranslationAdapter.TranslationViewHolder>(TranslationDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TranslationViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_translation, parent, false)
        return TranslationViewHolder(view)
    }

    override fun onBindViewHolder(holder: TranslationViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class TranslationViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        // Language fields
        private val englishField = LanguageField(itemView.findViewById(R.id.englishLayout), "en", "English")
        private val germanField = LanguageField(itemView.findViewById(R.id.germanLayout), "de", "German")
        private val frenchField = LanguageField(itemView.findViewById(R.id.frenchLayout), "fr", "French")
        private val italianField = LanguageField(itemView.findViewById(R.id.italianLayout), "it", "Italian")
        private val spanishField = LanguageField(itemView.findViewById(R.id.spanishLayout), "es", "Spanish")

        private val btnDelete: View = itemView.findViewById(R.id.btnDelete)

        fun bind(translation: Translation) {
            englishField.bind(translation, translation.english, "english")
            germanField.bind(translation, translation.german, "german")
            frenchField.bind(translation, translation.french, "french")
            italianField.bind(translation, translation.italian, "italian")
            spanishField.bind(translation, translation.spanish, "spanish")

            btnDelete.setOnClickListener { onDelete(translation) }
        }
    }

    inner class LanguageField(
        private val layout: View,
        private val langCode: String,
        private val langName: String
    ) {
        private val label: TextView = layout.findViewById(R.id.tvLanguageLabel)
        private val editText: EditText = layout.findViewById(R.id.etText)
        private val btnTranslate: ImageButton = layout.findViewById(R.id.btnTranslate)
        private val btnSpeak: ImageButton = layout.findViewById(R.id.btnSpeak)

        private var currentTranslation: Translation? = null
        private var fieldName: String? = null
        private val handler = Handler(Looper.getMainLooper())
        private var pendingUpdate: Runnable? = null

        init {
            label.text = langName
        }

        fun bind(translation: Translation, text: String, field: String) {
            // Always update current translation and field
            currentTranslation = translation
            fieldName = field

            // Update button click listeners
            btnTranslate.setOnClickListener {
                currentTranslation?.let { onTranslate(it, langCode) }
            }

            btnSpeak.setOnClickListener {
                onSpeak(editText.text.toString(), langCode)
            }

            // Skip text update if user is currently editing this field
            if (editText.hasFocus()) {
                return
            }

            // Remove existing text watcher before setting text
            editText.tag?.let { editText.removeTextChangedListener(it as TextWatcher) }

            editText.setText(text)

            val textWatcher = object : TextWatcher {
                override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
                override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
                override fun afterTextChanged(s: Editable?) {
                    // Cancel any pending update
                    pendingUpdate?.let { handler.removeCallbacks(it) }

                    // Schedule a new update after 800ms of inactivity
                    pendingUpdate = Runnable {
                        currentTranslation?.let {
                            onTextChanged(it, field, s.toString())
                        }
                    }
                    handler.postDelayed(pendingUpdate!!, 800)
                }
            }
            editText.addTextChangedListener(textWatcher)
            editText.tag = textWatcher
        }
    }

    class TranslationDiffCallback : DiffUtil.ItemCallback<Translation>() {
        override fun areItemsTheSame(oldItem: Translation, newItem: Translation): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Translation, newItem: Translation): Boolean {
            return oldItem == newItem
        }
    }
}
