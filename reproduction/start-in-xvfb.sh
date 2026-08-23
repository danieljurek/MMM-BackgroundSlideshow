#!/bin/sh

set -eu

readonly display_number='99'
readonly display=":${display_number}"
readonly xvfb_log='/tmp/mmm-backgroundslideshow-xvfb.log'

Xvfb "${display}" -screen 0 1280x1024x24 -nolisten tcp >"${xvfb_log}" 2>&1 &
xvfb_pid=$!

cleanup () {
  kill "${xvfb_pid}" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

attempt=0
while [ ! -S "/tmp/.X11-unix/X${display_number}" ]; do
  if ! kill -0 "${xvfb_pid}" 2>/dev/null; then
    cat "${xvfb_log}"
    exit 1
  fi
  attempt=$((attempt + 1))
  if [ "${attempt}" -ge 100 ]; then
    echo 'Timed out waiting for Xvfb' >&2
    exit 1
  fi
  sleep 0.05
done

export DISPLAY="${display}"

./node_modules/.bin/electron \
  --no-sandbox \
  --remote-debugging-port=9222 \
  --js-flags=--max-old-space-size=440 \
  js/electron.js
