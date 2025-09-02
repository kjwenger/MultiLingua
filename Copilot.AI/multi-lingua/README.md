# Multi-Lingua Translation App

A modern Next.js application that provides real-time translation services using LibreTranslate. The app features a table-based interface where users can input English text and receive translations in French, Italian, and Spanish with multiple translation proposals.

## Features

- **Real-time Translation**: Automatic translation using LibreTranslate API
- **Multiple Language Support**: Translates to French, Italian, and Spanish
- **Translation Proposals**: Up to 5 translation alternatives for each language
- **Editable Results**: All translation fields are editable
- **Persistent Storage**: SQLite database for storing translations
- **Sortable Table**: Sort translations by English column
- **Modern UI**: Clean, responsive design with Tailwind CSS

## Prerequisites

- Node.js 18+ installed
- LibreTranslate running locally on port 5000
  - You can run LibreTranslate using Docker: `docker run -ti --rm -p 5000:5000 libretranslate/libretranslate`

## Installation

### Option 1: Docker (Recommended)

#### Quick Start with Published Images
The fastest way to get Multi-Lingua running using pre-built Docker images:

```bash
# Download release configuration
curl -O https://raw.githubusercontent.com/kjwenger/NaturalStupidity/main/MultiLingua/Copilot.AI/docker-compose.release.yml

# Create and pre-populate LibreTranslate models volume
docker volume create lt-local
docker run -d --name temp-libretranslate -p 5000:5000 -v lt-local:/home/libretranslate/.local libretranslate/libretranslate:latest
# Wait for language models to download (check: docker logs -f temp-libretranslate)
docker stop temp-libretranslate && docker rm temp-libretranslate

# Start services
docker-compose -f docker-compose.release.yml up -d

# The app will be available at http://localhost:3456
# LibreTranslate admin will be available at http://localhost:5432
```

#### Local Development Setup
For development or if you want to build locally:

```bash
# Clone the repository and navigate to the project
cd multi-lingua

# Start both services using Docker Compose (builds locally)
docker-compose up -d
```

To stop the services:
```bash
docker-compose down
```

To rebuild the app after changes:
```bash
docker-compose up --build
```

### Option 2: Local Development

1. Navigate to the project directory:
   ```bash
   cd multi-lingua
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start LibreTranslate (required for translation functionality):
   ```bash
   # Basic LibreTranslate without persistence
   docker run -ti --rm -p 5000:5000 libretranslate/libretranslate
   
   # LibreTranslate with persistent dictionaries and models
   docker run -ti --rm -p 5000:5000 \
     -v lt-local:/home/libretranslate/.local \
     -v lt-db:/app/db \
     libretranslate/libretranslate
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3456`

## Usage

1. **Add New Translation**: Click the "Add New Translation" button to create a new row
2. **Enter English Text**: Type any English word or phrase in the first column
3. **Automatic Translation**: The app will automatically translate to French, Italian, and Spanish
4. **View Suggestions**: Click on any suggestion to use it as the translation
5. **Edit Translations**: Manually edit any translation field
6. **Sort**: Click on the English column header to sort alphabetically
7. **Delete**: Use the delete button to remove unwanted translations

## API Endpoints

- `GET /api/translations` - Fetch all translations
- `POST /api/translations` - Add new translation
- `PUT /api/translations` - Update existing translation
- `DELETE /api/translations?id={id}` - Delete translation
- `POST /api/translate` - Translate text to all languages

## Database Schema

The app uses SQLite with the following schema:

```sql
CREATE TABLE translations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  english TEXT NOT NULL,
  french TEXT,
  italian TEXT,
  spanish TEXT,
  french_proposals TEXT,
  italian_proposals TEXT,
  spanish_proposals TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **SQLite3**: Lightweight database
- **Axios**: HTTP client for API requests
- **LibreTranslate**: Open-source translation API

## Configuration

The app is configured to connect to LibreTranslate. You can customize the connection using environment variables:

### Environment Variables

- `LIBRETRANSLATE_URL`: Custom LibreTranslate server URL (default: auto-detected based on environment)
- `NODE_ENV`: Set to `production` for production builds
- `PORT`: Port for the Next.js app (default: 3456)

### LibreTranslate Connection

The app automatically detects the LibreTranslate URL based on the environment:

