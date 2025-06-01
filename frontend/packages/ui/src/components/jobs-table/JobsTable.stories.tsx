import { StoryObj, Meta } from '@storybook/react';
import React from 'react';
import JobsTable, { JobsTableProps } from './JobsTable';

const ParentContainer = (props: JobsTableProps) => {
  return (
    <div className="w-[980px]">
      <JobsTable {...props} />
    </div>
  );
};

export default {
  title: 'Components/Tables/JobsTable',
  component: ParentContainer,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} as Meta<typeof JobsTable>;

type Story = StoryObj<typeof JobsTable>;

export const Default: Story = {
  args: {
    variant: 'saved',
    jobs: [
      {
        image: 'images/example.png',
        title: 'Some Job Title Role',
        company: 'The Company Name',
        stage: 'interview',
        jobId: '2345',
        lastEdited: 1725567519000,
        stages: {
          applied: true,
          interview: false,
          offer: false
        }
      },
      {
        image: 'images/example.png',
        title: 'Some Job Title Role',
        company: 'The Company Name Is Really Long And Long',
        stage: 'interview',
        jobId: '234599',
        lastEdited: 1720224970000,
        is_favourite: true,
        stages: {
          applied: true,
          interview: false,
          offer: false
        }
      }
    ]
  }
};

export const NoJobsSection: Story = {
  args: {
    variant: 'interview',
    jobs: []
  }
};
