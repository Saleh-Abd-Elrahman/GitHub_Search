import type { Meta, StoryObj } from '@storybook/react';
import { RepositoryList } from '../../components/RepositoryList';
import { ThemeProvider } from '../../context/ThemeContext';

const meta = {
  title: 'Data Display/RepositoryList',
  component: RepositoryList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: '800px', maxWidth: '100%' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof RepositoryList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for repositories
const mockRepositories = [
  {
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
  },
  {
    id: 2,
    name: 'typescript',
    description: 'TypeScript is a superset of JavaScript that compiles to clean JavaScript output.',
    html_url: 'https://github.com/microsoft/typescript',
    language: 'TypeScript',
    stargazers_count: 85000,
    forks_count: 12000,
    created_at: '2014-06-18T20:54:00Z',
    updated_at: '2023-03-14T08:45:32Z',
    topics: ['typescript', 'javascript', 'compiler'],
    owner: {
      login: 'microsoft',
      avatar_url: 'https://avatars.githubusercontent.com/u/6154722?v=4',
      html_url: 'https://github.com/microsoft',
    },
  },
  {
    id: 3,
    name: 'vscode',
    description: 'Visual Studio Code is a code editor redefined and optimized for building and debugging modern web applications.',
    html_url: 'https://github.com/microsoft/vscode',
    language: 'TypeScript',
    stargazers_count: 140000,
    forks_count: 25000,
    created_at: '2015-09-03T20:23:38Z',
    updated_at: '2023-03-13T10:12:45Z',
    topics: ['editor', 'code', 'typescript', 'visual-studio'],
    owner: {
      login: 'microsoft',
      avatar_url: 'https://avatars.githubusercontent.com/u/6154722?v=4',
      html_url: 'https://github.com/microsoft',
    },
  }
];

export const Default: Story = {
  args: {
    repositories: mockRepositories,
  },
};

export const Empty: Story = {
  args: {
    repositories: [],
  },
};

export const Filtered: Story = {
  args: {
    repositories: mockRepositories,
  },
}; 