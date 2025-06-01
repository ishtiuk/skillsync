import HomePage from './page';
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const meta: Meta<typeof HomePage> = {
  title: 'Pages/Home',
  component: HomePage,
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
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof HomePage>;

export const Default: Story = {};
