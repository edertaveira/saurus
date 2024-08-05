/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import FormItem from "./FormItem";

test("renders FormItem component with children", () => {
  render(
    <FormItem>
      <input name="test" />
    </FormItem>
  );

  expect(screen.getByRole("textbox")).toBeInTheDocument();
});

test("displays the correct label when provided", () => {
  const label = "Test Label";

  render(
    <FormItem label={label}>
      <input name="test" />
    </FormItem>
  );

  expect(screen.getByText(label)).toBeInTheDocument();
});

test("applies custom className to the container", () => {
  const className = "custom-class";

  render(
    <FormItem className={className}>
      <input name="test" />
    </FormItem>
  );

  expect(screen.getByRole("textbox").parentElement).toHaveClass(className);
});

test("displays error message when error prop is provided", () => {
  const error = "Test Error";

  render(
    <FormItem error={error}>
      <input name="test" />
    </FormItem>
  );

  expect(screen.getByText(error)).toBeInTheDocument();
});

test("applies error class to the label when error prop is provided", () => {
  const error = "Test Error";
  const label = "Test Label";

  render(
    <FormItem label={label} error={error}>
      <input name="test" />
    </FormItem>
  );

  expect(screen.getByText(label)).toHaveClass("text-red-700");
});
