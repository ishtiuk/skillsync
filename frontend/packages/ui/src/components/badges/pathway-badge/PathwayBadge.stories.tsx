import type { Meta, StoryObj } from '@storybook/react';
import { PathwayBadge } from './PathwayBadge';

const meta = {
  title: 'Components/Notifications/PathwayBadge',
  component: PathwayBadge,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof PathwayBadge>;

export default meta;
type Story = StoryObj<typeof PathwayBadge>;

export const Agriculture: Story = {
  args: { variant: 'agriculture' }
};

export const Conservation: Story = {
  args: { variant: 'conservation' }
};

export const Energy: Story = {
  args: { variant: 'energy' }
};

export const Education: Story = {
  args: { variant: 'education' }
};

export const Construction: Story = {
  args: { variant: 'construction' }
};

export const Finance: Story = {
  args: { variant: 'finance' }
};

export const Forestry: Story = {
  args: { variant: 'forestry' }
};

export const Manufacturing: Story = {
  args: { variant: 'manufacturing' }
};

export const ArtsAndCulture: Story = {
  args: { variant: 'arts & culture' }
};

export const RealEstate: Story = {
  args: { variant: 'real-estate' }
};

export const Medical: Story = {
  args: { variant: 'medical' }
};

export const Policy: Story = {
  args: { variant: 'policy' }
};

export const Research: Story = {
  args: { variant: 'research' }
};

export const Sports: Story = {
  args: { variant: 'sports' }
};

export const Tourism: Story = {
  args: { variant: 'tourism' }
};

export const Transport: Story = {
  args: { variant: 'transportation' }
};

export const Technology: Story = {
  args: { variant: 'technology' }
};

export const UrbanPlanning: Story = {
  args: { variant: 'urban-planning' }
};

export const WasteManagement: Story = {
  args: { variant: 'waste-management' }
};

export const Water: Story = {
  args: { variant: 'water' }
};

export const Media: Story = {
  args: { variant: 'media' }
};
