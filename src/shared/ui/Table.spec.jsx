/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Table from './Table';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
];

const data = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
];

test('renders Table component with data and columns', () => {
  render(<Table columns={columns} data={data} keyName="id" />);

  data.forEach((item) => {
    expect(screen.getByText(item.name)).toBeInTheDocument();
    expect(screen.getByText(item.age.toString())).toBeInTheDocument();
  });

  columns.forEach((col) => {
    expect(screen.getByText(col.label)).toBeInTheDocument();
  });
});

test('selects and deselects items when checkboxes are clicked', () => {
  const handleSelect = jest.fn();
  render(<Table columns={columns} data={data} keyName="id" isChecked onSelect={handleSelect} />);

  fireEvent.click(screen.getAllByRole('checkbox')[1]);
  expect(handleSelect).toHaveBeenCalledWith([1]);

  fireEvent.click(screen.getAllByRole('checkbox')[1]);
  expect(handleSelect).toHaveBeenCalledWith([]);
});

test('selects and deselects all items when Select All checkbox is clicked', () => {
  const handleSelect = jest.fn();
  render(<Table columns={columns} data={data} keyName="id" isChecked onSelect={handleSelect} />);

  fireEvent.click(screen.getAllByRole('checkbox')[0]);
  expect(handleSelect).toHaveBeenCalledWith([1, 2]);

  fireEvent.click(screen.getAllByRole('checkbox')[0]);
  expect(handleSelect).toHaveBeenCalledWith([]);
});

test('renders with custom render function for columns', () => {
  const customColumns = [
    { key: 'name', label: 'Name', render: (value) => <strong>{value}</strong> },
    { key: 'age', label: 'Age' },
  ];

  render(<Table columns={customColumns} data={data} keyName="id" />);

  data.forEach((item) => {
    expect(screen.getByText(item.name)).toContainHTML('<strong>' + item.name + '</strong>');
    expect(screen.getByText(item.age.toString())).toBeInTheDocument();
  });
});
