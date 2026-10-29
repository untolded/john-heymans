#!/usr/bin/env bash
# The hero loop: the web keynote trailer (October 2026), an 8.72 s, 1920 x 1080 silent cut
# with "Hey mom, I made it" burned in as titles. It ends on the title card. The picture is
# letterboxed inside the frame (1920 x 812 at y=134), and the hero is full screen on every
# shape (app/story.css, .hero-screen), so the loop is re-framed shot by shot twice: once
# 16:9 for landscape screens and once 9:16 for upright ones. Both are cut from the picture
# inside the letterbox, so no bar ever shows.
#
#   scripts/encode-hero.sh [trailer.mp4]
#
# Every rendition is made from one lossless intermediate per frame shape, so
# nothing is encoded twice.
#
# Outputs, in public/story/film, each as AV1 (.webm), HEVC (-hevc.mp4) and H.264 (.mp4):
#   hero-loop            1920 x 1080  landscape screens: a 1440 x 812 window per shot. A 1440-wide
#                                     screen would show no more of the 2.36:1 picture than that
#                                     under object-fit: cover, so the upscale costs no detail
#                                     and the window, not the browser, decides what is cut.
#   hero-loop-portrait    720 x 1280  upright screens: a 456 x 812 window per shot on John
#   poster.jpg, poster-portrait.jpg   the first frame of each, painted before the video
#
# CRFs: VMAF against the lossless intermediates, 94+ for every file (October 2026).
set -euo pipefail
export PATH="/opt/homebrew/bin:$PATH"

src="${1:-media/Videos/20261025 John Heymans - Video web keynote.mp4}"
out="public/story/film"
# HERO_TMP keeps the lossless intermediates somewhere for comparing encodes.
tmp="${HERO_TMP:-$(mktemp -d)}"
mkdir -p "$tmp"
[[ -z "${HERO_TMP:-}" ]] && trap 'rm -rf "$tmp"' EXIT

# The whole trailer: 218 frames at 25 fps.
END=8.72
SCALE="flags=lanczos+accurate_rnd+full_chroma_int"
LOSSLESS=(-an -c:v libx264 -qp 0 -preset veryfast)

# The picture inside the letterbox.
PIC="crop=1920:812:0:134"
# The title card is white letters on black, so it is scaled whole and set on black: on a
# full-screen hero the black around it is the same night as the page.
CARD=7.96

# Landscape: a 1440 x 812 window per shot.   start  window x
WIDE=(
  "0.00 300"   # the start line in Paris, John flexing
  "0.72 0"     # in the pack
  "1.36 240"   # from above
  "2.04 100"   # on stage at Supernova, beside the cut-out
  "4.16 480"   # on stage, close
  "5.56 290"   # John flexing, "Hey mom, I made": the titles (x 300 to 1360) and his face (x 1120 to 1720)
)
# Upright: a 456 x 812 window per shot on John. In the flex shot he moves left as the
# camera pulls round, so the window follows him: x eases from the first value to the second
# over the shot's second second. The titles cannot fit a phone's width here; the card says
# them whole a second later.   start  window x  [x at the end]
TALL=(
  "0.00 912"
  "0.72 627"
  "1.36 417"
  "2.04 600"
  "4.16 760"
  "5.56 1370 972"
)

# One lossless file of shots, each cut from the source with its own filter, then the card.
#   cut <name> <out w> <out h> <window w> <list...>
cut() {
  local name="$1" ow="$2" oh="$3" ww="$4"; shift 4
  local shots=("$@") list="$tmp/$name.txt" i
  : >"$list"
  for ((i = 0; i < ${#shots[@]}; i++)); do
    local a x x2
    read -r a x x2 <<<"${shots[$i]}"
    local b="$CARD"
    [[ $((i + 1)) -lt ${#shots[@]} ]] && read -r b _ <<<"${shots[$((i + 1))]}"
    local frames; frames=$(awk -v a="$a" -v b="$b" 'BEGIN { printf "%d", (b - a) * 25 + 0.5 }')
    # A moving window eases with a smoothstep between 1 s and 2 s into the shot.
    local cx="$x"
    [[ -n "${x2:-}" ]] && cx="'$x+($x2-$x)*(3*pow(clip(t-1,0,1),2)-2*pow(clip(t-1,0,1),3))'"
    ffmpeg -v error -y -ss "$a" -i "$src" -frames:v "$frames" \
      -vf "$PIC,crop=$ww:812:$cx:0,scale=$ow:$oh:$SCALE,setsar=1,format=yuv444p10le" "${LOSSLESS[@]}" "$tmp/$name-$i.mkv"
    echo "file '$tmp/$name-$i.mkv'" >>"$list"
  done
  ffmpeg -v error -y -ss "$CARD" -i "$src" -t "$(awk -v a="$CARD" -v b="$END" 'BEGIN { print b - a }')" \
    -vf "$PIC,scale=$ow:-2:$SCALE,pad=$ow:$oh:0:(oh-ih)/2:black,setsar=1,format=yuv444p10le" "${LOSSLESS[@]}" "$tmp/$name-card.mkv"
  echo "file '$tmp/$name-card.mkv'" >>"$list"
  ffmpeg -v error -y -f concat -safe 0 -i "$list" -c copy "$tmp/$name.mkv"
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
cut wide 1920 1080 1440 "${WIDE[@]}"
cut tall 720 1280 456 "${TALL[@]}"

encode wide hero-loop "${CRF_WIDE:-46}" "${CRF_WIDE_HEVC:-31}" "${CRF_WIDE_X264:-28}"
encode tall hero-loop-portrait "${CRF_TALL:-44}" "${CRF_TALL_HEVC:-30}" "${CRF_TALL_X264:-27}"

# Posters: the first frame, matched to the loop so the video takes over without a jump. They are
# the page's largest paint, so they stay small: next/image re-encodes them per screen anyway.
ffmpeg -v error -y -i "$tmp/wide.mkv" -frames:v 1 -pix_fmt rgb24 "$tmp/poster.png"
ffmpeg -v error -y -i "$tmp/tall.mkv" -frames:v 1 -pix_fmt rgb24 "$tmp/poster-portrait.png"
jpeg "$tmp/poster.png" "$out/poster.jpg" 82
jpeg "$tmp/poster-portrait.png" "$out/poster-portrait.jpg" 82

# Loops from an earlier, 4K-sourced cut must not outlive it.
rm -f "$out"/hero-loop-1440.webm "$out"/hero-loop-1440-hevc.mp4 "$out"/hero-loop-1440.mp4

ls -la "$out" | grep -E "hero-loop|poster"
