// src/pages/leaderboard.js
import React from 'react';
import Head from 'next/head';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Leaderboard from '../components/awards/Leaderboard';

const LeaderboardPage = ({ initialData }) => {
  return (
    <>
      <Head>
        <title>Leaderboard - Top Rated Films | Vidora</title>
        <meta name="description" content="Discover the highest-rated and most popular films on Vidora. View monthly and yearly rankings across all categories." />
      </Head>
      
      <Navbar />
      
      <main className="leaderboard-page">
        <div className="page-header">
          <h1>Leaderboard</h1>
          <p>Discover the highest-rated content on Vidora</p>
        </div>
        
        <div className="leaderboard-wrapper">
          <Leaderboard initialData={initialData} />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export async function getServerSideProps() {
  try {
    // In a real app, fetch leaderboard data from API
    // For now, return empty data
    return {
      props: {
        initialData: []
      }
    };
  } catch (error) {
    return {
      props: {
        initialData: []
      }
    };
  }
}

export default LeaderboardPage;