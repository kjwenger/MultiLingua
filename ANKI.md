# Anki Sync Server on Synology NAS

Self-hosted Anki sync server using Docker (Portainer) on a Synology NAS,
with reverse proxy for HTTPS access.

## Services

| Service          | Internal Port | Exposed Port | Purpose                                       |
|------------------|---------------|--------------|-----------------------------------------------|
| anki-sync-server | 27701         | 27701        | Sync protocol for Anki desktop/mobile clients |
| anki-web-server  | 8080          | 8081         | Web interface and sync proxy                  |

## Deployment via Portainer

1. In Portainer, go to **Stacks > Add stack**.
2. Paste the contents of `Copilot.AI/multi-lingua/portainer-stack-anki.yml`.
3. Before deploying, update:
   - The volume path (`/volume1/docker/anki-server`) to match your NAS.
   - The `ANKI_SYNC_SERVER_USER_1` value to your desired `username:password`.
4. Deploy the stack.

## Reverse Proxy Setup (Synology DSM)

In **Control Panel > Login Portal > Advanced > Reverse Proxy**, create two entries:

### Anki Sync Server

| Field                | Value                      |
|----------------------|----------------------------|
| Description          | Anki Sync Server           |
| Source Protocol      | HTTPS                      |
| Source Hostname      | `anki-sync.your-domain.me` |
| Source Port          | 443                        |
| Destination Protocol | HTTP                       |
| Destination Hostname | `localhost`                |
| Destination Port     | 27701                      |

### Anki Web Interface

| Field                | Value                     |
|----------------------|---------------------------|
| Description          | Anki Web Interface        |
| Source Protocol      | HTTPS                     |
| Source Hostname      | `anki-web.your-domain.me` |
| Source Port          | 443                       |
| Destination Protocol | HTTP                      |
| Destination Hostname | `localhost`               |
| Destination Port     | 8081                      |

## Configuring Anki Clients

### Anki Desktop (2.1.57+)

1. Open Anki, go to **Preferences > Syncing**.
2. Set the **Self-hosted sync server** URL to:
   ```
   https://anki-sync.your-domain.me
   ```
3. Log in with the credentials from `ANKI_SYNC_SERVER_USER_1`.

### AnkiDroid (Android)

1. Open AnkiDroid, go to **Settings > Advanced > Custom sync server**.
2. Set **Sync URL** to:
   ```
   https://anki-sync.your-domain.me
   ```
3. Set **Media sync URL** to:
   ```
   https://anki-sync.your-domain.me/msync
   ```

### AnkiMobile (iOS)

AnkiMobile supports custom sync servers since version 2.0.90:

1. Go to **Settings > Syncing > Custom Server**.
2. Enter the sync URL: `https://anki-sync.your-domain.me`
