//
//  LoginView.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import SwiftUI

struct LoginView: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) var dismiss
    
    @State private var email = ""
    @State private var code = ""
    @State private var rememberMe = false
    @State private var step: LoginStep = .email
    @State private var isLoading = false
    @State private var errorMessage: String?
    
    enum LoginStep {
        case email
        case code
    }
    
    var body: some View {
        Form {
            Section {
                if step == .email {
                    TextField("Email Address", text: $email)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .disabled(isLoading)
                } else {
                    Text("Code sent to: \(email)")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    
                    TextField("6-digit code", text: $code)
                        .textContentType(.oneTimeCode)
                        .keyboardType(.numberPad)
                        .disabled(isLoading)
                }
            } header: {
                Text(step == .email ? "Enter your email" : "Enter verification code")
            }
            
            if step == .code {
                Section {
                    Toggle("Remember Me (30 days)", isOn: $rememberMe)
                }
            }
            
            if let error = errorMessage {
                Section {
                    Text(error)
                        .foregroundStyle(.red)
                        .font(.caption)
                }
            }
            
            Section {
                Button {
                    Task {
                        await handleSubmit()
                    }
                } label: {
                    if isLoading {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                    } else {
                        Text(step == .email ? "Send Code" : "Login")
                            .frame(maxWidth: .infinity)
                    }
                }
                .disabled(isLoading || !isValid)
            }
            
            if step == .code {
                Section {
                    Button("Send new code") {
                        step = .email
                        code = ""
                    }
                    .disabled(isLoading)
                }
            }
        }
        .navigationTitle("Login")
    }
    
    private var isValid: Bool {
        if step == .email {
            return email.contains("@") && email.contains(".")
        } else {
            return code.count == 6
        }
    }
    
    private func handleSubmit() async {
        isLoading = true
        errorMessage = nil
        
        do {
            if step == .email {
                _ = try await appState.apiClient.login(email: email)
                step = .code
            } else {
                let response = try await appState.apiClient.verifyLogin(email: email, code: code, rememberMe: rememberMe)
                appState.currentUser = response.user
                appState.isAuthenticated = true
                dismiss()
            }
        } catch let error as APIError {
            switch error {
            case .serverError(let message):
                errorMessage = message
            case .unauthorized:
                errorMessage = "Invalid code. Please try again."
            case .networkError:
                errorMessage = "Network error. Please check your connection."
            default:
                errorMessage = "An error occurred. Please try again."
            }
        } catch {
            errorMessage = "An error occurred. Please try again."
        }
        
        isLoading = false
    }
}

#Preview {
    NavigationStack {
        LoginView()
            .environmentObject(AppState())
    }
}
