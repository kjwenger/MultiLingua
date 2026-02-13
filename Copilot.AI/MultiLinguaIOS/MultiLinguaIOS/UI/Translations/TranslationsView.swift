//
//  TranslationsView.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import SwiftUI

struct TranslationsView: View {
    @EnvironmentObject var appState: AppState
    @State private var translations: [TranslationEntry] = []
    @State private var searchText = ""
    @State private var showingAddSheet = false
    @State private var isLoading = false
    @State private var errorMessage: String?
    
    var body: some View {
        NavigationStack {
            Group {
                if isLoading && translations.isEmpty {
                    ProgressView("Loading translations...")
                } else if let error = errorMessage {
                    VStack(spacing: 20) {
                        Image(systemName: "exclamationmark.triangle")
                            .font(.largeTitle)
                            .foregroundStyle(.orange)
                        Text(error)
                            .multilineTextAlignment(.center)
                        Button("Retry") {
                            Task {
                                await loadTranslations()
                            }
                        }
                    }
                    .padding()
                } else if translations.isEmpty {
                    VStack(spacing: 20) {
                        Image(systemName: "text.bubble")
                            .font(.system(size: 60))
                            .foregroundStyle(.secondary)
                        Text("No translations yet")
                            .font(.headline)
                        Text("Tap + to add your first translation")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                    .padding()
                } else {
                    List {
                        ForEach(filteredTranslations) { translation in
                            TranslationCard(translation: translation)
                        }
                    }
                    .refreshable {
                        await loadTranslations()
                    }
                }
            }
            .navigationTitle("Translations")
            .searchable(text: $searchText)
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showingAddSheet = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showingAddSheet) {
                AddTranslationView()
            }
            .task {
                await loadTranslations()
            }
        }
    }
    
    private var filteredTranslations: [TranslationEntry] {
        if searchText.isEmpty {
            return translations
        }
        return translations.filter { entry in
            entry.english.localizedCaseInsensitiveContains(searchText) ||
            entry.german.localizedCaseInsensitiveContains(searchText) ||
            entry.french.localizedCaseInsensitiveContains(searchText) ||
            entry.italian.localizedCaseInsensitiveContains(searchText) ||
            entry.spanish.localizedCaseInsensitiveContains(searchText)
        }
    }
    
    private func loadTranslations() async {
        print("📋 [Translations] loadTranslations() called")
        isLoading = true
        errorMessage = nil
        
        do {
            print("📋 [Translations] Fetching from API...")
            translations = try await appState.apiClient.getTranslations()
            print("📋 [Translations] Received \(translations.count) translations")
        } catch let error as APIError {
            print("❌ [Translations] API Error: \(error)")
            switch error {
            case .unauthorized:
                errorMessage = "Please log in again"
                appState.isAuthenticated = false
            case .serverError(let message):
                errorMessage = message
            case .networkError:
                errorMessage = "Network error. Please check your connection."
            default:
                errorMessage = "Failed to load translations"
            }
        } catch {
            print("❌ [Translations] Unknown error: \(error)")
            errorMessage = "Failed to load translations"
        }
        
        isLoading = false
        print("📋 [Translations] Loading complete. Count: \(translations.count), Error: \(errorMessage ?? "none")")
    }
}

struct TranslationCard: View {
    let translation: TranslationEntry
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if !translation.english.isEmpty {
                LanguageRow(flag: "🇬🇧", text: translation.english)
            }
            if !translation.german.isEmpty {
                LanguageRow(flag: "🇩🇪", text: translation.german)
            }
            if !translation.french.isEmpty {
                LanguageRow(flag: "🇫🇷", text: translation.french)
            }
            if !translation.italian.isEmpty {
                LanguageRow(flag: "🇮🇹", text: translation.italian)
            }
            if !translation.spanish.isEmpty {
                LanguageRow(flag: "🇪🇸", text: translation.spanish)
            }
            
            HStack {
                Spacer()
                Button {
                    // TODO: Translate
                } label: {
                    Image(systemName: "arrow.triangle.2.circlepath")
                }
                Button {
                    // TODO: TTS
                } label: {
                    Image(systemName: "speaker.wave.2")
                }
                Button(role: .destructive) {
                    // TODO: Delete
                } label: {
                    Image(systemName: "trash")
                }
            }
            .buttonStyle(.borderless)
        }
        .padding(.vertical, 4)
    }
}

struct LanguageRow: View {
    let flag: String
    let text: String
    
    var body: some View {
        HStack(spacing: 8) {
            Text(flag)
                .font(.title3)
            Text(text)
                .font(.body)
        }
    }
}

struct AddTranslationView: View {
    @Environment(\.dismiss) var dismiss
    @State private var english = ""
    @State private var german = ""
    @State private var french = ""
    @State private var italian = ""
    @State private var spanish = ""
    
    var body: some View {
        NavigationStack {
            Form {
                TextField("🇬🇧 English", text: $english)
                TextField("🇩🇪 German", text: $german)
                TextField("🇫🇷 French", text: $french)
                TextField("🇮🇹 Italian", text: $italian)
                TextField("🇪🇸 Spanish", text: $spanish)
            }
            .navigationTitle("Add Translation")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        // TODO: Save translation
                        dismiss()
                    }
                }
            }
        }
    }
}

#Preview {
    TranslationsView()
}
