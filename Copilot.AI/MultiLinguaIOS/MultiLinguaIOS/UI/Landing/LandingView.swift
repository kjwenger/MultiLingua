//
//  LandingView.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import SwiftUI

struct LandingView: View {
    @State private var showLogin = false
    @State private var showRegister = false
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 30) {
                Spacer()
                
                // App Icon/Logo
                Image(systemName: "text.bubble.fill")
                    .font(.system(size: 80))
                    .foregroundStyle(.blue)
                
                // Title
                Text("MultiLingua")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                // Tagline
                Text("Multi-language translation made simple")
                    .font(.headline)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                
                // Features
                VStack(alignment: .leading, spacing: 15) {
                    FeatureRow(icon: "globe", text: "5 languages: EN, DE, FR, IT, ES")
                    FeatureRow(icon: "arrow.triangle.2.circlepath", text: "Multiple translation providers")
                    FeatureRow(icon: "speaker.wave.2", text: "Text-to-speech support")
                    FeatureRow(icon: "arrow.clockwise", text: "Offline access to translations")
                }
                .padding()
                
                Spacer()
                
                // Action Buttons
                VStack(spacing: 15) {
                    Button {
                        showLogin = true
                    } label: {
                        Text("Login")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                    }
                    
                    Button {
                        showRegister = true
                    } label: {
                        Text("Register")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue.opacity(0.1))
                            .foregroundColor(.blue)
                            .cornerRadius(10)
                    }
                }
                .padding(.horizontal, 30)
                .padding(.bottom, 30)
            }
            .navigationDestination(isPresented: $showLogin) {
                LoginView()
            }
            .navigationDestination(isPresented: $showRegister) {
                RegisterView()
            }
        }
    }
}

struct FeatureRow: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundStyle(.blue)
                .frame(width: 24)
            Text(text)
                .font(.subheadline)
        }
    }
}

#Preview {
    LandingView()
        .environmentObject(AppState())
}
