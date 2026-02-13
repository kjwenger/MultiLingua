//
//  HelpView.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import SwiftUI

struct HelpView: View {
    var body: some View {
        NavigationStack {
            List {
                Section("About MultiLingua") {
                    Text("MultiLingua is a multi-language translation app that helps you translate words and phrases between English, German, French, Italian, and Spanish.")
                }
                
                Section("Supported Languages") {
                    ForEach(Language.supported, id: \.code) { language in
                        HStack {
                            Text(language.flag)
                                .font(.title2)
                            Text(language.name)
                        }
                    }
                }
                
                Section("Features") {
                    FeatureItem(icon: "arrow.triangle.2.circlepath", 
                              title: "Multiple Providers",
                              description: "Switch between LibreTranslate, DeepL, Google, and more")
                    
                    FeatureItem(icon: "list.bullet.rectangle",
                              title: "Alternative Translations",
                              description: "Up to 10 alternative proposals per language")
                    
                    FeatureItem(icon: "speaker.wave.2",
                              title: "Text-to-Speech",
                              description: "Listen to translations in native pronunciation")
                    
                    FeatureItem(icon: "arrow.clockwise",
                              title: "Offline Access",
                              description: "View and edit translations without internet")
                }
                
                Section("How to Use") {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("1. Add a new translation entry")
                        Text("2. Type text in any language column")
                        Text("3. Tap the translate button to fill other languages")
                        Text("4. Select from alternative proposals if available")
                        Text("5. Tap the speaker icon to hear the pronunciation")
                    }
                    .font(.subheadline)
                }
            }
            .navigationTitle("Help")
        }
    }
}

struct FeatureItem: View {
    let icon: String
    let title: String
    let description: String
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: icon)
                .foregroundStyle(.blue)
                .frame(width: 30)
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                Text(description)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
    }
}

#Preview {
    HelpView()
}
