// src/pages/login.js
import React from 'react';
import Head from 'next/head';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Log In - Vidora</title>
        <meta name="description" content="Log in to your Vidora filmmaker account to manage your videos, view analytics, and more." />
      </Head>
      
      <Navbar />
      
      <main className="auth-page">
        <div className="auth-container">
          <LoginForm />
          
          <div className="auth-image">
            <img src="/previews/login-image.jpg" alt="Vidora Filmmaker" />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default LoginPage;