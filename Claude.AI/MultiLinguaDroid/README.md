# Multi-Lingua Droid - Android Translation App

A modern Android application built with Kotlin that provides real-time translation services using LibreTranslate. The app features a list-based interface where users can manage translations between English, German, French, Italian, and Spanish with multiple translation proposals and text-to-speech capabilities.

## Features

- **Real-time Translation**: Automatic translation using LibreTranslate API
- **Multi-directional Translation**: Translate FROM any language TO all other languages
- **Multiple Language Support**: English, German, French, Italian, and Spanish
- **Translation Proposals**: Up to 10 translation alternatives for each language
- **Editable Results**: All translation fields are editable with auto-save
- **Text-to-Speech**: Native Android TTS for all supported languages
- **Persistent Storage**: Room database for storing translations and settings
- **Dark/Light Theme**: Automatic theme switching based on system settings
- **Settings**: Configurable LibreTranslate URL with presets
- **Modern UI**: Material Design 3 components

## Prerequisites

- Android Studio Hedgehog (2023.1.1) or later
- Kotlin 1.9.20+
- Minimum SDK: API 26 (Android 8.0)
- Target SDK: API 34 (Android 14)
- LibreTranslate server (local or remote)

## Installation

### Option 1: Build from Source

1. Clone the repository and navigate to the project:
   ```bash
   cd MultiLinguaDroid
   ```

2. Open the project in Android Studio

3. Sync Gradle files

4. Ensure you have a LibreTranslate server running:
   ```bash
   # Using Docker
   docker run -ti --rm -p 5432:5000 libretranslate/libretranslate
   ```

5. Build and run:
   - Connect an Android device or start an emulator
   - Click "Run" in Android Studio (or press Shift+F10)

### Option 2: Build APK

```bash
./gradlew assembleDebug
# APK will be in app/build/outputs/apk/debug/app-debug.apk
```

## Usage

1. **Add New Translation**: Tap the floating action button (+) to create a new translation entry
2. **Enter Text**: Type text in any language field
3. **Translate**: Tap the translate button (↻) next to any field to translate FROM that language TO all others
4. **Text-to-Speech**: Tap the speaker button to hear the text pronounced
5. **View Suggestions**: Translation alternatives are available (implementation can be expanded)
6. **Edit Translations**: Manually edit any field - changes are auto-saved
7. **Delete**: Tap the delete button to remove a translation
8. **Settings**: Tap the gear icon to configure LibreTranslate URL

## Architecture

### Tech Stack

- **Language**: Kotlin
- **UI**: Material Design 3, ViewBinding
- **Architecture**: MVVM (Model-View-ViewModel)
- **Database**: Room (SQLite wrapper)
- **Networking**: Retrofit + OkHttp
- **Async**: Kotlin Coroutines
- **DI**: Manual dependency injection via Application class

### Project Structure

```
app/src/main/java/com/multilingua/
├── MultiLinguaApplication.kt        # Application class with DI
├── data/
│   ├── database/
│   │   ├── AppDatabase.kt           # Room database
│   │   ├── TranslationDao.kt        # Translation data access
│   │   └── SettingDao.kt            # Settings data access
│   ├── model/
│   │   ├── Translation.kt           # Translation entity
│   │   ├── Setting.kt               # Setting entity
│   │   └── TranslationResult.kt     # API models
│   └── repository/
│       ├── TranslationRepository.kt # Translation data layer
│       └── SettingsRepository.kt    # Settings data layer
├── network/
│   ├── LibreTranslateApi.kt         # Retrofit API interface
│   ├── ApiClient.kt                 # Retrofit client builder
│   └── TranslationService.kt        # Translation business logic
└── ui/
    ├── main/
    │   ├── MainActivity.kt           # Main screen
    │   └── MainViewModel.kt          # Main screen ViewModel
    ├── settings/
    │   └── SettingsActivity.kt       # Settings screen
    └── adapters/
        └── TranslationAdapter.kt     # RecyclerView adapter
```

