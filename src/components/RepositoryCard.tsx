import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CardActions,
  Button,
  Stack,
  useTheme as useMuiTheme,
  Tooltip,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import StarIcon from '@mui/icons-material/Star';
import ForkLeftIcon from '@mui/icons-material/ForkLeft';
import { Repository } from '../types/github';

interface RepositoryCardProps {
  repository: Repository;
}

export const RepositoryCard = ({ repository }: RepositoryCardProps) => {
  const formattedDate = new Date(repository.updated_at).toLocaleDateString();
  const muiTheme = useMuiTheme();
  const isDarkMode = muiTheme.palette.mode === 'dark';

  // Function to generate a consistent pastel color based on the repository language
  const getLanguageColor = (language: string | null): string => {
    if (!language) return isDarkMode ? '#555' : '#ddd';
    
    // Simple hash function to get a consistent number from the language name
    let hash = 0;
    for (let i = 0; i < language.length; i++) {
      hash = language.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate pastel colors
    if (isDarkMode) {
      // Darker mode - richer colors with some saturation
      const h = hash % 360;
      return `hsl(${h}, 70%, 35%)`;
    } else {
      // Light mode - softer pastel colors
      const h = hash % 360;
      return `hsl(${h}, 70%, 75%)`;
    }
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'background-color 0.5s ease, box-shadow 0.5s ease, transform 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        borderColor: isDarkMode ? 'rgba(100, 181, 246, 0.2)' : 'rgba(25, 118, 210, 0.12)',
        background: isDarkMode 
          ? 'linear-gradient(145deg, rgba(19, 47, 76, 0.9) 0%, rgba(19, 47, 76, 0.7) 100%)' 
          : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 247, 255, 0.85) 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: repository.language 
            ? getLanguageColor(repository.language)
            : (isDarkMode ? '#555' : '#ddd'),
          opacity: 0.8,
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isDarkMode 
            ? '0 8px 16px rgba(0, 0, 0, 0.3)' 
            : '0 8px 16px rgba(0, 0, 0, 0.1)',
          '&::before': {
            opacity: 1,
          }
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="h6" component="div" gutterBottom noWrap sx={{ flexGrow: 1 }}>
            {repository.name}
          </Typography>
          {repository.is_fork && (
            <Tooltip title="Forked Repository">
              <ForkLeftIcon
                fontSize="small"
                sx={{
                  ml: 1,
                  color: isDarkMode 
                    ? muiTheme.palette.primary.light 
                    : muiTheme.palette.primary.main,
                }}
              />
            </Tooltip>
          )}
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom 
          sx={{ 
            minHeight: '40px',
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {repository.description || 'No description provided'}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" mb={2} flexWrap="wrap">
          {repository.language && (
            <Chip 
              label={repository.language} 
              size="small" 
              sx={{ 
                my: 0.5,
                backgroundColor: `${getLanguageColor(repository.language)}20`,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                borderColor: getLanguageColor(repository.language),
                fontWeight: 500,
              }}
              variant="outlined"
            />
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, my: 0.5 }}>
            <StarIcon 
              fontSize="small" 
              sx={{ 
                mr: 0.5, 
                color: isDarkMode ? 'rgba(255, 215, 0, 0.7)' : 'rgba(255, 180, 0, 0.7)' 
              }} 
            />
            <Typography variant="body2">{repository.stargazers_count}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, my: 0.5 }}>
            <ForkLeftIcon 
              fontSize="small" 
              sx={{ 
                mr: 0.5, 
                color: isDarkMode ? muiTheme.palette.primary.light : muiTheme.palette.primary.main
              }} 
            />
            <Typography variant="body2">{repository.forks_count}</Typography>
          </Box>
        </Stack>
        <Typography 
          variant="caption" 
          sx={{ 
            color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Last updated: {formattedDate}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          href={repository.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          startIcon={<GitHubIcon />}
          sx={{
            color: isDarkMode ? muiTheme.palette.primary.light : muiTheme.palette.primary.main,
            fontWeight: 500,
            '&:hover': {
              backgroundColor: isDarkMode 
                ? 'rgba(144, 202, 249, 0.08)'
                : 'rgba(33, 150, 243, 0.08)',
            }
          }}
        >
          View on GitHub
        </Button>
      </CardActions>
    </Card>
  );
}; 