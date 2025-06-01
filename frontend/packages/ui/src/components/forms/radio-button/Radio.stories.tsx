import RadioButton from './Radio';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm, FormProvider } from 'react-hook-form';

const meta: Meta<typeof RadioButton> = {
  title: 'Components/Forms/RadioButton',
  component: RadioButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  decorators: [
    Story => {
      const methods = useForm({ defaultValues: { radio: '' } }); // Ensure default value
      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    }
  ]
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Unselected: Story = {
  args: { id: '1', label: 'Field Value', nameRadio: 'radio' }
};

export const Selected: Story = {
  args: {
    id: '1',
    label: 'Field Value',
    nameRadio: 'radio',
    value: 'selectedValue',
    isChecked: true
  }
};

export const Helper: Story = {
  args: {
    id: '1',
    label: 'Field Value',
    nameRadio: 'radio',
    helperText: 'Helper Text'
  }
};

export const Error: Story = {
  args: {
    id: '1',
    label: 'Field Value',
    nameRadio: 'radio',
    helperText: 'Helper Text',
    isError: true,
    isErrorMessage: 'Error Message'
  }
};
