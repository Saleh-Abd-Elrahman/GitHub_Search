import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RepositoryCard } from './RepositoryCard';
import { ThemeProvider } from '../context/ThemeContext';
import { Repository } from '../types/github';

// Mock the MUI theme
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        mode: 'light',
        primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
        background: { paper: '#fff', default: '#f5f5f5' },
        text: { primary: '#000', secondary: '#666' },
        divider: '#ddd',
      },
      shadows: Array(25).fill('none'),
    }),
  };
});

// Mock date formatting
vi.mock('date-fns', () => ({
  format: () => 'January 01, 2023',
}));

describe('RepositoryCard Component', () => {
  const mockRepository: Repository = {
    id: 12345,
    name: 'test-repo',
    description: 'A test repository',
    html_url: 'https://github.com/testuser/test-repo',
    language: 'JavaScript',
    stargazers_count: 100,
    forks_count: 50,
    updated_at: '2023-01-01T00:00:00Z',
    owner: {
      login: 'testuser',
      avatar_url: 'https://example.com/avatar.jpg',
      html_url: 'https://github.com/testuser',
    },
  };

  it('renders repository information correctly', () => {
    render(
      <ThemeProvider>
        <RepositoryCard repository={mockRepository} />
      </ThemeProvider>
    );
    
    // Check if repository name is displayed
    expect(screen.getByText('test-repo')).toBeInTheDocument();
    
    // Check if description is displayed
    expect(screen.getByText('A test repository')).toBeInTheDocument();
    
    // Check if language is displayed
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    
    // Check if stats are displayed
    expect(screen.getByText('100')).toBeInTheDocument(); // Stars
    expect(screen.getByText('50')).toBeInTheDocument(); // Forks
  });
  
  it('renders repository without description', () => {
    const repoWithoutDescription = {
      ...mockRepository,
      description: null,
    };
    
    render(
      <ThemeProvider>
        <RepositoryCard repository={repoWithoutDescription} />
      </ThemeProvider>
    );
    
    // Check that the repository name is still displayed
    expect(screen.getByText('test-repo')).toBeInTheDocument();
    
    // Check that no description is shown
    expect(screen.queryByText('A test repository')).not.toBeInTheDocument();
  });
  
  it('renders repository without language', () => {
    const repoWithoutLanguage = {
      ...mockRepository,
      language: null,
    };
    
    render(
      <ThemeProvider>
        <RepositoryCard repository={repoWithoutLanguage} />
      </ThemeProvider>
    );
    
    // Check that the repository name is still displayed
    expect(screen.getByText('test-repo')).toBeInTheDocument();
    
    // Check that no language is shown
    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
  });
  
  it('renders repository with GitHub link', () => {
    render(
      <ThemeProvider>
        <RepositoryCard repository={mockRepository} />
      </ThemeProvider>
    );
    
    // Check if the GitHub button exists and has the correct URL
    const viewButton = screen.getByText('View on GitHub');
    expect(viewButton).toHaveAttribute('href', 'https://github.com/testuser/test-repo');
  });
}); 