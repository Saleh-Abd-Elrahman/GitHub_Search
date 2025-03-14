export interface Repository {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  is_private?: boolean;
  is_fork?: boolean;
}

export interface UserProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  twitter_username: string | null;
  blog: string | null;
  email: string | null;
  followers: number;
  following: number;
  public_repos: number;
  starred_repos: number;
  total_contributions: number;
  created_at: string;
}

export interface GithubError {
  message: string;
  documentation_url?: string;
} 