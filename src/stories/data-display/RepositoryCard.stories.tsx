import type { Meta, StoryObj } from '@storybook/react';
import { RepositoryCard } from '../../components/RepositoryCard';
import { ThemeProvider } from '../../context/ThemeContext';

const meta = {
  title: 'Data Display/RepositoryCard',
  component: RepositoryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: '350px', maxWidth: '100%' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof RepositoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    repository: {
      id: 1,
      name: 'react',
      description: 'A JavaScript library for building user interfaces',
      html_url: 'https://github.com/facebook/react',
      language: 'JavaScript',
      stargazers_count: 175000,
      forks_count: 35000,
      created_at: '2013-05-24T16:15:54Z',
      updated_at: '2023-03-15T12:34:56Z',
      topics: ['javascript', 'ui', 'library', 'react'],
      owner: {
        login: 'facebook',
        avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
        html_url: 'https://github.com/facebook',
      },
    }
  },
};

export const NoDescription: Story = {
  args: {
    repository: {
      id: 2,
      name: 'no-description-repo',
      description: '',
      html_url: 'https://github.com/user/no-description-repo',
      language: 'TypeScript',
      stargazers_count: 123,
      forks_count: 45,
      created_at: '2021-01-15T10:20:30Z',
      updated_at: '2023-02-10T08:15:00Z',
      topics: ['typescript'],
      owner: {
        login: 'user',
        avatar_url: 'https://avatars.githubusercontent.com/u/123456?v=4',
        html_url: 'https://github.com/user',
      },
    }
  },
};

export const NoLanguage: Story = {
  args: {
    repository: {
      id: 3,
      name: 'no-language-repo',
      description: 'A repository with no language specified',
      html_url: 'https://github.com/user/no-language-repo',
      language: null,
      stargazers_count: 50,
      forks_count: 10,
      created_at: '2022-05-20T14:30:00Z',
      updated_at: '2023-01-05T11:22:33Z',
      topics: ['documentation', 'examples'],
      owner: {
        login: 'user',
        avatar_url: 'https://avatars.githubusercontent.com/u/123456?v=4',
        html_url: 'https://github.com/user',
      },
    }
  },
}; 