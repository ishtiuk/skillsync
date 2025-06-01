import { StoryObj, Meta } from '@storybook/react';
import React from 'react';
import { JobRow, JobRowProps } from './JobRow';
import { Job } from './types';

const ParentTable = (props: JobRowProps) => {
  return (
    <div className="w-[1000px]">
      <JobRow {...props} />
    </div>
  );
};

export default {
  title: 'Components/Tables/JobRow',
  component: ParentTable,
  args: {
    element: {
      id: '1',
      title: 'Software Engineer',
      company: 'Tech Company',
      stage: 'interview',
      jobId: '12345',
      lastEdited: 1725475258000,
      is_favourite: false,
      image: 'images/example.png',
      stages: {
        applied: true,
        interview: false,
        offer: false
      }
    },
    onStatusChange: (element: Job, status: string) => {
      console.log('Status changed:', element, status);
    },
    onReactionChange: (element: Job, reaction: string) => {
      console.log('Reaction changed:', element, reaction);
    }
  },
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} as Meta<typeof JobRow>;

type Story = StoryObj<typeof JobRow>;

export const Default: Story = {
  args: {
    element: {
      id: '1',
      title: 'Software Engineer',
      company: 'Tech Company',
      stage: 'interview',
      jobId: '12345',
      lastEdited: 1725475258000,
      is_favourite: false,
      image: 'images/example.png',
      stages: {
        applied: true,
        interview: false,
        offer: false
      }
    },
    onStatusChange: (element: Job, status: string) => {
      console.log('Status changed:', element, status);
    },
    onReactionChange: (element: Job, reaction: string) => {
      console.log('Reaction changed:', element, reaction);
    }
  }
};

export const Favorited: Story = {
  args: {
    element: {
      id: '1',
      title: 'Software Engineer',
      company: 'Tech Company',
      stage: 'interview',
      jobId: '12345',
      lastEdited: 1725475258000,
      is_favourite: true,
      image: 'images/example.png',
      stages: {
        applied: true,
        interview: false,
        offer: false
      }
    },
    onStatusChange: (element: Job, status: string) => {
      console.log('Status changed:', element, status);
    },
    onReactionChange: (element: Job, reaction: string) => {
      console.log('Reaction changed:', element, reaction);
    }
  }
};
