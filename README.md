# MultiLingua

A collection of multi-language translation applications demonstrating various AI-assisted development approaches and platform implementations. This project showcases how different AI assistants (GitHub Copilot, Claude AI, and Google Gemini) can be leveraged to create similar applications across multiple platforms and technology stacks.

## Overview

MultiLingua is a suite of translation applications that integrate with LibreTranslate, an open-source translation API. The project explores different architectural patterns, UI frameworks, and development workflows while maintaining a consistent core functionality: translating text between multiple languages with alternative translation proposals.

## Supported Languages

Depending on the implementation:
- **English** (all implementations)
- **French** (all implementations)
- **Italian** (all implementations)
- **Spanish** (all implementations)
- **German** (Claude.AI Android app only)

## Project Structure

```
MultiLingua/
├── Copilot.AI/
│   ├── multi-lingua/          # Next.js web application
│   └── MultiLinguaDroid/      # Android application (Kotlin)
├── Claude.AI/
│   └── MultiLinguaDroid/      # Advanced Android app with TTS
├── Gemini.AI/
│   ├── README.md              # Gemini LLM integration module
│   └── MultiLinguaReactNative/ # React Native mobile app
└── README.md                  # This file
```

## Subprojects

### 1. Web Application (Next.js)
**Location**: `Copilot.AI/multi-lingua/`  
**Created with**: GitHub Copilot AI

A modern web application built with Next.js 14, TypeScript, and Tailwind CSS.

**Features**:
- Real-time translation to French, Italian, and Spanish
- Up to 5 translation alternatives per language
- SQLite database for persistent storage
- Editable translation results
- Sortable table interface
- Docker Compose deployment with LibreTranslate

**Tech Stack**: Next.js, TypeScript, Tailwind CSS, SQLite, Axios, LibreTranslate

[Read more →](./Copilot.AI/multi-lingua/README.md)

### 2. Android Application (Copilot Version)
**Location**: `Copilot.AI/MultiLinguaDroid/`  
**Created with**: GitHub Copilot AI

Native Android app that replicates the web application functionality with a Material Design interface.

**Features**:
- Native Android UI with Material Design 3
- SharedPreferences-based storage
- RecyclerView with CardView items
- Dark/Light theme toggle
- MVVM architecture with ViewModel and LiveData

**Tech Stack**: Kotlin, Material Components, Retrofit, Coroutines, SharedPreferences

[Read more →](./Copilot.AI/MultiLinguaDroid/README.md)

### 3. Android Application (Claude Version)
**Location**: `Claude.AI/MultiLinguaDroid/`  
**Created with**: Claude AI

An enhanced Android application with additional features and improved architecture.

**Features**:
- 5 languages including German
- Bidirectional translation (translate FROM any language TO all others)
- Text-to-Speech (TTS) for all languages
- Room database for robust persistence
- Up to 10 translation alternatives
- Settings screen with configurable LibreTranslate URL
- Auto-save functionality

**Tech Stack**: Kotlin, Material Design 3, Room, Retrofit, TTS API, Coroutines

[Read more →](./Claude.AI/MultiLinguaDroid/README.md)

### 4. React Native Application
**Location**: `Gemini.AI/MultiLinguaReactNative/`  
**Created with**: Google Gemini AI

Cross-platform mobile application built with React Native.

**Features**:
- Cross-platform (iOS and Android)
- React Native architecture
- Modern JavaScript/TypeScript development

**Tech Stack**: React Native, Metro bundler

[Read more →](./Gemini.AI/MultiLinguaReactNative/README.md)

### 5. Gemini LLM Integration
**Location**: `Gemini.AI/`  
**Created with**: Google Gemini AI

Python module for integrating Google's Gemini Large Language Models.

**Features**:
- Standardized interface for Gemini models
- Streaming support
- Parallel requests
- Fine-tuned model support

**Tech Stack**: Python, Google Gemini API

[Read more →](./Gemini.AI/README.md)

## Common Features Across Implementations

All translation applications share these core capabilities:

