// src/pages/index.js
import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const LandingPage = () => {
  return (
    <>
      <Head>
        <title>Vidora - Showcase Your Films</title>
        <meta name="description" content="Vidora is a streaming platform for filmmakers to showcase short films, commercials, indie films, promotional videos, music videos, and event highlights." />
      </Head>

      <div className="landing-page">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Where Filmmakers Shine</h1>
            <p className="hero-subtitle">
              A platform dedicated to short films, commercials, indie films, and creative video content
            </p>
            
            <div className="hero-buttons">
              <Link href="/browse" className="cta-button primary">
                Start Watching
              </Link>
              <Link href="/signup" className="cta-button secondary">
                Join as Filmmaker
              </Link>
            </div>
          </div>
          
          <div className="hero-visual">
            {/* Background video or image would go here */}
            <div className="hero-overlay"></div>
          </div>
        </div>
        
        <section className="features-section">
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
        </section>
        
        <section className="categories-section">
          <h2>Explore Categories</h2>
          
          <div className="category-grid">
            <Link href="/browse?category=short-film" className="category-card">
              <div className="category-image">
                <img src="/previews/category-short-films.jpg" alt="Short Films" />
              </div>
              <h3>Short Films</h3>
            </Link>
            
            <Link href="/browse?category=commercial" className="category-card">
              <div className="category-image">
                <img src="/previews/category-commercials.jpg" alt="Commercials" />
              </div>
              <h3>Commercials</h3>
            </Link>
            
            <Link href="/browse?category=indie-film" className="category-card">
              <div className="category-image">
                <img src="/previews/category-indie-films.jpg" alt="Indie Films" />
              </div>
              <h3>Indie Films</h3>
            </Link>
            
            <Link href="/browse?category=music-video" className="category-card">
              <div className="category-image">
                <img src="/previews/category-music-videos.jpg" alt="Music Videos" />
              </div>
              <h3>Music Videos</h3>
            </Link>
            
            <Link href="/browse?category=promotional" className="category-card">
              <div className="category-image">
                <img src="/previews/category-promotional.jpg" alt="Promotional Videos" />
              </div>
              <h3>Promotional</h3>
            </Link>
            
            <Link href="/browse?category=event" className="category-card">
              <div className="category-image">
                <img src="/previews/category-events.jpg" alt="Event Highlights" />
              </div>
              <h3>Event Highlights</h3>
            </Link>
          </div>
        </section>
        
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Share Your Films?</h2>
            <p>Join our community of filmmakers and get your work seen by thousands.</p>
            <Link href="/signup" className="cta-button primary">
              Create Account
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;