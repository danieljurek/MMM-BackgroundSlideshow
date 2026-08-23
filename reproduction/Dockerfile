FROM node:22.12.0-bookworm

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    git \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxkbcommon0 \
    libxrandr2 \
    libxshmfence1 \
    libxss1 \
    xvfb \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt

RUN git clone --depth 1 --branch v2.30.0 \
  https://github.com/MagicMirrorOrg/MagicMirror.git MagicMirror

COPY . /opt/MagicMirror/modules/MMM-BackgroundSlideshow

WORKDIR /opt/MagicMirror

RUN npm ci --no-audit --no-fund \
  && cd modules/MMM-BackgroundSlideshow \
  && npm ci --omit=dev --no-audit --no-fund \
  && chown -R node:node /opt/MagicMirror

USER node

ENV MM_CONFIG_FILE=/opt/MagicMirror/modules/MMM-BackgroundSlideshow/reproduction/config.js
ENV NODE_OPTIONS=--max-old-space-size=440

CMD ["modules/MMM-BackgroundSlideshow/reproduction/start-in-xvfb.sh"]
