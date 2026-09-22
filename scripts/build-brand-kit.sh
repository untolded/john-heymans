#!/usr/bin/env bash
# One zip of everything on the brand guide, for anyone who would rather not
# click twenty five links. Re-run whenever an asset in public/brand changes.
#
#   scripts/build-brand-kit.sh
set -euo pipefail
cd "$(dirname "$0")/.."

out="public/brand/john-heymans-brand-kit.zip"
rm -f "$out"
cp docs/brand-guide.md public/brand/brand-guide.md
( cd public/brand && zip -qr "$(basename "$out")" \
    fonts wordmark palette templates texture motion brand-guide.md \
    -x "*.DS_Store" )
rm -f public/brand/brand-guide.md
printf "%s, %s\n" "$out" "$(du -h "$out" | cut -f1)"
