import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserProfileCard } from './UserProfileCard';
import { ThemeProvider } from '../context/ThemeContext';
import { UserProfile } from '../types/github';

// Mock the MUI theme
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        mode: 'light',
        primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
        secondary: { main: '#9c27b0', light: '#ba68c8', dark: '#7b1fa2' },
        text: { primary: '#000', secondary: '#666' },
        background: { paper: '#fff', default: '#f5f5f5' },
        divider: '#ddd',
        grey: {
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121'
        }
      },
      shadows: Array(25).fill('none'),
      alpha: () => 'rgba(255, 255, 255, 0.8)',
    }),
    alpha: () => 'rgba(255, 255, 255, 0.8)'
  };
});

// Mock the date-fns import to ensure consistent date formatting
vi.mock('date-fns', () => ({
  format: () => 'January 01, 2020',
}));

const mockProfile: UserProfile = {
  login: 'testuser',
  avatar_url: 'https://example.com/avatar.jpg',
  html_url: 'https://github.com/testuser',
  name: 'Test User',
  company: '@testcompany',
  blog: 'https://example.com/blog',
  location: 'Test City',
  email: 'test@example.com',
  bio: 'This is a test bio',
  twitter_username: 'testtwitter',
  public_repos: 10,
  followers: 20,
  following: 15,
  created_at: '2020-01-01T00:00:00Z',
  starred_repos: 30,
  total_contributions: 500,
};

describe('UserProfileCard Component', () => {
  it('renders user profile information correctly', () => {
    render(
      <ThemeProvider>
        <UserProfileCard profile={mockProfile} />
      </ThemeProvider>
    );
    
    // Check if basic user information is displayed
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('This is a test bio')).toBeInTheDocument();
    
    // Check for follower and following links (instead of specific numbers)
    expect(screen.getByText(/Followers/i)).toBeInTheDocument();
    expect(screen.getByText(/Following/i)).toBeInTheDocument();
    
    // Check if contact information is displayed
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test City')).toBeInTheDocument();
    expect(screen.getByText('@testcompany')).toBeInTheDocument();
  });
  
  it('renders profile with minimal information', () => {
    const minimalProfile: UserProfile = {
      login: 'minimaluser',
      avatar_url: 'https://example.com/avatar.jpg',
      html_url: 'https://github.com/minimaluser',
      name: null,
      company: null,
      blog: '',
      location: null,
      email: null,
      bio: null,
      twitter_username: null,
      public_repos: 3,
      followers: 1,
      following: 2,
      created_at: '2020-01-01T00:00:00Z',
      starred_repos: 5,
      total_contributions: 50,
    };
    
    render(
      <ThemeProvider>
        <UserProfileCard profile={minimalProfile} />
      </ThemeProvider>
    );
    
    // Check that username is displayed when name is null
    expect(screen.getByText('minimaluser')).toBeInTheDocument();
    expect(screen.getByText('@minimaluser')).toBeInTheDocument();
    
    // Check for follower info without specific numbers
    expect(screen.getByText(/Follower/i)).toBeInTheDocument();
    expect(screen.getByText(/Following/i)).toBeInTheDocument();
    
    // Check that bio section is not displayed
    expect(screen.queryByText('Bio')).not.toBeInTheDocument();
  });
  
  it('handles GitHub links correctly', () => {
    render(
      <ThemeProvider>
        <UserProfileCard profile={mockProfile} />
      </ThemeProvider>
    );
    
    // Check if the "View on GitHub" link is present and has the correct URL
    const githubLink = screen.getByText('GitHub');
    expect(githubLink.closest('a')).toHaveAttribute('href', 'https://github.com/testuser');
    
    // Check if company link is present
    const companyLink = screen.getByText('@testcompany');
    expect(companyLink.closest('a')).toHaveAttribute('href', 'https://github.com/testcompany');
  });
}); 