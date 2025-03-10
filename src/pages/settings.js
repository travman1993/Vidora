// src/pages/settings.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../hooks/useAuth';

const SettingsPage = () => {
  const { user, loading, updateUserProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    location: '',
    profilePicture: null,
    socialLinks: {
      instagram: '',
      twitter: '',
      facebook: '',
      vimeo: '',
      youtube: '',
      website: ''
    }
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push('/login');
    }
    
    // Set initial form values from user data
    if (user) {
      setProfileForm({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        profilePicture: null,
        socialLinks: {
          instagram: user.socialLinks?.instagram || '',
          twitter: user.socialLinks?.twitter || '',
          facebook: user.socialLinks?.facebook || '',
          vimeo: user.socialLinks?.vimeo || '',
          youtube: user.socialLinks?.youtube || '',
          website: user.socialLinks?.website || ''
        }
      });
    }
    
    // Check if URL has a hash to set active tab
    if (router.asPath.includes('#')) {
      const hash = router.asPath.split('#')[1];
      setActiveTab(hash);
    }
  }, [user, loading, router.asPath]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (socialLinks)
      const [parent, child] = name.split('.');
      setProfileForm({
        ...profileForm,
        [parent]: {
          ...profileForm[parent],
          [child]: value
        }
      });
    } else {
      setProfileForm({
        ...profileForm,
        [name]: value
      });
    }
  };
  
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileForm({
        ...profileForm,
        profilePicture: file
      });
    }
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', profileForm.name);
      formData.append('bio', profileForm.bio);
      formData.append('location', profileForm.location);
      
      // Append social links as JSON
      formData.append('socialLinks', JSON.stringify(profileForm.socialLinks));
      
      // Append profile picture if changed
      if (profileForm.profilePicture) {
        formData.append('profilePicture', profileForm.profilePicture);
      }
      
      // Update profile
      await updateUserProfile(formData);
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'New passwords do not match.'
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Call API to update password
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      // Clear password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setMessage({
        type: 'success',
        text: 'Password updated successfully!'
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update password. Please check your current password.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loading || !user) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <p>Loading settings...</p>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Head>
        <title>Account Settings | Vidora</title>
        <meta name="description" content="Manage your Vidora account settings, profile information, and subscription plan." />
      </Head>
      
      <Navbar />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className="dashboard-content settings-page">
          <h1 className="dashboard-title">Account Settings</h1>
          
          <div className="settings-tabs">
            <button 
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              Profile Information
            </button>
            <button 
              className={activeTab === 'password' ? 'active' : ''}
              onClick={() => setActiveTab('password')}
            >
              Password
            </button>
            <button 
              className={activeTab === 'subscription' ? 'active' : ''}
              onClick={() => setActiveTab('subscription')}
            >
              Subscription
            </button>
            <button 
              className={activeTab === 'notifications' ? 'active' : ''}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </div>
          
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          
          <div className="settings-content">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="profilePicture">Profile Picture</label>
                  <div className="profile-picture-upload">
                    <img 
                      src={
                        profileForm.profilePicture 
                          ? URL.createObjectURL(profileForm.profilePicture)
                          : user.profilePicture || "/icons/default-avatar.png"
                      } 
                      alt={user.name} 
                      className="current-profile-image"
                    />
                    <input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                    />
                    <label htmlFor="profilePicture" className="upload-button">
                      Change Picture
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    rows="4"
                    placeholder="Tell viewers about yourself and your work..."
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={profileForm.location}
                    onChange={handleProfileChange}
                    placeholder="City, Country"
                  />
                </div>
                
                <div className="form-section">
                  <h3>Social Links</h3>
                  <p className="form-note">
                    Add your social media profiles for viewers to connect with you
                  </p>
                  
                  <div className="social-links-form">
                    <div className="form-group">
                      <label htmlFor="instagram">
                        <i className="fab fa-instagram"></i> Instagram
                      </label>
                      <input
                        id="instagram"
                        name="socialLinks.instagram"
                        type="url"
                        value={profileForm.socialLinks.instagram}
                        onChange={handleProfileChange}
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="twitter">
                        <i className="fab fa-twitter"></i> Twitter
                      </label>
                      <input
                        id="twitter"
                        name="socialLinks.twitter"
                        type="url"
                        value={profileForm.socialLinks.twitter}
                        onChange={handleProfileChange}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="vimeo">
                        <i className="fab fa-vimeo"></i> Vimeo
                      </label>
                      <input
                        id="vimeo"
                        name="socialLinks.vimeo"
                        type="url"
                        value={profileForm.socialLinks.vimeo}
                        onChange={handleProfileChange}
                        placeholder="https://vimeo.com/username"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="youtube">
                        <i className="fab fa-youtube"></i> YouTube
                      </label>
                      <input
                        id="youtube"
                        name="socialLinks.youtube"
                        type="url"
                        value={profileForm.socialLinks.youtube}
                        onChange={handleProfileChange}
                        placeholder="https://youtube.com/channel"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="website">
                        <i className="fas fa-globe"></i> Website
                      </label>
                      <input
                        id="website"
                        name="socialLinks.website"
                        type="url"
                        value={profileForm.socialLinks.website}
                        onChange={handleProfileChange}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}
            
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="8"
                  />
                  <p className="form-note">
                    Password must be at least 8 characters
                  </p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
            
            {activeTab === 'subscription' && (
              <div className="subscription-settings">
                <div className="current-plan">
                  <h3>Current Plan</h3>
                  <div className="plan-card active">
                    <div className="plan-header">
                      <h4>{user.subscription} Plan</h4>
                      <p className="plan-price">
                        {user.subscription === 'Basic' && '$9.99/month'}
                        {user.subscription === 'Pro' && '$19.99/month'}
                        {user.subscription === 'Elite' && '$29.99/month'}
                        {user.subscription === 'Student' && '$4.99/month'}
                      </p>
                    </div>
                    <div className="plan-features">
                      <p>
                        {user.subscription === 'Basic' && '5 uploads per month OR 50 total minutes'}
                        {user.subscription === 'Pro' && '15 uploads per month OR 150 total minutes'}
                        {user.subscription === 'Elite' && 'Unlimited uploads (max 30 min per video)'}
                        {user.subscription === 'Student' && '5 uploads per month OR 50 total minutes'}
                      </p>
                      <p className="renewal-info">
                        Next billing date: {user.nextBillingDate}
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3>Available Plans</h3>
                <div className="plan-options">
                  <div className={`plan-card ${user.subscription === 'Basic' ? 'current' : ''}`}>
                    <div className="plan-header">
                      <h4>Basic Plan</h4>
                      <p className="plan-price">$9.99/month</p>
                    </div>
                    <div className="plan-features">
                      <ul>
                        <li>5 uploads per month</li>
                        <li>OR 50 total minutes</li>
                        <li>1080p video quality</li>
                        <li>Basic analytics</li>
                      </ul>
                    </div>
                    {user.subscription !== 'Basic' && (
                      <button className="plan-button">Switch to Basic</button>
                    )}
                  </div>
                  
                  <div className={`plan-card ${user.subscription === 'Pro' ? 'current' : ''}`}>
                    <div className="plan-header">
                      <h4>Pro Plan</h4>
                      <p className="plan-price">$19.99/month</p>
                    </div>
                    <div className="plan-features">
                      <ul>
                        <li>15 uploads per month</li>
                        <li>OR 150 total minutes</li>
                        <li>4K video quality</li>
                        <li>Advanced analytics</li>
                        <li>Priority on leaderboards</li>
                      </ul>
                    </div>
                    {user.subscription !== 'Pro' && (
                      <button className="plan-button">Switch to Pro</button>
                    )}
                  </div>
                  
                  <div className={`plan-card ${user.subscription === 'Elite' ? 'current' : ''}`}>
                    <div className="plan-header">
                      <h4>Elite Plan</h4>
                      <p className="plan-price">$29.99/month</p>
                    </div>
                    <div className="plan-features">
                      <ul>
                        <li>Unlimited uploads</li>
                        <li>Max 30 min per video</li>
                        <li>4K video quality</li>
                        <li>Premium analytics</li>
                        <li>Featured creator opportunities</li>
                        <li>Priority on leaderboards</li>
                      </ul>
                    </div>
                    {user.subscription !== 'Elite' && (
                      <button className="plan-button">Switch to Elite</button>
                    )}
                  </div>
                  
                  {user.isStudent && (
                    <div className={`plan-card ${user.subscription === 'Student' ? 'current' : ''}`}>
                      <div className="plan-header">
                        <h4>Student Plan</h4>
                        <p className="plan-price">$4.99/month</p>
                      </div>
                      <div className="plan-features">
                        <ul>
                          <li>5 uploads per month</li>
                          <li>OR 50 total minutes</li>
                          <li>1080p video quality</li>
                          <li>Basic analytics</li>
                          <li>Student filmmaker competitions</li>
                        </ul>
                      </div>
                      {user.subscription !== 'Student' && (
                        <button className="plan-button">Switch to Student</button>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="cancellation-options">
                  <h3>Cancel Subscription</h3>
                  <p>
                    If you cancel your subscription, your account will remain active until the end
                    of your current billing period. After that, your videos will be muted but remain
                    on the platform for 30 days before being permanently removed.
                  </p>
                  <button className="cancel-button">Cancel Subscription</button>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="notification-settings">
                <h3>Email Notifications</h3>
                <form className="settings-form">
                  <div className="form-group checkbox-group">
                    <input
                      id="notifyComments"
                      type="checkbox"
                      defaultChecked={true}
                    />
                    <label htmlFor="notifyComments">
                      New ratings and reviews on your videos
                    </label>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <input
                      id="notifyAwards"
                      type="checkbox"
                      defaultChecked={true}
                    />
                    <label htmlFor="notifyAwards">
                      Awards and leaderboard placement notifications
                    </label>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <input
                      id="notifyPerformance"
                      type="checkbox"
                      defaultChecked={true}
                    />
                    <label htmlFor="notifyPerformance">
                      Weekly performance reports
                    </label>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <input
                      id="notifyMarketing"
                      type="checkbox"
                      defaultChecked={false}
                    />
                    <label htmlFor="notifyMarketing">
                      Product updates and promotional offers
                    </label>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-button"
                  >
                    Save Notification Preferences
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default SettingsPage;