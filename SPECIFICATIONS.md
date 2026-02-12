# MultiLingua - Cross-Platform Specifications

> **Version:** 0.4.1
> **Last Updated:** 2026-02-12
> **Purpose:** Common specification for building MultiLingua across all platform trials

## 1. Overview

MultiLingua is a multi-language translation app that helps users translate words and
phrases between English, German, French, Italian, and Spanish. It stores translations
in a persistent table, supports multiple translation providers, and offers
text-to-speech playback.

This specification defines the **shared requirements** that every platform
implementation must satisfy so that any two implementations are functionally
equivalent and can share the same backend API.

### 1.1 Platform Trials

| Trial               | Technology                          | Directory Convention         |
|---------------------|-------------------------------------|------------------------------|
| Next.js PWA         | Next.js 15, React 18, TypeScript    | `multi-lingua/`              |
| Android Native      | Kotlin, Jetpack Compose / XML       | `MultiLinguaDroid/`          |
| iOS Native          | Swift, SwiftUI                      | `MultiLinguaIOS/`            |
| Flutter             | Dart, Flutter SDK                   | `MultiLinguaFlutter/`        |
| React Native        | TypeScript, React Native            | `MultiLinguaReactNative/`    |
| KMM                 | Kotlin Multiplatform Mobile         | `MultiLinguaKMM/`            |

Each trial lives under one of the AI assistant directories (`Copilot.AI/`,
`Claude.AI/`, `Gemini.AI/`) and must conform to these specifications.

---

## 2. Supported Languages

All implementations must support exactly these five languages:

| Code  | Language | Locale (TTS) | Flag  |
|-------|----------|---------------|-------|
| `en`  | English  | `en-US`       | 🇬🇧   |
| `de`  | German   | `de-DE`       | 🇩🇪   |
| `fr`  | French   | `fr-FR`       | 🇫🇷   |
| `it`  | Italian  | `it-IT`       | 🇮🇹   |
| `es`  | Spanish  | `es-ES`       | 🇪🇸   |

**Rules:**
- Translation is **bidirectional**: the user may type in *any* language column and
  translate to *all* other languages.
- Up to **10 alternative translations** (proposals) per target language.
- The source language is auto-detected from which column the user typed in.

---

## 3. Screens & Navigation

Every implementation must provide the following screens. Visual styling may adapt to
platform conventions (Material Design on Android, Human Interface Guidelines on iOS,
etc.) but the information architecture must match.

All screens must be **responsive**: usable on both desktop/tablet (≥ 768px) and
mobile (< 768px) viewports. See section 3.5.1 for the detailed responsive layout
of the translations screen. Other screens (Settings, Admin Users) should stack
their content vertically on narrow screens.

### 3.1 Screen Map

```
┌─────────────┐
│  Landing     │──── unauthenticated entry point
└──────┬──────┘
       │
  ┌────▼────┐     ┌──────────┐
  │  Login   │◄───►│ Register │
  └────┬────┘     └──────────┘
       │
  ┌────▼──────────────────────────────────┐
  │  Translations (Main Screen)           │
  │  ┌──────────────────────────────────┐ │
  │  │  Table of translation entries    │ │
  │  │  [+ Add]  [Search]  [Sort]      │ │
  │  └──────────────────────────────────┘ │
  └──┬────────┬──────────┬───────────────┘
     │        │          │
┌────▼──┐ ┌──▼───┐ ┌────▼──────┐
│Settings│ │ Help │ │Admin Users│ (admin only)
└───────┘ └──────┘ └───────────┘
```

### 3.2 Landing Page

- App name, tagline, and brief feature description.
- Links/buttons to **Login** and **Register**.
- Visible without authentication.

### 3.3 Login

- Single field: **email address**.
- Submit sends a **6-digit one-time code** to the email.
- Second step: enter the code.
- Optional **"Remember Me"** checkbox (extends session to 30 days).
- Link to Register.
- Passwordless authentication only (no passwords).

### 3.4 Register

- Fields: **Full Name**, **Email Address**.
- Submit sends a 6-digit verification code to the email.
- Second step: enter the code to confirm registration.
- The **first registered user** automatically becomes admin.
- Link to Login.

### 3.5 Translations (Main Screen)

This is the core screen of the app.

#### 3.5.1 Responsive Layout

Implementations must adapt the translations screen to the available screen width.

**Desktop / Wide Screen (≥ 768px) — Table Layout**

