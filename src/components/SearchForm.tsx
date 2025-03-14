import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputAdornment,
  Typography,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

interface SearchFormProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }
    
    setError('');
    onSearch(username.trim());
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 4,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: isDarkMode 
          ? alpha(theme.palette.primary.dark, 0.15)
          : alpha(theme.palette.primary.light, 0.07),
        borderRadius: '12px',
        backdropFilter: 'blur(5px)',
        borderColor: isDarkMode 
          ? alpha(theme.palette.primary.main, 0.2)
          : alpha(theme.palette.primary.light, 0.2),
        borderWidth: '1px',
        borderStyle: 'solid',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: isDarkMode
            ? 'radial-gradient(circle at 15% 50%, rgba(25, 118, 210, 0.1), transparent 25%), radial-gradient(circle at 85% 30%, rgba(100, 181, 246, 0.15), transparent 30%)'
            : 'radial-gradient(circle at 15% 50%, rgba(25, 118, 210, 0.05), transparent 25%), radial-gradient(circle at 85% 30%, rgba(33, 150, 243, 0.07), transparent 30%)',
          opacity: 0.8,
          zIndex: 0,
        },
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonSearchIcon 
            sx={{ 
              mr: 1.5, 
              color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
              fontSize: 28,
            }} 
          />
          <Typography 
            variant="h6"
            sx={{
              fontWeight: 500,
              background: isDarkMode
                ? 'linear-gradient(90deg, #90CAF9 0%, #64B5F6 100%)'
                : 'linear-gradient(90deg, #1976D2 0%, #2196F3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Search GitHub Repositories
          </Typography>
        </Box>
        <FormControl fullWidth error={!!error}>
          <TextField
            id="username"
            label="GitHub Username"
            placeholder="Enter GitHub username (e.g., facebook)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            error={!!error}
            helperText={error}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                transition: 'background-color 0.3s ease',
                backgroundColor: isDarkMode 
                  ? alpha(theme.palette.background.paper, 0.5)
                  : alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? alpha(theme.palette.background.paper, 0.7)
                    : alpha(theme.palette.background.paper, 0.9),
                },
                '&.Mui-focused': {
                  backgroundColor: isDarkMode 
                    ? alpha(theme.palette.background.paper, 0.9)
                    : theme.palette.background.paper,
                }
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                    startIcon={<SearchIcon />}
                    sx={{ 
                      borderRadius: '8px',
                      boxShadow: isDarkMode 
                        ? '0 4px 10px 0 rgba(0, 0, 0, 0.2)'
                        : '0 4px 10px 0 rgba(33, 150, 243, 0.2)',
                      background: isDarkMode
                        ? 'linear-gradient(45deg, #64B5F6 0%, #42A5F5 100%)'
                        : 'linear-gradient(45deg, #1976D2 0%, #2196F3 100%)',
                      fontWeight: 500,
                      '&:hover': {
                        boxShadow: isDarkMode 
                          ? '0 6px 12px 0 rgba(0, 0, 0, 0.3)'
                          : '0 6px 12px 0 rgba(33, 150, 243, 0.3)',
                        background: isDarkMode
                          ? 'linear-gradient(45deg, #64B5F6 0%, #2196F3 100%)'
                          : 'linear-gradient(45deg, #1565C0 0%, #1976D2 100%)',
                      },
                    }}
                  >
                    Search
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 2, 
            display: 'block', 
            color: isDarkMode ? alpha(theme.palette.text.secondary, 0.7) : theme.palette.text.secondary,
            marginLeft: '4px',
          }}
        >
          Enter a GitHub username to see their public repositories
        </Typography>
      </Box>
    </Paper>
  );
}; 