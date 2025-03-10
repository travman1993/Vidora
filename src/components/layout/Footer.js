// src/components/layout/Footer.js
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Vidora</h3>
          <p>A streaming platform dedicated to short films, commercials, and indie productions.</p>
        </div>
        
        <div className="footer-section">
          <h3>Links</h3>
          <ul>
            <li><Link href="/browse">Browse</Link></li>
            <li><Link href="/leaderboard">Leaderboard</Link></li>
            <li><Link href="/student-films">Student Films</Link></li>
            <li><Link href="/hall-of-fame">Hall of Fame</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Filmmaker Resources</h3>
          <ul>
            <li><Link href="/signup">Sign Up</Link></li>
            <li><Link href="/login">Login</Link></li>
            <li><a href="https://help.vidorafilms.com">Help Center</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><Link href="/terms/terms-of-service">Terms of Service</Link></li>
            <li><Link href="/terms/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms/copyright">Copyright</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Vidora Films. All rights reserved.</p>
        <div className="social-links">
          <a href="https://instagram.com/vidorafilms" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com/vidorafilms" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://facebook.com/vidorafilms" aria-label="Facebook">
            <i className="fab fa-facebook"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;