✅ **Multi-language translation** using LibreTranslate  
✅ **Translation alternatives** (multiple proposals per language)  
✅ **Editable fields** for manual corrections  
✅ **Persistent storage** (SQLite, SharedPreferences, or Room)  
✅ **Modern UI/UX** design  
✅ **CRUD operations** (Create, Read, Update, Delete)  

## LibreTranslate Setup

All applications require a LibreTranslate instance. The easiest setup:

### Using Docker

```bash
# Basic setup
docker run -ti --rm -p 5000:5000 libretranslate/libretranslate

# With persistent storage (recommended)
docker run -d -p 5000:5000 \
  -v lt-local:/home/libretranslate/.local \
  -v lt-db:/app/db \
  libretranslate/libretranslate
```

### Using Docker Compose (from web app directory)

```bash
cd Copilot.AI/multi-lingua
docker-compose up -d
```

This starts both the Next.js app and LibreTranslate with proper networking and persistence.

## Network Configuration

### For Web Application
- LibreTranslate: `http://localhost:5000` (or `http://libretranslate:5000` in Docker network)
- Web App: `http://localhost:3456`

### For Android Applications

**Emulator**: Use `http://10.0.2.2:5432` to access host machine's localhost  
**Physical Device**: Use your computer's local network IP address (e.g., `http://192.168.1.100:5432`)

## Technology Comparison

| Aspect | Next.js Web | Copilot Android | Claude Android | React Native |
|--------|-------------|-----------------|----------------|--------------|
| **Platform** | Web | Android | Android | iOS/Android |
| **Language** | TypeScript | Kotlin | Kotlin | JavaScript/TypeScript |
| **UI Framework** | React + Tailwind | Material 3 | Material 3 | React Native |
| **Storage** | SQLite | SharedPreferences | Room | TBD |
| **Architecture** | Next.js API Routes | MVVM | MVVM | React |
| **Networking** | Axios | Retrofit | Retrofit | Fetch/Axios |
| **Languages** | En/Fr/It/Es | En/Fr/It/Es | En/De/Fr/It/Es | TBD |
| **Async** | Promises | Coroutines | Coroutines | Promises |
| **Special Features** | Docker ready | Theme toggle | TTS + Settings | Cross-platform |

## AI Assistant Comparison

This project demonstrates how different AI coding assistants approach the same problem:

### GitHub Copilot
- Strong at generating boilerplate and common patterns
- Excellent autocomplete for known frameworks (Next.js, Kotlin)
- Created both web and Android versions with consistent architecture

### Claude AI
- Enhanced existing Android app with additional features
- Better at understanding complex requirements (bidirectional translation)
- Added sophisticated features (TTS, settings management)

### Google Gemini
- Generated React Native boilerplate
- Created Python LLM integration module
- Focus on modern development practices

## Getting Started

Choose your preferred implementation:

1. **For Web Development**: Start with [Copilot.AI/multi-lingua](./Copilot.AI/multi-lingua/README.md)
2. **For Android Development**: Try [Claude.AI/MultiLinguaDroid](./Claude.AI/MultiLinguaDroid/README.md) for the full-featured version
3. **For Cross-Platform Mobile**: Explore [Gemini.AI/MultiLinguaReactNative](./Gemini.AI/MultiLinguaReactNative/README.md)

Each subproject contains detailed setup instructions in its respective README.

## Development Workflow

1. **Start LibreTranslate** (required for all apps)
2. **Choose your platform** and navigate to its directory
3. **Follow the specific README** for setup and build instructions
4. **Run and test** the application

## Use Cases

- **Learning**: Compare different architectural approaches
- **Prototyping**: Quick translation app setup
- **AI-Assisted Development**: Study how AI assistants generate code
- **Cross-Platform Development**: Understand platform-specific patterns
- **Translation Services**: Deploy as a self-hosted translation tool

## Contributing

Each subproject can be developed independently. Contributions are welcome for:
- New platform implementations (iOS, Flutter, etc.)
- Feature enhancements
- UI/UX improvements
- Performance optimizations
- Documentation updates

## License

This project is open source and available under the MIT License.

## Project Context

Part of the **NaturalStupidity** project suite, demonstrating practical applications of AI-assisted software development across multiple platforms and technology stacks.

---

**Last Updated**: January 2026
