# MultiLingua — v0.5.0 Roadmap: Configurable Languages

> **Status:** Planned
> **Depends on:** v0.4.1 (Tatoeba Example Sentences)
> **Parent spec:** `SPECIFICATIONS.md` (v0.4.1)

---

## 1. Overview

**Goal:** Replace the hardcoded five-language model with a dynamic, admin-managed
language set. Users and admins can add, enable, or disable any language supported
by the active translation provider.

Starting in v0.5.0, the set of supported languages is **configurable** rather than
fixed. Languages are stored as `Language` entities (see Section 3) and managed by
admins via a dedicated screen.

**Rules:**
- The five v0.4.x languages (EN, DE, FR, IT, ES) are **seeded by default** and
  enabled on first install.
- Admins can **add new languages** by providing a language code, name, TTS locale,
  and flag emoji.
- Admins can **enable or disable** any language, subject to a minimum of **2
  enabled languages** at all times.
- The available language set is bounded by what the active translation provider
  supports. The UI should query the provider for supported languages and restrict
  the admin's choices accordingly.
- All UI, API, and data model references to specific languages become dynamic —
  driven by the enabled `Language` set rather than hardcoded column names.

**Breaking changes:**
- Database schema: `TranslationEntry` columns (`english`, `german`, etc.) are
  replaced by a normalized `TranslationValue` child table keyed by language code.
- API contract: Translation request/response bodies switch from fixed field names
  to a dynamic `values` map keyed by language code.
- Existing data must be migrated (see Section 8).

**Minimum constraints:**
- At least **2 languages** must be enabled at all times.
- The five original languages (EN, DE, FR, IT, ES) are seeded by default.
- Maximum language count is bounded only by what the translation provider supports.

**Candidate languages:** The 36 languages in the strict provider intersection
(Section 6) are guaranteed to work with any of the five main translation
providers (LibreTranslate, MyMemory, DeepL, Google, Azure). When PONS or Tatoeba
is the active provider, the available set is smaller and the admin UI must reflect
that via `supportedLanguages()`.

**Implementation notes:**
- The `Language` table should store ISO 639-1 codes, display names, flag emojis,
  and an `enabled` flag.
- On provider switch, warn the admin if any currently-enabled languages are not
  supported by the newly selected provider.
- The UI language selector should group languages: seeded defaults first, then
  alphabetical.

**Sections affected in SPECIFICATIONS.md:** 2, 3.5, 4, 5, 7, Appendix C.

---

## 2. UI Changes

### 2.1 Dynamic Columns (Translations Screen)

In v0.5.0, the table columns and mobile card language lines are generated
dynamically from the enabled `Language` set (fetched via `GET /api/languages`),
ordered by `sort_order`. The column headers display the language name; the mobile
cards display the flag + value. When languages are added or removed by an admin,
the UI updates accordingly on next load.

If many languages are enabled (> 6-7), the desktop table should support horizontal
scrolling or allow the user to choose which language columns are visible.

### 2.2 Language Management (Admin Screen)

A new admin sub-screen (tab or separate page) for managing languages:

| Feature               | Description                                          |
|-----------------------|------------------------------------------------------|
| Language list         | Table of all languages with code, name, flag, status |
| Add language          | Form: code, name, locale, flag emoji                 |
| Enable / disable      | Toggle switch per language (min 2 must stay enabled) |
| Reorder               | Drag-and-drop or arrows to change `sort_order`       |
| Remove language       | Delete a language (blocked if translation data exists)|
| Provider compatibility| Show which languages the active provider supports    |

---

## 3. Data Model

### 3.1 Language Entity

```
Language {
  code:               String      — ISO 639-1, primary key (e.g., "en", "de", "ja")
  name:               String      — display name (e.g., "English", "Japanese")
  locale:             String      — BCP 47 TTS locale (e.g., "en-US", "ja-JP")
  flag:               String      — flag emoji (e.g., "🇬🇧", "🇯🇵")
  enabled:            Boolean     — default true; at least 2 must remain enabled
  sort_order:         Integer     — display order in UI (0-based)
  created_at:         DateTime
  updated_at:         DateTime
}
```

**Seed data:** The five v0.4.x languages (en, de, fr, it, es) are inserted as
enabled with sort_order 0-4 on first run or migration.

### 3.2 TranslationValue Entity

Replaces the per-language columns on `TranslationEntry`.

```
TranslationValue {
  id:                 Integer     — primary key, auto-increment
  entry_id:           Integer     — FK -> TranslationEntry.id (cascade delete)
  language_code:      String      — FK -> Language.code
  value:              String      — the translation text
  proposals:          String[]    — up to 10 alternatives (JSON array)
  created_at:         DateTime
  updated_at:         DateTime

  UNIQUE(entry_id, language_code)
}
```

