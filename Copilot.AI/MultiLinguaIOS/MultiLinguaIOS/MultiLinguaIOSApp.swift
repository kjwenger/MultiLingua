//
//  MultiLinguaIOSApp.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import SwiftUI

@main
struct MultiLinguaIOSApp: App {
    @StateObject private var appState = AppState()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .preferredColorScheme(appState.colorScheme)
        }
    }
}

// MARK: - App State
@MainActor
class AppState: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var theme: Theme = .system
    
    let apiClient = APIClient()
    
    var colorScheme: ColorScheme? {
        switch theme {
        case .light: return .light
        case .dark: return .dark
        case .system: return nil
        }
    }
    
    init() {
        // Check if user has a valid token
        if apiClient.authToken != nil {
            Task {
                await checkAuth()
            }
        }
    }
    
    func checkAuth() async {
        do {
            let user = try await apiClient.getCurrentUser()
            self.currentUser = user
            self.isAuthenticated = true
        } catch {
            self.isAuthenticated = false
            self.currentUser = nil
        }
    }
    
    enum Theme: String, CaseIterable {
        case light = "Light"
        case dark = "Dark"
        case system = "System"
    }
}
