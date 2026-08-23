# Minimal image-transport OOM reproduction

This reproduction supports
[issue 187](https://github.com/darickc/MMM-BackgroundSlideshow/issues/187) by
isolating the local-image transport and Electron rendering path of
`MMM-BackgroundSlideshow`. It runs no other MagicMirror modules and repeatedly
transports two large 4096-by-4096 PNG images at an accelerated 250 ms interval.
Image resizing, transitions, image information, progress display, and background
animation are disabled.

The image files are downloaded at test time into `/tmp`; no image binaries are
stored in this repository.

## Reproduce on Linux ARM64 with a Raspberry Pi-sized memory limit

The container uses MagicMirror 2.30.0, Electron 32.2.7, Node 22.12.0, Linux
ARM64, a 1.8 GiB total-memory ceiling, and a 464 MiB V8 heap ceiling. Run from
the root of this module repository:

```sh
reproduction/fetch-images.sh

docker build --platform linux/arm64 \
  --file reproduction/Dockerfile \
  --tag mmm-backgroundslideshow-repro:arm64 .

docker run --name mmm-backgroundslideshow-repro \
  --platform linux/arm64 \
  --memory 1800m \
  --memory-swap 1800m \
  --shm-size 256m \
  --volume /tmp/mmm-backgroundslideshow-repro-images:/tmp/mmm-backgroundslideshow-repro-images:ro \
  mmm-backgroundslideshow-repro:arm64
```

The image sets `NODE_OPTIONS=--max-old-space-size=440`. Electron does not pass
that Node setting to Chromium renderer isolates, so the startup script also
passes `--js-flags=--max-old-space-size=440`. Both produce an observed V8 heap
limit of 464 MiB after V8 overhead, matching the reported Raspberry Pi crash.

On an Apple Silicon host running Docker Desktop, Electron exited after about 14
seconds. The container did not hit its cgroup limit (`oom=false`); V8 was the
limiter:

```text
<--- Last few GCs --->
[20:...] Mark-Compact (reduce) 450.6 (455.4) -> 450.6 (452.4) MB ...
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
.../electron exited with signal SIGABRT
```

Remove the stopped test container before repeating the run:

```sh
docker rm mmm-backgroundslideshow-repro
```

## Control: enable the existing resize mitigation

Change only the module configuration in `reproduction/config.js`:

```js
resizeImages: true,
maxWidth: 1920,
maxHeight: 1080
```

Rebuild and run the same commands. In the local control run, the container
remained healthy, the renderer held two image elements, and live renderer heap
was 7.7 MiB after one minute at the same 250 ms interval.

## Run in an existing MagicMirror installation

Run these commands from the MagicMirror installation directory. The module is
expected at `modules/MMM-BackgroundSlideshow`:

```sh
modules/MMM-BackgroundSlideshow/reproduction/fetch-images.sh

MM_CONFIG_FILE="$PWD/modules/MMM-BackgroundSlideshow/reproduction/config.js" \
  npm run config:check

NODE_OPTIONS='--max-old-space-size=440' \
MM_CONFIG_FILE="$PWD/modules/MMM-BackgroundSlideshow/reproduction/config.js" \
  ./node_modules/.bin/electron \
    --js-flags=--max-old-space-size=440 \
    js/electron.js
```

Stop a PM2-managed instance first so it cannot hide or restart the failing
process:

```sh
pm2 stop mm
```

The 250 ms interval deliberately compresses the failure into seconds. It proves
that large base64 image payloads can accumulate faster than they are reclaimed;
it does not by itself prove that every normal-speed configuration leaks at the
same rate.

## Test image provenance

The fixtures are NASA Scientific Visualization Studio's Blue Marble east and
west hemisphere images from visualization
[2915](https://svs.gsfc.nasa.gov/2915/). NASA SVS states that its content is in
the public domain unless otherwise noted. The source page does not note an
exception for these images. NASA should be acknowledged as the source.

See the [NASA SVS usage guidance](https://svs.gsfc.nasa.gov/help/) and
[NASA media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/).
