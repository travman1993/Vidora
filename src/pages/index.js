import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import HeroCarousel from '../components/home/HeroCarousel';
import CategorySlider from '../components/home/CategorySlider';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';

const LandingPage = () => {
  return (
    <>
      <Head>
        <title>Vidora - Showcase Your Films</title>
        <meta 
          name="description" 
          content="Vidora is a streaming platform for filmmakers to showcase short films, commercials, indie films, promotional videos, music videos, and event highlights." 
        />
      </Head>

      <div className="landing-page">
        <HeroCarousel />
        
        <section className="features-section">
          <div className="container">
            <h2>Why Choose Vidora?</h2>
            
            <div className="feature-cards">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-film"></i>
                </div>
                <h3>For Filmmakers</h3>
                <ul>
                  <li>Showcase your work to a dedicated audience</li>
                  <li>Compete in monthly & yearly awards</li>
                  <li>Get discovered by potential clients</li>
                  <li>Track performance with detailed analytics</li>
                </ul>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-user"></i>
                </div>
                <h3>For Viewers</h3>
                <ul>
                  <li>Discover amazing short-form content</li>
                  <li>Browse by genre, duration, or location</li>
                  <li>Rate and share your favorite films</li>
                  <li>Completely free to watch</li>
                </ul>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-briefcase"></i>
                </div>
                <h3>For Businesses</h3>
                <ul>
                  <li>Find talented filmmakers in your area</li>
                  <li>View portfolios & previous work</li>
                  <li>Connect directly with creators</li>
                  <li>No middleman fees</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <CategorySlider />
        
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Share Your Films?</h2>
              <p>Join our community of filmmakers and get your work seen by thousands.</p>
              <Link href="/signup" className="cta-button primary">
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;