### 3.3 TranslationEntry Simplification

In v0.5.0 the `TranslationEntry` is simplified — language-specific fields move to
`TranslationValue`:

```
TranslationEntry {
  id:                 Integer     — primary key, auto-increment
  user_id:            String?     — owner (null = shared with everyone)
  created_at:         DateTime
  updated_at:         DateTime
}
```

The per-language columns (`english`, `german`, `french`, `italian`, `spanish` and
their `*_proposals` arrays) are removed. Translation content is accessed via the
`TranslationValue` relationship.

---

## 4. API Changes

### 4.1 Translation Endpoints

In v0.5.0, translation request and response bodies use a dynamic `values` map
keyed by language code instead of fixed field names.

**GET `/api/translations` — Response (200):**
```json
{
  "translations": [
    {
      "id": 1,
      "user_id": "uuid-or-null",
      "values": {
        "en": { "value": "hello", "proposals": [] },
        "de": { "value": "hallo", "proposals": ["hallo", "guten tag"] },
        "fr": { "value": "bonjour", "proposals": ["bonjour", "salut"] },
        "it": { "value": "ciao", "proposals": ["ciao", "salve"] },
        "es": { "value": "hola", "proposals": ["hola", "buenos dias"] }
      },
      "created_at": "2026-02-07T10:00:00Z",
      "updated_at": "2026-02-07T10:00:00Z"
    }
  ]
}
```

**POST `/api/translations` — Request:**
```json
{
  "values": {
    "en": "hello"
  }
}
```

**PUT `/api/translations/:id` — Request:**
```json
{
  "values": {
    "de": { "value": "hallo", "proposals": ["hallo", "guten tag"] }
  }
}
```

Query parameter `sort` accepts any enabled language code (e.g., `?sort=en&order=asc`)
instead of the fixed language names.

### 4.2 Language Endpoints

| Method | Path                          | Auth  | Description                       |
|--------|-------------------------------|-------|-----------------------------------|
| GET    | `/api/languages`              | No    | List enabled languages            |
| GET    | `/api/admin/languages`        | Admin | List all languages (incl. disabled)|
| POST   | `/api/admin/languages`        | Admin | Add a new language                |
| PUT    | `/api/admin/languages/:code`  | Admin | Update/enable/disable a language  |
| DELETE | `/api/admin/languages/:code`  | Admin | Remove a language (if no data)    |

#### GET `/api/languages`

Returns only enabled languages, ordered by `sort_order`. No authentication required
so that login/register screens can display language options.

**Response (200):**
```json
{
  "languages": [
    { "code": "en", "name": "English", "locale": "en-US", "flag": "🇬🇧", "sortOrder": 0 },
    { "code": "de", "name": "German", "locale": "de-DE", "flag": "🇩🇪", "sortOrder": 1 },
    { "code": "fr", "name": "French", "locale": "fr-FR", "flag": "🇫🇷", "sortOrder": 2 },
    { "code": "it", "name": "Italian", "locale": "it-IT", "flag": "🇮🇹", "sortOrder": 3 },
    { "code": "es", "name": "Spanish", "locale": "es-ES", "flag": "🇪🇸", "sortOrder": 4 }
  ]
}
```

#### POST `/api/admin/languages`

**Request:**
```json
{
  "code": "ja",
  "name": "Japanese",
  "locale": "ja-JP",
  "flag": "🇯🇵"
}
```

**Response (201):**
```json
{
  "message": "Language added",
  "language": { "code": "ja", "name": "Japanese", "locale": "ja-JP", "flag": "🇯🇵", "enabled": true, "sortOrder": 5 }
}
```

#### PUT `/api/admin/languages/:code`

**Request:**
```json
{
  "enabled": false
}
```

**Response (200):**
```json
{
  "message": "Language updated",
  "language": { "code": "ja", "name": "Japanese", "locale": "ja-JP", "flag": "🇯🇵", "enabled": false, "sortOrder": 5 }
}
```

**Error (400):** Returned if disabling would leave fewer than 2 enabled languages.

#### DELETE `/api/admin/languages/:code`

Permanently removes a language. Fails if any `TranslationValue` rows exist for that
language code — the admin must first delete or reassign that data.

**Response (200):**
```json
{
  "message": "Language removed"
}
```

---

## 5. Activity Log Actions

The following activity log actions are added in v0.5.0:

```
admin.language.add
admin.language.update
admin.language.remove
```

---

## 6. Provider Changes

### 6.1 Provider Interface Addition

`supportedLanguages()` is added to the provider interface so the admin UI can show
which languages are available for the active provider when adding/enabling languages.

