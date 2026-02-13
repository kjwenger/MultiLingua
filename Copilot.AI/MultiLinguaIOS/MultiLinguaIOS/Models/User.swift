//
//  User.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import Foundation

struct User: Codable, Identifiable {
    let id: Int
    let email: String
    let fullName: String
    let role: UserRole
    let preferredLanguage: String?
    let isActive: Bool?
    let emailVerified: Bool?
    let createdAt: String?
    let updatedAt: String?
    let lastLogin: String?
}

enum UserRole: String, Codable {
    case admin
    case user
}
