//
//  RegisterView.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import SwiftUI

struct RegisterView: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) var dismiss
    
    @State private var fullName = ""
    @State private var email = ""
    @State private var code = ""
    @State private var step: RegisterStep = .info
    @State private var isLoading = false
    @State private var errorMessage: String?
    
    enum RegisterStep {
        case info
        case code
    }
    
    var body: some View {
        Form {
            Section {
                if step == .info {
                    TextField("Full Name", text: $fullName)
                        .textContentType(.name)
                        .disabled(isLoading)
                    
                    TextField("Email Address", text: $email)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .disabled(isLoading)
                } else {
                    Text("Verification code sent to: \(email)")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    
                    TextField("6-digit code", text: $code)
                        .textContentType(.oneTimeCode)
                        .keyboardType(.numberPad)
                        .disabled(isLoading)
                }
            } header: {
                Text(step == .info ? "Create your account" : "Verify your email")
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
                        Text(step == .info ? "Send Code" : "Complete Registration")
                            .frame(maxWidth: .infinity)
                    }
                }
                .disabled(isLoading || !isValid)
            }
            
            if step == .code {
                Section {
                    Button("Send new code") {
                        step = .info
                        code = ""
                    }
                    .disabled(isLoading)
                }
            }
        }
        .navigationTitle("Register")
    }
    
    private var isValid: Bool {
        if step == .info {
            return !fullName.isEmpty && email.contains("@") && email.contains(".")
        } else {
            return code.count == 6
        }
    }
    
    private func handleSubmit() async {
        isLoading = true
        errorMessage = nil
        
        do {
            if step == .info {
                _ = try await appState.apiClient.register(email: email, fullName: fullName)
                step = .code
            } else {
                let response = try await appState.apiClient.verifyRegistration(email: email, code: code)
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
        RegisterView()
            .environmentObject(AppState())
    }
}
