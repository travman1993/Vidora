// src/pages/browse.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import VideoGrid from '../components/video/VideoGrid';

const BrowsePage = ({ initialVideos }) => {
  const router = useRouter();
  const { category, search } = router.query;
  const [videos, setVideos] = useState(initialVideos || []);
  const [isLoading, setIsLoading] = useState(!initialVideos);
  const [searchTerm, setSearchTerm] = useState(search || '');
  
  useEffect(() => {
    if (!initialVideos || category !== router.query.category || search !== router.query.search) {
      fetchVideos();
    }
  }, [router.query.category, router.query.search]);
  
  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      // Construct URL with query parameters
      let url = '/api/videos?';
      if (category) {
        url += `category=${category}&`;
      }
      if (router.query.search) {
        url += `search=${router.query.search}&`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    router.push({
      pathname: '/browse',
      query: {
        ...(category && { category }),
        ...(searchTerm && { search: searchTerm })
      }
    });
  };
  
  const getCategoryTitle = () => {
    const categories = {
      'short-film': 'Short Films',
      'commercial': 'Commercials',
      'indie-film': 'Indie Films',
      'music-video': 'Music Videos',
      'promotional': 'Promotional Videos',
      'event': 'Event Highlights'
    };
    
    return category ? categories[category] || category : 'All Videos';
  };
  
  return (
    <>
      <Head>
        <title>{getCategoryTitle()} - Vidora</title>
        <meta name="description" content={`Browse ${getCategoryTitle().toLowerCase()} on Vidora, the streaming platform for filmmakers.`} />
      </Head>
      
      <Navbar />
      
      <main className="browse-page">
        <div className="browse-header">
          <h1>{getCategoryTitle()}</h1>
          
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search videos, filmmakers..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
        
        <div className="category-nav">
          <a 
            href="/browse" 
            className={!category ? 'active' : ''}
          >
            All
          </a>
          <a 
            href="/browse?category=short-film" 
            className={category === 'short-film' ? 'active' : ''}
          >
            Short Films
          </a>
          <a 
            href="/browse?category=commercial" 
            className={category === 'commercial' ? 'active' : ''}
          >
            Commercials
          </a>
          <a 
            href="/browse?category=indie-film" 
            className={category === 'indie-film' ? 'active' : ''}
          >
            Indie Films
          </a>
          <a 
            href="/browse?category=music-video" 
            className={category === 'music-video' ? 'active' : ''}
          >
            Music Videos
          </a>
          <a 
            href="/browse?category=promotional" 
            className={category === 'promotional' ? 'active' : ''}
          >
            Promotional
          </a>
          <a 
            href="/browse?category=event" 
            className={category === 'event' ? 'active' : ''}
          >
            Events
          </a>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <p>Loading videos...</p>
          </div>
        ) : (
          <>
            {router.query.search && (
              <div className="search-results-header">
                <p>
                  Showing results for: <strong>{router.query.search}</strong>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      router.push({
                        pathname: '/browse',
                        query: category ? { category } : {}
                      });
                    }}
                    className="clear-search"
                  >
                    Clear Search
                  </button>
                </p>
              </div>
            )}
            
            <VideoGrid 
              videos={videos} 
              category={category}
              showFilters={true}
            />
          </>
        )}
      </main>
      
      <Footer />
    </>
  );
};

export async function getServerSideProps(context) {
  // In a real app, you would fetch data from an API here
  // For now, we'll return an empty array
  return {
    props: {
      initialVideos: []
    }
  };
}

export default BrowsePage;