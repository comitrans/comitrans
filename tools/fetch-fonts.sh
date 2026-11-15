#!/usr/bin/env bash
# Fetch the self-hosted webfonts: Sofia Sans, from the Fontsource packages on npm -> public/fonts.
#
# The files are committed, so this only needs running to change the families, the
# subsets or the pinned version. Each file is a variable font over the whole weight
# axis; public/css/01-base.css declares them, with the unicode ranges Fontsource cut
# the subsets by.
#
# Usage:
#   tools/fetch-fonts.sh
#
# Requires: npm, tar.
set -euo pipefail

cd "$(dirname "$0")/.."

version="5.3.0"
out="public/fonts"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

fetch() {
  local family="$1"
  shift
  mkdir -p "$tmp/$family"
  (cd "$tmp/$family" && npm pack --silent "@fontsource-variable/$family@$version" >/dev/null && tar -xzf ./*.tgz)
  for subset in "$@"; do
    cp "$tmp/$family/package/files/$family-$subset-wght-normal.woff2" "$out/$family-$subset.woff2"
  done
  cp "$tmp/$family/package/LICENSE" "$out/$family-OFL.txt"
}

mkdir -p "$out"
fetch sofia-sans latin latin-ext
fetch sofia-sans-extra-condensed latin latin-ext cyrillic

ls -l "$out" | awk 'NR > 1 { printf "%7d  %s\n", $5, $9 }'
