import type { Meta, StoryObj } from '@storybook/react';
import { FilterData, FilterPill } from './FilterPill';
import { useForm, FormProvider } from 'react-hook-form';

const data: FilterData[] = [
  {
    label: 'Field Value 1',
    id: '1',
    nameFilter: 'collection',
    checked: false
  },
  {
    label: 'Field Value 2',
    id: '2',
    nameFilter: 'collection',
    checked: false
  },
  {
    label: 'Field Value 3',
    id: '3',
    nameFilter: 'collection',
    checked: false
  }
];
const meta: Meta<typeof FilterPill> = {
  title: 'Components/Filter/Filter',
  component: FilterPill,
  parameters: {
    layout: 'centered'
  },
  decorators: [
    Story => {
      const methods = useForm({ defaultValues: { radio: '' } }); // Ensure default value
      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    }
  ],
  tags: ['autodocs']
} satisfies Meta<typeof FilterPill>;

export default meta;
type Story = StoryObj<typeof FilterPill>;

export const Default: Story = {
  args: { data: data, type: 'checkbox' }
};

export const Radio: Story = {
  args: { data: data, type: 'radio' }
};

export const Color: Story = {
  args: { data: data, type: 'checkbox' }
};
