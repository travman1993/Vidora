// src/pages/signup.js
import React from 'react';
import Head from 'next/head';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
  return (
    <>
      <Head>
        <title>Sign Up - Vidora</title>
        <meta name="description" content="Create your Vidora filmmaker account to upload videos, showcase your work, and connect with viewers." />
      </Head>
      
      <Navbar />
      
      <main className="auth-page">
        <div className="auth-container">
          <SignupForm />
          
          <div className="auth-image">
            <img src="/previews/signup-image.jpg" alt="Vidora Filmmaker" />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default SignupPage;