#!/usr/bin/env bash
# Web versions of the story's videos, other than the hero loop (scripts/encode-hero.sh).
# Every video ships as AV1 in WebM, HEVC in MP4 (-hevc.mp4) and H.264 in MP4, best first
# (lib/story/video.ts). Uses Homebrew ffmpeg.
#
#   scripts/encode-video.sh kenya <source> <name> <start> <seconds> <crop-y> [graded]
#       A muted stage clip from the vertical Kenya footage: a 1080 x 608 band at crop-y,
#       upscaled with Lanczos to 1920 x 1080 for wide screens, and the full 1080 x 1920
#       frame for upright phones. Poster from the first frame. Into public/story/kenya.
#       "graded" is for a clip the stage darkens and grains over (the prologue), which
#       hides fine detail and so can be compressed further.
#   scripts/encode-video.sh clip <source> <name>
#       An audience clip: 1080 x 1920 with sound for the dialog, and a light 540 x 960
#       muted preview of its first ten seconds for the wall. Into public/videos.
#   scripts/encode-video.sh film <source> <name>
#       The film with sound, 1920 x 1080, for the film dialog. Into public/story/film.
#
# CRFs were chosen by VMAF against lossless intermediates (round 12). The phone and drone
# footage carries sensor noise and costs far more bits than the 4K film for the same score.
# Pre-scaling the 1080-wide Kenya band to 1920 with Lanczos beats letting the browser
# stretch it: at the same bitrate it scored 86 against 73 at display size.
set -euo pipefail
export PATH="/opt/homebrew/bin:$PATH"

kind="${1:?kind: kenya | clip | film}"
src="${2:?source file}"
name="${3:?output name without extension}"

av1() { # in out crf [extra ffmpeg args...]
  local in="$1" out="$2" crf="$3"; shift 3
  ffmpeg -v error -y -i "$in" "$@" -c:v libsvtav1 -preset 4 -crf "$crf" -pix_fmt yuv420p10le \
    -svtav1-params "tune=0:scd=1" "$out" 2>/dev/null
}
hevc() {
  local in="$1" out="$2" crf="$3"; shift 3
  ffmpeg -v error -y -i "$in" "$@" -c:v libx265 -preset slow -crf "$crf" -pix_fmt yuv420p -profile:v main \
    -tag:v hvc1 -x265-params log-level=error -movflags +faststart "$out"
}
h264() {
  local in="$1" out="$2" crf="$3"; shift 3
  ffmpeg -v error -y -i "$in" "$@" -c:v libx264 -preset slower -crf "$crf" -profile:v high -pix_fmt yuv420p \
    -movflags +faststart "$out"
}
# All three, from a lossless intermediate.
ladder() { # in base av1 hevc h264 [audio args for webm] [audio args for mp4]
  local in="$1" base="$2"
  av1 "$in" "$base.webm" "$3" ${6:--an}
  hevc "$in" "$base-hevc.mp4" "$4" ${7:--an}
  h264 "$in" "$base.mp4" "$5" ${7:--an}
}
poster() { # in out.jpg [width]
  local png; png="$(mktemp).png"
  ffmpeg -v error -y -i "$1" -frames:v 1 -vf "scale=${3:--1}:-2:flags=lanczos" -pix_fmt rgb24 "$png"
  node -e 'require("sharp")(process.argv[1]).jpeg({ quality: 86, mozjpeg: true }).toFile(process.argv[2])' "$png" "$2"
  rm -f "$png"
}

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
lossless=(-c:v libx264 -qp 0 -preset veryfast)

case "$kind" in
  kenya)
    start="${4:?start in seconds}"; secs="${5:?length in seconds}"; y="${6:?crop y}"
    out="public/story/kenya"; mkdir -p "$out"
    ffmpeg -v error -y -ss "$start" -i "$src" -t "$secs" -an \
      -vf "crop=1080:608:0:$y,scale=1920:1080:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv444p10le" "${lossless[@]}" "$tmp/land.mkv"
    ffmpeg -v error -y -ss "$start" -i "$src" -t "$secs" -an -vf "format=yuv444p10le" "${lossless[@]}" "$tmp/port.mkv"
    if [[ "${7:-}" == graded ]]; then crf=(42 31 28); else crf=(36 28 25); fi
    ladder "$tmp/land.mkv" "$out/$name" "${crf[@]}"
    ladder "$tmp/port.mkv" "$out/$name-portrait" "${crf[@]}"
    poster "$tmp/land.mkv" "$out/$name.jpg"
    rm -f "$out/$name-portrait.jpg"
    ;;
  clip)
    out="public/videos"; mkdir -p "$out"
    ffmpeg -v error -y -i "$src" -vf "scale=1080:1920:flags=lanczos,format=yuv444p10le" -c:a pcm_s16le "${lossless[@]}" "$tmp/full.mkv"
    ladder "$tmp/full.mkv" "$out/$name" 34 27 24 "-c:a libopus -b:a 96k" "-c:a aac -b:a 128k"
    ffmpeg -v error -y -i "$tmp/full.mkv" -t 10 -an -vf "scale=540:960:flags=lanczos" "${lossless[@]}" "$tmp/preview.mkv"
    ladder "$tmp/preview.mkv" "$out/$name-preview" 36 29 26
    # The wall's first paint and the dialog's first frame, so sharper than the preview itself.
    poster "$tmp/full.mkv" "$out/$name.jpg" 720
    ;;
  film)
    out="public/story/film"; mkdir -p "$out"
    ffmpeg -v error -y -i "$src" -vf "scale=1920:1080:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv444p10le" -c:a pcm_s16le "${lossless[@]}" "$tmp/film.mkv"
    ladder "$tmp/film.mkv" "$out/$name" 34 27 24 "-c:a libopus -b:a 128k" "-c:a aac -b:a 160k"
    ;;
  *) echo "unknown kind: $kind" >&2; exit 1 ;;
esac
ls -la "$out" | grep "$name" || true
