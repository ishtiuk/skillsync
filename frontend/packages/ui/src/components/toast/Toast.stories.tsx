import type { Meta, StoryObj } from '@storybook/react';
import { ToastComponent } from './Toast';

const meta = {
  title: 'Components/Notifications/Toast',
  component: ToastComponent,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ToastComponent>;

export default meta;
type Story = StoryObj<typeof ToastComponent>;

export const Default: Story = {
  args: {
    variant: 'info',
    label: 'Informational'
  }
};

export const Success: Story = {
  args: {
    variant: 'success',
    label: 'Success'
  }
};

export const Error: Story = {
  args: {
    variant: 'error',
    label: 'Error'
  }
};
