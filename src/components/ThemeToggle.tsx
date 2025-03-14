import { useState } from 'react';
import { IconButton, Tooltip, Box, useTheme as useMuiTheme } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '../context/ThemeContext';
import { keyframes } from '@mui/system';

// Define animations
const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    
    // Reset the animation state after the rotation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <Box sx={{ position: 'relative', height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton 
          onClick={handleToggle} 
          color="inherit" 
          aria-label="toggle theme"
          edge="end"
          sx={{
            transition: 'background-color 0.3s ease',
            animation: isAnimating ? `${rotateAnimation} 0.5s ease` : 'none',
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(55,55,75,0.4) 0%, rgba(55,55,75,0) 100%)' 
              : 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
            backdropFilter: 'blur(4px)',
            border: `1px solid ${muiTheme.palette.divider}`,
            '&:hover': {
              background: mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(55,55,75,0.6) 0%, rgba(55,55,75,0.2) 100%)' 
                : 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
            },
          }}
        >
          {mode === 'light' ? (
            <DarkModeIcon 
              sx={{ 
                color: muiTheme.palette.text.primary,
              }} 
            />
          ) : (
            <LightModeIcon 
              sx={{ 
                color: muiTheme.palette.primary.light,
              }} 
            />
          )}
        </IconButton>
      </Box>
    </Tooltip>
  );
}; 