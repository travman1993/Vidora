// src/pages/_app.js
import React from 'react';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '../context/AuthContext';
import { VideoProvider } from '../context/VideoContext';

// Global Styles
import '../../styles/global.css';
import '../../styles/themes.css';
import '../../styles/streaming-components.css';

function MyApp({ Component, pageProps, router }) {
  return (
    <>
      <Head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" 
        />
      </Head>
      <AuthProvider>
        <VideoProvider>
          <AnimatePresence mode="wait">
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </VideoProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;