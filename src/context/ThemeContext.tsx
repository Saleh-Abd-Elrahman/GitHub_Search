import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Check if user has a saved preference in localStorage, otherwise use their system preference
  const getInitialMode = (): ThemeMode => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    
    if (savedMode) {
      return savedMode;
    }
    
    // Check if user prefers dark mode in their system settings
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return prefersDark ? 'dark' : 'light';
  };

  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Toggle between light and dark mode with a smooth transition for backgrounds only
  const toggleTheme = () => {
    // Apply the theme change immediately
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      
      // Apply text color change immediately before starting the background transition
      document.body.classList.remove('light-mode', 'dark-mode');
      document.body.classList.add(`${newMode}-mode`);
      
      return newMode;
    });
    
    // Start the background transition
    setIsTransitioning(true);
    
    // End transition after backgrounds have changed
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with the CSS transition duration
  };

  // Apply theme to body element immediately on initial load
  useEffect(() => {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${mode}-mode`);
    
    // Apply a subtle animation to the entire page on theme change
    if (isTransitioning) {
      document.body.classList.add('theme-transitioning');
    } else {
      document.body.classList.remove('theme-transitioning');
    }
  }, [mode, isTransitioning]);

  // Effect to handle system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (!localStorage.getItem('themeMode')) {
        // Apply text color change immediately
        const newMode = mediaQuery.matches ? 'dark' : 'light';
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(`${newMode}-mode`);
        
        // Then set state and trigger background transitions
        setMode(newMode);
        setIsTransitioning(true);
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 