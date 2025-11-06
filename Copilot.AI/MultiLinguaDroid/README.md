# MultiLinguaDroid

An Android application for multi-language translation using LibreTranslate, built with Kotlin.

## Overview

MultiLinguaDroid is a native Android app that replicates the functionality of the multi-lingua Next.js web application. It provides a clean interface for translating English text into French, Italian, and Spanish with multiple translation options.

## Features

✅ **Multi-Language Translation**
- Translate English text to French, Italian, and Spanish
- Integration with LibreTranslate API
- Up to 5 translation alternatives per language

✅ **Persistent Storage**
- Local SharedPreferences-based storage
- Auto-save on text changes
- Entries persist across app restarts

✅ **Modern UI/UX**
- Material Design 3 components
- RecyclerView with CardView items
- Dark/Light theme toggle
- Floating Action Button for adding entries

✅ **Interactive Features**
- Sortable by English column
- Editable text fields for all languages
- Clickable translation suggestions
- Delete functionality for entries

## Tech Stack

- **Language**: Kotlin
- **UI**: Material Components, RecyclerView, ViewBinding
- **Architecture**: MVVM with ViewModel and LiveData
- **Networking**: Retrofit 2, OkHttp
- **Storage**: SharedPreferences with Gson serialization
- **Async**: Kotlin Coroutines
- **Min SDK**: 26 (Android 8.0)
- **Target SDK**: 34 (Android 14)

## Project Structure

```
MultiLinguaDroid/
├── app/
│   ├── src/main/
│   │   ├── java/com/naturalstupidity/multilinguadroid/
│   │   │   ├── MainActivity.kt              # Main activity
│   │   │   ├── TranslationViewModel.kt      # ViewModel
│   │   │   ├── TranslationAdapter.kt        # RecyclerView adapter
│   │   │   ├── TranslationRepository.kt     # Data layer
│   │   │   └── TranslationEntry.kt          # Data model
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   │   ├── activity_main.xml        # Main layout
│   │   │   │   └── item_translation.xml     # Item layout
│   │   │   ├── values/
│   │   │   │   ├── strings.xml
│   │   │   │   ├── colors.xml
│   │   │   │   └── themes.xml
│   │   │   ├── values-night/
│   │   │   │   └── themes.xml               # Dark theme
│   │   │   └── menu/
│   │   │       └── main_menu.xml
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
├── build.gradle.kts
└── settings.gradle.kts
```

## Setup Instructions

### Prerequisites

- Android Studio Hedgehog (2023.1.1) or newer
- JDK 17
- Android SDK with API level 34
- LibreTranslate instance running (see below)

### LibreTranslate Setup

1. **Using Docker Compose** (from multi-lingua directory):
   ```bash
   cd ../Copilot.AI/multi-lingua
   docker-compose up -d
   ```

2. The Android app connects to LibreTranslate at:
   - **Emulator**: `http://10.0.2.2:5432`
   - **Physical Device**: Update the base URL in `TranslationRepository.kt` to your local network IP

### Building the App

1. **Clone and Open**:
   ```bash
   cd MultiLingua/MultiLinguaDroid
   # Open in Android Studio
   ```

2. **Sync Gradle**:
   - Android Studio will automatically sync Gradle
   - Or manually: `./gradlew build`

3. **Run the App**:
   - Select an emulator or physical device
   - Click Run (▶️) or use `Shift+F10`

### Configuration

To change the LibreTranslate server URL, edit `TranslationRepository.kt`:

```kotlin
private val api: LibreTranslateApi by lazy {
    Retrofit.Builder()
        .baseUrl("http://YOUR_IP:5432/")  // Change this
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(LibreTranslateApi::class.java)
}
```

## Usage

1. **Add New Translation**:
   - Tap the floating action button (➕)
   - A new empty entry appears

2. **Enter English Text**:
   - Type in the English field
   - Text auto-saves on change

