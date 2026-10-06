#!/usr/bin/env bash
# The keynote film as an adaptive HLS ladder, so the player starts on a small rendition
# within a second and steps up as the connection allows. Safari and iPhones play the
# master playlist natively; other browsers load hls.js only when the film opens
# (components/story/media/FilmModal.tsx). The progressive files from
# scripts/encode-video.sh film stay as the fallback.
#
#   scripts/encode-film-hls.sh [master.mp4]
#
# Out: public/story/film/hls/
#   master.m3u8                     the four renditions with bandwidth, resolution and codecs
#   360p/ 540p/ 720p/ 1080p/        index.m3u8, init_N.mp4 and 2-second fMP4 segments
#
# H.264 High + AAC-LC in every rendition (muxed, so a switch never loses sync), a keyframe
# exactly every 2 s (25 fps, GOP 50, no scene-cut keyframes) so every segment starts on
# one and all four renditions cut at the same times. Capped CRF: constant quality where
# the film is easy, a hard ceiling where it is busy, so the bandwidth figures in the
# master playlist hold. Uses Homebrew ffmpeg.
set -euo pipefail
export PATH="/opt/homebrew/bin:$PATH"

src="${1:-media/Videos/20260826 John Heymans - Video keynote v2.mp4}"
out="public/story/film/hls"
rm -rf "$out"
mkdir -p "$out"/{360p,540p,720p,1080p}

# height  crf  maxrate  bufsize  audio
ladder=(
  "360  25 700k  1400k 96k"
  "540  24 1400k 2800k 128k"
  "720  23 2600k 5200k 128k"
  "1080 22 5000k 10000k 160k"
)

split="[0:v]fps=25,split=4[v0][v1][v2][v3]"
filters="$split"
maps=()
streammap=""
for i in "${!ladder[@]}"; do
  read -r h crf max buf ab <<<"${ladder[$i]}"
  filters+=";[v$i]scale=-2:$h:flags=lanczos,format=yuv420p[o$i]"
  maps+=(-map "[o$i]" -map 0:a:0
    -c:v:$i libx264 -crf:v:$i "$crf" -maxrate:v:$i "$max" -bufsize:v:$i "$buf"
    -c:a:$i aac -b:a:$i "$ab" -ac:a:$i 2 -ar:a:$i 48000)
  streammap+="v:$i,a:$i,name:${h}p "
done

ffmpeg -v error -stats -y -i "$src" -filter_complex "$filters" "${maps[@]}" \
  -preset slow -profile:v high -g 50 -keyint_min 50 -sc_threshold 0 \
  -x264-params "open-gop=0" \
  -f hls -hls_time 2 -hls_playlist_type vod -hls_segment_type fmp4 \
  -hls_flags independent_segments \
  -hls_segment_filename "$out/%v/seg-%03d.m4s" \
  -master_pl_name master.m3u8 \
  -var_stream_map "${streammap% }" \
  "$out/%v/index.m3u8"

du -sh "$out"/*/ | sed 's#public/story/film/hls/##'
cat "$out/master.m3u8"
