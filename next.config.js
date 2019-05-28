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
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'https-calls',
              networkTimeoutSeconds: 15,
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 1 month
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
