import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoGrid from '../src/components/video/VideoGrid';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Sample test data
const mockVideos = [
  {
    id: 'video1',
    title: 'Test Video 1',
    thumbnailUrl: '/test1.jpg',
    duration: 180,
    views: 1500,
    averageRating: 4.5,
    uploadDate: '2023-06-01T12:00:00Z',
    category: 'short-film',
    filmmaker: {
      id: 'user1',
      name: 'Test Filmmaker'
    }
  },
  {
    id: 'video2',
    title: 'Test Video 2',
    thumbnailUrl: '/test2.jpg',
    duration: 360,
    views: 5000,
    averageRating: 4.2,
    uploadDate: '2023-05-15T10:00:00Z',
    category: 'commercial',
    filmmaker: {
      id: 'user2',
      name: 'Another Filmmaker'
    }
  },
  {
    id: 'video3',
    title: 'Long Test Video',
    thumbnailUrl: '/test3.jpg',
    duration: 1200,
    views: 3000,
    averageRating: 4.8,
    uploadDate: '2023-05-01T09:00:00Z',
    category: 'short-film',
    filmmaker: {
      id: 'user1',
      name: 'Test Filmmaker'
    }
  }
];

describe('VideoGrid Component', () => {
  test('renders all videos', () => {
    render(<VideoGrid videos={mockVideos} />);
    
    // Check if all videos are rendered
    expect(screen.getByText('Test Video 1')).toBeInTheDocument();
    expect(screen.getByText('Test Video 2')).toBeInTheDocument();
    expect(screen.getByText('Long Test Video')).toBeInTheDocument();
  });
  
  test('filters videos by duration', async () => {
    render(<VideoGrid videos={mockVideos} showFilters={true} />);
    
    // Click on the 'Long' duration filter (> 15 min)
    fireEvent.click(screen.getByText('Long (> 15 min)'));
    
    // Wait for filtering to complete
    await waitFor(() => {
      // Should only show the long video
      expect(screen.getByText('Long Test Video')).toBeInTheDocument();
      expect(screen.queryByText('Test Video 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Video 2')).not.toBeInTheDocument();
    });
  });
  
  test('sorts videos by rating', async () => {
    render(<VideoGrid videos={mockVideos} showFilters={true} />);
    
    // Select 'Highest Rated' sorting
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'rating' } });
    
    // Wait for sorting to complete
    await waitFor(() => {
      // Check the order of videos
      const videoTitles = screen.getAllByRole('heading', { level: 3 })
        .map(heading => heading.textContent);
      
      // The video with highest rating (4.8) should be first
      expect(videoTitles[0]).toBe('Long Test Video');
    });
  });
  
  test('displays empty state when no videos match filter', async () => {
    // Create custom videos with all short duration
    const shortVideos = mockVideos.map(video => ({
      ...video,
      duration: 120 // 2 minutes
    }));
    
    render(<VideoGrid videos={shortVideos} showFilters={true} />);
    
    // Click on the 'Long' duration filter
    fireEvent.click(screen.getByText('Long (> 15 min)'));
    
    // Wait for filtering to complete
    await waitFor(() => {
      expect(screen.getByText('No videos match your current filters.')).toBeInTheDocument();
    });
  });
  
  test('renders without filters when showFilters is false', () => {
    render(<VideoGrid videos={mockVideos} showFilters={false} />);
    
    // Filter controls should not be present
    expect(screen.queryByText('All Durations')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});