import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepositoryList } from './RepositoryList';
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
      alpha: () => 'rgba(255, 255, 255, 0.8)',
    }),
    alpha: () => 'rgba(255, 255, 255, 0.8)',
  };
});

describe('RepositoryList Component', () => {
  const mockRepositories: Repository[] = [
    {
      id: 1,
      name: 'react-app',
      description: 'A React application',
      html_url: 'https://github.com/testuser/react-app',
      language: 'JavaScript',
      stargazers_count: 100,
      forks_count: 50,
      updated_at: '2023-01-01T00:00:00Z',
      owner: {
        login: 'testuser',
        avatar_url: 'https://example.com/avatar.jpg',
        html_url: 'https://github.com/testuser',
      },
    },
    {
      id: 2,
      name: 'typescript-lib',
      description: 'A TypeScript library',
      html_url: 'https://github.com/testuser/typescript-lib',
      language: 'TypeScript',
      stargazers_count: 75,
      forks_count: 25,
      updated_at: '2023-02-01T00:00:00Z',
      owner: {
        login: 'testuser',
        avatar_url: 'https://example.com/avatar.jpg',
        html_url: 'https://github.com/testuser',
      },
    },
    {
      id: 3,
      name: 'python-utils',
      description: 'Python utility functions',
      html_url: 'https://github.com/testuser/python-utils',
      language: 'Python',
      stargazers_count: 50,
      forks_count: 10,
      updated_at: '2023-03-01T00:00:00Z',
      owner: {
        login: 'testuser',
        avatar_url: 'https://example.com/avatar.jpg',
        html_url: 'https://github.com/testuser',
      },
    },
  ];

  it('renders the list of repositories', () => {
    render(
      <ThemeProvider>
        <RepositoryList repositories={mockRepositories} />
      </ThemeProvider>
    );
    
    // Check that the repository names are displayed
    expect(screen.getByText('react-app')).toBeInTheDocument();
    expect(screen.getByText('typescript-lib')).toBeInTheDocument();
    expect(screen.getByText('python-utils')).toBeInTheDocument();
    
    // Check that the filter controls are displayed
    expect(screen.getByLabelText('Filter by Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
  });
  
  it('filters repositories by name', async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeProvider>
        <RepositoryList repositories={mockRepositories} />
      </ThemeProvider>
    );
    
    // Type "react" in the name filter
    const nameFilterInput = screen.getByLabelText('Filter by Name');
    await user.type(nameFilterInput, 'react');
    
    // Check that only the react-app is displayed
    expect(screen.getByText('react-app')).toBeInTheDocument();
    expect(screen.queryByText('typescript-lib')).not.toBeInTheDocument();
    expect(screen.queryByText('python-utils')).not.toBeInTheDocument();
  });
  
  it('filters repositories by language', async () => {
    render(
      <ThemeProvider>
        <RepositoryList repositories={mockRepositories} />
      </ThemeProvider>
    );
    
    // Select "TypeScript" in the language filter
    const languageFilter = screen.getByLabelText('Language');
    fireEvent.mouseDown(languageFilter);
    
    // Using getByRole to find the TypeScript option in the dropdown
    const typeScriptOption = screen.getByRole('option', { name: 'TypeScript' });
    fireEvent.click(typeScriptOption);
    
    // Check that only the typescript-lib is displayed
    expect(screen.queryByText('react-app')).not.toBeInTheDocument();
    expect(screen.getByText('typescript-lib')).toBeInTheDocument();
    expect(screen.queryByText('python-utils')).not.toBeInTheDocument();
  });
  
  it('displays empty state when no repositories match filters', async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeProvider>
        <RepositoryList repositories={mockRepositories} />
      </ThemeProvider>
    );
    
    // Type a non-matching name
    const nameFilterInput = screen.getByLabelText('Filter by Name');
    await user.type(nameFilterInput, 'nonexistent');
    
    // Check that no repositories are displayed and empty message is shown
    expect(screen.queryByText('react-app')).not.toBeInTheDocument();
    expect(screen.queryByText('typescript-lib')).not.toBeInTheDocument();
    expect(screen.queryByText('python-utils')).not.toBeInTheDocument();
    expect(screen.getByText('0 Repositories')).toBeInTheDocument();
  });
  
  it('displays empty state when repositories array is empty', async () => {
    render(
      <ThemeProvider>
        <RepositoryList repositories={[]} />
      </ThemeProvider>
    );
    
    // Check that empty message is shown
    expect(screen.getByText(/No repositories found/i)).toBeInTheDocument();
  });
}); 