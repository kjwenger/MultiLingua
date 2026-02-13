//
//  ContentView.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        Group {
            if appState.isAuthenticated {
                MainTabView()
            } else {
                LandingView()
            }
        }
    }
}

// MARK: - Main Tab View
struct MainTabView: View {
    var body: some View {
        TabView {
            TranslationsView()
                .tabItem {
                    Label("Translations", systemImage: "text.bubble")
                }
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
            
            HelpView()
                .tabItem {
                    Label("Help", systemImage: "questionmark.circle")
                }
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(AppState())
}
