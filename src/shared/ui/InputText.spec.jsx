/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputText from "./InputText";
import { getRandomString } from "../utils";

jest.mock("../utils", () => ({
  getRandomString: jest.fn().mockReturnValue("random-name"),
}));

test("renders InputText component with provided value", () => {
  const value = "test value";

  render(<InputText value={value} />);

  expect(screen.getByDisplayValue(value)).toBeInTheDocument();
});

test("calls onChange when input value changes", () => {
  const handleChange = jest.fn();
  const value = "test value";

  render(<InputText value={value} onChange={handleChange} />);

  fireEvent.change(screen.getByDisplayValue(value), {
    target: { value: "new value" },
  });

  expect(handleChange).toHaveBeenCalledWith("new value");
});

test("applies custom className to the input", () => {
  const className = "custom-class";
  const value = "test value";

  render(<InputText value={value} className={className} />);

  expect(screen.getByDisplayValue(value)).toHaveClass(className);
});

test("disables input when disabled prop is true", () => {
  const value = "test value";

  render(<InputText value={value} disabled />);

  expect(screen.getByDisplayValue(value)).toBeDisabled();
});

test("applies error class when isError prop is true", () => {
  const value = "test value";

  render(<InputText value={value} isError />);

  expect(screen.getByDisplayValue(value)).toHaveClass("border-red-400");
});

test("generates a random name if name prop is not provided", () => {
  const value = "test value";

  render(<InputText value={value} />);

  expect(screen.getByDisplayValue(value)).toHaveAttribute(
    "name",
    "random-name"
  );
});

test("uses provided name if name prop is provided", () => {
  const name = "test-name";
  const value = "test value";

  render(<InputText value={value} name={name} />);

  expect(screen.getByDisplayValue(value)).toHaveAttribute("name", name);
});