| Column    | Editable | Notes                                    |
|-----------|----------|------------------------------------------|
| `#`       | No       | Row number                               |
| English   | Yes      | Inline text editing                      |
| German    | Yes      | Inline text editing                      |
| French    | Yes      | Inline text editing                      |
| Italian   | Yes      | Inline text editing                      |
| Spanish   | Yes      | Inline text editing                      |
| Actions   | —        | Translate, TTS, Delete                   |

- Each row is a **translation entry**.
- Editing any cell and triggering translate fills the other four language columns.
- Columns are **sortable** by clicking the header.

**Mobile / Narrow Screen (< 768px) — List + Detail Layout**

On narrow screens the full table does not fit. Instead, use a two-level layout:

**List View** — shows all translation entries as cards/rows. Each card displays
every non-empty language with its flag to the left:

```
┌──────────────────────────────────┐
│  🇬🇧 hello                        │
│  🇩🇪 hallo                        │
│  🇫🇷 bonjour                      │
│  🇮🇹 ciao                         │
│  🇪🇸 hola                         │
│                   [🔄] [🔊] [🗑] │
└──────────────────────────────────┘
```

- Each language line shows: **flag emoji** + **translation text**.
- Empty languages are omitted from the card.
- Action buttons (Translate, TTS, Delete) appear at the bottom of each card.
- The list is scrollable, searchable, and sortable.

**Detail View** — tapping a card opens a full-screen detail/edit view:

- Each language is displayed as a labeled, editable field with its flag.
- Translation proposals are accessible per language (dropdown, bottom sheet, or
  expandable list).
- Translate, TTS, and Delete actions are available.
- Changes auto-save; a back gesture/button returns to the list.

**Breakpoint Reference:**

| Breakpoint | Layout           | Notes                              |
|------------|------------------|------------------------------------|
| < 768px    | List + Detail    | Cards with flags, tap to edit      |
| ≥ 768px    | Full table       | Inline editing, all columns visible|

#### 3.5.2 Translation Proposals

When a translation is performed, each target language column receives up to 10
alternative proposals. The UI must:

- Display the **primary translation** in the cell.
- Provide a way to view alternatives (dropdown, expandable list, popover, or similar).
- Allow the user to **select an alternative** to replace the primary translation.
- Persist the selected value.

#### 3.5.3 Actions Per Row

| Action     | Icon/Label        | Behavior                                        |
|------------|-------------------|-------------------------------------------------|
| Translate  | 🔄 / "Translate"  | Detect source column, translate to other four    |
| TTS        | 🔊 / Speaker icon | Read aloud the text in the correct language/locale|
| Delete     | 🗑 / Trash icon    | Remove the entry (with confirmation)             |

#### 3.5.4 Toolbar / FAB

- **Add Entry**: Creates a new empty row (FAB on mobile, button on web).
- **Search**: Filter entries by text across all language columns.
- **Share/Unshare** (optional per-user feature): Toggle whether an entry is
  private or shared with all users.

#### 3.5.5 Auto-Save

Changes to any cell must be automatically persisted. No explicit "Save" button.

### 3.6 Settings

| Setting                  | Type              | Default               |
|--------------------------|-------------------|-----------------------|
| Translation Provider     | Radio / Picker    | LibreTranslate        |
| Provider API URL         | Text field        | `http://localhost:5000`|
| Provider API Key         | Text field (masked)| (empty)              |
| Theme                    | Toggle            | System default        |
| Session Timeout (admin)  | Number (minutes)  | 60                    |
| Code Expiry (admin)      | Number (minutes)  | 10                    |

- Settings are persisted server-side (in system_config table) for admin-level
  settings, and client-side for user preferences like theme.
- Provider presets: selecting a known provider auto-fills the URL.

### 3.7 Admin — User Management

Accessible only to users with `role = admin`.

| Feature               | Description                                          |
|-----------------------|------------------------------------------------------|
| User list             | Searchable, sortable table of all users              |
| Create user           | Admin can create new users (sends verification email)|
| Edit user             | Change name, email, role, active status              |
| Deactivate user       | Soft-delete (set `is_active = false`)                |
| Activity log          | Filterable audit trail of user actions               |
| Self-protection       | Admin cannot deactivate/demote themselves            |

### 3.8 Help

- Public page (no auth required).
- Brief usage instructions, supported languages, keyboard shortcuts (if any).

### 3.9 API Documentation

- Public page (no auth required).
- Interactive API reference (Swagger UI on web, a simple list view on mobile).

