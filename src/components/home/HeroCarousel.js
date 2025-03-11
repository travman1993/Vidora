import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const heroContent = [
  {
    title: "Where Filmmakers Shine",
    description: "A platform dedicated to short films, commercials, and indie content",
    backgroundImage: "/hero-backgrounds/filmmaker-hero.jpg",
    ctas: [
      { text: "Start Watching", link: "/browse", primary: true },
      { text: "Join as Filmmaker", link: "/signup", primary: false }
    ]
  },
  {
    title: "Discover Emerging Talent",
    description: "Explore groundbreaking short films from around the world",
    backgroundImage: "/hero-backgrounds/global-films.jpg",
    ctas: [
      { text: "Browse Films", link: "/browse", primary: true },
      { text: "Submit Your Film", link: "/upload", primary: false }
    ]
  },
  {
    title: "Monthly Filmmaker Awards",
    description: "Compete, get recognized, and win incredible opportunities",
    backgroundImage: "/hero-backgrounds/awards.jpg",
    ctas: [
      { text: "View Leaderboard", link: "/leaderboard", primary: true },
      { text: "Learn More", link: "/awards", primary: false }
    ]
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroContent.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="hero-carousel">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="hero-slide"
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url(${heroContent[currentSlide].backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="hero-content">
            <h1>{heroContent[currentSlide].title}</h1>
            <p>{heroContent[currentSlide].description}</p>
            <div className="hero-ctas">
              {heroContent[currentSlide].ctas.map((cta, index) => (
                <Link 
                  key={index} 
                  href={cta.link} 
                  className={`btn ${cta.primary ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {cta.text}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="carousel-dots">
        {heroContent.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;