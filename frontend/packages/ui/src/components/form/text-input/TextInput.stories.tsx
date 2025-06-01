import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { Form } from '../Form';
import React from 'react';
import { TextInputProps, TextInput } from './TextInput';

function Render(args: TextInputProps) {
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      [args.fieldName]: ''
    }
  });
  return (
    <Form {...form}>
      <form>
        <div style={{ width: '343px' }}>
          <TextInput {...args} />
        </div>
      </form>
    </Form>
  );
}

const meta = {
  title: 'Components/Form/Text',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  render: Render
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof TextInput>;
export const Default: Story = {
  args: {
    placeholder: 'Place holder',
    type: 'text',
    fieldName: 'someFieldName'
  }
};

export const Password: Story = {
  args: {
    placeholder: 'Password',
    type: 'password',
    fieldName: 'anotherField',
    rules: {
      required: true,
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        message:
          'Password must be at least 8 characters long, have at least one uppercase and one lowercase letter, and at least one special character.'
      }
    }
  }
};

export const RequiredMessage: Story = {
  args: {
    placeholder: 'Field Name',
    type: 'text',
    fieldName: 'anotherField',
    rules: {
      required: {
        value: true,
        message: 'This field is required.'
      }
    }
  }
};