---

## 4. Data Model

### 4.1 Translation Entry

```
TranslationEntry {
  id:                 Integer     — primary key, auto-increment
  user_id:            String?     — owner (null = shared with everyone)
  english:            String
  german:             String
  french:             String
  italian:            String
  spanish:            String
  english_proposals:  String[]    — up to 10 alternatives (JSON array)
  german_proposals:   String[]
  french_proposals:   String[]
  italian_proposals:  String[]
  spanish_proposals:  String[]
  created_at:         DateTime
  updated_at:         DateTime
}
```

### 4.2 User

```
User {
  id:                 String      — UUID
  email:              String      — unique
  full_name:          String
  role:               Enum        — "admin" | "user"
  preferred_language: String?     — language code (en, de, fr, it, es)
  is_active:          Boolean     — default true
  email_verified:     Boolean     — default false
  created_at:         DateTime
  updated_at:         DateTime
  last_login:         DateTime?
}
```

### 4.3 Session

```
Session {
  id:                 String      — UUID
  user_id:            String      — FK → User.id
  token:              String      — JWT, unique
  device_info:        String?
  ip_address:         String?
  expires_at:         DateTime
  last_activity:      DateTime
  created_at:         DateTime
}
```

### 4.4 Auth Code

```
AuthCode {
  id:                 String      — UUID
  email:              String
  code:               String      — 6-digit numeric
  code_type:          Enum        — "registration" | "login"
  attempts:           Integer     — default 0
  max_attempts:       Integer     — default 3
  expires_at:         DateTime    — default: created_at + 10 min
  used:               Boolean     — default false
  created_at:         DateTime
}
```

### 4.5 System Config

```
SystemConfig {
  id:                 Integer     — primary key
  config_key:         String      — unique
  config_value:       String
  description:        String?
  updated_by:         String?     — FK → User.id
  updated_at:         DateTime
}
```

### 4.6 Activity Log

```
ActivityLog {
  id:                 Integer     — primary key, auto-increment
  user_id:            String?     — FK → User.id
  action:             String      — e.g., "user.login", "translation.create"
  details:            String?     — JSON with extra context
  ip_address:         String?
  created_at:         DateTime
}
```

---

## 5. API Contract

All client apps communicate with the same backend API. The canonical implementation
is the Next.js app (`multi-lingua/`), but any conforming backend may be used.

**Base URL:** Configurable, default `http://localhost:3456`

### 5.1 Authentication Endpoints

| Method | Path                      | Auth | Description                    |
|--------|---------------------------|------|--------------------------------|
| POST   | `/api/auth/register`      | No   | Start registration             |
| POST   | `/api/auth/verify`        | No   | Verify OTP code                |
| POST   | `/api/auth/login`         | No   | Request login code             |
| POST   | `/api/auth/login/verify`  | No   | Verify login code              |
| POST   | `/api/auth/logout`        | Yes  | End session                    |
| GET    | `/api/auth/me`            | Yes  | Get current user               |
| POST   | `/api/auth/refresh`       | Yes  | Refresh JWT token              |

#### POST `/api/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "fullName": "Jane Doe"
}
```

**Response (201):**
```json
{
  "message": "Verification code sent to user@example.com",
  "email": "user@example.com"
}
```

#### POST `/api/auth/verify`

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response (200):**
```json
{
  "message": "Registration successful",
  "user": { "id": "...", "email": "...", "fullName": "...", "role": "admin" },
  "token": "jwt-token-string"
}
```

#### POST `/api/auth/login`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Login code sent to user@example.com",
  "email": "user@example.com"
}
```

#### POST `/api/auth/login/verify`

**Request:**
```json
{
  "email": "user@example.com",
  "code": "654321",
  "rememberMe": true
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": { "id": "...", "email": "...", "fullName": "...", "role": "user" },
  "token": "jwt-token-string"
}
```

