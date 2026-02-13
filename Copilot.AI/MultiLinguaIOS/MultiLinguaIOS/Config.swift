//
//  Config.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import Foundation

enum Config {
    #if targetEnvironment(simulator)
    static let apiBaseURL = "http://localhost:3456"
    #else
    static let apiBaseURL = "http://10.251.65.190:3456" // Replace with your Mac's IP
    #endif
    static let isDevelopment = true
    static let appVersion = "0.4.1"

    static let testEmail: String? = env("TEST_EMAIL")

    /// Reads a value from .env.local bundled resource
    static func env(_ key: String) -> String? {
        #if !targetEnvironment(simulator)
        return nil
        #else
        guard let url = Bundle.main.url(forResource: ".env", withExtension: "local"),
              let contents = try? String(contentsOf: url, encoding: .utf8) else {
            return nil
        }
        for line in contents.components(separatedBy: .newlines) {
            let trimmed = line.trimmingCharacters(in: .whitespaces)
            guard !trimmed.isEmpty, !trimmed.hasPrefix("#") else { continue }
            let parts = trimmed.split(separator: "=", maxSplits: 1)
            if parts.count == 2, String(parts[0]).trimmingCharacters(in: .whitespaces) == key {
                return String(parts[1]).trimmingCharacters(in: .whitespaces).trimmingCharacters(in: CharacterSet(charactersIn: "\"'"))
            }
        }
        return nil
        #endif
    }
}