3. **Translate**:
   - Tap "Translate" button for each language
   - View up to 5 translation options
   - Tap an option to select it

4. **Edit Translations**:
   - All fields are editable
   - Changes save automatically

5. **Delete Entry**:
   - Tap the "Delete" button on any entry

6. **Sort Entries**:
   - Tap the sort icon in toolbar
   - Entries sort alphabetically by English

7. **Toggle Theme**:
   - Tap the theme icon in toolbar
   - Switches between dark and light mode

## Key Components

### TranslationEntry (Data Model)
```kotlin
data class TranslationEntry(
    val id: Long,
    var english: String,
    var french: String,
    var italian: String,
    var spanish: String,
    var frenchOptions: List<String>,
    var italianOptions: List<String>,
    var spanishOptions: List<String>
)
```

### TranslationViewModel (Business Logic)
- Manages UI state with LiveData
- Coordinates between Repository and UI
- Handles translation requests
- Implements sorting functionality

### TranslationRepository (Data Layer)
- SharedPreferences persistence
- Retrofit API integration
- Coroutine-based async operations
- CRUD operations for translations

### TranslationAdapter (UI Rendering)
- RecyclerView adapter with DiffUtil
- ViewHolder pattern
- Real-time text change detection
- Dynamic translation options display

## API Integration

The app communicates with LibreTranslate using Retrofit:

```kotlin
interface LibreTranslateApi {
    @POST("translate")
    suspend fun translate(@Body request: TranslateRequest): TranslateResponse
}
```

**Request Format**:
```json
{
  "q": "Hello",
  "source": "en",
  "target": "fr",
  "format": "text",
  "alternatives": 4
}
```

**Response Format**:
```json
{
  "translatedText": "Bonjour",
  "alternatives": ["Salut", "Bonsoir", "Coucou"]
}
```

## Architecture

The app follows **MVVM (Model-View-ViewModel)** architecture:

```
┌─────────────┐
│  MainActivity │  ← View Layer
└──────┬──────┘
       │ observes
┌──────▼──────────┐
│ ViewModel       │  ← Presentation Layer
└──────┬──────────┘
       │ calls
┌──────▼──────────┐
│ Repository      │  ← Data Layer
└──────┬──────────┘
       │
   ┌───┴────┐
   │        │
   ▼        ▼
[SharedPref] [API]
```

## Comparison with Web App

| Feature | Web App (Next.js) | Android App |
|---------|------------------|-------------|
| Framework | Next.js + React | Native Android + Kotlin |
| UI | Tailwind CSS | Material Design 3 |
| Storage | SQLite | SharedPreferences |
| API Client | Axios | Retrofit |
| State Management | React Hooks | LiveData + ViewModel |
| Theme Toggle | localStorage | SharedPreferences |
| Languages | English, French, Italian, Spanish | Same |

## Troubleshooting

### Cannot Connect to LibreTranslate

**Emulator**:
- Use `10.0.2.2` instead of `localhost`
- Ensure LibreTranslate is running on port 5432

**Physical Device**:
- Update base URL to your computer's local IP
- Ensure device is on same network
- Check firewall settings

### Build Errors

```bash
# Clean and rebuild
./gradlew clean build

# Invalidate caches in Android Studio
File → Invalidate Caches → Invalidate and Restart
```

### Translation Failures

- Check LibreTranslate logs: `docker logs libretranslate`
- Verify network connectivity
- Ensure language models are downloaded

## Future Enhancements

- [ ] Room database for better persistence
- [ ] Offline translation caching
- [ ] Export/Import functionality
- [ ] Custom language pair selection
- [ ] Voice input for translations
- [ ] History and favorites
- [ ] Widget support
- [ ] Tablet optimization

## License

This project is part of the NaturalStupidity MultiLingua suite.

## Related Projects

- **multi-lingua** (Web): Next.js web application
- **MultiLinguaDroid** (Android): This project

## Author

Created as part of the NaturalStupidity project suite.