1. **Docker Compose**: Uses `http://libretranslate:5000` (service name)
2. **Standalone Docker**: Uses `http://host.docker.internal:5000` (connects to host)
3. **Local Development**: Uses `http://localhost:5000`
4. **Custom**: Set `LIBRETRANSLATE_URL` environment variable

To change the LibreTranslate URL manually:

```bash
# For Docker
docker run -p 3456:3456 -e LIBRETRANSLATE_URL=http://your-server:5000 multi-lingua

# For local development
export LIBRETRANSLATE_URL=http://your-server:5000
npm run dev
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Docker

### Building the Docker Image

```bash
# Build the Docker image
docker build -t multi-lingua .

# Run with LibreTranslate on host machine (localhost:5000)
docker run -p 3456:3456 multi-lingua

# Run with custom LibreTranslate URL
docker run -p 3456:3456 -e LIBRETRANSLATE_URL=http://your-libretranslate-server:5000 multi-lingua

# Run with LibreTranslate also in Docker (basic)
docker run -d --name libretranslate -p 5000:5000 libretranslate/libretranslate
docker run -p 3456:3456 --link libretranslate:libretranslate -e LIBRETRANSLATE_URL=http://libretranslate:5000 multi-lingua

# Run with LibreTranslate in Docker (with persistent storage)
docker run -d --name libretranslate -p 5000:5000 \
  -v lt-local:/home/libretranslate/.local \
  -v lt-db:/app/db \
  libretranslate/libretranslate
docker run -p 3456:3456 --link libretranslate:libretranslate -e LIBRETRANSLATE_URL=http://libretranslate:5000 multi-lingua
```

### Using Docker Compose (Recommended)

#### Option 1: Published Images (No Build Required)
```bash
# Download the release docker-compose file
curl -O https://raw.githubusercontent.com/kjwenger/NaturalStupidity/main/MultiLingua/Copilot.AI/docker-compose.release.yml

# Create and pre-populate LibreTranslate volume (recommended)
docker volume create lt-local
docker run -d --name temp-libretranslate -p 5000:5000 -v lt-local:/home/libretranslate/.local libretranslate/libretranslate:latest
# Wait for models to download, then: docker stop temp-libretranslate && docker rm temp-libretranslate

# Start services using published images
docker-compose -f docker-compose.release.yml up -d
```

#### Option 2: Local Development Build
```bash
# Start both Multi-Lingua and LibreTranslate with local build
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services (preserves volumes)
docker-compose down

# Rebuild and restart
docker-compose up --build -d

# Clean up everything including volumes
docker-compose down -v
```

### Persistence & Volume Configuration

The Docker Compose setup includes persistent storage for:
- **LibreTranslate models and dictionaries**: Uses external `lt-local` volume (must exist)
- **Multi-Lingua database**: Stored in `./data` directory on host

**Important**: The Docker Compose configuration expects an existing `lt-local` volume with pre-downloaded LibreTranslate language models. If you don't have this volume, either:

1. **Create and populate the volume first**:
   ```bash
   # Run LibreTranslate standalone to download models
   docker run -d --name temp-libretranslate -p 5000:5000 \
     -v lt-local:/home/libretranslate/.local \
     libretranslate/libretranslate
   
   # Wait for models to download, then stop
   docker stop temp-libretranslate && docker rm temp-libretranslate
   ```

2. **Or modify docker-compose.yml** to create a new volume instead of using external.

### Port Configuration

- **Multi-Lingua App**: http://localhost:3456
- **LibreTranslate API** (external access): http://localhost:5432
- **Internal network**: Multi-Lingua connects to LibreTranslate via `http://libretranslate:5000`

## Troubleshooting

1. **LibreTranslate 400 Errors**: Usually indicates missing language models
   - Ensure the `lt-local` volume exists and contains downloaded models
   - Check LibreTranslate logs: `docker-compose logs libretranslate`

2. **Volume Issues**: If getting "external volume not found" error
   - Run LibreTranslate standalone first to create the `lt-local` volume
   - Or change `external: true` to `driver: local` in docker-compose.yml

3. **Network Connectivity**: 
   - Multi-Lingua app logs should show: "Using LibreTranslate URL: http://libretranslate:5000"
   - Test with: `curl -X POST http://localhost:3456/api/translate -H "Content-Type: application/json" -d '{"text": "hello"}'`

4. **Database Issues**: The SQLite database file will be created automatically in `./data/`

5. **Translation Errors**: Check the browser console for API error messages

## License

This project is open source and available under the MIT License.
