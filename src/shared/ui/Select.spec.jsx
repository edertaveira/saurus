/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from './Select';

const options = [
  { key: '1', value: 'option1', label: 'Option 1' },
  { key: '2', value: 'option2', label: 'Option 2' },
  { key: '3', value: 'option3', label: 'Option 3' },
];

test('renders Select component with options', () => {
  render(<Select options={options} />);

  options.forEach((option) => {
    expect(screen.getByText(option.label)).toBeInTheDocument();
  });
});

test('calls onChange when selected value changes', () => {
  const handleChange = jest.fn();
  render(<Select options={options} onChange={handleChange} />);

  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'option2' } });

  expect(handleChange).toHaveBeenCalledWith('option2');
});

test('select is disabled when the disabled prop is true', () => {
  render(<Select options={options} disabled />);

  expect(screen.getByRole('combobox')).toBeDisabled();
});

test('renders with the correct initial value', () => {
  render(<Select options={options} value="option2" />);

  expect(screen.getByRole('combobox')).toHaveValue('option2');
});

test('applies custom className to the select', () => {
  const className = 'custom-class';
  render(<Select options={options} className={className} />);

  expect(screen.getByRole('combobox')).toHaveClass('border', 'border-gray-400', 'rounded-lg', 'text-xs', 'p-2', 'placeholder-gray-400', className);
});
