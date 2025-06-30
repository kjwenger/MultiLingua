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

1. Navigate to the project directory:
   ```bash
   cd multi-lingua
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

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

The app is configured to connect to LibreTranslate at `http://localhost:5000`. To change this:

1. Edit `lib/translate.ts`
2. Update the `LIBRETRANSLATE_URL` constant

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

## Troubleshooting

1. **LibreTranslate Connection Issues**: Ensure LibreTranslate is running on port 5000
2. **Database Issues**: The SQLite database file will be created automatically
3. **Translation Errors**: Check the browser console for API error messages

## License

This project is open source and available under the MIT License.
