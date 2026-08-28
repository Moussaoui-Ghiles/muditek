#!/usr/bin/env bash
set -euo pipefail

name="${1:-}"
domain="${2:-}"
output_folder="${3:-.}"

if [[ -z "$name" || -z "$domain" ]]; then
  echo "Usage: $0 <name> <domain> [output-folder]" >&2
  exit 1
fi

mkdir -p "$output_folder"
output_file="${output_folder}/${name}.png"
url="https://www.google.com/s2/favicons?domain=${domain}&sz=128"

curl --fail --location --silent --show-error "$url" --output "$output_file"

if ! file "$output_file" | grep -q "PNG image data"; then
  echo "Downloaded file is not a PNG: ${output_file}" >&2
  exit 2
fi

echo "saved ${output_file}"
