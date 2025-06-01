/* eslint-disable prettier/prettier */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OverviewCard, OverviewCardProps } from './OverviewCard';

const ParentContainer: React.FC<OverviewCardProps> = props => { 
    return (
        <div className='w-[350px]'>
            <OverviewCard {...props} />
        </div>
    );
};

const meta: Meta<typeof OverviewCard> = {
  title: 'Components/Cards/OverviewCard',
  component: ParentContainer,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof OverviewCard>;

export const Default: Story = {
  args: {
    industry: "energy",
    jobType: "marketing-design",
    salary: "$52,000 - $59,000",
    education: "BFA, MFA Preferred",
    level: "Senior or Executive",
    city: "Montpelier",
    state: "VT",
    workplace: "Remote"
  }
};
