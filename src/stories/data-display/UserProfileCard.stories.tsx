import type { Meta, StoryObj } from '@storybook/react';
import { UserProfileCard } from '../../components/UserProfileCard';
import { ThemeProvider } from '../../context/ThemeContext';

const meta = {
  title: 'Data Display/UserProfileCard',
  component: UserProfileCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: '900px', maxWidth: '100%' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof UserProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    profile: {
      login: 'octocat',
      avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
      html_url: 'https://github.com/octocat',
      name: 'The Octocat',
      company: '@github',
      blog: 'https://github.blog',
      location: 'San Francisco',
      email: null,
      bio: 'This is a GitHub mascot',
      twitter_username: 'github',
      public_repos: 8,
      followers: 9483,
      following: 9,
      created_at: '2011-01-25T18:44:36Z',
      starred_repos: 231,
      total_contributions: 3542,
    }
  },
};

export const MinimalProfile: Story = {
  args: {
    profile: {
      login: 'minimal-user',
      avatar_url: 'https://avatars.githubusercontent.com/u/123456?v=4',
      html_url: 'https://github.com/minimal-user',
      name: null,
      company: null,
      blog: '',
      location: null,
      email: null,
      bio: null,
      twitter_username: null,
      public_repos: 3,
      followers: 2,
      following: 5,
      created_at: '2020-05-10T14:20:30Z',
      starred_repos: 12,
      total_contributions: 156,
    }
  },
};

export const CompleteProfile: Story = {
  args: {
    profile: {
      login: 'developer',
      avatar_url: 'https://avatars.githubusercontent.com/u/654321?v=4',
      html_url: 'https://github.com/developer',
      name: 'Full Developer',
      company: '@microsoft',
      blog: 'https://dev.portfolio.io',
      location: 'Seattle, WA',
      email: 'dev@example.com',
      bio: 'Software engineer passionate about open source. Working on web technologies and cloud computing.',
      twitter_username: 'devprofile',
      public_repos: 42,
      followers: 230,
      following: 115,
      created_at: '2015-03-12T10:24:36Z',
      starred_repos: 385,
      total_contributions: 2784,
    }
  },
}; 