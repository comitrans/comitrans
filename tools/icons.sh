#!/usr/bin/env bash
# Render the raster icons from public/favicon.svg, which is served as well.
#
# Edit the vector and re-run rather than touching the PNGs, and commit them together.
#
# Usage:
#   tools/icons.sh
#
# Requires: rsvg-convert, oxipng.
set -euo pipefail

cd "$(dirname "$0")/.."

rsvg-convert -w 48 -h 48 public/favicon.svg -o public/favicon-48.png

# iOS rounds the corners itself, so its icon is drawn square.
sed 's/ rx="7"//' public/favicon.svg | rsvg-convert -w 180 -h 180 -o public/apple-touch-icon.png

oxipng -o 2 --strip safe public/favicon-48.png public/apple-touch-icon.png
