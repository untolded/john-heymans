#!/usr/bin/env bash
# Web versions of the film assets. Uses Homebrew ffmpeg.
#
#   scripts/encode-video.sh loop     <source> <out-name>   muted hero loop, MP4 + AV1 WebM + posters
#   scripts/encode-video.sh portrait <source> <out-name>   muted vertical loop for phones (720 x 1280)
#   scripts/encode-video.sh film     <source> <out-name>   the film with sound, for the modal
#   scripts/encode-video.sh clip     <source> <out-name>   an audience clip with sound (720 x 1280)
#
# Outputs go to public/story/film (loops, film) or public/videos (clips).
# Budgets: desktop loop under 4 MB, phone loop under 2.5 MB.
set -euo pipefail
export PATH="/opt/homebrew/bin:$PATH"

kind="${1:?kind: loop | portrait | film | clip}"
src="${2:?source file}"
name="${3:?output name without extension}"

case "$kind" in
  loop)
    out="public/story/film"; mkdir -p "$out"
    ffmpeg -y -i "$src" -vf "scale=1920:-2" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart -an "$out/$name.mp4"
    ffmpeg -y -i "$src" -vf "scale=1920:-2" -c:v libsvtav1 -crf 38 -preset 6 -pix_fmt yuv420p10le -an "$out/$name.webm"
    ffmpeg -y -i "$src" -vframes 1 -vf "scale=1920:-2" -q:v 3 "$out/poster.jpg"
    ;;
  portrait)
    out="public/story/film"; mkdir -p "$out"
    ffmpeg -y -i "$src" -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart -an "$out/$name.mp4"
    ffmpeg -y -i "$src" -vframes 1 -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" -q:v 3 "$out/poster-portrait.jpg"
    ;;
  film)
    out="public/story/film"; mkdir -p "$out"
    ffmpeg -y -i "$src" -vf "scale=1920:-2" -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart "$out/$name.mp4"
    ;;
  clip)
    out="public/videos"; mkdir -p "$out"
    ffmpeg -y -i "$src" -vf "scale=-2:1280" -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$out/$name.mp4"
    ffmpeg -y -i "$src" -vframes 1 -vf "scale=-2:1280" -q:v 3 "$out/$name.jpg"
    ;;
  *) echo "unknown kind: $kind" >&2; exit 1 ;;
esac
ls -la "$out" | grep "$name" || true
