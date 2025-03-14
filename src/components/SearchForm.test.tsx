import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchForm } from './SearchForm';
import { ThemeProvider } from '../context/ThemeContext';

// Mock MUI theme
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        mode: 'light',
        primary: {
          main: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0'
        },
        background: {
          paper: '#fff'
        },
        text: {
          primary: '#000',
          secondary: '#666'
        },
        divider: '#ddd',
        action: {
          active: 'rgba(0, 0, 0, 0.54)',
          hover: 'rgba(0, 0, 0, 0.04)',
          selected: 'rgba(0, 0, 0, 0.08)',
          disabled: 'rgba(0, 0, 0, 0.26)',
          disabledBackground: 'rgba(0, 0, 0, 0.12)'
        }
      },
      shadows: Array(25).fill('none'),
      shape: { borderRadius: 4 },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      transitions: {
        create: () => 'all 0.3s ease',
      },
      alpha: () => 'rgba(255, 255, 255, 0.8)'
    }),
    alpha: () => 'rgba(255, 255, 255, 0.8)'
  };
});

describe('SearchForm Component', () => {
  it('renders correctly', () => {
    render(
      <ThemeProvider>
        <SearchForm onSearch={() => {}} isLoading={false} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Search GitHub Repositories')).toBeInTheDocument();
    expect(screen.getByLabelText('GitHub Username')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });
  
  it('shows validation error when submitting with empty username', async () => {
    const onSearchMock = vi.fn();
    
    render(
      <ThemeProvider>
        <SearchForm onSearch={onSearchMock} isLoading={false} />
      </ThemeProvider>
    );
    
    // Submit form with empty input
    const submitButton = screen.getByText('Search');
    fireEvent.click(submitButton);
    
    // Check that the error message is displayed
    expect(screen.getByText('Please enter a GitHub username')).toBeInTheDocument();
    
    // Check that onSearch was not called
    expect(onSearchMock).not.toHaveBeenCalled();
  });
  
  it('calls onSearch with trimmed username when valid input is submitted', async () => {
    const onSearchMock = vi.fn();
    const user = userEvent.setup();
    
    render(
      <ThemeProvider>
        <SearchForm onSearch={onSearchMock} isLoading={false} />
      </ThemeProvider>
    );
    
    // Type in the input field
    const input = screen.getByLabelText('GitHub Username');
    await user.type(input, '  octocat  ');
    
    // Submit the form
    const submitButton = screen.getByText('Search');
    await user.click(submitButton);
    
    // Check that onSearch was called with the trimmed username
    expect(onSearchMock).toHaveBeenCalledWith('octocat');
  });
  
  it('disables the form when isLoading is true', () => {
    render(
      <ThemeProvider>
        <SearchForm onSearch={() => {}} isLoading={true} />
      </ThemeProvider>
    );
    
    // Check that the input and button are disabled
    const input = screen.getByLabelText('GitHub Username');
    const button = screen.getByText('Search');
    
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
}); 