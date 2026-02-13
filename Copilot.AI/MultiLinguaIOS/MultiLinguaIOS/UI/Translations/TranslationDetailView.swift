//
//  TranslationDetailView.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import SwiftUI
import AVFoundation

struct TranslationDetailView: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) var dismiss

    @State var translation: TranslationEntry
    var onUpdate: ((TranslationEntry) -> Void)?
    var onDelete: (() -> Void)?

    @State private var isTranslating = false
    @State private var isSaving = false
    @State private var showDeleteConfirmation = false
    @State private var errorMessage: String?
    @State private var speechSynthesizer = AVSpeechSynthesizer()

    var body: some View {
        Form {
            if let error = errorMessage {
                Section {
                    Text(error)
                        .foregroundStyle(.red)
                        .font(.caption)
                }
            }

            languageSection(flag: "🇬🇧", label: "English", text: $translation.english,
                            proposals: translation.englishProposals, locale: "en-US") { selected in
                translation.english = selected
            }
            languageSection(flag: "🇩🇪", label: "German", text: $translation.german,
                            proposals: translation.germanProposals, locale: "de-DE") { selected in
                translation.german = selected
            }
            languageSection(flag: "🇫🇷", label: "French", text: $translation.french,
                            proposals: translation.frenchProposals, locale: "fr-FR") { selected in
                translation.french = selected
            }
            languageSection(flag: "🇮🇹", label: "Italian", text: $translation.italian,
                            proposals: translation.italianProposals, locale: "it-IT") { selected in
                translation.italian = selected
            }
            languageSection(flag: "🇪🇸", label: "Spanish", text: $translation.spanish,
                            proposals: translation.spanishProposals, locale: "es-ES") { selected in
                translation.spanish = selected
            }

            Section {
                Button(role: .destructive) {
                    showDeleteConfirmation = true
                } label: {
                    HStack {
                        Image(systemName: "trash")
                        Text("Delete Translation")
                    }
                    .frame(maxWidth: .infinity)
                }
            }
        }
        .navigationTitle("Edit Translation")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                if isTranslating || isSaving {
                    ProgressView()
                } else {
                    Button {
                        Task { await translateEntry() }
                    } label: {
                        Image(systemName: "arrow.triangle.2.circlepath")
                    }
                    .disabled(sourceText.isEmpty)
                }
            }
        }
        .confirmationDialog("Delete this translation?", isPresented: $showDeleteConfirmation, titleVisibility: .visible) {
            Button("Delete", role: .destructive) {
                Task { await deleteEntry() }
            }
        }
        .onChange(of: translation) { _ in
            Task { await autoSave() }
        }
    }

    // MARK: - Language Section

    @ViewBuilder
    private func languageSection(flag: String, label: String, text: Binding<String>,
                                  proposals: [String], locale: String,
                                  onSelectProposal: @escaping (String) -> Void) -> some View {
        Section {
            HStack {
                Text(flag)
                    .font(.title2)
                TextField(label, text: text, axis: .vertical)
                    .lineLimit(1...4)
                Button {
                    speak(text: text.wrappedValue, locale: locale)
                } label: {
                    Image(systemName: "speaker.wave.2")
                }
                .buttonStyle(.borderless)
                .disabled(text.wrappedValue.isEmpty)
            }

            if !proposals.isEmpty {
                DisclosureGroup("Suggestions") {
                    ForEach(proposals, id: \.self) { proposal in
                        Button {
                            onSelectProposal(proposal)
                        } label: {
                            Text(proposal)
                                .foregroundStyle(.primary)
                        }
                    }
                }
                .font(.subheadline)
                .foregroundStyle(.secondary)
            }
        } header: {
            Text("\(flag) \(label)")
        }
    }

    // MARK: - Source detection

    private var sourceText: String {
        if !translation.english.isEmpty { return translation.english }
        if !translation.german.isEmpty { return translation.german }
        if !translation.french.isEmpty { return translation.french }
        if !translation.italian.isEmpty { return translation.italian }
        if !translation.spanish.isEmpty { return translation.spanish }
        return ""
    }

    private var sourceLanguage: String {
        if !translation.english.isEmpty { return "en" }
        if !translation.german.isEmpty { return "de" }
        if !translation.french.isEmpty { return "fr" }
        if !translation.italian.isEmpty { return "it" }
        if !translation.spanish.isEmpty { return "es" }
        return "en"
    }

    // MARK: - Actions

    private func translateEntry() async {
        isTranslating = true
        errorMessage = nil
        do {
            let result = try await appState.apiClient.translate(text: sourceText, sourceLanguage: sourceLanguage)
            if let en = result["english"] { translation.english = en.translation; translation.englishProposals = en.alternatives }
            if let de = result["german"] { translation.german = de.translation; translation.germanProposals = de.alternatives }
            if let fr = result["french"] { translation.french = fr.translation; translation.frenchProposals = fr.alternatives }
            if let it = result["italian"] { translation.italian = it.translation; translation.italianProposals = it.alternatives }
            if let es = result["spanish"] { translation.spanish = es.translation; translation.spanishProposals = es.alternatives }
        } catch {
            errorMessage = "Translation failed"
        }
        isTranslating = false
    }

    private func autoSave() async {
        guard !isSaving, !isTranslating else { return }
        isSaving = true
        do {
            let updated = try await appState.apiClient.updateTranslation(translation)
            onUpdate?(updated)
        } catch {
            // silent — best-effort auto-save
        }
        isSaving = false
    }

    private func deleteEntry() async {
        do {
            try await appState.apiClient.deleteTranslation(id: translation.id)
            onDelete?()
            dismiss()
        } catch {
            errorMessage = "Failed to delete"
        }
    }

    private func speak(text: String, locale: String) {
        speechSynthesizer.stopSpeaking(at: .immediate)
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: locale)
        speechSynthesizer.speak(utterance)
    }
}
