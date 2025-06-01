import ProfilePage from './page';
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const meta: Meta<typeof ProfilePage> = {
  title: 'Pages/Profile',
  component: ProfilePage,
  decorators: [
    Story => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    )
  ],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof ProfilePage>;

export default meta;
type Story = StoryObj<typeof ProfilePage>;

export const Default: Story = {};
