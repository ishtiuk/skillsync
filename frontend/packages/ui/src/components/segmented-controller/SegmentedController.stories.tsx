import type { Meta, StoryObj } from '@storybook/react';
import SegmentedControl from './SegmentedController';
import { useRef, useState } from 'react';

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const TwoTabs = () => {
  const [selectedValue1, setSelectedValue1] = useState('complete');
  return (
    <SegmentedControl
      name="story-name"
      callback={val => setSelectedValue1(val)}
      segments={[
        {
          label: 'label',
          value: 'complete',
          ref: useRef()
        },
        {
          label: 'Label',
          value: 'incomplete',
          ref: useRef()
        }
      ]}
    />
  );
};

export const ThreeTabs = () => {
  const [selectedValue1, setSelectedValue1] = useState('complete');
  return (
    <SegmentedControl
      name="story-name"
      callback={val => setSelectedValue1(val)}
      segments={[
        {
          label: 'label',
          value: 'complete',
          ref: useRef()
        },
        {
          label: 'Label',
          value: 'incomplete',
          ref: useRef()
        },
        {
          label: 'label',
          value: 'complete',
          ref: useRef()
        }
      ]}
    />
  );
};

export const FourTabs = () => {
  const [selectedValue1, setSelectedValue1] = useState('complete');
  return (
    <SegmentedControl
      name="story-name"
      callback={val => setSelectedValue1(val)}
      segments={[
        {
          label: 'label',
          value: 'complete',
          ref: useRef()
        },
        {
          label: 'Label',
          value: 'incomplete',
          ref: useRef()
        },
        {
          label: 'label',
          value: 'complete',
          ref: useRef()
        },
        {
          label: 'label',
          value: 'complete',
          ref: useRef()
        }
      ]}
    />
  );
};

export const FiveTabs = () => {
  const [selectedValue1, setSelectedValue1] = useState('complete');
  return (
    <SegmentedControl
      name="story-name"
      callback={val => setSelectedValue1(val)}
      segments={[
        {
          label: 'label',
          value: 'complete',
          ref: useRef()
        },
        {
          label: 'Label',
          value: 'incomplete',
          ref: useRef()
        },
        {
          label: 'label',
          value: 'complete',
          ref: useRef()
        },
        {
          label: 'label',
          value: 'complete',
          ref: useRef()
        },
        {
          label: 'label',
          value: 'complete',
          ref: useRef()
        }
      ]}
    />
  );
};
