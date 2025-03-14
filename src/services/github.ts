import axios from 'axios';
import { Repository, GithubError, UserProfile } from '../types/github';

const GITHUB_API_URL = 'https://api.github.com/graphql';

// GraphQL query to fetch repositories for a user
const GET_USER_REPOSITORIES = `
  query GetUserRepositories($username: String!, $first: Int!) {
    user(login: $username) {
      repositories(
        first: $first, 
        orderBy: {field: UPDATED_AT, direction: DESC},
        ownerAffiliations: [OWNER],
        affiliations: [OWNER],
        privacy: PUBLIC
      ) {
        nodes {
          id
          name
          url
          description
          primaryLanguage {
            name
          }
          stargazerCount
          forkCount
          updatedAt
          owner {
            login
            avatarUrl
            url
          }
          isPrivate
          isFork
        }
      }
    }
  }
`;

// GraphQL query to fetch user profile information
const GET_USER_PROFILE = `
  query GetUserProfile($username: String!) {
    user(login: $username) {
      login
      name
      avatarUrl
      url
      bio
      company
      location
      twitterUsername
      websiteUrl
      email
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories {
        totalCount
      }
      starredRepositories {
        totalCount
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
        }
      }
      createdAt
    }
  }
`;

export const fetchUserProfile = async (username: string): Promise<UserProfile> => {
  try {
    const token = import.meta.env.VITE_GITHUB_TOKEN || '';
    
    const response = await axios.post(
      GITHUB_API_URL,
      {
        query: GET_USER_PROFILE,
        variables: {
          username
        }
      },
      {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      }
    );

    // Handle GraphQL errors
    if (response.data.errors) {
      const errorMessage = response.data.errors[0]?.message || 'Failed to fetch user profile';
      throw new Error(errorMessage);
    }

    const userData = response.data.data?.user;
    
    if (!userData) {
      throw new Error(`User "${username}" not found`);
    }

    return {
      login: userData.login,
      name: userData.name,
      avatar_url: userData.avatarUrl,
      html_url: userData.url,
      bio: userData.bio,
      company: userData.company,
      location: userData.location,
      twitter_username: userData.twitterUsername,
      blog: userData.websiteUrl,
      email: userData.email,
      followers: userData.followers.totalCount,
      following: userData.following.totalCount,
      public_repos: userData.repositories.totalCount,
      starred_repos: userData.starredRepositories.totalCount,
      total_contributions: userData.contributionsCollection.contributionCalendar.totalContributions,
      created_at: userData.createdAt
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const githubError = error.response.data as GithubError;
      throw new Error(githubError.message || 'Failed to fetch user profile');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch user profile');
  }
};

export const fetchUserRepositories = async (username: string): Promise<Repository[]> => {
  try {
    // GitHub requires a token for GraphQL API, but for public repositories,
    // you can also use a personal access token with no scopes
    const token = import.meta.env.VITE_GITHUB_TOKEN || '';
    
    const response = await axios.post(
      GITHUB_API_URL,
      {
        query: GET_USER_REPOSITORIES,
        variables: {
          username,
          first: 100 // Fetch up to 100 repositories
        }
      },
      {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      }
    );

    // Handle GraphQL errors
    if (response.data.errors) {
      const errorMessage = response.data.errors[0]?.message || 'Failed to fetch repositories';
      throw new Error(errorMessage);
    }

    // Map GraphQL response to Repository type
    const repositories = response.data.data?.user?.repositories?.nodes || [];

    // Additional check to ensure all repositories belong to the searched user
    return repositories
      .filter((repo: any) => repo.owner.login.toLowerCase() === username.toLowerCase())
      .map((repo: any): Repository => ({
        id: repo.id,
        name: repo.name,
        html_url: repo.url,
        description: repo.description,
        language: repo.primaryLanguage?.name || null,
        stargazers_count: repo.stargazerCount,
        forks_count: repo.forkCount,
        updated_at: repo.updatedAt,
        owner: {
          login: repo.owner.login,
          avatar_url: repo.owner.avatarUrl,
          html_url: repo.owner.url
        },
        is_private: repo.isPrivate,
        is_fork: repo.isFork
      }));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const githubError = error.response.data as GithubError;
      throw new Error(githubError.message || 'Failed to fetch repositories');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch repositories');
  }
}; 