import type { Meta, StoryObj } from '@storybook/react';
import { themes } from '@storybook/theming';
import { CoachTip } from './CoachTip';
const meta = {
  title: 'Components/CoachTips',
  component: CoachTip,
  parameters: {
    layout: 'centered',
    docs: {
      theme: themes.light
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof CoachTip>;

export default meta;
type Story = StoryObj<typeof CoachTip>;

export const PositionTop: Story = {
  args: {
    position: 'top',
    title: 'Coach Tip Header',
    text: ['Coach tip content that can wrap to the next line.']
  }
};

export const PositionBottom: Story = {
  args: {
    position: 'bottom',
    title: 'Coach Tip Header',
    text: ['Coach tip content that can wrap to the next line.']
  }
};

export const PositionLeft: Story = {
  args: {
    position: 'left',
    title: 'Coach Tip Header',
    text: ['Coach tip content that can wrap to the next line.']
  }
};

export const PositionRight: Story = {
  args: {
    position: 'right',
    title: 'Coach Tip Header',
    text: ['Coach tip content that can wrap to the next line.']
  }
};

export const CoachTipWithPagination: Story = {
  args: {
    position: 'right',
    title: 'Coach Tip Header',
    text: [
      '1 Coach tip content that can wrap to the next line.',
      '2 Coach tip content that can wrap to the next line',
      '3 Coach tip content that can wrap to the next line',
      '4 Coach tip content that can wrap to the next line',
      '5 Coach tip content that can wrap to the next line',
      '6 Coach tip content that can wrap to the next line',
      '7 Coach tip content that can wrap to the next line'
    ]
  }
};
