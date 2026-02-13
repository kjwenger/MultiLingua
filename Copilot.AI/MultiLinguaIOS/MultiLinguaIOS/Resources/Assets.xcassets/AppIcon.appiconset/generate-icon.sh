#!/bin/bash
# Generates the iOS app icon from the shared SVG source.
#
# Source: ../../../../../../../multi-lingua/public/icon.svg
# Design: Blue rounded-rect background (#3B82F6) with the Heroicons
#         "language" icon (https://heroicons.com — outline, 24x24).
#         Same icon is used on the Next.js landing page and as PWA icon.
#
# Requires: rsvg-convert (brew install librsvg)
#
# Usage: ./generate-icon.sh

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SVG_SOURCE="$SCRIPT_DIR/../../../../../../../multi-lingua/public/icon.svg"

if ! command -v rsvg-convert &>/dev/null; then
  echo "Error: rsvg-convert not found. Install with: brew install librsvg"
  exit 1
fi

rsvg-convert -w 1024 -h 1024 "$SVG_SOURCE" -o "$SCRIPT_DIR/AppIcon.png"
echo "Generated AppIcon.png (1024x1024) from icon.svg"
