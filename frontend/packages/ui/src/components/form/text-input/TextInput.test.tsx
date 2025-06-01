import { useForm } from 'react-hook-form';
import { Form } from '../Form';
import React, { BaseSyntheticEvent, useState } from 'react';
import { TextInputProps, TextInput } from './TextInput';
import { describe, it, expect, afterEach } from 'vitest';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';

const SingleTextForm: React.FC<TextInputProps> = props => {
  const form = useForm({
    mode: 'onSubmit',
    defaultValues: {
      [props.fieldName]: ''
    }
  });
  const [val, setVal] = useState<string>('');
  const submitForm = async (data: any, event?: BaseSyntheticEvent) => {
    event?.preventDefault();
    setVal(data[props.fieldName]);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)}>
        <TextInput {...props} />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
        <p data-testid="form-value">{val}</p>
      </form>
    </Form>
  );
};

describe('TextInput Form', () => {
  afterEach(() => {
    cleanup();
  });
  describe('Basic optional text input', () => {
    it('Contains the placeholder', () => {
      const props = {
        placeholder: 'Place holder',
        type: 'text',
        fieldName: 'someFieldName'
      };
      const { getByTestId, getByText } = render(<SingleTextForm {...props} />);
      expect(getByTestId('form-input')).not.toBeNull();
      expect(getByTestId('input-label').textContent).toEqual(
        'Place holder (Optional)'
      );
    });
    it('submits the input text correctly', async () => {
      const props = {
        placeholder: 'Place holder',
        type: 'text',
        fieldName: 'someFieldName'
      };
      const { getByTestId, getByText } = render(<SingleTextForm {...props} />);
      const input = getByTestId('form-input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'some value' } });
      expect(input.value).toEqual('some value');
      fireEvent.click(getByText('Submit'));
      await waitFor(() => {
        expect(getByTestId('form-value').textContent).toEqual('some value');
      });
    });
  });
  describe('Form with validation', () => {
    it("displays error message when input doesn't meet criteria", async () => {
      const props = {
        placeholder: 'Field Name',
        type: 'text',
        fieldName: 'anotherField',
        rules: {
          required: {
            value: true,
            message: 'This field is required.'
          }
        }
      };
      const { queryByText, getByText } = render(<SingleTextForm {...props} />);
      expect(queryByText('This field is required.')).toBeNull();
      fireEvent.click(getByText('Submit'));
      await waitFor(() => {
        expect(queryByText('This field is required.')).not.toBeNull();
      });
    });
  });
});
