// next.config.js
const path = require('path');

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './src/components'),
      '@context': path.resolve(__dirname, './context'),     // Pointing to root context
      '@hooks': path.resolve(__dirname, './hooks'),         // Pointing to root hooks
      '@utils': path.resolve(__dirname, './utils'),         // Pointing to root utils
      '@styles': path.resolve(__dirname, './styles'),
    };
    return config;
  }
};