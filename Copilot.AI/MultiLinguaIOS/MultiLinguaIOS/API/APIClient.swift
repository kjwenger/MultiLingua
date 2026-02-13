//
//  APIClient.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import Foundation

enum APIError: Error {
    case invalidURL
    case unauthorized
    case serverError(String)
    case decodingError
    case networkError(Error)
}

@MainActor
class APIClient: ObservableObject {
    private let baseURL: String
    @Published var authToken: String?
    
    init(baseURL: String = Config.apiBaseURL) {
        self.baseURL = baseURL
        self.authToken = KeychainManager.shared.getToken()
    }
    
    // MARK: - Auth
    
    func login(email: String) async throws -> String {
        let response: LoginResponse = try await post("/api/auth/login", body: ["email": email])
        return response.message
    }
    
    func verifyLogin(email: String, code: String, rememberMe: Bool = false) async throws -> AuthResponse {
        struct VerifyLoginRequest: Codable {
            let email: String
            let code: String
            let rememberMe: Bool
        }
        let body = VerifyLoginRequest(email: email, code: code, rememberMe: rememberMe)
        let response: AuthResponse = try await post("/api/auth/verify-login", body: body)
        self.authToken = response.token
        KeychainManager.shared.saveToken(response.token)
        return response
    }
    
    func register(email: String, fullName: String) async throws -> String {
        struct RegisterRequest: Codable {
            let email: String
            let fullName: String
        }
        let body = RegisterRequest(email: email, fullName: fullName)
        let response: RegisterResponse = try await post("/api/auth/register", body: body)
        return response.message
    }
    
    func verifyRegistration(email: String, code: String) async throws -> AuthResponse {
        struct VerifyRegistrationRequest: Codable {
            let email: String
            let code: String
        }
        let body = VerifyRegistrationRequest(email: email, code: code)
        let response: AuthResponse = try await post("/api/auth/verify-registration", body: body)
        self.authToken = response.token
        KeychainManager.shared.saveToken(response.token)
        return response
    }
    
    func logout() async throws {
        struct EmptyResponse: Codable {}
        let _: EmptyResponse = try await post("/api/auth/logout", body: EmptyResponse())
        self.authToken = nil
        KeychainManager.shared.deleteToken()
    }
    
    func getCurrentUser() async throws -> User {
        let response: UserResponse = try await get("/api/auth/me")
        return response.user
    }
    
    // MARK: - Translations
    
    func getTranslations(search: String? = nil) async throws -> [TranslationEntry] {
        var path = "/api/translations"
        if let search = search, !search.isEmpty {
            path += "?search=\(search.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")"
        }
        // API returns array directly, not wrapped in object
        return try await get(path)
    }
    
    func createTranslation(_ translation: TranslationEntry) async throws -> TranslationEntry {
        try await post("/api/translations", body: translation)
    }
    
    func updateTranslation(_ translation: TranslationEntry) async throws -> TranslationEntry {
        try await put("/api/translations/\(translation.id)", body: translation)
    }
    
    func deleteTranslation(id: Int) async throws {
        struct EmptyResponse: Codable {}
        let _: EmptyResponse = try await delete("/api/translations/\(id)")
    }

    // MARK: - Translate

    func translate(text: String, sourceLanguage: String) async throws -> [String: TranslateResult] {
        struct TranslateRequest: Codable {
            let text: String
            let sourceLanguage: String
        }
        let body = TranslateRequest(text: text, sourceLanguage: sourceLanguage)
        let response: TranslateResponse = try await post("/api/translate", body: body)
        var results: [String: TranslateResult] = [:]
        if let v = response.english { results["english"] = v }
        if let v = response.german { results["german"] = v }
        if let v = response.french { results["french"] = v }
        if let v = response.italian { results["italian"] = v }
        if let v = response.spanish { results["spanish"] = v }
        return results
    }
    
    // MARK: - Generic HTTP Methods
    
    private func get<T: Decodable>(_ path: String) async throws -> T {
        try await request(path, method: "GET")
    }
    
    private func post<T: Decodable, B: Encodable>(_ path: String, body: B) async throws -> T {
        try await request(path, method: "POST", body: body)
    }
    
    private func put<T: Decodable, B: Encodable>(_ path: String, body: B) async throws -> T {
        try await request(path, method: "PUT", body: body)
    }
    
    private func delete<T: Decodable>(_ path: String) async throws -> T {
        try await request(path, method: "DELETE")
    }
    
    private func request<T: Decodable, B: Encodable>(_ path: String, method: String, body: B? = nil as String?) async throws -> T {
        guard let url = URL(string: baseURL + path) else {
            throw APIError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }
        
        do {
            print("🌐 [API] Request: \(method) \(url)")
            if let body = body {
                print("🌐 [API] Body: \(String(data: try JSONEncoder().encode(body), encoding: .utf8) ?? "nil")")
            }
            
            let (data, response) = try await URLSession.shared.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                print("❌ [API] Invalid response type")
                throw APIError.serverError("Invalid response")
            }
            
            print("🌐 [API] Response: \(httpResponse.statusCode)")
            
            if httpResponse.statusCode == 401 {
                self.authToken = nil
                KeychainManager.shared.deleteToken()
                throw APIError.unauthorized
            }
            
            guard httpResponse.statusCode >= 200 && httpResponse.statusCode < 300 else {
                if let errorResponse = try? JSONDecoder().decode(ErrorResponse.self, from: data) {
                    print("❌ [API] Server error: \(errorResponse.error)")
                    throw APIError.serverError(errorResponse.error)
                }
                print("❌ [API] HTTP error: \(httpResponse.statusCode)")
                throw APIError.serverError("HTTP \(httpResponse.statusCode)")
            }
            
            let decoder = JSONDecoder()
            do {
                return try decoder.decode(T.self, from: data)
            } catch let decodingError {
                let responseString = String(data: data, encoding: .utf8) ?? "<binary>"
                print("❌ [API] Decoding error: \(decodingError)")
                print("❌ [API] Response body: \(responseString.prefix(500))")
                throw APIError.decodingError
            }
        } catch let error as APIError {
            throw error
        } catch {
            print("❌ [API] Network error: \(error.localizedDescription)")
            throw APIError.networkError(error)
        }
    }
}

// MARK: - Response Models

struct LoginResponse: Codable {
    let success: Bool
    let message: String
    let codeExpiresIn: Int
}

struct RegisterResponse: Codable {
    let success: Bool
    let message: String
    let codeExpiresIn: Int
}

struct AuthResponse: Codable {
    let success: Bool?
    let message: String?
    let user: User
    let token: String
    let expiresAt: String?
}

struct UserResponse: Codable {
    let user: User
}

struct TranslationsResponse: Codable {
    let translations: [TranslationEntry]
}

struct ErrorResponse: Codable {
    let error: String
}

struct TranslateResult: Codable {
    let translation: String
    let alternatives: [String]
}

struct TranslateResponse: Codable {
    let provider: String?
    let english: TranslateResult?
    let german: TranslateResult?
    let french: TranslateResult?
    let italian: TranslateResult?
    let spanish: TranslateResult?
}
