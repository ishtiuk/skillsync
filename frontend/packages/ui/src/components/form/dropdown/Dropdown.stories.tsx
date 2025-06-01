import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import React from 'react';
import { DropdownProps, Dropdown } from './Dropdown';
import { Form } from '../Form';

function Render(args: DropdownProps) {
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      [args.fieldName]: ''
    }
  });
  return (
    <Form {...form}>
      <form>
        <div style={{ width: '343px', position: 'relative' }}>
          <Dropdown {...args} />
        </div>
      </form>
    </Form>
  );
}

const meta = {
  title: 'Components/Form/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  render: Render
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof Dropdown>;
export const Default: Story = {
  args: {
    placeholder: 'Place holder',
    fieldName: 'someFieldName',
    options: ['Apple', 'Strawberry', 'Watermelon']
  }
};
