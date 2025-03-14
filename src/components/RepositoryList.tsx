import { useState, useMemo } from 'react';
import {
  Grid,
  Typography,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  SelectChangeEvent,
  Alert,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TuneIcon from '@mui/icons-material/Tune';
import { Repository } from '../types/github';
import { RepositoryCard } from './RepositoryCard';

interface RepositoryListProps {
  repositories: Repository[];
}

export const RepositoryList = ({ repositories }: RepositoryListProps) => {
  const [nameFilter, setNameFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Get unique languages from repositories for the filter dropdown
  const languages = useMemo(() => {
    const languageSet = new Set<string>();
    repositories.forEach((repo) => {
      if (repo.language) {
        languageSet.add(repo.language);
      }
    });
    return Array.from(languageSet).sort();
  }, [repositories]);

  // Filter repositories based on name and language
  const filteredRepositories = useMemo(() => {
    return repositories.filter((repo) => {
      const nameMatch = repo.name.toLowerCase().includes(nameFilter.toLowerCase());
      const languageMatch = !languageFilter || repo.language === languageFilter;
      return nameMatch && languageMatch;
    });
  }, [repositories, nameFilter, languageFilter]);

  if (!repositories.length) {
    return <Alert severity="info">No repositories found. Try searching for a GitHub username.</Alert>;
  }

  return (
    <Box>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: isDarkMode 
            ? alpha(theme.palette.primary.dark, 0.1)
            : alpha(theme.palette.primary.light, 0.05),
          borderRadius: '12px',
          borderColor: isDarkMode 
            ? alpha(theme.palette.primary.main, 0.15)
            : alpha(theme.palette.primary.light, 0.15),
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
              ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.07) 0%, transparent 50%, rgba(21, 101, 192, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(33, 150, 243, 0.04) 0%, transparent 50%, rgba(66, 165, 245, 0.03) 100%)',
            opacity: 0.8,
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
          <TuneIcon 
            sx={{ 
              mr: 1.5, 
              color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
              fontSize: 26,
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
            Filter Repositories
          </Typography>
        </Box>
        
        <Divider sx={{ 
          mb: 3, 
          opacity: 0.6,
          background: isDarkMode 
            ? 'linear-gradient(90deg, rgba(100, 181, 246, 0.2), rgba(100, 181, 246, 0.1) 50%, rgba(100, 181, 246, 0.2))'
            : 'linear-gradient(90deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05) 50%, rgba(25, 118, 210, 0.1))'
        }} />
        
        <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Filter by Name"
              fullWidth
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Type to filter repositories"
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease',
                  backgroundColor: isDarkMode 
                    ? alpha(theme.palette.background.paper, 0.5)
                    : alpha(theme.palette.background.paper, 0.7),
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
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="language-filter-label">Language</InputLabel>
              <Select
                labelId="language-filter-label"
                id="language-filter"
                value={languageFilter}
                label="Language"
                onChange={(e: SelectChangeEvent) => setLanguageFilter(e.target.value)}
                sx={{ 
                  borderRadius: '8px',
                  backgroundColor: isDarkMode 
                    ? alpha(theme.palette.background.paper, 0.5)
                    : alpha(theme.palette.background.paper, 0.7),
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
                }}
              >
                <MenuItem value="">All Languages</MenuItem>
                {languages.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          mt: 4,
          px: 1.5,
        }}
      >
        <Typography 
          variant="h5" 
          sx={{
            fontWeight: 600,
            color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark,
          }}
        >
          {filteredRepositories.length} {filteredRepositories.length === 1 ? 'Repository' : 'Repositories'}
        </Typography>
        {filteredRepositories.length < repositories.length && (
          <Typography variant="body2" sx={{ 
            color: isDarkMode ? alpha(theme.palette.text.secondary, 0.7) : theme.palette.text.secondary,
            fontStyle: 'italic',
          }}>
            Filtered from {repositories.length} total
          </Typography>
        )}
      </Box>

      <Grid container spacing={3}>
        {filteredRepositories.map((repo) => (
          <Grid item key={repo.id} xs={12} sm={6} md={4}>
            <RepositoryCard repository={repo} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 