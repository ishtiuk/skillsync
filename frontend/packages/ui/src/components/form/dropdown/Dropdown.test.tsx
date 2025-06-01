import { useForm } from 'react-hook-form';
import { Form } from '../Form';
import React, { BaseSyntheticEvent, useState } from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { Dropdown, DropdownProps } from './Dropdown';

const SingleDropdownForm: React.FC<DropdownProps> = ({ ...props }) => {
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
        <Dropdown {...props} />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
        <p data-testid="form-value">{val}</p>
      </form>
    </Form>
  );
};

const props = {
  placeholder: 'Place holder',
  fieldName: 'someFieldName',
  options: ['Apple', 'Strawberry', 'Watermelon']
};
describe('Dropdown Form', () => {
  afterEach(() => {
    cleanup();
  });
  describe('happy path for dropdown', () => {
    it('options drop down upon focusing', async () => {
      const { getByTestId, queryByTestId, getByText } = render(
        <SingleDropdownForm {...props} />
      );
      const ul = queryByTestId('dropdown-list') as HTMLUListElement;
      expect(ul).not.toBeNull();
      expect(ul).not.toBeVisible();
      fireEvent.focusIn(getByTestId('form-input'));
      await waitFor(() => {
        expect(ul).toBeVisible();
        expect(getByText('Apple')).toBeVisible();
        expect(getByText('Strawberry')).toBeVisible();
        expect(getByText('Watermelon')).toBeVisible();
      });
    });
    it('populates input with selected option', async () => {
      const { getByTestId, getByText } = render(
        <SingleDropdownForm {...props} />
      );
      fireEvent.focusIn(getByTestId('form-input'));
      fireEvent.mouseDown(getByText('Watermelon'));
      await waitFor(() => {
        expect((getByTestId('form-input') as HTMLInputElement).value).toEqual(
          'Watermelon'
        );
      });
    });
    it('returns the value in submission', async () => {
      const { getByTestId, getByText } = render(
        <SingleDropdownForm {...props} />
      );
      fireEvent.focusIn(getByTestId('form-input'));
      fireEvent.mouseDown(getByText('Strawberry'));
      fireEvent.click(getByTestId('submit-button'));
      await waitFor(() => {
        expect(getByTestId('form-value').textContent).toEqual('Strawberry');
      });
    });
    it('displays options that match typeahead', async () => {
      const { getByTestId, queryByText, getByText } = render(
        <SingleDropdownForm {...props} />
      );
      fireEvent.focus(getByTestId('form-input'));
      fireEvent.change(getByTestId('form-input'), { target: { value: 's' } });
      await waitFor(() => {
        expect(queryByText('Apple')).toBeNull();
        expect(queryByText('Strawberry')).not.toBeNull();
        expect(queryByText('Watermelon')).toBeNull();
      });
    });
  });
  describe('unhappy path for dropdown', () => {
    it('shows error message if you provide an option not on the list', async () => {
      const { getByTestId, queryByText, getByText } = render(
        <SingleDropdownForm {...props} />
      );
      fireEvent.focus(getByTestId('form-input'));
      fireEvent.change(getByTestId('form-input'), {
        target: { value: 'mango' }
      });
      fireEvent.click(getByText('Submit'));
      await waitFor(() => {
        expect(queryByText('Choose an option from the list.')).not.toBeNull();
      });
    });
  });
});
