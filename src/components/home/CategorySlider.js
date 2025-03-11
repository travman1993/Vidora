import React, { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  {
    title: 'Short Films',
    slug: 'short-films',
    videos: [
      { id: '1', title: 'Midnight Run', thumbnail: '/thumbnails/short1.jpg' },
      { id: '2', title: 'Silent Echo', thumbnail: '/thumbnails/short2.jpg' },
      { id: '3', title: 'Urban Dreams', thumbnail: '/thumbnails/short3.jpg' },
      { id: '4', title: 'Forgotten Memory', thumbnail: '/thumbnails/short4.jpg' },
      { id: '5', title: 'Quantum Leap', thumbnail: '/thumbnails/short5.jpg' }
    ]
  },
  {
    title: 'Indie Films',
    slug: 'indie-films',
    videos: [
      { id: '6', title: 'Indie Horizons', thumbnail: '/thumbnails/indie1.jpg' },
      { id: '7', title: 'Rebel Hearts', thumbnail: '/thumbnails/indie2.jpg' },
      { id: '8', title: 'Whispers of Time', thumbnail: '/thumbnails/indie3.jpg' },
      { id: '9', title: 'City Lights', thumbnail: '/thumbnails/indie4.jpg' },
      { id: '10', title: 'Distant Echoes', thumbnail: '/thumbnails/indie5.jpg' }
    ]
  },
  {
    title: 'Commercials',
    slug: 'commercials',
    videos: [
      { id: '11', title: 'Urban Pulse', thumbnail: '/thumbnails/commercial1.jpg' },
      { id: '12', title: 'Tech Revolution', thumbnail: '/thumbnails/commercial2.jpg' },
      { id: '13', title: 'Green Future', thumbnail: '/thumbnails/commercial3.jpg' },
      { id: '14', title: 'Global Connect', thumbnail: '/thumbnails/commercial4.jpg' },
      { id: '15', title: 'Modern Life', thumbnail: '/thumbnails/commercial5.jpg' }
    ]
  }
];

const CategorySlider = () => {
  const sliderRefs = useRef([]);

  const handleScroll = (categoryIndex, direction) => {
    const slider = sliderRefs.current[categoryIndex];
    if (slider) {
      const scrollAmount = slider.offsetWidth;
      slider.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="category-section">
      {categories.map((category, categoryIndex) => (
        <div key={category.title} className="category-row">
          <div className="category-header">
            <h2>{category.title}</h2>
            <Link 
              href={`/browse?category=${category.slug}`} 
              className="see-more"
            >
              See More
            </Link>
          </div>
          
          <div className="slider-container">
            <button 
              className="slider-nav left"
              onClick={() => handleScroll(categoryIndex, 'left')}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <div 
              ref={(el) => sliderRefs.current[categoryIndex] = el} 
              className="video-slider"
            >
              {category.videos.map((video) => (
                <motion.div 
                  key={video.id} 
                  className="video-card"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href={`/video/${video.id}`}>
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="video-thumbnail" 
                    />
                    <div className="video-details">
                      <p>{video.title}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <button 
              className="slider-nav right"
              onClick={() => handleScroll(categoryIndex, 'right')}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySlider;