/ src/pages/profile/[id].js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProfileCard from '../../components/profile/ProfileCard';
import VideoGrid from '../../components/video/VideoGrid';

const ProfilePage = ({ initialFilmmaker, initialVideos }) => {
  const router = useRouter();
  const { id } = router.query;
  const [filmmaker, setFilmmaker] = useState(initialFilmmaker);
  const [videos, setVideos] = useState(initialVideos || []);
  const [isLoading, setIsLoading] = useState(!initialFilmmaker);
  
  useEffect(() => {
    if (id && (!initialFilmmaker || initialFilmmaker.id !== id)) {
      fetchFilmmakerData();
    }
  }, [id]);
  
  const fetchFilmmakerData = async () => {
    setIsLoading(true);
    try {
      // Fetch filmmaker data
      const filmmakerResponse = await fetch(`/api/filmmakers/${id}`);
      const filmmakerData = await filmmakerResponse.json();
      setFilmmaker(filmmakerData);
      
      // Fetch filmmaker's videos
      const videosResponse = await fetch(`/api/filmmakers/${id}/videos`);
      const videosData = await videosResponse.json();
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching filmmaker data:', error);
      // Handle 404 or other errors
      if (error.status === 404) {
        router.push('/404');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <p>Loading filmmaker profile...</p>
        </div>
        <Footer />
      </>
    );
  }
  
  if (!filmmaker) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <h2>Filmmaker Not Found</h2>
          <p>The filmmaker profile you're looking for doesn't exist or has been removed.</p>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Head>
        <title>{filmmaker.name} - Filmmaker Profile | Vidora</title>
        <meta name="description" content={`View ${filmmaker.name}'s filmmaker profile on Vidora. Watch their short films, commercials, and videos.`} />
      </Head>
      
      <Navbar />
      
      <main className="profile-page">
        <div className="profile-container">
          <ProfileCard filmmaker={filmmaker} />
          
          <div className="filmmaker-videos">
            <h2>Videos by {filmmaker.name}</h2>
            
            {videos.length === 0 ? (
              <div className="no-videos">
                <p>This filmmaker hasn't uploaded any videos yet.</p>
              </div>
            ) : (
              <VideoGrid 
                videos={videos} 
                showFilters={false}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  
  try {
    // In a real app, fetch filmmaker data and videos from API
    // For now, return empty data
    return {
      props: {
        initialFilmmaker: null,
        initialVideos: []
      }
    };
  } catch (error) {
    return {
      props: {
        initialFilmmaker: null,
        initialVideos: []
      }
    };
  }
}

export default ProfilePage;
