import type { Meta, StoryObj } from '@storybook/react';
import { FilterData, FilterPillNew } from './FilterPillNew';
import { useForm, FormProvider } from 'react-hook-form';

const data: FilterData[] = [
  {
    label: 'Field Value 1',
    id: '1',
    nameFilter: 'collection'
  },
  {
    label: 'Field Value 2',
    id: '2',
    nameFilter: 'collection'
  },
  {
    label: 'Field Value 3',
    id: '3',
    nameFilter: 'collection'
  }
];
const meta: Meta<typeof FilterPillNew> = {
  title: 'Components/Filter/FilterNew',
  component: FilterPillNew,
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
} satisfies Meta<typeof FilterPillNew>;

export default meta;
type Story = StoryObj<typeof FilterPillNew>;

export const Default: Story = {
  args: { data: data, type: 'checkbox' }
};

export const Radio: Story = {
  args: { data: data, type: 'radio' }
};

export const Color: Story = {
  args: { data: data, type: 'checkbox' }
};
