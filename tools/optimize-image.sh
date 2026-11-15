#!/usr/bin/env bash
# Optimize a photo for the site.
# Resize (keep aspect, never upscale) -> STRIP ALL METADATA (incl. GPS) -> encode.
#
# Every image goes through this before it is committed: see CLAUDE.md.
# The output's extension picks the format. A cutout needs its transparency, so
# it is a .webp; a plain photo can be a .jpg.
#
# Usage:
#   tools/optimize-image.sh <input> <output.webp|output.jpg> [maxdim] [quality]
#
# Defaults: maxdim=1600, quality=82
#
# Presets (output -> maxdim / quality):
#   hero cutout   public/img/hero.webp    1600 / 82   (transparent background)
#   portrait      public/img/comi.webp     900 / 82
#
# Example:
#   tools/optimize-image.sh ~/shots/cutout.png public/img/hero.webp 1600 82
#
# Requires: ImageMagick (magick). exiftool optional (double-checks the GPS removal).
set -euo pipefail

in="${1:?usage: optimize-image.sh <input> <output.webp|output.jpg> [maxdim] [quality]}"
out="${2:?usage: optimize-image.sh <input> <output.webp|output.jpg> [maxdim] [quality]}"
max="${3:-1600}"
q="${4:-82}"

[ -f "$in" ] || { echo "input not found: $in" >&2; exit 1; }
mkdir -p "$(dirname "$out")"

magick "$in" -auto-orient -resize "${max}x${max}>" -strip -interlace Plane -quality "$q" "$out"

# Phone and drone exports carry exact coordinates.
if command -v exiftool >/dev/null 2>&1; then
  if exiftool -GPSLatitude -GPSLongitude "$out" 2>/dev/null | grep -qi gps; then
    echo "WARNING: GPS metadata still present in $out" >&2
  fi
fi

printf '%s  ->  %s  (%s, %s)\n' "$(basename "$in")" "$out" \
  "$(magick identify -format '%wx%h' "$out")" "$(du -h "$out" | cut -f1)"
