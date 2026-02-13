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
}
