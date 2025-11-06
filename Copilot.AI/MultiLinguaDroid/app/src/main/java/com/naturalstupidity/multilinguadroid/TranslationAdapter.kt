package com.naturalstupidity.multilinguadroid

import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView

class TranslationAdapter(
    private val onTranslate: (TranslationEntry, String) -> Unit,
    private val onDelete: (TranslationEntry) -> Unit,
    private val onUpdate: (TranslationEntry) -> Unit
) : ListAdapter<TranslationEntry, TranslationAdapter.ViewHolder>(DiffCallback()) {
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_translation, parent, false)
        return ViewHolder(view)
    }
    
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
    
    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val etEnglish: EditText = itemView.findViewById(R.id.etEnglish)
        private val etFrench: EditText = itemView.findViewById(R.id.etFrench)
        private val etItalian: EditText = itemView.findViewById(R.id.etItalian)
        private val etSpanish: EditText = itemView.findViewById(R.id.etSpanish)
        
        private val btnTranslateFrench: Button = itemView.findViewById(R.id.btnTranslateFrench)
        private val btnTranslateItalian: Button = itemView.findViewById(R.id.btnTranslateItalian)
        private val btnTranslateSpanish: Button = itemView.findViewById(R.id.btnTranslateSpanish)
        private val btnDelete: Button = itemView.findViewById(R.id.btnDelete)
        
        private val llFrenchOptions: LinearLayout = itemView.findViewById(R.id.llFrenchOptions)
        private val llItalianOptions: LinearLayout = itemView.findViewById(R.id.llItalianOptions)
        private val llSpanishOptions: LinearLayout = itemView.findViewById(R.id.llSpanishOptions)
        
        private var currentEntry: TranslationEntry? = null
        
        init {
            etEnglish.addTextChangedListener(createTextWatcher { 
                currentEntry?.english = it 
            })
            etFrench.addTextChangedListener(createTextWatcher { 
                currentEntry?.french = it 
            })
            etItalian.addTextChangedListener(createTextWatcher { 
                currentEntry?.italian = it 
            })
            etSpanish.addTextChangedListener(createTextWatcher { 
                currentEntry?.spanish = it 
            })
        }
        
        fun bind(entry: TranslationEntry) {
            currentEntry = entry
            
            etEnglish.setText(entry.english)
            etFrench.setText(entry.french)
            etItalian.setText(entry.italian)
            etSpanish.setText(entry.spanish)
            
            btnTranslateFrench.setOnClickListener {
                currentEntry?.let { onTranslate(it, "fr") }
            }
            
            btnTranslateItalian.setOnClickListener {
                currentEntry?.let { onTranslate(it, "it") }
            }
            
            btnTranslateSpanish.setOnClickListener {
                currentEntry?.let { onTranslate(it, "es") }
            }
            
            btnDelete.setOnClickListener {
                currentEntry?.let { onDelete(it) }
            }
            
            showOptions(llFrenchOptions, entry.frenchOptions) { 
                etFrench.setText(it)
                currentEntry?.french = it
                currentEntry?.let { e -> onUpdate(e) }
            }
            
            showOptions(llItalianOptions, entry.italianOptions) { 
                etItalian.setText(it)
                currentEntry?.italian = it
                currentEntry?.let { e -> onUpdate(e) }
            }
            
            showOptions(llSpanishOptions, entry.spanishOptions) { 
                etSpanish.setText(it)
                currentEntry?.spanish = it
                currentEntry?.let { e -> onUpdate(e) }
            }
        }
        
        private fun createTextWatcher(onTextChanged: (String) -> Unit): TextWatcher {
            return object : TextWatcher {
                override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
                override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                    onTextChanged(s?.toString() ?: "")
                }
                override fun afterTextChanged(s: Editable?) {
                    currentEntry?.let { onUpdate(it) }
                }
            }
        }
        
        private fun showOptions(container: LinearLayout, options: List<String>, onSelect: (String) -> Unit) {
            container.removeAllViews()
            options.take(5).forEach { option ->
                val textView = TextView(itemView.context).apply {
                    text = option
                    setPadding(8, 8, 8, 8)
                    setTextColor(itemView.context.getColor(R.color.option_text))
                    setBackgroundResource(R.drawable.option_background)
                    setOnClickListener { onSelect(option) }
                }
                container.addView(textView)
            }
        }
    }
    
    class DiffCallback : DiffUtil.ItemCallback<TranslationEntry>() {
        override fun areItemsTheSame(oldItem: TranslationEntry, newItem: TranslationEntry): Boolean {
            return oldItem.id == newItem.id
        }
        
        override fun areContentsTheSame(oldItem: TranslationEntry, newItem: TranslationEntry): Boolean {
            return oldItem == newItem
        }
    }
}
