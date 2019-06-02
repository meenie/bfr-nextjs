const withTypescript = require('@zeit/next-typescript');
const withOffline = require('next-offline');
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([
  [
    withTypescript,
    {
      target: 'serverless'
    }
  ],
  [
    withOffline,
    {
      generateInDevMode: false,
      workboxOpts: {
        swDest: 'static/service-worker.js',
        runtimeCaching: [
          {
            urlPattern: /(?:\/_next\/static|\/static\/images).*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'app-files',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 365 * 24 * 60 * 60 // 1 Year
              },
              cacheableResponse: {
                statuses: [ 0, 200 ]
              }
            }
          },
          {
            urlPattern: /^https:\/\/(?:unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|www\.redditstatic\.com).*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'third-party-files',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 Days
              },
              cacheableResponse: {
                statuses: [ 0, 200 ]
              }
            }
          }
        ]
      }
    }
  ]
]);
