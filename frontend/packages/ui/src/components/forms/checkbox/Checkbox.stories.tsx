import { Checkbox } from './Checkbox';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm, FormProvider } from 'react-hook-form';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  decorators: [
    Story => {
      const methods = useForm({ defaultValues: { checkbox: [] } });
      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    }
  ]
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unselected: Story = {
  args: { id: '1', label: 'Field Value', nameCheckbox: 'checkbox' }
};

export const Selected: Story = {
  args: {
    id: '1',
    label: 'Field Value',
    nameCheckbox: 'checkbox',
    isChecked: true
  }
};

export const Helper: Story = {
  args: {
    id: '1',
    label: 'Field Value',
    nameCheckbox: 'checkbox',
    helperText: 'Helper Text'
  }
};

export const Error: Story = {
  args: {
    id: '1',
    label: 'Field Value',
    nameCheckbox: 'checkbox',
    helperText: 'Helper Text',
    isError: true,
    isErrorMessage: 'Error Message'
  }
};
