# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-Lingua is a Next.js 14 translation application that provides real-time multi-directional translation between English, German, French, Italian, and Spanish using LibreTranslate. The app features a table-based interface with editable translations, multiple translation proposals (up to 10 alternatives per language), and text-to-speech capabilities.

**Key Feature**: Users can translate FROM any language TO all other languages using per-column translate buttons, making it truly multi-directional.

## Important Note

The actual codebase is located in `../Copilot.AI/multi-lingua/` relative to this CLAUDE.md file. When working on the project, navigate to that directory first:

```bash
cd ../Copilot.AI/multi-lingua
```

## Development Commands

### Starting the Application

```bash
# Local development (requires LibreTranslate running separately)
npm run dev

# Start LibreTranslate dependency first
docker run -ti --rm -p 5000:5000 -v lt-local:/home/libretranslate/.local libretranslate/libretranslate

# Docker Compose (recommended - starts both services)
docker-compose up -d

# View logs
docker-compose logs -f

# Rebuild after changes
docker-compose up --build -d
```

### Building and Running

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Docker Commands

```bash
# Build standalone Docker image
docker build -t multi-lingua .

# Stop services
docker-compose down

# Clean up including volumes
docker-compose down -v
```

## Architecture

### Directory Structure

```
multi-lingua/
├── app/
│   ├── api/
│   │   ├── translate/route.ts      # Translation API endpoint
│   │   └── translations/route.ts    # CRUD operations for translations
│   ├── layout.tsx                   # Root layout with ThemeProvider
│   ├── page.tsx                     # Main UI component (table interface)
│   └── test/page.tsx                # Test page
├── components/
│   ├── ThemeProvider.tsx            # Dark/light theme context
│   └── ThemeToggle.tsx              # Theme toggle button
├── lib/
│   ├── database.ts                  # SQLite database layer
│   ├── translate.ts                 # LibreTranslate service wrapper
│   └── tts.ts                       # Browser Text-to-Speech using Web Speech API
├── Dockerfile                       # Multi-stage Docker build
└── docker-compose.yml               # Orchestrates app + LibreTranslate
```

### Core Architecture Patterns

**1. Multi-Directional Translation**
- Each language column has a translate button that uses that language as the source
- `handleTranslateFromLanguage()` in app/page.tsx initiates translation from any column
- Translation service (`lib/translate.ts`) has `translateFromLanguage()` method that accepts source language parameter
- API endpoint `/api/translate` accepts optional `sourceLanguage` parameter

**2. Database Layer (lib/database.ts)**
- Singleton pattern: Exports single `database` instance
- SQLite with auto-initialization and schema migration support
- Migration pattern: `addGermanColumn()` and `addEnglishProposalsColumn()` show how to add new languages
- Translations stored with main text + JSON-serialized proposals array

**3. Translation Service (lib/translate.ts)**
- Environment-aware LibreTranslate URL detection:
  - `DOCKER_COMPOSE=true` → uses `http://libretranslate:5432` (service name)
  - Running in Docker → `http://host.docker.internal:5432`
  - Local development → `http://localhost:5432`
- Generates translation alternatives by translating variations of input text
- Parallel translation execution using `Promise.all()`

**4. Frontend State Management (app/page.tsx)**
- Client component with React hooks for state management
- Real-time UI updates: Local state updated immediately, then database synced
- Loading states tracked per-row using Sets: `translatingIds`, `ttsPlayingIds`
- Proposals displayed in 2-column grid (5 per column)

**5. Data Persistence**
- Docker volumes for persistence:
  - `lt-local`: LibreTranslate language models (external volume - must be pre-created)
  - `ml-data`: SQLite database (external volume)
- Local development: Database stored in `app/data/translations.db`

**6. API Routes (Next.js 14 App Router)**
- RESTful pattern in `/api/translations`:
  - GET: Fetch all (ordered by English ASC)
  - POST: Create new translation
  - PUT: Update existing (partial updates supported)
  - DELETE: Remove by ID
