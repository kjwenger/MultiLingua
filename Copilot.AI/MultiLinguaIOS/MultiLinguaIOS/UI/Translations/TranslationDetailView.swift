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

    let isNew: Bool
    @State var english: String
    @State var german: String
    @State var french: String
    @State var italian: String
    @State var spanish: String
    @State var englishProposals: [String]
    @State var germanProposals: [String]
    @State var frenchProposals: [String]
    @State var italianProposals: [String]
    @State var spanishProposals: [String]

    private let entryId: Int?
    var onSave: ((TranslationEntry) -> Void)?
    var onUpdate: ((TranslationEntry) -> Void)?
    var onDelete: (() -> Void)?

    @State private var isTranslating = false
    @State private var isSaving = false
    @State private var showDeleteConfirmation = false
    @State private var errorMessage: String?
    @State private var speechSynthesizer = AVSpeechSynthesizer()

    /// Create mode
    init(onSave: @escaping (TranslationEntry) -> Void) {
        self.isNew = true
        self.entryId = nil
        self._english = State(initialValue: "")
        self._german = State(initialValue: "")
        self._french = State(initialValue: "")
        self._italian = State(initialValue: "")
        self._spanish = State(initialValue: "")
        self._englishProposals = State(initialValue: [])
        self._germanProposals = State(initialValue: [])
        self._frenchProposals = State(initialValue: [])
        self._italianProposals = State(initialValue: [])
        self._spanishProposals = State(initialValue: [])
        self.onSave = onSave
    }

    /// Edit mode
    init(translation: TranslationEntry,
         onUpdate: ((TranslationEntry) -> Void)? = nil,
         onDelete: (() -> Void)? = nil) {
        self.isNew = false
        self.entryId = translation.id
        self._english = State(initialValue: translation.english)
        self._german = State(initialValue: translation.german)
        self._french = State(initialValue: translation.french)
        self._italian = State(initialValue: translation.italian)
        self._spanish = State(initialValue: translation.spanish)
        self._englishProposals = State(initialValue: translation.englishProposals)
        self._germanProposals = State(initialValue: translation.germanProposals)
        self._frenchProposals = State(initialValue: translation.frenchProposals)
        self._italianProposals = State(initialValue: translation.italianProposals)
        self._spanishProposals = State(initialValue: translation.spanishProposals)
        self.onUpdate = onUpdate
        self.onDelete = onDelete
    }

    var body: some View {
        Form {
            if let error = errorMessage {
                Section {
                    Text(error)
                        .foregroundStyle(.red)
                        .font(.caption)
                }
            }

            Section {
                languageRow(flag: "🇬🇧", label: "English", langCode: "en",
                            text: $english, proposals: englishProposals, locale: "en-US") { selected in
                    english = selected
                }
                languageRow(flag: "🇩🇪", label: "German", langCode: "de",
                            text: $german, proposals: germanProposals, locale: "de-DE") { selected in
                    german = selected
                }
                languageRow(flag: "🇫🇷", label: "French", langCode: "fr",
                            text: $french, proposals: frenchProposals, locale: "fr-FR") { selected in
                    french = selected
                }
                languageRow(flag: "🇮🇹", label: "Italian", langCode: "it",
                            text: $italian, proposals: italianProposals, locale: "it-IT") { selected in
                    italian = selected
                }
                languageRow(flag: "🇪🇸", label: "Spanish", langCode: "es",
                            text: $spanish, proposals: spanishProposals, locale: "es-ES") { selected in
                    spanish = selected
                }
            }

            if !isNew {
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
        }
        .navigationTitle(isNew ? "Add Translation" : "Edit Translation")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            if isNew {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    if isSaving {
                        ProgressView()
                    } else {
                        Button("Save") {
                            Task { await createEntry() }
                        }
                        .disabled(!hasContent)
                    }
                }
            } else {
                ToolbarItem(placement: .primaryAction) {
                    if isTranslating || isSaving {
                        ProgressView()
                    }
                }
            }
        }
        .confirmationDialog("Delete this translation?", isPresented: $showDeleteConfirmation, titleVisibility: .visible) {
            Button("Delete", role: .destructive) {
                Task { await deleteEntry() }
            }
        }
        .onChange(of: english) { _ in Task { await autoSave() } }
        .onChange(of: german) { _ in Task { await autoSave() } }
        .onChange(of: french) { _ in Task { await autoSave() } }
        .onChange(of: italian) { _ in Task { await autoSave() } }
        .onChange(of: spanish) { _ in Task { await autoSave() } }
    }

    // MARK: - Language Row

    @ViewBuilder
    private func languageRow(flag: String, label: String, langCode: String,
                              text: Binding<String>,
                              proposals: [String], locale: String,
                              onSelectProposal: @escaping (String) -> Void) -> some View {
        HStack(alignment: .top) {
            Text(flag)
                .font(.title2)
            TextField(label, text: text, axis: .vertical)
                .lineLimit(1...4)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
            Button {
                Task { await translateFrom(text: text.wrappedValue, langCode: langCode) }
            } label: {
                Image(systemName: "arrow.triangle.2.circlepath")
            }
            .buttonStyle(.borderless)
            .disabled(text.wrappedValue.isEmpty || isTranslating)
            Button {
                speak(text: text.wrappedValue, locale: locale)
            } label: {
                Image(systemName: "speaker.wave.2")
            }
            .buttonStyle(.borderless)
            .disabled(text.wrappedValue.isEmpty)
        }

        if !proposals.isEmpty {
            DisclosureGroup("Suggestions for \(flag)") {
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
    }

    // MARK: - Helpers

    private var hasContent: Bool {
        !english.isEmpty || !german.isEmpty || !french.isEmpty || !italian.isEmpty || !spanish.isEmpty
    }

    private func buildEntry() -> TranslationEntry? {
        guard let id = entryId else { return nil }
        return TranslationEntry(id: id, english: english, german: german, french: french,
                                italian: italian, spanish: spanish,
                                englishProposals: englishProposals, germanProposals: germanProposals,
                                frenchProposals: frenchProposals, italianProposals: italianProposals,
                                spanishProposals: spanishProposals)
    }

    // MARK: - Actions

    private func translateFrom(text: String, langCode: String) async {
        isTranslating = true
        errorMessage = nil
        do {
            let result = try await appState.apiClient.translate(text: text, sourceLanguage: langCode)
            if let en = result["english"] { english = en.translation; englishProposals = en.alternatives }
            if let de = result["german"] { german = de.translation; germanProposals = de.alternatives }
            if let fr = result["french"] { french = fr.translation; frenchProposals = fr.alternatives }
            if let it = result["italian"] { italian = it.translation; italianProposals = it.alternatives }
            if let es = result["spanish"] { spanish = es.translation; spanishProposals = es.alternatives }
        } catch {
            errorMessage = "Translation failed"
        }
        isTranslating = false
    }

    private func createEntry() async {
        isSaving = true
        errorMessage = nil
        do {
            let req = NewTranslationRequest(
                english: english, german: german, french: french, italian: italian, spanish: spanish,
                englishProposals: englishProposals, germanProposals: germanProposals,
                frenchProposals: frenchProposals, italianProposals: italianProposals,
                spanishProposals: spanishProposals
            )
            let response = try await appState.apiClient.createNewTranslation(req)
            let entry = TranslationEntry(
                id: response.id, english: english, german: german, french: french,
                italian: italian, spanish: spanish,
                englishProposals: englishProposals, germanProposals: germanProposals,
                frenchProposals: frenchProposals, italianProposals: italianProposals,
                spanishProposals: spanishProposals
            )
            onSave?(entry)
            dismiss()
        } catch {
            errorMessage = "Failed to save translation"
        }
        isSaving = false
    }

    private func autoSave() async {
        guard !isNew, !isSaving, !isTranslating, let entry = buildEntry() else { return }
        isSaving = true
        do {
            try await appState.apiClient.updateTranslation(entry)
            onUpdate?(entry)
        } catch {
            // silent
        }
        isSaving = false
    }

    private func deleteEntry() async {
        guard let id = entryId else { return }
        do {
            try await appState.apiClient.deleteTranslation(id: id)
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
