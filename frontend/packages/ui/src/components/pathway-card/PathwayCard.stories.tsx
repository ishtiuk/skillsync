import type { Meta, StoryObj } from '@storybook/react';
import { PathwayCard } from './PathwayCard';

const meta = {
  title: 'Components/Cards/PathwayCard',
  component: PathwayCard,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof PathwayCard>;

export default meta;
type Story = StoryObj<typeof PathwayCard>;

export const Agriculture: Story = {
  args: {
    variant: 'agriculture',
    jobs: 15
  }
};

export const Conservation: Story = {
  args: {
    variant: 'conservation',
    jobs: 15
  }
};

export const Construction: Story = {
  args: {
    variant: 'construction',
    jobs: 15
  }
};

export const Education: Story = {
  args: {
    variant: 'education',
    jobs: 15
  }
};

export const Energy: Story = {
  args: {
    variant: 'energy',
    jobs: 15
  }
};

export const Finance: Story = {
  args: {
    variant: 'finance',
    jobs: 15
  }
};

export const Forestry: Story = {
  args: {
    variant: 'forestry',
    jobs: 15
  }
};

export const Manufacturing: Story = {
  args: {
    variant: 'manufacturing',
    jobs: 15
  }
};

export const Medical: Story = {
  args: {
    variant: 'medical',
    jobs: 15
  }
};

export const Policy: Story = {
  args: {
    variant: 'policy',
    jobs: 15
  }
};

export const RealEstate: Story = {
  args: {
    variant: 'real-estate',
    jobs: 15
  }
};

export const Research: Story = {
  args: {
    variant: 'research',
    jobs: 15
  }
};

export const Sports: Story = {
  args: {
    variant: 'sports',
    jobs: 15
  }
};

export const Technology: Story = {
  args: {
    variant: 'technology',
    jobs: 15
  }
};

export const Tourism: Story = {
  args: {
    variant: 'tourism',
    jobs: 15
  }
};

export const Transportation: Story = {
  args: {
    variant: 'transportation',
    jobs: 15
  }
};

export const UrbanPlanning: Story = {
  args: {
    variant: 'urban-planning',
    jobs: 15
  }
};

export const Water: Story = {
  args: {
    variant: 'water',
    jobs: 15
  }
};

export const WasteManagement: Story = {
  args: {
    variant: 'waste-management',
    jobs: 15
  }
};

export const ArtsCulture: Story = {
  args: {
    variant: 'arts-culture',
    jobs: 15
  }
};
