// next.config.js
const path = require('path');

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // Configure module path aliases for easier imports
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@styles': path.resolve(__dirname, 'styles'),
    };
    return config;
  },
  // Environmental variables can be configured here as well
  env: {
    APP_NAME: 'Vidora',
    ENVIRONMENT: process.env.NODE_ENV || 'development',
  },
  // Configure image domains if you're using Next.js Image component
  images: {
    domains: ['example.com', 'vidorafilms.com'],
  },
  // Add any other Next.js configurations as needed
};