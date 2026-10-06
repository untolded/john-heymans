#!/usr/bin/env bash
# The hero loop: the film's own opening, cut straight from the 4K master. It
# is the trailer the film playbook asks for. The live TV commentary is burned
# into the picture ("This is good running from Heymans", "He's going to make
# the final", "Hey mom, I made it"), so the loop is already talking, muted,
# before anyone touches it. It ends on the "Hey mom, I made it" title card,
# the frame before the film cuts to black.
#
#   scripts/encode-hero.sh [master.mp4]
#
# Every rendition is made from one lossless intermediate per frame shape, so
# nothing is encoded twice.
#
# Outputs, in public/story/film, each as AV1 (.webm), HEVC (-hevc.mp4) and H.264 (.mp4):
#   hero-loop            1920 x 1080  landscape screens
#   hero-loop-1440       2560 x 1440  large and high-density landscape screens
#   hero-loop-portrait   1080 x 1080  upright screens: a square, re-framed per shot so the
#                                     captions stay whole, shown as a band in the hero
#   poster.jpg, poster-portrait.jpg   the first frame of each, painted before the video
#
# Quality is set by VMAF against the lossless intermediate (round 13): every
# file scores 95 or more, the level where the caption edges stay clean.
set -euo pipefail
export PATH="/opt/homebrew/bin:$PATH"

src="${1:-media/Videos/20260826 John Heymans - Video keynote v2.mp4}"
out="public/story/film"
# HERO_TMP keeps the lossless intermediates somewhere for comparing encodes.
tmp="${HERO_TMP:-$(mktemp -d)}"
mkdir -p "$tmp"
[[ -z "${HERO_TMP:-}" ]] && trap 'rm -rf "$tmp"' EXIT

# The trailer runs from the first frame to the cut to black at 10.40 s (260 frames at 25 fps).
END=10.40
SCALE="flags=lanczos+accurate_rnd+full_chroma_int"
LOSSLESS=(-an -c:v libx264 -qp 0 -preset veryfast)

# The square follows the captions shot by shot: a window from the 3840 x 2160
# frame, its left edge chosen so each line of commentary stays whole. A window
# wider than 2160 is scaled to the square's width and set on black; the bars
# fall inside the fade the page puts on the band. The title card is black
# around its letters, so it is scaled whole the same way.
#   start  window x (or "card")  window width (2160 if not given)
SQUARE=(
  "0.00 700"        # stadium, "This is good running from Heymans"
  "1.52 100"        # in the pack, "Right up alongside"
  "2.64 1500"       # from above, "The very best in the world"
  "3.72 640"        # Belgian fans, "Heymans has found a way through"
  "4.80 660"        # the fan with his hands on his head, "... on the inside"
  "5.84 870"        # the finish, "He's going to make the final"
  "7.24 400 2560"   # John flexing, "Hey mom, I made": the widest line, so the widest window
  "9.64 card"       # "Hey mom, I made it"
)

# Landscape: the whole frame, scaled once per size.
landscape() {
  local name="$1" w="$2" h="$3"
  ffmpeg -v error -y -i "$src" -t "$END" \
    -vf "scale=$w:$h:$SCALE,setsar=1,format=yuv444p10le" "${LOSSLESS[@]}" "$tmp/$name.mkv"
}

square() {
  local list="$tmp/square.txt" n=0 i
  : >"$list"
  for ((i = 0; i < ${#SQUARE[@]}; i++)); do
    local a x w
    read -r a x w <<<"${SQUARE[$i]}"
    local b="$END"
    [[ $((i + 1)) -lt ${#SQUARE[@]} ]] && read -r b _ <<<"${SQUARE[$((i + 1))]}"
    local frames; frames=$(awk -v a="$a" -v b="$b" 'BEGIN { printf "%d", (b - a) * 25 + 0.5 }')
    local vf="crop=${w:-2160}:2160:$x:0,scale=1080:-2:$SCALE,pad=1080:1080:0:(oh-ih)/2:black"
    [[ "$x" == card ]] && vf="scale=1080:-2:$SCALE,pad=1080:1080:0:(oh-ih)/2:black"
    ffmpeg -v error -y -ss "$a" -i "$src" -frames:v "$frames" \
      -vf "$vf,setsar=1,format=yuv444p10le" "${LOSSLESS[@]}" "$tmp/square-$n.mkv"
    echo "file '$tmp/square-$n.mkv'" >>"$list"
    n=$((n + 1))
  done
  ffmpeg -v error -y -f concat -safe 0 -i "$list" -c copy "$tmp/square.mkv"
}

# AV1 in WebM first (10-bit: no banding in the dark stands), then HEVC for Safari and iPhones
# without AV1, then H.264 for everything else. A keyframe every 2 s lets a slow connection
# start playing before the whole file has arrived.
encode() {
  local shape="$1" name="$2" av1_crf="$3" hevc_crf="$4" x264_crf="$5"
  ffmpeg -v error -y -i "$tmp/$shape.mkv" -an -c:v libsvtav1 -preset 3 -crf "$av1_crf" -pix_fmt yuv420p10le -g 50 \
    -svtav1-params "tune=0:enable-overlays=1:scd=1" "$out/$name.webm" 2>/dev/null
  ffmpeg -v error -y -i "$tmp/$shape.mkv" -an -c:v libx265 -preset slow -crf "$hevc_crf" -pix_fmt yuv420p \
    -profile:v main -tag:v hvc1 -x265-params "log-level=error:keyint=50" -movflags +faststart "$out/$name-hevc.mp4"
  ffmpeg -v error -y -i "$tmp/$shape.mkv" -an -c:v libx264 -preset slower -crf "$x264_crf" -tune film -g 50 \
    -profile:v high -pix_fmt yuv420p -movflags +faststart "$out/$name.mp4"
}

jpeg() {
  node -e '
    const sharp = require("sharp");
    const [src, dst, q] = process.argv.slice(1);
    sharp(src).jpeg({ quality: Number(q), mozjpeg: true }).toFile(dst);
  ' "$1" "$2" "$3"
}

mkdir -p "$out"
landscape land-1080 1920 1080
landscape land-1440 2560 1440
square

encode land-1080 hero-loop "${CRF_1080:-46}" "${CRF_1080_HEVC:-31}" "${CRF_1080_X264:-28}"
encode land-1440 hero-loop-1440 "${CRF_1440:-48}" "${CRF_1440_HEVC:-32}" "${CRF_1440_X264:-29}"
encode square hero-loop-portrait "${CRF_SQ:-46}" "${CRF_SQ_HEVC:-31}" "${CRF_SQ_X264:-28}"

# Posters: the first frame, matched to the loop so the video takes over without a jump. They are
# the page's largest paint, so they stay small: next/image re-encodes them per screen anyway.
ffmpeg -v error -y -i "$tmp/land-1440.mkv" -frames:v 1 -pix_fmt rgb24 "$tmp/poster.png"
ffmpeg -v error -y -i "$tmp/square.mkv" -frames:v 1 -pix_fmt rgb24 "$tmp/poster-portrait.png"
jpeg "$tmp/poster.png" "$out/poster.jpg" 82
jpeg "$tmp/poster-portrait.png" "$out/poster-portrait.jpg" 82

ls -la "$out" | grep -E "hero-loop|poster"