```
supportedLanguages() -> String[]   — list of ISO 639-1 codes this provider supports
```

### 6.2 Provider Language Coverage

Each active provider supports a different set of languages. The table below
summarizes coverage relevant to configurable languages.

| Provider         | Language Count | Notes                                                    |
|------------------|---------------|----------------------------------------------------------|
| LibreTranslate   | ~50           | Self-hosted; exact count depends on model version        |
| MyMemory         | ~120          | Largest coverage; free tier has daily limits              |
| DeepL            | 33            | High quality; 33 core languages (some with variants)     |
| Google Translate | 150+          | Broadest coverage; requires API key                      |
| Azure Translator | 130+          | Broad coverage; requires API key                         |
| PONS             | 9             | Dictionary pairs: DE, EN, FR, ES, IT, PL, PT, RU, ZH    |
| Tatoeba          | 400+          | Example sentences; no API restriction on languages        |

#### 6.2.1 Strict Intersection (all five translation providers)

The following **36 languages** are supported by LibreTranslate, MyMemory, DeepL,
Google Translate, and Azure Translator. These are the "safe" candidates for
configurable languages — any of them will work regardless of which main
translation provider the admin selects.

| Code | Language    | Code | Language    | Code | Language    |
|------|-------------|------|-------------|------|-------------|
| `ar` | Arabic      | `hu` | Hungarian   | `pl` | Polish      |
| `bg` | Bulgarian   | `id` | Indonesian  | `pt` | Portuguese  |
| `cs` | Czech       | `it` | Italian     | `ro` | Romanian    |
| `da` | Danish      | `ja` | Japanese    | `ru` | Russian     |
| `de` | German      | `ko` | Korean      | `sk` | Slovak      |
| `el` | Greek       | `lt` | Lithuanian  | `sl` | Slovenian   |
| `en` | English     | `lv` | Latvian     | `sv` | Swedish     |
| `es` | Spanish     | `nb` | Norwegian   | `tr` | Turkish     |
| `et` | Estonian    | `nl` | Dutch       | `uk` | Ukrainian   |
| `fi` | Finnish     | `fa` | Persian     | `vi` | Vietnamese  |
| `fr` | French      | `ga` | Irish       | `zh` | Chinese     |
| `hi` | Hindi       | `he` | Hebrew      | `th` | Thai        |

> **Note — PONS** has a genuinely restricted language set (9 languages). When
> PONS is active, the admin UI should only offer those 9 languages.
>
> **Note — Tatoeba** has no API-side language restriction — its database contains
> sentences in 400+ languages and the API accepts any ISO 639-3 code. The current
> v0.4.1 implementation only maps 5 languages (EN, DE, FR, IT, ES) in its
> `LANG_MAP`, but this is an **implementation limitation, not a provider
> limitation**. For v0.5.0, `LANG_MAP` must be expanded to cover at least all 36
> intersection languages. Tatoeba's `supportedLanguages()` should reflect the
> full set the API can serve, not the current hardcoded subset.

---

## 7. Text-to-Speech Changes

**Dynamic Locales:**

In v0.5.0, the TTS locale for each language is read from the `Language.locale`
field rather than a hardcoded mapping. When a new language is added, the admin
provides its BCP 47 locale string. If the platform's TTS engine does not support a
given locale, the TTS button should be hidden or disabled for that language with a
tooltip indicating unavailability.

---

## 8. Migration Strategy (v0.4.x -> v0.5.0)

Implementations must provide a one-time migration that:

1. Creates the `Language` and `TranslationValue` tables.
2. Seeds the five default languages (en, de, fr, it, es) as enabled.
3. For each existing `TranslationEntry`, creates `TranslationValue` rows from the
   old `english`, `german`, `french`, `italian`, `spanish` columns and their
   corresponding `*_proposals` arrays.
4. Drops the old language-specific columns from `TranslationEntry` (or keeps them
   as deprecated if the platform requires a phased rollout).

---

## 9. Implementation Checklist

- [ ] Data migration (v0.4.x -> v0.5.0 schema)
- [ ] `Language` entity and local storage
- [ ] `TranslationValue` normalized model
- [ ] Fetch languages from `GET /api/languages`
- [ ] Dynamic table columns / card lines from enabled languages
- [ ] Admin language management screen (add, enable/disable, reorder, remove)
- [ ] TTS locale resolution from `Language.locale`
- [ ] Handle unsupported TTS locales gracefully
- [ ] Updated translation API calls (dynamic `values` map)
- [ ] Provider `supportedLanguages()` integration
- [ ] Horizontal scroll or column picker for many languages (desktop)
