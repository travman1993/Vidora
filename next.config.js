// next.config.js
const path = require('path');

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@utils': path.resolve(__dirname, './src/utils'),
    };
    return config;
  }
};