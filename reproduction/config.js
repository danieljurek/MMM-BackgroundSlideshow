// MagicMirror merges its defaults by reassigning this global.
// eslint-disable-next-line prefer-const
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
        slideshowSpeed: 2000,
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
