import {
  Avatar,
  Box,
  Chip,
  Grid,
  Link,
  Stack,
  Typography,
  useTheme,
  alpha,
  Paper,
  Tooltip,
  Button,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import TwitterIcon from '@mui/icons-material/Twitter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WebIcon from '@mui/icons-material/Web';
import { UserProfile } from '../types/github';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

interface UserProfileCardProps {
  profile: UserProfile;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [portfolioUrl, setPortfolioUrl] = useState<string | null>(null);
  const [linkedInUrl, setLinkedInUrl] = useState<string | null>(null);
  const [linkedInUsername, setLinkedInUsername] = useState<string | null>(null);
  
  // Format the creation date to a readable format
  const formattedDate = profile.created_at 
    ? format(new Date(profile.created_at), 'MMMM dd, yyyy')
    : '';

  // Enhanced utility function to safely format URLs with validation
  const formatUrl = (url: string): string => {
    if (!url) return '';
    
    try {
      // Check if the URL is empty or just whitespace
      if (!url.trim()) return '';
      
      // Check if the URL starts with http:// or https://
      if (url.match(/^https?:\/\//i)) {
        // Test if it's a valid URL by trying to create a URL object
        new URL(url);
        return url;
      }
      
      // Check if it's a GitHub profile
      if (url.startsWith('github.com/')) {
        return `https://${url}`;
      }
      
      // Check if it's a LinkedIn profile
      if (url.includes('linkedin.com') || url.startsWith('linkedin.com/')) {
        return url.startsWith('linkedin.com/') ? `https://${url}` : url;
      }
      
      // Check if it's just a domain name (e.g., example.com)
      if (url.includes('.') && !url.includes(' ')) {
        try {
          const formattedUrl = `https://${url}`;
          new URL(formattedUrl); // Test if it's a valid URL
          return formattedUrl;
        } catch (e) {
          // If not a valid URL, return as is
          return url;
        }
      }
      
      return url;
    } catch (error) {
      // If URL parsing fails, return original
      console.warn("URL parsing error:", error);
      return url;
    }
  };

  // Testing URL validity
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Extract Website URL from profile data
  const extractWebsiteInfo = (): string | null => {
    // If blog exists and isn't a LinkedIn URL, format it
    if (profile.blog) {
      // Skip LinkedIn URLs as they'll be handled separately
      if (profile.blog.toLowerCase().includes('linkedin.com')) {
        return null;
      }
      
      const formattedUrl = formatUrl(profile.blog);
      if (formattedUrl && isValidUrl(formattedUrl)) {
        return formattedUrl;
      }
    }
    
    return null;
  };

  // Extract LinkedIn info from any available source
  const extractLinkedInInfo = (): {url: string, username: string} | null => {
    // Check direct URL source first (blog is most common)
    if (profile.blog) {
      const blogLower = profile.blog.toLowerCase();
      
      // Direct LinkedIn profile URL - preserve the exact URL
      if (blogLower.includes('linkedin.com/')) {
        try {
          // Format properly with https:// but preserve the rest
          const formattedUrl = formatUrl(profile.blog);
          const urlObj = new URL(formattedUrl);
          
          // Verify this is a LinkedIn URL
          if (urlObj.hostname.includes('linkedin.com')) {
            // Try to extract username from path
            let username = '';
            
            // For /in/ style profiles
            if (urlObj.pathname.includes('/in/')) {
              const match = urlObj.pathname.match(/\/in\/([^\/\?#]+)/i);
              if (match && match[1]) {
                username = match[1];
              }
            } else {
              // For other LinkedIn URL formats, use the path as username
              username = urlObj.pathname.replace(/^\//, '').split('/')[0];
            }
            
            // Return the exact formatted URL, not a reconstructed one
            return {
              url: formattedUrl, // Use the exact URL from the profile
              username: username || 'Profile' // Fallback if we can't extract username
            };
          }
        } catch (e) {
          console.warn("LinkedIn URL parsing error", e);
        }
      }
    }
    
    // Try other sources if direct URL not found
    const linkedInSources = [
      // Check bio for LinkedIn
      profile.bio,
      // Check if there's a direct mention in other fields
      profile.company
    ];
    
    // First try to find explicit LinkedIn URLs in any available field
    for (const source of linkedInSources) {
      if (!source) continue;
      
      // Match linkedin.com URL pattern (case insensitive)
      const linkedInMatch = source.match(/(https?:\/\/)?([w]{3}\.)?linkedin\.com\/[^\s]+/i);
      if (linkedInMatch && linkedInMatch[0]) {
        try {
          const exactUrl = formatUrl(linkedInMatch[0]);
          const urlObj = new URL(exactUrl);
          
          // Try to extract username if this is an /in/ profile
          let username = '';
          if (urlObj.pathname.includes('/in/')) {
            const match = urlObj.pathname.match(/\/in\/([^\/\?#]+)/i);
            if (match && match[1]) {
              username = match[1];
            }
          }
          
          return {
            url: exactUrl, // Use the exact URL found
            username: username || 'Profile'
          };
        } catch (e) {
          console.warn("LinkedIn URL parsing error in source text", e);
        }
      }
    }
    
    // Skip the more aggressive fallback options to avoid incorrect LinkedIn URLs
    return null;
  };

  // Check if company name is a GitHub organization (starts with @)
  const renderCompany = () => {
    if (!profile.company) return null;
    
    // If company name contains @org references, convert them to links
    const companyText = profile.company;
    
    // Check if company name is a GitHub organization (starts with @)
    if (companyText.startsWith('@')) {
      const orgName = companyText.substring(1); // Remove the @ symbol
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon 
            fontSize="small" 
            sx={{ color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main }}
          />
          <Link
            href={`https://github.com/${orgName}`}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color={isDarkMode ? "primary.light" : "primary.main"}
          >
            {companyText}
          </Link>
        </Box>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BusinessIcon 
          fontSize="small" 
          sx={{ color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main }}
        />
        <Typography variant="body2">{companyText}</Typography>
      </Box>
    );
  };

  // Process LinkedIn and Portfolio URLs when component mounts or profile changes
  useEffect(() => {
    // Extract Portfolio/Website info first
    const websiteUrl = extractWebsiteInfo();
    setPortfolioUrl(websiteUrl);
    
    // Then extract LinkedIn info
    const linkedInInfo = extractLinkedInInfo();
    if (linkedInInfo) {
      console.log("LinkedIn info found:", linkedInInfo);
      setLinkedInUrl(linkedInInfo.url);
      setLinkedInUsername(linkedInInfo.username);
    } else {
      setLinkedInUrl(null);
      setLinkedInUsername(null);
    }
  }, [profile]);

  // For testing: show profile data in console
  useEffect(() => {
    console.log('Profile data for link detection:', {
      login: profile.login,
      name: profile.name,
      bio: profile.bio,
      blog: profile.blog, 
      company: profile.company,
      location: profile.location
    });
  }, [profile]);

  return (
    <Paper
      elevation={3}
      sx={{
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
            ? 'radial-gradient(circle at 25% 25%, rgba(25, 118, 210, 0.15), transparent 40%), radial-gradient(circle at 75% 75%, rgba(100, 181, 246, 0.2), transparent 40%)'
            : 'radial-gradient(circle at 25% 25%, rgba(25, 118, 210, 0.07), transparent 40%), radial-gradient(circle at 75% 75%, rgba(33, 150, 243, 0.1), transparent 40%)',
          opacity: 0.9,
          zIndex: 0,
        },
      }}
    >
      <Grid container spacing={3} sx={{ p: 3 }}>
        {/* Avatar and Name Section */}
        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Link 
            href={profile.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ textDecoration: 'none' }}
          >
            <Avatar 
              src={profile.avatar_url} 
              alt={profile.login}
              sx={{ 
                width: 120, 
                height: 120, 
                mb: 2,
                border: `3px solid ${isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light}`,
                boxShadow: `0 4px 12px ${isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(33, 150, 243, 0.2)'}`,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: `0 6px 16px ${isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(33, 150, 243, 0.3)'}`,
                }
              }}
            />
          </Link>
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            align="center"
            sx={{
              background: isDarkMode
                ? 'linear-gradient(90deg, #90CAF9 0%, #64B5F6 100%)'
                : 'linear-gradient(90deg, #1976D2 0%, #2196F3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            {profile.name || profile.login}
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            align="center"
            sx={{ mb: 2 }}
          >
            @{profile.login}
          </Typography>
          
          {/* Social Buttons */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<GitHubIcon />}
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderRadius: '20px',
                padding: '6px 12px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                backgroundColor: isDarkMode 
                  ? alpha(theme.palette.primary.dark, 0.1)
                  : alpha(theme.palette.primary.light, 0.1),
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 8px ${isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(33, 150, 243, 0.2)'}`,
                  backgroundColor: isDarkMode 
                    ? alpha(theme.palette.primary.dark, 0.2)
                    : alpha(theme.palette.primary.light, 0.2),
                }
              }}
            >
              GitHub
            </Button>
            
            {linkedInUrl && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<LinkedInIcon />}
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  backgroundColor: isDarkMode 
                    ? alpha('#0077B5', 0.1)
                    : alpha('#0077B5', 0.07),
                  borderColor: '#0077B5',
                  color: '#0077B5',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 119, 181, 0.2)',
                    backgroundColor: isDarkMode 
                      ? alpha('#0077B5', 0.2)
                      : alpha('#0077B5', 0.15),
                    borderColor: '#0077B5',
                  }
                }}
              >
                LinkedIn
              </Button>
            )}
            
            {portfolioUrl && (
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<WebIcon />}
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  borderColor: isDarkMode 
                    ? theme.palette.secondary.main 
                    : theme.palette.secondary.main,
                  color: isDarkMode 
                    ? theme.palette.secondary.light 
                    : theme.palette.secondary.main,
                  backgroundColor: isDarkMode 
                    ? alpha(theme.palette.secondary.main, 0.1)
                    : alpha(theme.palette.secondary.main, 0.07),
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 8px ${alpha(theme.palette.secondary.main, 0.3)}`,
                    backgroundColor: isDarkMode 
                      ? alpha(theme.palette.secondary.main, 0.2)
                      : alpha(theme.palette.secondary.main, 0.15),
                  }
                }}
              >
                Portfolio
              </Button>
            )}
          </Stack>
        </Grid>

        {/* User Info Section */}
        <Grid item xs={12} md={9}>
          {profile.bio && (
            <Typography 
              variant="body1" 
              gutterBottom 
              sx={{ 
                mb: 2, 
                fontStyle: 'italic',
                color: isDarkMode ? theme.palette.grey[300] : theme.palette.grey[800],
              }}
            >
              {profile.bio}
            </Typography>
          )}

          <Grid container spacing={2}>
            {/* Stats Section */}
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 2, 
                  mb: 3,
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}
              >
                <Link 
                  href={`${profile.html_url}?tab=followers`}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                >
                  <Chip
                    icon={<PeopleIcon />}
                    label={`${profile.followers} Followers`}
                    variant="outlined"
                    clickable
                    sx={{
                      backgroundColor: isDarkMode 
                        ? alpha(theme.palette.primary.dark, 0.2)
                        : alpha(theme.palette.primary.light, 0.1),
                      border: `1px solid ${isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light}`,
                      '& .MuiChip-icon': {
                        color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
                      },
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? alpha(theme.palette.primary.dark, 0.3)
                          : alpha(theme.palette.primary.light, 0.2),
                        transform: 'translateY(-2px)',
                      }
                    }}
                  />
                </Link>
                <Link 
                  href={`${profile.html_url}?tab=following`}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                >
                  <Chip
                    icon={<PersonIcon />}
                    label={`${profile.following} Following`}
                    variant="outlined"
                    clickable
                    sx={{
                      backgroundColor: isDarkMode 
                        ? alpha(theme.palette.primary.dark, 0.2)
                        : alpha(theme.palette.primary.light, 0.1),
                      border: `1px solid ${isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light}`,
                      '& .MuiChip-icon': {
                        color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
                      },
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? alpha(theme.palette.primary.dark, 0.3)
                          : alpha(theme.palette.primary.light, 0.2),
                        transform: 'translateY(-2px)',
                      }
                    }}
                  />
                </Link>
                <Link 
                  href={`${profile.html_url}?tab=stars`}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                >
                  <Chip
                    icon={<StarIcon />}
                    label={`${profile.starred_repos} Stars`}
                    variant="outlined"
                    clickable
                    sx={{
                      backgroundColor: isDarkMode 
                        ? alpha(theme.palette.primary.dark, 0.2)
                        : alpha(theme.palette.primary.light, 0.1),
                      border: `1px solid ${isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light}`,
                      '& .MuiChip-icon': {
                        color: isDarkMode ? 'rgba(255, 215, 0, 0.7)' : 'rgba(255, 180, 0, 0.7)',
                      },
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? alpha(theme.palette.primary.dark, 0.3)
                          : alpha(theme.palette.primary.light, 0.2),
                        transform: 'translateY(-2px)',
                      }
                    }}
                  />
                </Link>
                <Tooltip title="Total Contributions in the last year">
                  <Link 
                    href={`${profile.html_url}?tab=overview`}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                  >
                    <Chip
                      icon={<GitHubIcon />}
                      label={`${profile.total_contributions} Contributions`}
                      variant="outlined"
                      clickable
                      sx={{
                        backgroundColor: isDarkMode 
                          ? alpha(theme.palette.primary.dark, 0.2)
                          : alpha(theme.palette.primary.light, 0.1),
                        border: `1px solid ${isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light}`,
                        '& .MuiChip-icon': {
                          color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
                        },
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: isDarkMode 
                            ? alpha(theme.palette.primary.dark, 0.3)
                            : alpha(theme.palette.primary.light, 0.2),
                          transform: 'translateY(-2px)',
                        }
                      }}
                    />
                  </Link>
                </Tooltip>
              </Box>
            </Grid>

            {/* Contact and Details */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.5}>
                {profile.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon 
                      fontSize="small" 
                      sx={{ color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main }}
                    />
                    <Tooltip title="Search for this location on Google Maps">
                      <Link
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        color={isDarkMode ? "primary.light" : "primary.main"}
                      >
                        {profile.location}
                      </Link>
                    </Tooltip>
                  </Box>
                )}
                {profile.company && renderCompany()}
                {profile.created_at && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon 
                      fontSize="small" 
                      sx={{ color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main }}
                    />
                    <Typography variant="body2">Joined on {formattedDate}</Typography>
                  </Box>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack spacing={1.5}>
                {profile.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon 
                      fontSize="small" 
                      sx={{ color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main }}
                    />
                    <Link 
                      href={`mailto:${profile.email}`} 
                      underline="hover"
                      color={isDarkMode ? "primary.light" : "primary.main"}
                    >
                      {profile.email}
                    </Link>
                  </Box>
                )}
                {linkedInUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinkedInIcon 
                      fontSize="small" 
                      sx={{ color: '#0077B5' }}
                    />
                    <Link 
                      href={linkedInUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{ color: '#0077B5' }}
                    >
                      {linkedInUsername ? `@${linkedInUsername}` : 'LinkedIn Profile'}
                    </Link>
                  </Box>
                )}
                {portfolioUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WebIcon 
                      fontSize="small" 
                      sx={{ color: isDarkMode ? theme.palette.secondary.light : theme.palette.secondary.main }}
                    />
                    <Tooltip title="Personal Portfolio Website">
                      <Link 
                        href={portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        underline="hover"
                        color={isDarkMode ? "secondary.light" : "secondary.main"}
                        sx={{ 
                          maxWidth: '100%', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap',
                          display: 'block',
                          fontWeight: 500,
                        }}
                      >
                        {portfolioUrl.replace(/^https?:\/\//i, '')}
                        <Chip
                          label="Portfolio"
                          size="small"
                          sx={{
                            ml: 1,
                            height: '18px',
                            fontSize: '0.65rem',
                            backgroundColor: isDarkMode 
                              ? alpha(theme.palette.secondary.main, 0.2)
                              : alpha(theme.palette.secondary.light, 0.2),
                            border: `1px solid ${isDarkMode ? alpha(theme.palette.secondary.main, 0.3) : alpha(theme.palette.secondary.light, 0.3)}`,
                            color: isDarkMode ? theme.palette.secondary.light : theme.palette.secondary.main,
                          }}
                        />
                      </Link>
                    </Tooltip>
                  </Box>
                )}
                {profile.twitter_username && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TwitterIcon 
                      fontSize="small" 
                      sx={{ color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main }}
                    />
                    <Link 
                      href={`https://x.com/${profile.twitter_username}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      underline="hover"
                      color={isDarkMode ? "primary.light" : "primary.main"}
                    >
                      @{profile.twitter_username}
                    </Link>
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}; 