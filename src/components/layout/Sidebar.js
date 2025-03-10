// src/components/layout/Sidebar.js
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  if (!user) {
    return null; // Only show sidebar to logged-in users
  }
  
  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <img 
          src={user.profilePicture || "/icons/default-avatar.png"} 
          alt={user.name} 
          className="profile-image"
        />
        <h3>{user.name}</h3>
        <p>{user.isStudent ? 'Student Filmmaker' : 'Filmmaker'}</p>
      </div>
      
      <nav className="sidebar-nav">
        <Link 
          href="/dashboard" 
          className={router.pathname === '/dashboard' ? 'active' : ''}
        >
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </Link>
        
        <Link 
          href="/dashboard/uploads" 
          className={router.pathname === '/dashboard/uploads' ? 'active' : ''}
        >
          <i className="fas fa-upload"></i> My Uploads
        </Link>
        
        <Link 
          href="/dashboard/analytics" 
          className={router.pathname === '/dashboard/analytics' ? 'active' : ''}
        >
          <i className="fas fa-chart-line"></i> Analytics
        </Link>
        
        <Link 
          href="/profile/[id]" 
          as={`/profile/${user.id}`}
          className={router.pathname === '/profile/[id]' ? 'active' : ''}
        >
          <i className="fas fa-user"></i> View My Profile
        </Link>
        
        <Link 
          href="/settings" 
          className={router.pathname === '/settings' ? 'active' : ''}
        >
          <i className="fas fa-cog"></i> Settings
        </Link>
      </nav>
      
      <div className="sidebar-subscription">
        <h4>Subscription: {user.subscription}</h4>
        <p>{user.uploadsLeft} uploads remaining this month</p>
        <Link href="/settings#subscription" className="upgrade-button">
          {user.subscription === 'Elite' ? 'Manage Plan' : 'Upgrade Plan'}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;