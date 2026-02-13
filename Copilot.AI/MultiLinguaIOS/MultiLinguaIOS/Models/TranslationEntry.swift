//
//  TranslationEntry.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import Foundation

struct TranslationEntry: Codable, Identifiable {
    let id: Int
    let userId: String?
    var english: String
    var german: String
    var french: String
    var italian: String
    var spanish: String
    var englishProposals: [String]
    var germanProposals: [String]
    var frenchProposals: [String]
    var italianProposals: [String]
    var spanishProposals: [String]
    let createdAt: Date
    let updatedAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case english, german, french, italian, spanish
        case englishProposals = "english_proposals"
        case germanProposals = "german_proposals"
        case frenchProposals = "french_proposals"
        case italianProposals = "italian_proposals"
        case spanishProposals = "spanish_proposals"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

struct Language {
    let code: String
    let name: String
    let locale: String
    let flag: String
    
    static let supported: [Language] = [
        Language(code: "en", name: "English", locale: "en-US", flag: "🇬🇧"),
        Language(code: "de", name: "German", locale: "de-DE", flag: "🇩🇪"),
        Language(code: "fr", name: "French", locale: "fr-FR", flag: "🇫🇷"),
        Language(code: "it", name: "Italian", locale: "it-IT", flag: "🇮🇹"),
        Language(code: "es", name: "Spanish", locale: "es-ES", flag: "🇪🇸")
    ]
}
