const workboxBuild = require('workbox-build');

workboxBuild.generateSW({
  swDest: 'build/service-worker.js',
  globDirectory: 'build',
  globPatterns: ['**/*.{js,css,html,png,svg,jpg}'],
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [{
    urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'images',
      expiration: {
        maxEntries: 10,
      },
    },
  }],
});
