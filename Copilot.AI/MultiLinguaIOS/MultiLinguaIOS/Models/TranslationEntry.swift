//
//  TranslationEntry.swift
//  MultiLinguaIOS
//
//  Created on 2026-02-13.
//

import Foundation

struct TranslationEntry: Codable, Identifiable {
    let id: Int
    let userId: Int?
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
    let createdAt: String
    let updatedAt: String

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

    // Backend sends proposals as JSON strings, not arrays
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(Int.self, forKey: .id)
        userId = try container.decodeIfPresent(Int.self, forKey: .userId)
        english = try container.decodeIfPresent(String.self, forKey: .english) ?? ""
        german = try container.decodeIfPresent(String.self, forKey: .german) ?? ""
        french = try container.decodeIfPresent(String.self, forKey: .french) ?? ""
        italian = try container.decodeIfPresent(String.self, forKey: .italian) ?? ""
        spanish = try container.decodeIfPresent(String.self, forKey: .spanish) ?? ""
        englishProposals = Self.decodeProposals(from: container, forKey: .englishProposals)
        germanProposals = Self.decodeProposals(from: container, forKey: .germanProposals)
        frenchProposals = Self.decodeProposals(from: container, forKey: .frenchProposals)
        italianProposals = Self.decodeProposals(from: container, forKey: .italianProposals)
        spanishProposals = Self.decodeProposals(from: container, forKey: .spanishProposals)
        createdAt = try container.decodeIfPresent(String.self, forKey: .createdAt) ?? ""
        updatedAt = try container.decodeIfPresent(String.self, forKey: .updatedAt) ?? ""
    }

    /// Decodes proposals that come as JSON-encoded strings (e.g. "[\"Hi\",\"Hey\"]")
    private static func decodeProposals(from container: KeyedDecodingContainer<CodingKeys>, forKey key: CodingKeys) -> [String] {
        // Try as actual array first
        if let array = try? container.decode([String].self, forKey: key) {
            return array
        }
        // Try as JSON string containing an array
        if let jsonString = try? container.decode(String.self, forKey: key),
           let data = jsonString.data(using: .utf8),
           let array = try? JSONDecoder().decode([String].self, from: data) {
            return array
        }
        return []
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
