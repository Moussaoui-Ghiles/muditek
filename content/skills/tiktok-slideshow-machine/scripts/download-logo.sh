#!/usr/bin/env bash
# Download a tool's brand logo via Google's free favicon API.
# Usage: ./download-logo.sh <name> <domain> <output-folder>
#   ./download-logo.sh cursor cursor.com ./asset-library/logos
#
# Returns 128×128 PNG. No API key needed. ~5KB per logo.

set -e
name="$1"
domain="$2"
out_folder="${3:-.}"

if [[ -z "$name" || -z "$domain" ]]; then
  echo "Usage: $0 <name> <domain> [output-folder]"
  exit 1
fi

mkdir -p "$out_folder"
url="https://www.google.com/s2/favicons?domain=${domain}&sz=128"
out_file="${out_folder}/${name}.png"

curl -sL "$url" -o "$out_file"

# Verify it's a valid PNG
if file "$out_file" | grep -q "PNG image data"; then
  size=$(sips -g pixelWidth -g pixelHeight "$out_file" 2>/dev/null | tail -2 | awk '{print $2}' | paste -sd × -)
  echo "✓ ${name} (${size}) → ${out_file}"
else
  echo "✗ ${name} — not a valid PNG, possibly invalid domain"
  rm "$out_file"
  exit 2
fi
