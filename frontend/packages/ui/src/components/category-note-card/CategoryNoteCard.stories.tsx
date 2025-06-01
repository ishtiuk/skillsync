import type { Meta, StoryObj } from '@storybook/react';
import { CategoryNoteCard } from './CategoryNoteCard';

const meta = {
  title: 'Components/Cards/CategoryNoteCard',
  component: CategoryNoteCard,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof CategoryNoteCard>;

export default meta;
type Story = StoryObj<typeof CategoryNoteCard>;

export const Buildingpaths: Story = {
  args: {
    variant: 'building-paths',
    pathwayId: '15'
  }
};

export const WriteYourStory: Story = {
  args: {
    variant: 'write-your-story',
    pathwayId: '14'
  }
};

export const PrepTalk: Story = {
  args: {
    variant: 'prep-talk',
    pathwayId: '3'
  }
};

export const GrowthMindset: Story = {
  args: {
    variant: 'growth-mindset',
    pathwayId: '3'
  }
};

export const SkillBuilding: Story = {
  args: {
    variant: 'skill-building',
    pathwayId: '3'
  }
};

export const TheSearch: Story = {
  args: {
    variant: 'the-search',
    pathwayId: '3'
  }
};
