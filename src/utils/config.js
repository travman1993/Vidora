// src/utils/config.js
const getEnvironment = () => {
    if (typeof window === 'undefined') {
      // Server-side
      return process.env.ENVIRONMENT || 'development';
    }
    // Client-side
    return process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';
  };
  
  const config = {
    app: {
      name: process.env.APP_NAME || 'Vidora',
      environment: getEnvironment(),
      version: process.env.VERSION || '0.1.0',
      debug: process.env.DEBUG === 'true',
      logLevel: process.env.LOG_LEVEL || 'error',
    },
    server: {
      port: parseInt(process.env.PORT, 10) || 3000,
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000/api',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },
    frontend: {
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
    media: {
      uploadDir: process.env.UPLOAD_DIR || './uploads',
      maxUploadSize: parseInt(process.env.MAX_UPLOAD_SIZE, 10) || 500,
      mediaBucket: process.env.MEDIA_BUCKET || 'vidora-dev-media',
    },
    video: {
      bunnyStorageZone: process.env.BUNNY_STORAGE_ZONE || 'dev-vidora',
      bunnyApiKey: process.env.BUNNY_API_KEY || 'dev_bunny_api_key',
      bunnyHostname: process.env.BUNNY_HOSTNAME || 'dev-vidora.b-cdn.net',
    },
    features: {
      studentFilmmaker: process.env.FEATURE_STUDENT_FILMMAKER === 'true',
      hallOfFame: process.env.FEATURE_HALL_OF_FAME === 'true',
      analyticsDashboard: process.env.FEATURE_ANALYTICS_DASHBOARD === 'true',
      darkMode: process.env.FEATURE_DARK_MODE === 'true',
    },
  };
  
  export default config;