# Self-Hosting Anki on a Synology NAS with Portainer

This guide outlines a strategy for deploying a personal Anki sync server on a Synology NAS using Docker. The primary goal is to gain control over your sync data and make it securely accessible from anywhere via the domain `anki.gertrun.synology.me`.

We will use Docker Compose within Portainer to manage the required services as a single "stack".

## 1. Understanding the "API"

It's crucial to understand the two different "APIs" in the Anki ecosystem:

1.  **Syncing API:** This is the internal API that Anki clients (Desktop, AnkiDroid, AnkiMobile) use to synchronize your collection with a server. By self-hosting the **Anki Sync Server**, you are creating your own private endpoint for this API. This is the focus of this guide.

2.  **Card Management API (Anki-Connect):** This is a RESTful API provided by the [Anki-Connect](https://github.com/FooSoft/anki-connect) plugin, which runs on the **Anki Desktop application**. It allows external applications to create cards, manage decks, and more. Self-hosting the sync server does **not** replace Anki-Connect. They serve different purposes but can be used together for a powerful, private setup.

## 2. Core Components

Our self-hosted setup will use two separate Docker containers managed by the `ankicommunity` project.

*   **Anki Sync Server (`ankicommunity/anki-sync-server`):** The essential backend. It emulates the official AnkiWeb sync server.
*   **Anki Web Server (`ankicommunity/anki-web-server`):** An optional web interface for reviewing cards. **Crucially, this service also acts as a proxy, directing sync requests to the sync server.** This simplifies our remote access setup.
*   **Portainer:** A web UI to manage Docker containers on your Synology NAS.

## 3. Deployment Strategy

### Part 1: Prerequisites

1.  **Docker on Synology:** Ensure the "Docker" package is installed from the Package Center.
2.  **Portainer:** Have Portainer installed and running.
3.  **Domain and SSL:** You must have your Synology DDNS service configured so that `gertrun.synology.me` points to your NAS. You also need a valid SSL certificate for `*.gertrun.synology.me` or `anki.gertrun.synology.me`. You can get a free one from Let's Encrypt within the Synology Control Panel (**Security** > **Certificate**).
4.  **Persistent Data Folder:** Create a dedicated folder on your NAS to store the Anki server data. This ensures your collection persists even if the container is removed or updated.
    *   Example path: `/volume1/docker/anki-server`

### Part 2: Deploy the Anki Stack with Docker Compose

Instead of deploying containers individually, we will use Portainer's "Stacks" feature, which uses Docker Compose. This makes management much simpler.

1.  Navigate to your Portainer web interface.
2.  Go to **Stacks** and click **+ Add stack**.
3.  **Configuration:**
    *   **Name:** `anki`
    *   **Web editor:** Paste the following `docker-compose` configuration into the editor.

```yaml
version: '3.8'

# This file defines two services: the Anki sync server and a web interface.
# The web server also acts as a proxy for the sync server, simplifying remote access.

services:
  # The core sync server
  anki-sync-server:
    image: ankicommunity/anki-sync-server:latest
    container_name: anki-sync-server
    volumes:
      # Mounts a folder from your NAS to store the Anki database.
      # IMPORTANT: Replace the path on the left with the real path on your Synology NAS.
      - /volume1/docker/anki-server:/data
    environment:
      # Sets the first user account and password.
      # IMPORTANT: Change this to a secure and private username and password.
      - ANKI_SYNC_SERVER_USER_1=your_username:your_very_strong_password
    restart: unless-stopped

  # The web interface and sync proxy
  anki-web-server:
    image: ankicommunity/anki-web-server:latest
    container_name: anki-web-server
    ports:
      # Exposes the web server on port 8081 of your NAS.
      - "8081:8080"
    environment:
      # Tells the web server where to find the sync server.
      # 'anki-sync-server' is the service name defined above.
      - ANKI_SYNC_SERVER_URL=http://anki-sync-server:27701
      - ANKI_WEB_SERVER_HOST=0.0.0.0
    depends_on:
      - anki-sync-server
    restart: unless-stopped

# Creates a dedicated network for the Anki services to communicate.
networks:
  default:
    name: anki-network
```

4.  **Deploy the Stack:**
    *   **CRITICAL:** Before deploying, make sure you have edited the `volumes` path and the `ANKI_SYNC_SERVER_USER_1` environment variable in the web editor.
    *   Click **Deploy the stack**. Portainer will now pull the images and start both containers.

### Part 3: Set Up the Reverse Proxy

This step will make your Anki stack securely available at `https://anki.gertrun.synology.me`.

1.  On your Synology NAS, go to **Control Panel** > **Login Portal** > **Advanced** > **Reverse Proxy**.
2.  Click **Create**.
3.  **Reverse Proxy Settings:**
    *   **Source:**
        *   **Hostname:** `anki.gertrun.synology.me`
        *   **Protocol:** `HTTPS`
        *   **Port:** `443`
        *   **Enable HSTS** (Recommended for security).
        *   **Enable HTTP/2** (Recommended for performance).
    *   **Destination:**
        *   **Hostname:** `localhost`
        *   **Protocol:** `HTTP`
        *   **Port:** `8081` (This is the host port you mapped for the `anki-web-server`).
4.  **Custom Header:**
    *   Switch to the **Custom Header** tab.
    *   Click the dropdown that says `Create` and select **WebSocket**. This will automatically add the required headers for the WebSocket protocol, which Anki's sync process may use.
5.  Click **Save**.

After a moment, you should be able to access the Anki web interface by navigating to `https://anki.gertrun.synology.me`.

### Part 4: Configure Anki Clients

Now, point your Anki clients to your new, secure sync server address.

1.  **Anki Desktop:**
    *   Open Anki, go to **Preferences** > **Sync**.
    *   Check the box for "Use self-hosted sync server".
    *   In the "Server address" field, enter: `https://anki.gertrun.synology.me`
    *   Click **OK**.
    *   Press "Sync" and enter the credentials you configured.

2.  **AnkiDroid/AnkiMobile:**
    *   In the app's sync settings, choose to use a custom server.
    *   Enter the full URL (`https://anki.gertrun.synology.me`) and your credentials.

## 4. Backups (Crucial)

Regularly back up the persistent data folder (`/volume1/docker/anki-server`) you created. This folder contains your entire Anki collection and user data. Use Synology's **Hyper Backup** or another backup solution of your choice.
