import { useState, useMemo, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Alert, 
  CircularProgress, 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  AppBar, 
  Toolbar,
  GlobalStyles,
  Divider,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { SearchForm } from './components/SearchForm';
import { RepositoryList } from './components/RepositoryList';
import { ThemeToggle } from './components/ThemeToggle';
import { fetchUserRepositories, fetchUserProfile } from './services/github';
import { Repository, UserProfile } from './types/github';
import { useTheme } from './context/ThemeContext';
import { UserProfileCard } from './components/UserProfileCard';

function App() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const { mode, isTransitioning } = useTheme();
  const [tokenMissing, setTokenMissing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    // Check if the GitHub token is set
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    setTokenMissing(!token);
  }, []);

  // Create Material UI theme based on the current mode
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#2196f3' : '#90caf9',
        light: mode === 'light' ? '#64b5f6' : '#bbdefb',
        dark: mode === 'light' ? '#1976d2' : '#64b5f6',
      },
      secondary: {
        main: mode === 'light' ? '#f50057' : '#f48fb1',
      },
      background: {
        default: mode === 'light' ? '#f0f7ff' : '#0a1929',
        paper: mode === 'light' ? '#ffffff' : '#132f4c',
      },
      // Custom colors for faint backgrounds
      ...((mode === 'light') 
        ? {
          faintBlue: 'rgba(33, 150, 243, 0.04)',
          faintHighlight: 'rgba(120, 170, 255, 0.08)',
          cardGradient: 'linear-gradient(120deg, rgba(240, 247, 255, 0.8) 0%, rgba(240, 247, 255, 0.2) 100%)',
          subtlePattern: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%2380b3ff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
        }
        : {
          faintBlue: 'rgba(30, 80, 140, 0.25)',
          faintHighlight: 'rgba(100, 181, 246, 0.12)',
          cardGradient: 'linear-gradient(120deg, rgba(19, 47, 76, 0.6) 0%, rgba(19, 47, 76, 0.9) 100%)',
          subtlePattern: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%234080bf\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
        }
      ),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.5s ease',
            backgroundImage: mode === 'light' 
              ? 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%2380b3ff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
              : 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%233070b3\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundColor: mode === 'light' ? '#f0f7ff' : '#0a1929',
            backgroundAttachment: 'fixed',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.5s ease, box-shadow 0.5s ease',
            backgroundImage: mode === 'light' 
              ? 'linear-gradient(120deg, rgba(240, 247, 255, 0.7) 0%, rgba(255, 255, 255, 0.8) 100%)' 
              : 'linear-gradient(120deg, rgba(19, 47, 76, 0.8) 0%, rgba(19, 47, 76, 0.95) 100%)',
            boxShadow: mode === 'light' 
              ? '0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 0 rgba(0, 127, 255, 0)' 
              : '0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 0 0 0 rgba(137, 207, 255, 0.05)',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            transition: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.5s ease, box-shadow 0.5s ease',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.5s ease, border-color 0.5s ease',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: mode === 'light' 
              ? 'linear-gradient(120deg, rgba(240, 247, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)' 
              : 'linear-gradient(120deg, rgba(25, 53, 82, 0.95) 0%, rgba(19, 47, 76, 0.95) 100%)',
            borderBottom: mode === 'light' 
              ? '1px solid rgba(231, 241, 251, 0.7)' 
              : '1px solid rgba(26, 54, 85, 0.7)',
            backdropFilter: 'blur(8px)',
          },
        },
      },
    },
  }), [mode]);

  const handleSearch = async (searchUsername: string) => {
    setLoading(true);
    setProfileLoading(true);
    setError(null);
    setUsername(searchUsername);
    setUserProfile(null);

    try {
      // Fetch user profile
      try {
        const profile = await fetchUserProfile(searchUsername);
        setUserProfile(profile);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        // Continue even if profile fetch fails, as we still want to show repositories
      } finally {
        setProfileLoading(false);
      }

      // Fetch repositories
      const repos = await fetchUserRepositories(searchUsername);
      setRepositories(repos);
      
      if (repos.length === 0) {
        setError(`No repositories found for user "${searchUsername}"`);
      }
    } catch (err) {
      setRepositories([]);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles 
        styles={{
          '*, *::before, *::after': {
            transition: 'inherit',
          },
          '.theme-transition-container': {
            transition: 'background-color 0.5s ease, border-color 0.5s ease',
          },
          'p, h1, h2, h3, h4, h5, h6, span, div': {
            transition: 'none !important',
          },
          '@keyframes fadeColorChange': {
            '0%': { opacity: 0.98 },
            '100%': { opacity: 1 }
          },
          '.theme-transitioning': {
            animation: 'fadeColorChange 0.5s ease'
          }
        }} 
      />
      <Box 
        className={`theme-transition-container ${isTransitioning ? 'theme-transitioning' : ''}`} 
        sx={{ 
          minHeight: '100vh',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
            zIndex: -1,
            backgroundImage: mode === 'light' 
              ? 'linear-gradient(120deg, rgba(173, 216, 230, 0.2) 0%, rgba(240, 248, 255, 0.1) 100%)' 
              : 'linear-gradient(120deg, rgba(30, 60, 90, 0.2) 0%, rgba(10, 25, 41, 0.1) 100%)',
            pointerEvents: 'none',
          }
        }}
      >
        <AppBar 
          position="static" 
          color="default" 
          elevation={0}
          sx={{ transition: 'background-color 0.5s ease' }}
        >
          <Toolbar>
            <GitHubIcon sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              GitHub Repository Search
            </Typography>
            <ThemeToggle />
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {tokenMissing && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1">
                GitHub API Token Required: This app uses GitHub's GraphQL API which requires authentication.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Please create a token at <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">https://github.com/settings/tokens</a> and add it to your .env file as VITE_GITHUB_TOKEN.
              </Typography>
            </Alert>
          )}
          
          <SearchForm onSearch={handleSearch} isLoading={loading || profileLoading} />

          {(loading || profileLoading) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

          {username && !loading && !error && (
            <>
              {/* User Profile Section */}
              {userProfile && (
                <UserProfileCard profile={userProfile} />
              )}

              {/* Repository Section */}
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  mt: 4, 
                  mb: 3,
                  fontWeight: 500,
                  color: mode === 'light' ? 'primary.dark' : 'primary.light'
                }}
              >
                Repositories ({repositories.length})
              </Typography>
              <Divider sx={{ 
                mb: 4, 
                opacity: 0.6,
                background: mode === 'light' 
                  ? 'linear-gradient(90deg, rgba(25, 118, 210, 0.2), rgba(25, 118, 210, 0.05) 50%, rgba(25, 118, 210, 0.2))'
                  : 'linear-gradient(90deg, rgba(100, 181, 246, 0.3), rgba(100, 181, 246, 0.1) 50%, rgba(100, 181, 246, 0.3))'
              }} />
              <RepositoryList repositories={repositories} />
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
