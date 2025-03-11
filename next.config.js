// next.config.js
const fs = require('fs');
const path = require('path');

// Load environment variables from config files
const loadEnvConfig = () => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  let envPath;

  switch (NODE_ENV) {
    case 'production':
      envPath = path.resolve(process.cwd(), 'config/prod.env');
      break;
    case 'staging':
      envPath = path.resolve(process.cwd(), 'config/staging.env');
      break;
    default:
      envPath = path.resolve(process.cwd(), 'config/dev.env');
  }

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVariables = {};

    // Simple parser for environment variables
    envContent.split('\n').forEach(line => {
      // Skip comments and empty lines
      if (line.startsWith('#') || line.trim() === '') return;

      // Extract key-value pairs
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();

        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        // Skip lines with REPLACE_IN_CI_PIPELINE
        if (value === 'REPLACE_IN_CI_PIPELINE') return;

        envVariables[key] = value;
      }
    });

    return envVariables;
  }

  return {};
};

const envVariables = loadEnvConfig();

module.exports = {
  reactStrictMode: true,
  env: {
    ...envVariables,
  },
  publicRuntimeConfig: {
    // Add variables that should be available on client-side
    APP_NAME: envVariables.APP_NAME,
    ENVIRONMENT: envVariables.ENVIRONMENT,
    VERSION: envVariables.VERSION,
    NEXT_PUBLIC_API_URL: envVariables.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: envVariables.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ENVIRONMENT: envVariables.NEXT_PUBLIC_ENVIRONMENT,
    FEATURE_STUDENT_FILMMAKER: envVariables.FEATURE_STUDENT_FILMMAKER,
    FEATURE_HALL_OF_FAME: envVariables.FEATURE_HALL_OF_FAME,
    FEATURE_ANALYTICS_DASHBOARD: envVariables.FEATURE_ANALYTICS_DASHBOARD,
    FEATURE_DARK_MODE: envVariables.FEATURE_DARK_MODE,
  },
};