#### GET `/api/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Jane Doe",
    "role": "user",
    "preferredLanguage": "en",
    "isActive": true,
    "emailVerified": true,
    "lastLogin": "2026-02-07T10:00:00Z"
  }
}
```

### 5.2 Translation Endpoints

| Method | Path                          | Auth | Description                    |
|--------|-------------------------------|------|--------------------------------|
| GET    | `/api/translations`           | Yes  | List user's translations       |
| POST   | `/api/translations`           | Yes  | Create a translation entry     |
| PUT    | `/api/translations/:id`       | Yes  | Update an entry                |
| DELETE | `/api/translations/:id`       | Yes  | Delete an entry                |
| POST   | `/api/translations/:id/share` | Yes  | Share/unshare an entry         |

#### GET `/api/translations`

**Query params:** `?search=hello&sort=english&order=asc`

**Response (200):**
```json
{
  "translations": [
    {
      "id": 1,
      "user_id": "uuid-or-null",
      "english": "hello",
      "german": "hallo",
      "french": "bonjour",
      "italian": "ciao",
      "spanish": "hola",
      "english_proposals": [],
      "german_proposals": ["hallo", "guten tag"],
      "french_proposals": ["bonjour", "salut"],
      "italian_proposals": ["ciao", "salve"],
      "spanish_proposals": ["hola", "buenos días"],
      "created_at": "2026-02-07T10:00:00Z",
      "updated_at": "2026-02-07T10:00:00Z"
    }
  ]
}
```

#### POST `/api/translations`

**Request:**
```json
{
  "english": "hello",
  "german": "",
  "french": "",
  "italian": "",
  "spanish": ""
}
```

**Response (201):**
```json
{
  "id": 1,
  "english": "hello",
  "german": "",
  "french": "",
  "italian": "",
  "spanish": "",
  "created_at": "2026-02-07T10:00:00Z",
  "updated_at": "2026-02-07T10:00:00Z"
}
```

#### PUT `/api/translations/:id`

**Request:**
```json
{
  "german": "hallo",
  "german_proposals": ["hallo", "guten tag"]
}
```

**Response (200):**
```json
{
  "message": "Translation updated",
  "translation": { ... }
}
```

### 5.3 Translate Endpoint

| Method | Path              | Auth | Description                       |
|--------|-------------------|------|-----------------------------------|
| POST   | `/api/translate`  | Yes  | Translate text to target language |

#### POST `/api/translate`

**Request:**
```json
{
  "text": "hello",
  "sourceLanguage": "en",
  "targetLanguage": "de"
}
```

**Response (200):**
```json
{
  "translation": "hallo",
  "alternatives": ["hallo", "guten tag", "grüß gott"],
  "provider": "libretranslate"
}
```

### 5.4 Provider Endpoints

| Method | Path              | Auth | Description                       |
|--------|-------------------|------|-----------------------------------|
| GET    | `/api/providers`  | Yes  | List available translation providers |

**Response (200):**
```json
{
  "providers": [
    {
      "id": "libretranslate",
      "name": "LibreTranslate",
      "requiresApiKey": false,
      "defaultUrl": "http://localhost:5000"
    },
    {
      "id": "deepl",
      "name": "DeepL",
      "requiresApiKey": true,
      "defaultUrl": "https://api-free.deepl.com/v2"
    }
  ],
  "activeProvider": "libretranslate"
}
```

### 5.5 Admin Endpoints

| Method | Path                          | Auth  | Description                    |
|--------|-------------------------------|-------|--------------------------------|
| GET    | `/api/admin/users`            | Admin | List all users                 |
| POST   | `/api/admin/users`            | Admin | Create a user                  |
| PUT    | `/api/admin/users/:id`        | Admin | Update a user                  |
| DELETE | `/api/admin/users/:id`        | Admin | Deactivate a user              |
| GET    | `/api/admin/activity-log`     | Admin | Get activity log entries       |
| GET    | `/api/admin/config`           | Admin | Get system configuration       |
| PUT    | `/api/admin/config`           | Admin | Update system configuration    |
| POST   | `/api/admin/init`             | No    | Initialize first admin         |

### 5.6 Authentication Mechanism

- **Token type:** JWT (JSON Web Token).
- **Transport:**
  - Web: HTTP-only cookie named `auth_token` + `Authorization` header.
  - Mobile: `Authorization: Bearer <token>` header.
- **Token lifetime:** 1 hour (default), 30 days with "Remember Me".
- **Refresh:** POST to `/api/auth/refresh` before expiry.

### 5.7 Error Responses

All errors follow this format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

| HTTP Status | Code                  | Meaning                        |
|-------------|-----------------------|--------------------------------|
| 400         | `INVALID_INPUT`       | Missing or malformed field     |
| 401         | `UNAUTHORIZED`        | No valid token                 |
| 403         | `FORBIDDEN`           | Insufficient role              |
| 404         | `NOT_FOUND`           | Resource does not exist        |
| 409         | `CONFLICT`            | Duplicate resource             |
| 429         | `RATE_LIMITED`        | Too many requests              |
| 500         | `INTERNAL_ERROR`      | Server error                   |

---

## 6. Translation Providers

The app supports a pluggable provider architecture. All implementations must support
switching providers at runtime via the Settings screen.

### 6.1 Provider Interface

Every translation provider must implement:

```
TranslationProvider {
  id:          String              — unique identifier
  name:        String              — display name

  translate(
    text:           String,
    sourceLanguage: String,        — ISO 639-1 code
    targetLanguage: String         — ISO 639-1 code
  ) → String                      — primary translation

  translateWithAlternatives(
    text:           String,
    sourceLanguage: String,
    targetLanguage: String
  ) → { translation: String, alternatives: String[] }

  isAvailable() → Boolean         — health check
}

