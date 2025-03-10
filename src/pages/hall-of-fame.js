// src/pages/hall-of-fame.js
import React from 'react';
import Head from 'next/head';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FilmOfTheYear from '../components/awards/FilmOfTheYear';
import StudentAwards from '../components/awards/StudentAwards';

const HallOfFamePage = ({ winners }) => {
  return (
    <>
      <Head>
        <title>Hall of Fame - Film of the Year | Vidora</title>
        <meta name="description" content="Celebrating the best films on Vidora. View our Film of the Year and Student Filmmaker of the Year award winners." />
      </Head>
      
      <Navbar />
      
      <main className="hall-of-fame-page">
        <div className="page-header">
          <h1>Hall of Fame</h1>
          <p>Celebrating excellence in filmmaking</p>
        </div>
        
        <div className="hall-of-fame-content">
          {winners.currentYear && (
            <section className="current-winners">
              <FilmOfTheYear 
                winner={winners.currentYear.filmOfTheYear} 
                runnerUps={winners.currentYear.runnerUps}
              />
              
              <StudentAwards 
                winner={winners.currentYear.studentFilmmaker} 
                year={winners.currentYear.year}
              />
            </section>
          )}
          
          <section className="past-winners">
            <h2>Previous Winners</h2>
            
            <div className="past-winners-grid">
              {winners.pastYears.map(year => (
                <div key={year.year} className="past-year">
                  <h3>{year.year}</h3>
                  
                  <div className="past-winners-list">
                    <div className="past-winner">
                      <h4>Film of the Year</h4>
                      <div className="winner-card">
                        <img 
                          src={year.filmOfTheYear.thumbnailUrl} 
                          alt={year.filmOfTheYear.title} 
                          className="winner-thumbnail"
                        />
                        <div className="winner-info">
                          <p className="winner-title">{year.filmOfTheYear.title}</p>
                          <p className="winner-filmmaker">{year.filmOfTheYear.filmmaker.name}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="past-winner">
                      <h4>Student Filmmaker</h4>
                      <div className="winner-card">
                        <img 
                          src={year.studentFilmmaker.filmmaker.profilePicture} 
                          alt={year.studentFilmmaker.filmmaker.name} 
                          className="winner-thumbnail"
                        />
                        <div className="winner-info">
                          <p className="winner-title">{year.studentFilmmaker.filmmaker.name}</p>
                          <p className="winner-film">{year.studentFilmmaker.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export async function getServerSideProps() {
  // In a real app, fetch data from an API
  // For now, return sample data structure
  return {
    props: {
      winners: {
        currentYear: null,
        pastYears: []
      }
    }
  };
}

export default HallOfFamePage;
