import type { Meta, StoryObj } from '@storybook/react';
import { SearchForm } from '../../components/SearchForm';
import { ThemeProvider } from '../../context/ThemeContext';

const meta = {
  title: 'Forms/SearchForm',
  component: SearchForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: '600px', maxWidth: '100%' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof SearchForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSearch: (username) => console.log('Searching for:', username),
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    onSearch: () => {},
    isLoading: true,
  },
}; 