### 6.2 Supported Providers

#### 6.2.1 Translation Providers (active)

| Provider         | ID                 | API Key Required | Default URL                          | Type        |
|------------------|--------------------|------------------|--------------------------------------|-------------|
| LibreTranslate   | `libretranslate`   | No               | `http://localhost:5000`              | Translation |
| DeepL            | `deepl`            | Yes              | `https://api-free.deepl.com/v2`     | Translation |
| Google Translate | `google`           | Yes              | Google Cloud Translation API         | Translation |
| Azure Translator | `azure`            | Yes              | Azure Cognitive Services             | Translation |
| MyMemory         | `mymemory`         | No               | `https://api.mymemory.translated.net`| Translation |
| PONS             | `pons`             | No               | `https://api.pons.com`              | Dictionary  |
| Tatoeba          | `tatoeba`          | No               | `https://api.tatoeba.org`           | Examples    |

#### 6.2.2 Dictionary Providers (inactive — commented out)

The following providers were explored but are **not suitable as translation
providers**. They are monolingual dictionaries (definitions only) or have
restrictive licensing. Their code remains in the codebase, commented out, for
potential future use (e.g., a dedicated "dictionary mode").

| Provider         | ID                 | Reason Inactive                                         |
|------------------|--------------------|----------------------------------------------------------|
| Free Dictionary  | `free-dictionary`  | English-only monolingual dictionary — no translation     |
| Merriam-Webster  | `merriam-webster`  | English-only monolingual dictionary — no translation     |
| Oxford           | `oxford`           | English-centric dictionary; expensive API, limited pairs |

- **Default provider:** LibreTranslate (self-hosted, no API key needed).
- Only **one** provider is active at a time.
- Provider selection is a **system-wide** setting (applies to all users).

### 6.3 Provider Language Coverage

Each active provider supports a different set of languages. The table below
summarizes coverage for reference.

| Provider         | Language Count | Notes                                                    |
|------------------|---------------|----------------------------------------------------------|
| LibreTranslate   | ~50           | Self-hosted; exact count depends on model version        |
| MyMemory         | ~120          | Largest coverage; free tier has daily limits              |
| DeepL            | 33            | High quality; 33 core languages (some with variants)     |
| Google Translate | 150+          | Broadest coverage; requires API key                      |
| Azure Translator | 130+          | Broad coverage; requires API key                         |
| PONS             | 9             | Dictionary pairs: DE, EN, FR, ES, IT, PL, PT, RU, ZH    |
| Tatoeba          | 400+          | Example sentences; no API restriction on languages        |

> **Note — PONS** has a genuinely restricted language set (9 languages).
>
> **Note — Tatoeba** has no API-side language restriction — its database contains
> sentences in 400+ languages and the API accepts any ISO 639-3 code. The current
> v0.4.1 implementation maps 5 languages (EN, DE, FR, IT, ES) in its `LANG_MAP`.

---

## 7. Text-to-Speech

All implementations must support text-to-speech for all five languages.

| Platform        | TTS Engine                                  |
|-----------------|---------------------------------------------|
| Web (PWA)       | Web Speech API (`speechSynthesis`)          |
| Android         | Android `TextToSpeech` API                  |
| iOS             | `AVSpeechSynthesizer`                       |
| Flutter         | `flutter_tts` package                       |
| React Native    | `react-native-tts` package                  |
| KMM             | Platform-specific (Android TTS / iOS AVSpeech) |

**Behavior:**
- Tap the speaker icon on a row.
- The app speaks the text in each non-empty language column, one after another,
  using the correct locale for each.
- If only one column has text, speak only that column.
- The user can tap again to stop playback.

---

## 8. Theming

