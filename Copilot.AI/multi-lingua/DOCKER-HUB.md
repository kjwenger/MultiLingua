# Docker Hub Publishing Guide

This guide explains how to deploy the multi-lingua application using Docker Hub images for Portainer/Synology or other Docker environments.

## Quick Start with Pre-built Images

### For Portainer (Synology/Other)

1. **Pull the docker-compose template:**
```bash
curl -O https://raw.githubusercontent.com/kjwenger/NaturalStupidity/main/MultiLingua/Copilot.AI/docker-compose.release.yml
```

2. **Create the external volume for LibreTranslate:**
```bash
docker volume create lt-local
```

3. **Deploy in Portainer:**
   - Go to Stacks
   - Click "Add Stack"
   - Name: `multi-lingua`
   - Upload the `docker-compose.release.yml` file
   - Deploy

### Manual Docker Deployment

```bash
# Create the required volume
docker volume create lt-local

# Run LibreTranslate (downloads language models on first run)
docker run -d \
  --name libretranslate \
  -p 5432:5000 \
  -v lt-local:/home/libretranslate/.local \
  libretranslate/libretranslate:latest

# Wait for LibreTranslate to download models (check logs)
docker logs -f libretranslate

# Run Multi-Lingua app
docker run -d \
  --name multi-lingua \
  -p 3456:3000 \
  -v $(pwd)/data:/app/data \
  --link libretranslate \
  -e LIBRETRANSLATE_URL=http://libretranslate:5000 \
  kjwenger/multi-lingua:latest
```

## Image Details

### Available Images

- **Main Application**: `kjwenger/multi-lingua:latest`
- **Platform Support**: 
  - `linux/amd64` (Intel/AMD 64-bit)
  - `linux/arm64` (Apple Silicon, newer ARM)
  - `linux/arm/v7` (Raspberry Pi, older ARM)

### Image Tags

- `latest` - Latest stable release from main branch
- `v1.0.0` - Specific version tags (when released)
- `main` - Development builds from main branch

## Configuration

### Environment Variables

The application accepts these environment variables:

- `LIBRETRANSLATE_URL` - URL to LibreTranslate service (default: `http://libretranslate:5000`)
- `NODE_ENV` - Environment mode (default: `production`)
- `PORT` - Application port (default: `3000`)

### Volumes

- `/app/data` - SQLite database storage (mount for persistence)
- `lt-local` - LibreTranslate language models (external volume)

### Ports

- `3000` - Multi-Lingua web application
- `5000` - LibreTranslate API (internal)
- External mappings:
  - `3456:3000` - Multi-Lingua web interface
  - `5432:5000` - LibreTranslate API (for debugging)

## Production Docker Compose

Here's the production-ready docker-compose.yml that uses published images:

```yaml
version: '3.8'

services:
  libretranslate:
    image: libretranslate/libretranslate:latest
    ports:
      - "5432:5000"
    volumes:
      - lt-local:/home/libretranslate/.local
    networks:
      - multi-lingua-network
    environment:
      - LT_DISABLE_FILES_TRANSLATION=true
      - LT_DISABLE_WEB_UI=false
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:5000/languages || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5

  multi-lingua:
    image: kjwenger/multi-lingua:latest
    ports:
      - "3456:3000"
    volumes:
      - ./data:/app/data
    networks:
      - multi-lingua-network
    environment:
      - NODE_ENV=production
      - LIBRETRANSLATE_URL=http://libretranslate:5000
    depends_on:
      libretranslate:
        condition: service_healthy

volumes:
  lt-local:
    external: true

networks:
  multi-lingua-network:
    driver: bridge
```

## Automated Updates

The Docker images are automatically built and published when:

- Code is pushed to the `main` branch
- Version tags are created (e.g., `git tag v1.0.0`)
- Pull requests are opened (for testing)

## Troubleshooting

### Common Issues

1. **LibreTranslate returns 400 errors**
   - Ensure the `lt-local` volume exists and is properly mounted
   - Check LibreTranslate logs: `docker logs libretranslate`
   - Wait for language models to fully download

2. **Multi-Lingua can't connect to LibreTranslate**
   - Verify both services are on the same Docker network
   - Check the `LIBRETRANSLATE_URL` environment variable
   - Ensure LibreTranslate health check passes

3. **Database not persisting**
   - Verify the `./data` directory is mounted correctly
   - Check file permissions on the host system

### Health Checks

```bash
# Check if LibreTranslate is ready
curl http://localhost:5432/languages

# Check if Multi-Lingua is running
curl http://localhost:3456

# Check container logs
docker logs multi-lingua
docker logs libretranslate
```

## Development

For local development, use the development docker-compose:

```bash
# Clone the repository
git clone https://github.com/kjwenger/NaturalStupidity.git
cd MultiLingua/Copilot.AI

# Use development setup
docker-compose up
```

This will build the application locally instead of using the published image.

## Support

- **Repository**: https://github.com/kjwenger/NaturalStupidity
- **Docker Hub**: https://hub.docker.com/r/kjwenger/multi-lingua
- **Issues**: https://github.com/kjwenger/NaturalStupidity/issues