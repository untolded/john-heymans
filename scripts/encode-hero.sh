#!/usr/bin/env bash
# The hero loop, cut straight from the 4K master of the keynote film. Every
# rendition is made from one lossless intermediate per frame shape, so no
# shot is ever encoded twice (round 12: the round 10 loop re-used five shots
# from earlier web encodes, and the second generation is what looked soft).
#
#   scripts/encode-hero.sh [master.mp4]
#
# Six title-free shots, 7.08 s, opening on the face. Landscape crops keep to
# the top 74 percent of the frame, clear of the burned-in subtitle band; the
# arms-up shot is a tighter 1920 x 1080 crop on the face. Crops were matched
# against the round 10 loop to the pixel, so the framing is unchanged.
#
# Outputs, in public/story/film, each as AV1 (.webm), HEVC (-hevc.mp4) and H.264 (.mp4):
#   hero-loop            1920 x 1080  most screens
#   hero-loop-1440       2560 x 1440  large and high-density screens
#   hero-loop-portrait   1080 x 1920  phones held upright
#   poster.jpg, poster-portrait.jpg   first frame, painted before the video
#
# Quality was set by VMAF against the lossless intermediate (round 12): the
# CRFs below all score 97 to 98, where the round 10 files scored 90 to 92.
set -euo pipefail
export PATH="/opt/homebrew/bin:$PATH"

src="${1:-media/Videos/20260826 John Heymans - Video keynote v2.mp4}"
out="public/story/film"
# HERO_TMP keeps the lossless intermediates somewhere for comparing encodes.
tmp="${HERO_TMP:-$(mktemp -d)}"
mkdir -p "$tmp"
[[ -z "${HERO_TMP:-}" ]] && trap 'rm -rf "$tmp"' EXIT

# name  start  end  landscape crop (w:h:x:y)  portrait crop (w:h:x:y)
SHOTS=(
  "arms      39.20 40.44 1920:1080:880:260  900:1600:1360:60"
  "budapest  24.64 26.24 2841:1598:500:0    900:1600:1350:0"
  "headon    32.56 33.64 2841:1598:500:0    900:1600:2510:0"
  "supernova 33.72 34.72 2841:1598:500:0    900:1600:1310:0"
  "back      13.76 15.08 2841:1598:500:0    1215:2160:953:0"
  "wide      38.28 39.12 2841:1598:500:0    900:1600:1470:0"
)

# One lossless intermediate per shape: each shot cut on its exact frames, cropped, scaled with
# Lanczos into 10-bit 4:4:4, then the shots joined without re-encoding.
master() {
  local shape="$1" w="$2" h="$3" col="$4"
  local n=0 list="$tmp/$shape.txt"
  : >"$list"
  for shot in "${SHOTS[@]}"; do
    read -r _ a b land port <<<"$shot"
    local crop="$land"; [[ "$col" == port ]] && crop="$port"
    local frames; frames=$(awk -v a="$a" -v b="$b" 'BEGIN { printf "%d", (b - a) * 25 + 0.5 }')
    ffmpeg -v error -y -ss "$a" -i "$src" -frames:v "$frames" -an \
      -vf "crop=$crop,scale=$w:$h:flags=lanczos+accurate_rnd+full_chroma_int,setsar=1,format=yuv444p10le" \
      -c:v libx264 -qp 0 -preset veryfast "$tmp/$shape-$n.mkv"
    echo "file '$tmp/$shape-$n.mkv'" >>"$list"
    n=$((n + 1))
  done
  ffmpeg -v error -y -f concat -safe 0 -i "$list" -c copy "$tmp/$shape.mkv"
}

# AV1 in WebM first (10-bit: no banding in the dark stage shot), then HEVC for Safari and iPhones
# without AV1, then H.264 for everything else. One keyframe at the start is all a 7-second loop needs.
encode() {
  local shape="$1" name="$2" av1_crf="$3" hevc_crf="$4" x264_crf="$5"
  ffmpeg -v error -y -i "$tmp/$shape.mkv" -an -c:v libsvtav1 -preset 3 -crf "$av1_crf" -pix_fmt yuv420p10le \
    -svtav1-params "tune=0:enable-overlays=1:scd=1" "$out/$name.webm" 2>/dev/null
  ffmpeg -v error -y -i "$tmp/$shape.mkv" -an -c:v libx265 -preset slow -crf "$hevc_crf" -pix_fmt yuv420p \
    -profile:v main -tag:v hvc1 -x265-params log-level=error -movflags +faststart "$out/$name-hevc.mp4"
  ffmpeg -v error -y -i "$tmp/$shape.mkv" -an -c:v libx264 -preset slower -crf "$x264_crf" -tune film \
    -profile:v high -pix_fmt yuv420p -movflags +faststart "$out/$name.mp4"
}

mkdir -p "$out"
master land-1080 1920 1080 land
master land-1440 2560 1440 land
master port-1920 1080 1920 port

encode land-1080 hero-loop 35 27 25
encode land-1440 hero-loop-1440 36 28 26
encode port-1920 hero-loop-portrait 36 28 25

# Posters: the first frame, at the size next/image may need to serve on a large screen.
ffmpeg -v error -y -i "$tmp/land-1440.mkv" -frames:v 1 -pix_fmt rgb24 "$tmp/poster.png"
ffmpeg -v error -y -i "$tmp/port-1920.mkv" -frames:v 1 -pix_fmt rgb24 "$tmp/poster-portrait.png"
node -e '
  const sharp = require("sharp");
  const [src, dst] = process.argv.slice(1);
  sharp(src).jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(dst);
' "$tmp/poster.png" "$out/poster.jpg"
node -e '
  const sharp = require("sharp");
  const [src, dst] = process.argv.slice(1);
  sharp(src).jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(dst);
' "$tmp/poster-portrait.png" "$out/poster-portrait.jpg"

ls -la "$out" | grep -E "hero-loop|poster"