- `/api/translate` POST: Translate text with optional source language

## Database Schema

```sql
CREATE TABLE translations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  english TEXT NOT NULL,
  german TEXT,
  french TEXT,
  italian TEXT,
  spanish TEXT,
  english_proposals TEXT,      -- JSON array
  german_proposals TEXT,        -- JSON array
  french_proposals TEXT,        -- JSON array
  italian_proposals TEXT,       -- JSON array
  spanish_proposals TEXT,       -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Configuration

### Environment Variables

- `LIBRETRANSLATE_URL`: Override LibreTranslate server URL
- `LIBRETRANSLATE_API_KEY`: API key for LibreTranslate (optional)
- `NODE_ENV`: Set to `production` for production builds
- `PORT`: App port (default: 3456)
- `DOCKER_COMPOSE`: Set to `true` when running via docker-compose
- `DATA_DIR`: Override database directory location

### Port Configuration

- **App**: 3456
- **LibreTranslate**: 5432 (external), 5000 (internal in Docker Compose network)

## Adding New Languages

To add a new language (e.g., Portuguese):

1. **Database (lib/database.ts)**:
   - Add fields to `Translation` interface: `portuguese: string`, `portuguese_proposals: string`
   - Create migration method (e.g., `addPortugueseColumn()`) and call in `initializeDatabase()`
   - Update `addTranslation()`, `updateTranslation()` to handle new fields

2. **Translation Service (lib/translate.ts)**:
   - Add to `translateFromLanguage()` targets logic
   - Create `translateToPortuguese()` method
   - Update `translateToAllLanguages()` to include Portuguese

3. **API (app/api/translate/route.ts)**:
   - Add Portuguese to response object construction

4. **Frontend (app/page.tsx)**:
   - Add column to table with textarea, translate button, TTS button
   - Update `Translation` interface
   - Add Portuguese to `languageCodeMap` in `handleTranslateFromLanguage()`
   - Add Portuguese case in TTS `handleTTS()`

5. **TTS (lib/tts.ts)**:
   - Add `portuguese: 'pt-PT'` or `'pt-BR'` to `languageCodes` map

## Text-to-Speech

Uses browser Web Speech API (`speechSynthesis`):
- Client-side only (lib/tts.ts)
- Configurable rate: 0.8, pitch: 1, volume: 1
- Cancels any ongoing speech before starting new
- Language codes: en-US, de-DE, fr-FR, it-IT, es-ES

## LibreTranslate Integration

- Open-source translation API (runs in separate container)
- Pre-download language models by running LibreTranslate standalone first
- Translation alternatives generated by translating text variations (lowercase, uppercase, with articles, with punctuation)
- Returns up to 10 alternatives per language

## Testing Translation Endpoint

```bash
# Test from English
curl -X POST http://localhost:3456/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "hello"}'

# Test from German
curl -X POST http://localhost:3456/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "Hallo", "sourceLanguage": "de"}'
```

## Common Gotchas

1. **LibreTranslate 400 Errors**: Language models not downloaded. Pre-populate the `lt-local` volume by running LibreTranslate standalone first and waiting for model downloads.

2. **External Volume Errors**: The docker-compose.yml expects external volumes `lt-local` and `ml-data` to exist. Create them first with `docker volume create lt-local && docker volume create ml-data`.

3. **Translation Alternative Strategy**: LibreTranslate doesn't provide native alternatives, so the app generates them by translating variations of the input. This means alternatives may be similar or identical.

4. **TypeScript Paths**: Uses `@/*` alias mapped to project root in tsconfig.json.

5. **Client vs Server Components**: Main page.tsx is a client component (`'use client'`) due to interactive state. API routes and lib modules are server-side.

6. **Database Updates**: When updating translations, the app does optimistic UI updates (local state first) then syncs with database. No explicit loading states for individual field updates.
