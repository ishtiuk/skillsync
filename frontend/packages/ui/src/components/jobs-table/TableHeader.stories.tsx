import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TableHeader } from './TableHeader';

const ParentTable = () => {
  return (
    <div className="w-[750px]">
      <TableHeader />
    </div>
  );
};

export default {
  title: 'Components/Tables/TableHeader',
  component: ParentTable,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} as Meta<typeof TableHeader>;

type Story = StoryObj<typeof TableHeader>;

export const Default: Story = {
  args: {}
};
