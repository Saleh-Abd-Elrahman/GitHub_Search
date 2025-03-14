import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../context/ThemeContext';

// Mock the MUI theme
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        divider: '#ccc',
        text: { primary: '#000' },
        primary: { light: '#fff' }
      }
    }),
  };
});

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    // Mock local storage
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('light');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    // Mock setTimeout
    vi.useFakeTimers();
  });

  it('renders correctly in light mode', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    // In light mode, we should see the dark mode icon (to switch to dark)
    expect(screen.getByLabelText('toggle theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    // First, mock localStorage to start in light mode
    Storage.prototype.getItem = vi.fn().mockReturnValue('light');
    
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    // Click the toggle button
    fireEvent.click(screen.getByLabelText('toggle theme'));
    
    // Check that localStorage.setItem was called with the new theme
    expect(localStorage.setItem).toHaveBeenCalledWith('themeMode', 'dark');
    
    // Fast-forward timers to complete the animation
    vi.runAllTimers();
  });

  it('displays tooltip with correct text', async () => {
    // Mock for light mode
    Storage.prototype.getItem = vi.fn().mockReturnValue('light');
    
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    // Check the tooltip in light mode
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
    
    // Click to toggle to dark mode
    fireEvent.click(screen.getByLabelText('toggle theme'));
    
    // After toggling, the tooltip should show "Switch to light mode"
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });
}); 