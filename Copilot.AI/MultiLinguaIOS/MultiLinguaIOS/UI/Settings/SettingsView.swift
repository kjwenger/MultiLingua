//
//  SettingsView.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    @State private var selectedProvider = "libretranslate"
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Translation Provider") {
                    Picker("Provider", selection: $selectedProvider) {
                        Text("LibreTranslate").tag("libretranslate")
                        Text("DeepL").tag("deepl")
                        Text("Google Translate").tag("google")
                        Text("Azure Translator").tag("azure")
                        Text("MyMemory").tag("mymemory")
                        Text("PONS").tag("pons")
                        Text("Tatoeba").tag("tatoeba")
                    }
                }
                
                Section("Appearance") {
                    Picker("Theme", selection: $appState.theme) {
                        ForEach(AppState.Theme.allCases, id: \.self) { theme in
                            Text(theme.rawValue).tag(theme)
                        }
                    }
                }
                
                Section("Account") {
                    if let user = appState.currentUser {
                        LabeledContent("Name", value: user.fullName)
                        LabeledContent("Email", value: user.email)
                        LabeledContent("Role", value: user.role.rawValue.capitalized)
                    }
                    
                    Button("Logout", role: .destructive) {
                        appState.isAuthenticated = false
                        appState.currentUser = nil
                    }
                }
                
                Section("About") {
                    LabeledContent("Version", value: Config.appVersion)
                }
            }
            .navigationTitle("Settings")
        }
    }
}

#Preview {
    SettingsView()
        .environmentObject(AppState())
}
