//
//  User.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import Foundation

struct User: Codable, Identifiable {
    let id: String
    let email: String
    let fullName: String
    let role: UserRole
    let preferredLanguage: String?
    let isActive: Bool
    let emailVerified: Bool
    let createdAt: Date
    let updatedAt: Date
    let lastLogin: Date?
    
    enum CodingKeys: String, CodingKey {
        case id
        case email
        case fullName = "full_name"
        case role
        case preferredLanguage = "preferred_language"
        case isActive = "is_active"
        case emailVerified = "email_verified"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case lastLogin = "last_login"
    }
}

enum UserRole: String, Codable {
    case admin
    case user
}