All implementations must support **light** and **dark** themes.

| Property              | Light Theme     | Dark Theme      |
|-----------------------|-----------------|-----------------|
| Background            | White / #FFFFFF | Dark / #1A1A2E  |
| Surface               | Gray / #F5F5F5  | Dark / #16213E  |
| Primary color         | Blue / #3B82F6  | Blue / #60A5FA  |
| Text primary          | Black / #111827 | White / #F9FAFB |
| Text secondary        | Gray / #6B7280  | Gray / #9CA3AF  |
| Border                | Gray / #E5E7EB  | Gray / #374151  |
| Error                 | Red / #EF4444   | Red / #F87171   |
| Success               | Green / #10B981 | Green / #34D399 |

- Theme preference is stored **locally** on the device.
- Default: follow system preference.
- Toggle via a button in the app header/toolbar.

---

## 9. Offline Behavior

| Feature                     | Offline Support                             |
|-----------------------------|---------------------------------------------|
| View existing translations  | Yes — read from local cache/DB              |
| Edit translations           | Yes — save locally, sync when online        |
| Translate (call provider)   | No — requires network                       |
| TTS                         | Depends on platform (usually yes)           |
| Login / Register            | No — requires network                       |
| Settings                    | View: yes, Change: queued until online      |

Mobile implementations should use a local database (Room on Android, Core Data on
iOS, SQLite via packages on Flutter/RN/KMM) to cache translations for offline access.

---

## 10. Platform-Specific Guidelines

### 10.1 Next.js PWA

- Must be installable as a Progressive Web App (service worker + manifest).
- Responsive: works on mobile and desktop browsers.
- SSR for landing, login, register pages (SEO + fast first paint).
- Client-side rendering for authenticated pages.
- API routes serve as the canonical backend for all clients.

### 10.2 Android Native

- **Min SDK:** 26 (Android 8.0 Oreo)
- **Target SDK:** 34 (Android 14)
- **UI toolkit:** Jetpack Compose (preferred) or XML Views
- **Architecture:** MVVM with ViewModel + StateFlow/LiveData
- **DI:** Hilt or manual
- **Networking:** Retrofit 2 + OkHttp
- **Local DB:** Room
- **Async:** Kotlin Coroutines + Flow

### 10.3 iOS Native

- **Min deployment target:** iOS 16
- **UI toolkit:** SwiftUI
- **Architecture:** MVVM with ObservableObject / @Observable
- **Networking:** URLSession or Alamofire
- **Local DB:** SwiftData or Core Data
- **Async:** Swift Concurrency (async/await)

### 10.4 Flutter

- **Min Flutter version:** 3.19+
- **Architecture:** BLoC or Riverpod for state management
- **Networking:** `http` or `dio` package
- **Local DB:** `sqflite` or `drift`
- **Platforms:** Android + iOS (web optional)

### 10.5 React Native

- **Min RN version:** 0.76+
- **Architecture:** Functional components + hooks
- **State management:** Zustand or Redux Toolkit
- **Networking:** Axios
- **Navigation:** React Navigation
- **Local DB:** `@react-native-async-storage/async-storage` or `expo-sqlite`

### 10.6 Kotlin Multiplatform Mobile (KMM)

- Shared business logic in `shared` module (Kotlin)
- Platform-specific UI: Jetpack Compose (Android) + SwiftUI (iOS)
- **Networking:** Ktor client
- **Local DB:** SQLDelight
- **Serialization:** kotlinx.serialization
- **DI:** Koin

---

## 11. Development Environment

### 11.1 Backend (shared by all clients)

```bash
# Start the Next.js backend + LibreTranslate
cd multi-lingua/
docker-compose up -d        # LibreTranslate on port 5000
npm install && npm run dev   # Next.js on port 3456
```

### 11.2 Environment Variables

```env
# Required
JWT_SECRET=your-secret-key-min-32-chars

# Email (DEV_MODE=true bypasses real email)
DEV_MODE=true
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
EMAIL_FROM=noreply@multilingua.app

# Translation
LIBRETRANSLATE_URL=http://localhost:5000
DEEPL_API_KEY=
GOOGLE_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3456
```

### 11.3 DEV_MODE

When `DEV_MODE=true`:
- OTP codes are logged to the console instead of sent via email.
- Email verification is relaxed.
- Useful for local development and testing of all client apps.

---

## 12. Testing Requirements

Every implementation must include:

