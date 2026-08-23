// MagicMirror expects this global to remain mutable while it merges defaults.
let config = {
  address: 'localhost',
  port: 8080,
  basePath: '/',
  ipWhitelist: ['127.0.0.1', '::ffff:127.0.0.1', '::1'],
  useHttps: false,
  language: 'en',
  locale: 'en-US',
  timeFormat: 24,
  units: 'metric',
  modules: [
    {
      module: 'MMM-BackgroundSlideshow',
      position: 'fullscreen_below',
      config: {
        imagePaths: ['/tmp/mmm-backgroundslideshow-repro-images'],
        // Accelerated to make the retained image transport visible quickly.
        slideshowSpeed: 250,
        randomizeImageOrder: false,
        recursiveSubDirectories: false,
        transitionImages: false,
        backgroundAnimationEnabled: false,
        showImageInfo: false,
        showProgressBar: false,
        resizeImages: false
      }
    }
  ]
};

if (typeof module !== 'undefined') module.exports = config;
