// src/pages/student-films.js
import React from 'react';
import Head from 'next/head';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import VideoGrid from '../components/video/VideoGrid';
import StudentAwards from '../components/awards/StudentAwards';

const StudentFilmsPage = ({ videos, currentWinner }) => {
  return (
    <>
      <Head>
        <title>Student Films | Vidora</title>
        <meta name="description" content="Discover the best student films on Vidora. Watch films from emerging talent and student filmmakers." />
      </Head>
      
      <Navbar />
      
      <main className="student-films-page">
        <div className="page-header">
          <h1>Student Filmmakers</h1>
          <p>Discover the next generation of filmmaking talent</p>
        </div>
        
        {currentWinner && (
          <section className="student-award-section">
            <StudentAwards 
              winner={currentWinner} 
              year={new Date().getFullYear()}
            />
          </section>
        )}
        
        <section className="student-videos-section">
          <h2>Student Films</h2>
          <VideoGrid videos={videos} showFilters={true} />
        </section>
        
        <section className="student-info-section">
          <div className="info-card">
            <h3>Are You a Student Filmmaker?</h3>
            <p>
              Vidora offers a special discounted plan for verified student filmmakers.
              Sign up today and showcase your work to a global audience.
            </p>
            <ul>
              <li>Dedicated section for student films</li>
              <li>Student Filmmaker of the Month & Year awards</li>
              <li>Special discounted subscription plan</li>
              <li>Connect with industry professionals</li>
            </ul>
            <a href="/signup" className="cta-button">Join as Student Filmmaker</a>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export async function getServerSideProps() {
  // In a real app, fetch data from an API
  return {
    props: {
      videos: [],
      currentWinner: null
    }
  };
}

export default StudentFilmsPage;