| Test Type        | Scope                                              |
|------------------|----------------------------------------------------|
| Unit tests       | Data models, repositories, view models, utilities  |
| Widget / UI tests| Key screens render correctly, user interactions    |
| Integration tests| API communication, auth flow end-to-end            |

Recommended test frameworks per platform:

| Platform        | Framework                                     |
|-----------------|-----------------------------------------------|
| Next.js         | Jest + React Testing Library + Playwright     |
| Android         | JUnit 5 + Espresso + MockK                   |
| iOS             | XCTest + Swift Testing                        |
| Flutter         | flutter_test + integration_test               |
| React Native    | Jest + React Native Testing Library + Detox   |
| KMM             | kotlin.test (shared) + platform-specific      |

---

## 13. Non-Functional Requirements

| Requirement       | Target                                            |
|-------------------|---------------------------------------------------|
| First paint       | < 2s on 4G network                                |
| Translation API   | < 3s response time (depends on provider)           |
| Offline access    | Cached translations available immediately          |
| Accessibility     | WCAG 2.1 AA (web), platform a11y guidelines        |
| Localization      | UI labels in English (i18n-ready structure)         |
| Min screen size   | 320px width (mobile), responsive up to 1920px      |
| Data sync         | Eventual consistency when coming back online        |

---

## 14. Versioning & Releases

- All implementations share the same **major.minor** version to indicate feature
  parity. The patch version is platform-specific.
- Current target: **v0.4.1** — Tatoeba example sentence provider (see Section 16.1).
- Next planned: **v0.5.0** — configurable languages (see [`ROADMAP-v0.5.0.md`](ROADMAP-v0.5.0.md)).
- Version displayed in Settings screen footer.
- A minor version bump (e.g., 0.4 → 0.5) indicates **new features** and may
  include breaking changes to the schema or API contract. Migration steps are
  documented in the roadmap section for each version.

---

## 15. Security Considerations

| Concern                    | Mitigation                                      |
|----------------------------|-------------------------------------------------|
| Token storage (mobile)     | Platform secure storage (Keystore / Keychain)   |
| Token storage (web)        | HTTP-only cookies                               |
| API key storage            | Never in client code; server-side only          |
| Input validation           | Sanitize on client and server                   |
| Rate limiting              | Max 3 OTP attempts, configurable cooldown       |
| HTTPS                      | Required in production                          |
| SQL injection              | Parameterized queries only                      |
| XSS                        | Framework-provided escaping (React, SwiftUI, etc.)|

---

## 16. Roadmap

| Version | Theme                  | Status      | Summary                                     |
|---------|------------------------|-------------|---------------------------------------------|
| 0.4.0   | Fixed Five             | Released    | Five hardcoded languages, full feature parity, PWA, responsive UI |
| 0.4.1   | Tatoeba Examples       | **Current** | Tatoeba as translation provider — human-curated example sentences as proposals |
| 0.5.0   | Configurable Languages | Planned     | See [`ROADMAP-v0.5.0.md`](ROADMAP-v0.5.0.md) |
| 0.6.0   | *(TBD)*                | Future      | —                                           |

### 16.1 v0.4.1 — Tatoeba Example Sentences