### Database Schema

```kotlin
// Translation table
@Entity(tableName = "translations")
data class Translation(
    @PrimaryKey(autoGenerate = true) val id: Long,
    val english: String,
    val german: String,
    val french: String,
    val italian: String,
    val spanish: String,
    val englishProposals: String,      // JSON array
    val germanProposals: String,       // JSON array
    val frenchProposals: String,       // JSON array
    val italianProposals: String,      // JSON array
    val spanishProposals: String,      // JSON array
    val createdAt: Long,
    val updatedAt: Long
)

// Settings table
@Entity(tableName = "settings")
data class Setting(
    @PrimaryKey val key: String,
    val value: String
)
```

## Configuration

### LibreTranslate URL

Configure via the Settings screen. Available presets:

- **Environment Default**: Uses default localhost (10.0.2.2:5432 for emulator)
- **Localhost:5432**: For Android emulator connecting to host machine
- **LibreTranslate.com**: Public LibreTranslate instance
- **Gertrun Synology**: Custom preset
- **Custom URL**: Enter your own URL

**Note**: Android emulator uses `10.0.2.2` to access the host machine's `localhost`.

### Network Configuration

The app requires internet permission and allows cleartext traffic for local development. For production, ensure HTTPS URLs are used or configure network security settings appropriately.

## Development

### Building

```bash
# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# Run tests
./gradlew test

# Run linting
./gradlew lint
```

### Key Dependencies

- **AndroidX Core**: 1.12.0
- **Material Design**: 1.11.0
- **Room**: 2.6.1
- **Retrofit**: 2.9.0
- **OkHttp**: 4.12.0
- **Coroutines**: 1.7.3
- **Lifecycle**: 2.7.0

## Adding New Languages

To add a new language (e.g., Portuguese):

1. **Database Model** (`data/model/Translation.kt`):
   ```kotlin
   val portuguese: String = "",
   val portugueseProposals: String = "[]"
   ```

2. **Translation Service** (`network/TranslationService.kt`):
   - Add Portuguese to `translateFromLanguage()` targets
   - Add `pt` language code handling

3. **UI Layout** (`res/layout/item_translation.xml`):
   - Add new `<include>` for Portuguese language field

4. **Adapter** (`ui/adapters/TranslationAdapter.kt`):
   - Add `portugueseField` to ViewHolder
   - Bind Portuguese field in `bind()` method

5. **MainActivity** (`ui/main/MainActivity.kt`):
   - Add Portuguese locale to TTS `speak()` method

6. **ViewModel** (`ui/main/MainViewModel.kt`):
   - Handle Portuguese in `translateFromLanguage()` switch

## Text-to-Speech

Uses Android's native TextToSpeech API:
- Languages: en-US, de-DE, fr-FR, it-IT, es-ES
- Automatically switches locale based on language
- No internet connection required (uses on-device voices)

## Troubleshooting

1. **Network Errors**:
   - For emulator: Use `http://10.0.2.2:5432` to access host's localhost
   - For device: Use actual IP address of your LibreTranslate server
   - Check LibreTranslate logs for errors

2. **Translation Failures**:
   - Verify LibreTranslate server is running
   - Check Settings screen for correct URL
   - Review Logcat for error messages (tag: `TranslationService`)

3. **Database Issues**:
   - Database is auto-created on first launch
   - Clear app data to reset database: Settings → Apps → Multi-Lingua → Clear Data

4. **TTS Not Working**:
   - Ensure TTS data is installed for your languages
   - Settings → System → Languages & input → Text-to-speech output

## License

This project is open source and available under the MIT License.

## Related Projects

- **Multi-Lingua Web** (Next.js): `../Copilot.AI/multi-lingua`
- This Android app shares the same LibreTranslate backend and data schema design

## Contributing

Contributions are welcome! Please ensure:
- Code follows Kotlin coding conventions
- Material Design guidelines are followed
- Database migrations are handled properly
- All features are tested on both emulator and physical devices
