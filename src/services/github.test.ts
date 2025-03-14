import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchUserRepositories, fetchUserProfile } from './github';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('GitHub Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock environment variables
    vi.stubEnv('VITE_GITHUB_TOKEN', 'mock-token');
  });
  
  describe('fetchUserProfile', () => {
    it('fetches and transforms user profile data correctly', async () => {
      // Mock the GraphQL response data
      const mockResponseData = {
        data: {
          data: {
            user: {
              login: 'testuser',
              name: 'Test User',
              avatarUrl: 'https://example.com/avatar.jpg',
              url: 'https://github.com/testuser',
              bio: 'This is a test bio',
              company: '@testcompany',
              location: 'Test City',
              twitterUsername: 'testtwitter',
              websiteUrl: 'https://example.com/blog',
              email: 'test@example.com',
              followers: { totalCount: 20 },
              following: { totalCount: 15 },
              repositories: { totalCount: 10 },
              starredRepositories: { totalCount: 30 },
              contributionsCollection: {
                contributionCalendar: {
                  totalContributions: 500
                }
              },
              createdAt: '2020-01-01T00:00:00Z'
            }
          }
        }
      };
      
      // Mock axios.post to return the response
      (axios.post as any).mockResolvedValueOnce(mockResponseData);
      
      // Call the function
      const profile = await fetchUserProfile('testuser');
      
      // Check that axios was called correctly
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.github.com/graphql',
        expect.objectContaining({
          variables: { username: 'testuser' }
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      );
      
      // Check that the profile data is transformed correctly
      expect(profile).toEqual({
        login: 'testuser',
        name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        html_url: 'https://github.com/testuser',
        bio: 'This is a test bio',
        company: '@testcompany',
        location: 'Test City',
        twitter_username: 'testtwitter',
        blog: 'https://example.com/blog',
        email: 'test@example.com',
        followers: 20,
        following: 15,
        public_repos: 10,
        starred_repos: 30,
        total_contributions: 500,
        created_at: '2020-01-01T00:00:00Z'
      });
    });
    
    it('handles errors when user is not found', async () => {
      // Mock the GraphQL error response
      const mockErrorResponse = {
        data: {
          errors: [
            { message: 'User "nonexistent" not found' }
          ]
        }
      };
      
      // Mock axios.post to return the error response
      (axios.post as any).mockResolvedValueOnce(mockErrorResponse);
      
      // Call the function and expect it to throw
      await expect(fetchUserProfile('nonexistent')).rejects.toThrow('User "nonexistent" not found');
      
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
    
    it('handles network errors', async () => {
      // Mock axios.post to throw a network error
      const networkError = new Error('Network Error');
      (axios.post as any).mockRejectedValueOnce(networkError);
      
      // Call the function and expect it to throw
      await expect(fetchUserProfile('testuser')).rejects.toThrow('Network Error');
      
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('fetchUserRepositories', () => {
    it('fetches and transforms repositories data correctly', async () => {
      // Mock the GraphQL response data
      const mockResponseData = {
        data: {
          data: {
            user: {
              repositories: {
                nodes: [
                  {
                    id: '12345',
                    name: 'test-repo',
                    url: 'https://github.com/testuser/test-repo',
                    description: 'A test repository',
                    primaryLanguage: {
                      name: 'JavaScript'
                    },
                    stargazerCount: 100,
                    forkCount: 50,
                    updatedAt: '2023-01-01T00:00:00Z',
                    owner: {
                      login: 'testuser',
                      avatarUrl: 'https://example.com/avatar.jpg',
                      url: 'https://github.com/testuser'
                    },
                    isPrivate: false,
                    isFork: false
                  }
                ]
              }
            }
          }
        }
      };
      
      // Mock axios.post to return the response
      (axios.post as any).mockResolvedValueOnce(mockResponseData);
      
      // Call the function
      const repositories = await fetchUserRepositories('testuser');
      
      // Check that axios was called correctly
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.github.com/graphql',
        expect.objectContaining({
          variables: { 
            username: 'testuser',
            first: 100
          }
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      );
      
      // Check that the repository data is transformed correctly
      expect(repositories).toEqual([
        {
          id: '12345',
          name: 'test-repo',
          html_url: 'https://github.com/testuser/test-repo',
          description: 'A test repository',
          language: 'JavaScript',
          stargazers_count: 100,
          forks_count: 50,
          updated_at: '2023-01-01T00:00:00Z',
          owner: {
            login: 'testuser',
            avatar_url: 'https://example.com/avatar.jpg',
            html_url: 'https://github.com/testuser'
          },
          is_private: false,
          is_fork: false
        }
      ]);
    });
    
    it('handles errors when user is not found', async () => {
      // Mock the GraphQL error response
      const mockErrorResponse = {
        data: {
          errors: [
            { message: 'User "nonexistent" not found' }
          ]
        }
      };
      
      // Mock axios.post to return the error response
      (axios.post as any).mockResolvedValueOnce(mockErrorResponse);
      
      // Call the function and expect it to throw
      await expect(fetchUserRepositories('nonexistent')).rejects.toThrow('User "nonexistent" not found');
      
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
    
    it('returns empty array when user has no repositories', async () => {
      // Mock the GraphQL response with no repositories
      const mockResponseData = {
        data: {
          data: {
            user: {
              repositories: {
                nodes: []
              }
            }
          }
        }
      };
      
      // Mock axios.post to return the response
      (axios.post as any).mockResolvedValueOnce(mockResponseData);
      
      // Call the function
      const repositories = await fetchUserRepositories('testuser');
      
      // Check that the result is an empty array
      expect(repositories).toEqual([]);
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
}); 