**Goal:** Add [Tatoeba](https://tatoeba.org) as a translation provider. Tatoeba is a
free, community-curated database of sentences and their translations across 400+
languages. Unlike machine-translation providers, Tatoeba returns **human-written
example sentences** showing real-world usage.

**API:** `https://api.tatoeba.org` (read-only, no authentication, CC-licensed data).
See [OpenAPI spec](https://api.tatoeba.org/openapi-unstable.json).

**Language code mapping:** Tatoeba uses ISO 639-3 (3-letter codes). The provider must
map MultiLingua's ISO 639-1 codes:

| MultiLingua | Tatoeba |
|-------------|---------|
| `en`        | `eng`   |
| `de`        | `deu`   |
| `fr`        | `fra`   |
| `it`        | `ita`   |
| `es`        | `spa`   |

**Translation strategy:**

When the user translates a source text (e.g., "house" in English), the Tatoeba
provider:

1. **Primary translation:** Search for short sentences (`word_count=-3`,
   `sort=words`) in the source language containing the text, requiring translations
   in all target languages (`trans:1:lang=deu&trans:2:lang=fra&...`). Extract the
   target-language text from the **shortest matching sentence** as the primary
   translation for each language.

2. **Alternative proposals:** Search for longer sentences (`word_count=-10`,
   `sort=relevance`, `limit=10`) containing the source text. Return the
   target-language sentence translations as proposals. This gives the user
   **contextual example sentences** rather than just synonym lists.

**Example flow:**

User types "house" in the English column and clicks Translate.

The provider searches Tatoeba: `GET /unstable/sentences?lang=eng&q=house&word_count=-3&sort=words&limit=1&showtrans:lang=deu,fra,ita,spa`

Shortest match: *"A house!"* → translations: *"Ein Haus!"*, *"Maison !"*, *"Una casa!"*, *"¡Una casa!"*

Primary translations extracted: `Haus`, `Maison`, `casa`, `casa`

Then a second query for examples: `GET /unstable/sentences?lang=eng&q=house&word_count=-10&sort=relevance&limit=10&showtrans:lang=deu,fra,ita,spa`

Proposals populated with sentence pairs:
- EN: "The house collapsed." → DE: "Das Haus ist eingestürzt."
- EN: "Watch this house." → FR: "Surveille cette maison."
- etc.

**Audio bonus:** Many Tatoeba sentences have community-recorded audio
(`GET /unstable/audio/{id}/file`). A future enhancement could offer Tatoeba audio
as an alternative to the browser's TTS engine.

**No breaking changes.** Tatoeba is added as a new provider entry alongside existing
ones. No schema or API contract changes are required.

**Implementation checklist:**

- [x] `lib/translation-providers/tatoeba.ts` — provider module
- [x] ISO 639-1 → 639-3 language code mapping
- [x] Short-sentence search for primary translations
- [x] Longer-sentence search for example-based proposals
- [x] Add to provider registry and Settings UI
- [x] Handle empty results gracefully (Tatoeba may not have coverage for all words)
- [x] Respect Tatoeba's rate limits and add reasonable caching
- [x] Promise-based cache for correlated proposals across language columns
- [x] Source-language example sentences (proposals in the source column)
- [x] Help page documentation and Swagger API spec updated

---

## Appendix A: Action Types for Activity Log

```
user.register
user.login
user.logout
user.update
user.deactivate
user.reactivate
translation.create
translation.update
translation.delete
translation.share
translation.unshare
config.update
admin.user.create
admin.user.update
admin.user.deactivate
```

## Appendix B: Directory Structure Template

```
MultiLingua{Platform}/
├── README.md                  — Setup & run instructions
├── CLAUDE.md                  — AI assistant guidelines (if using Claude)
├── src/                       — Source code
│   ├── models/                — Data classes / entities
│   ├── api/                   — API client / networking
│   ├── auth/                  — Authentication logic
│   ├── ui/                    — Screens and components
│   │   ├── landing/
│   │   ├── login/
│   │   ├── register/
│   │   ├── translations/
│   │   ├── settings/
│   │   ├── admin/
│   │   └── help/
│   ├── storage/               — Local database / cache
│   ├── tts/                   — Text-to-speech wrapper
│   └── theme/                 — Theming / styles
├── test/                      — Tests
└── {platform build files}     — build.gradle, Podfile, pubspec.yaml, etc.
```

## Appendix C: Quick Reference — What to Build

A checklist for each platform implementation:

- [ ] Project scaffolding with platform build system
- [ ] Theme system (light/dark toggle)
- [ ] API client (authenticated requests with JWT)
- [ ] Landing page
- [ ] Login screen (email → OTP → token)
- [ ] Registration screen (name + email → OTP → token)
- [ ] Secure token storage
- [ ] Translations table (main screen)
- [ ] Add / edit / delete translation entries
- [ ] Translate action (call `/api/translate`, show proposals)
- [ ] Proposal selection (pick alternative translation)
- [ ] Search / filter translations
- [ ] Sort by column
- [ ] Auto-save on edit
- [ ] Text-to-speech per language
- [ ] Settings screen (provider selection, theme)
- [ ] Admin user management screen
- [ ] Activity log viewer (admin)
- [ ] Offline caching of translations
- [ ] Error handling and loading states
- [ ] Unit tests
- [ ] UI / widget tests
- [ ] Integration tests

### v0.4.1 Additions

- [ ] Tatoeba translation provider (`lib/translation-providers/tatoeba.ts`)
- [ ] ISO 639-1 → 639-3 language code mapping
- [ ] Short-sentence search for primary word translations
- [ ] Example-sentence search for contextual proposals
- [ ] Graceful handling of missing Tatoeba coverage
- [ ] Caching to respect Tatoeba rate limits
