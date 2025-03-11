import React from 'react';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';

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
      <AnimatePresence mode="wait">
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </>
  );
}

export default MyApp;