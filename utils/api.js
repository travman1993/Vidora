// src/pages/_app.js
import React from 'react';
// Update imports to point to the root folders
import { AuthProvider } from '../../context/AuthContext';
import { VideoProvider } from '../../context/VideoContext';

// Import styles
import '../../styles/global.css';
import '../../styles/themes.css';
import '../../styles/streaming-components.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <VideoProvider>
        <Component {...pageProps} />
      </VideoProvider>
    </AuthProvider>
  );
}

export default MyApp;