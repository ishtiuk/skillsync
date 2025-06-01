import type { Meta, StoryObj } from '@storybook/react';
import SectionHeader from './SectionHeader';
import { Button } from '../button';

const meta = {
  title: 'Components/SectionHeader',
  component: SectionHeader,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof SectionHeader>;

const RightButton = (
  <Button variant="tertiary" size="default">
    {'Explore Jobs'}
  </Button>
);

export const SectionHeaderWithoutDropdown: Story = {
  args: {
    leftImageSrc: '/images/chart-donut.svg',
    count: 4,
    title: 'Section Header',
    rightButtonProps: {
      label: 'Explore Jobs',
      rightIcon: 'ArrowCircleRight_fill'
    },
    className: 'w-[500px]'
  }
};

export const SectionHeaderWithDropdown: Story = {
  args: {
    leftIconProps: {
      iconVariant: 'BellSimple_fill',
      className: 'text-blue-b-400'
    },
    hasDropdown: true,
    defaultState: 'closed',
    count: 24,
    title: 'Section Header',
    className: 'w-[500px]'
  }
};
