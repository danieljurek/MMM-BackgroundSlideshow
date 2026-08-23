#!/usr/bin/env bash

set -euo pipefail

readonly image_dir='/tmp/mmm-backgroundslideshow-repro-images'
readonly source_url='https://svs.gsfc.nasa.gov/vis/a000000/a002900/a002915'
readonly images=(
  'bluemarble-east-4096.png'
  'bluemarble-west-4096.png'
)

mkdir -p "${image_dir}"

for image in "${images[@]}"; do
  echo "Downloading ${image}"
  curl --fail --location --retry 3 \
    --output "${image_dir}/${image}" \
    "${source_url}/${image}"
done

echo "NASA test images are ready in ${image_dir}"
