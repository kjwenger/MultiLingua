# MultiLinguaIOS

iOS native implementation of MultiLingua - Multi-language translation app.

## Requirements

- **Xcode:** 15.0+
- **iOS Deployment Target:** 16.0+
- **Swift:** 5.9+
- **SwiftUI:** Required

## Architecture

- **UI Framework:** SwiftUI
- **Architecture Pattern:** MVVM with ObservableObject / @Observable
- **Networking:** URLSession
- **Local Database:** SwiftData (iOS 17+) or Core Data (iOS 16)
- **Async:** Swift Concurrency (async/await)
- **Dependency Injection:** Manual

## Project Structure

```
MultiLinguaIOS/
├── MultiLinguaIOS/
│   ├── Models/                 — Data models and entities
│   ├── API/                    — API client and networking
│   ├── Auth/                   — Authentication logic
│   ├── UI/                     — SwiftUI views and screens
│   │   ├── Landing/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Translations/
│   │   ├── Settings/
│   │   ├── Admin/
│   │   └── Help/
│   ├── Storage/                — Local database (SwiftData/CoreData)
│   ├── TTS/                    — Text-to-speech (AVSpeechSynthesizer)
│   ├── Theme/                  — Theme and styling
│   ├── Resources/              — Assets, localization
│   ├── MultiLinguaIOSApp.swift
│   └── Info.plist
├── MultiLinguaIOSTests/        — Unit tests
└── MultiLinguaIOSUITests/      — UI tests
```

## Setup

1. Open `MultiLinguaIOS.xcodeproj` in Xcode
2. Select your development team in project settings
3. Update the backend URL in environment configuration
4. Build and run on simulator or device

## Backend

This app requires the MultiLingua backend API to be running:

```bash
cd ../multi-lingua/
docker-compose up -d           # Start LibreTranslate
npm install && npm run dev     # Start backend on port 3456
```

## Configuration

Update `Config.swift` with your backend URL:

```swift
enum Config {
    static let apiBaseURL = "http://localhost:3456"
    static let isDevelopment = true
}
```

## Features

- ✅ Passwordless authentication (email + 6-digit OTP)
- ✅ Translation table with 5 languages (EN, DE, FR, IT, ES)
- ✅ Multiple translation providers (LibreTranslate, DeepL, Google, etc.)
- ✅ Up to 10 alternative translation proposals per language
- ✅ Text-to-speech for all languages (AVSpeechSynthesizer)
- ✅ Offline support with local caching
- ✅ Light/Dark theme support
- ✅ Admin user management
- ✅ Responsive UI (iPad and iPhone)

## Version

Current version: **0.4.1**

See [SPECIFICATIONS.md](../../SPECIFICATIONS.md) for complete feature requirements.

## License

See parent project license.
