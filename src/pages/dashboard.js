// src/pages/dashboard.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, loading]);
  
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/filmmaker/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);
      
      // Fetch recent uploads
      const uploadsResponse = await fetch('/api/filmmaker/uploads?limit=5');
      const uploadsData = await uploadsResponse.json();
      setRecentUploads(uploadsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loading || !user) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <p>Loading dashboard...</p>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Head>
        <title>Filmmaker Dashboard | Vidora</title>
        <meta name="description" content="Manage your videos, view performance analytics, and update your filmmaker profile." />
      </Head>
      
      <Navbar />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className="dashboard-content">
          <h1 className="dashboard-title">Dashboard</h1>
          
          <div className="dashboard-welcome">
            <h2>Welcome back, {user.name}!</h2>
            <p>Here's how your content is performing</p>
          </div>
          
          {isLoading ? (
            <div className="dashboard-loading">
              <p>Loading your statistics...</p>
            </div>
          ) : (
            <>
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-eye"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Total Views</h3>
                    <p className="stat-value">{stats?.totalViews.toLocaleString()}</p>
                    <p className="stat-change">
                      {stats?.viewsChange >= 0 ? (
                        <span className="positive">+{stats?.viewsChange}%</span>
                      ) : (
                        <span className="negative">{stats?.viewsChange}%</span>
                      )}
                      <span className="period">vs. last month</span>
                    </p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Average Rating</h3>
                    <p className="stat-value">{stats?.averageRating.toFixed(1)}</p>
                    <p className="stat-change">
                      {stats?.ratingChange >= 0 ? (
                        <span className="positive">+{stats?.ratingChange}</span>
                      ) : (
                        <span className="negative">{stats?.ratingChange}</span>
                      )}
                      <span className="period">vs. last month</span>
                    </p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-video"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Total Videos</h3>
                    <p className="stat-value">{stats?.totalVideos}</p>
                    <p className="stat-period">
                      <span className="period">{stats?.uploadsRemaining} uploads remaining this month</span>
                    </p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-share-alt"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Total Shares</h3>
                    <p className="stat-value">{stats?.totalShares}</p>
                    <p className="stat-change">
                      {stats?.sharesChange >= 0 ? (
                        <span className="positive">+{stats?.sharesChange}%</span>
                      ) : (
                        <span className="negative">{stats?.sharesChange}%</span>
                      )}
                      <span className="period">vs. last month</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="dashboard-sections">
                <div className="dashboard-section">
                  <div className="section-header">
                    <h2>Recent Uploads</h2>
                    <a href="/dashboard/uploads" className="view-all">View All</a>
                  </div>
                  
                  {recentUploads.length === 0 ? (
                    <div className="empty-state">
                      <p>You haven't uploaded any videos yet.</p>
                      <a href="/dashboard/uploads/new" className="cta-button">Upload Your First Video</a>
                    </div>
                  ) : (
                    <div className="recent-uploads-list">
                      {recentUploads.map(video => (
                        <div key={video.id} className="upload-item">
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title} 
                            className="upload-thumbnail"
                          />
                          
                          <div className="upload-info">
                            <h3 className="upload-title">{video.title}</h3>
                            <p className="upload-date">Uploaded on {new Date(video.uploadDate).toLocaleDateString()}</p>
                            <div className="upload-stats">
                              <span className="upload-stat">
                                <i className="fas fa-eye"></i> {video.views.toLocaleString()}
                              </span>
                              <span className="upload-stat">
                                <i className="fas fa-star"></i> {video.averageRating.toFixed(1)}
                              </span>
                              <span className="upload-stat">
                                <i className="fas fa-share-alt"></i> {video.shares}
                              </span>
                            </div>
                          </div>
                          
                          <div className="upload-actions">
                            <a href={`/video/${video.id}`} className="action-button">
                              <i className="fas fa-eye"></i> View
                            </a>
                            <a href={`/dashboard/uploads/edit/${video.id}`} className="action-button">
                              <i className="fas fa-edit"></i> Edit
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="dashboard-section">
                  <div className="section-header">
                    <h2>Performance Overview</h2>
                    <a href="/dashboard/analytics" className="view-all">Detailed Analytics</a>
                  </div>
                  
                  <div className="performance-chart">
                    {/* This would be a chart component in a real implementation */}
                    <div className="chart-placeholder">
                      <p>Views and engagement over time would display here</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="dashboard-sections">
                <div className="dashboard-section">
                  <div className="section-header">
                    <h2>Subscription Plan</h2>
                    <a href="/settings#subscription" className="view-all">Manage Plan</a>
                  </div>
                  
                  <div className="subscription-info">
                    <div className="plan-info">
                      <h3>{user.subscription} Plan</h3>
                      <p className="plan-price">
                        {user.subscription === 'Basic' && '$9.99/month'}
                        {user.subscription === 'Pro' && '$19.99/month'}
                        {user.subscription === 'Elite' && '$29.99/month'}
                        {user.subscription === 'Student' && '$4.99/month'}
                      </p>
                      <p className="plan-details">
                        {user.subscription === 'Basic' && '5 uploads per month OR 50 total minutes'}
                        {user.subscription === 'Pro' && '15 uploads per month OR 150 total minutes'}
                        {user.subscription === 'Elite' && 'Unlimited uploads (max 30 min per video)'}
                        {user.subscription === 'Student' && '5 uploads per month OR 50 total minutes'}
                      </p>
                      <p className="plan-usage">
                        <span className="usage-info">{stats?.uploadsRemaining} uploads remaining this month</span>
                        <span className="usage-info">{stats?.minutesRemaining} minutes remaining</span>
                      </p>
                    </div>
                    
                    {user.subscription !== 'Elite' && (
                      <a href="/settings#subscription" className="upgrade-button">
                        Upgrade Plan
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default DashboardPage;