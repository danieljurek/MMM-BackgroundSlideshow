# Minimal renderer memory reproduction

This reproduction supports
[issue 187](https://github.com/darickc/MMM-BackgroundSlideshow/issues/187) by
isolating the local-image transport and Electron rendering path of
`MMM-BackgroundSlideshow`. It runs no other MagicMirror modules and cycles two
4096-by-4096 PNG images every two seconds. Image resizing, transitions, image
information, progress display, and background animation are disabled.

The image files are downloaded at test time into `/tmp`; no image binaries are
stored in this repository.

## Test environment

Run these commands from the MagicMirror installation directory. The module is
expected at `modules/MMM-BackgroundSlideshow`.

First fetch the test images:

```sh
modules/MMM-BackgroundSlideshow/reproduction/fetch-images.sh
```

Stop a PM2-managed instance so it cannot hide or restart the failing process:

```sh
pm2 stop mm
```

Check the isolated configuration and start Electron directly:

```sh
MM_CONFIG_FILE="$PWD/modules/MMM-BackgroundSlideshow/reproduction/config.js" \
  npm run config:check
MM_CONFIG_FILE="$PWD/modules/MMM-BackgroundSlideshow/reproduction/config.js" \
  npm run start:dev
```

In a second terminal, sample the Electron processes once per minute:

```sh
while true; do
  date --iso-8601=seconds
  ps -eo pid,ppid,rss,%mem,etime,args --sort=-rss | \
    awk 'NR == 1 || /electron/ { print }'
  sleep 60
done | tee ~/mmm-backgroundslideshow-memory.log
```

## Expected and observed behavior

Expected behavior: after initial loading, renderer memory should remain bounded as
the same two images cycle.

Failure behavior: renderer memory continues to grow despite garbage collection,
then Electron exits with a message similar to:

```text
V8 javascript OOM (Reached heap limit)
```

To compare the documented mitigation, change `resizeImages` to `true` in
`config.js` and add `maxWidth: 1920` and `maxHeight: 1080`. Do not change any
other setting or test input between runs.

## Test image provenance

The fixtures are NASA Scientific Visualization Studio's Blue Marble east and
west hemisphere images from visualization
[2915](https://svs.gsfc.nasa.gov/2915/). NASA SVS states that its content is in
the public domain unless otherwise noted. The source page does not note an
exception for these images. NASA should be acknowledged as the source.

See the [NASA SVS usage guidance](https://svs.gsfc.nasa.gov/help/) and
[NASA media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/).
