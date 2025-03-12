import axios from 'axios';
import { Repository, GithubError } from '../types/github';

const GITHUB_API_URL = 'https://api.github.com';

export const fetchUserRepositories = async (username: string): Promise<Repository[]> => {
  try {
    const response = await axios.get<Repository[]>(`${GITHUB_API_URL}/users/${username}/repos?per_page=100`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const githubError = error.response.data as GithubError;
      throw new Error(githubError.message || 'Failed to fetch repositories');
    }
    throw new Error('Failed to fetch repositories');
  }
}; 