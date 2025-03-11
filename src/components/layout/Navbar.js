// src/components/layout/Navbar.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../../hooks/useAuth';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/">
          <img 
            src={darkMode ? "/logos/vidora-logo-dark.png" : "/logos/vidora-logo-light.png"} 
            alt="Vidora" 
          />
        </Link>
      </div>
      <div className="navbar-links">
        <Link href="/browse" className="nav-link">Browse</Link>
        <Link href="/leaderboard" className="nav-link">Leaderboard</Link>
        <Link href="/student-films" className="nav-link">Student Films</Link>
        <Link href="/hall-of-fame" className="nav-link">Hall of Fame</Link>
        {user ? (
          <>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="nav-link">Login</Link>
            <Link href="/signup" className="nav-button">Sign Up</Link>
          </>
        )}
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;