#!/bin/bash
# Generates the iOS app icon from the shared SVG source.
#
# <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-blue-600" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"></path></svg>
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
