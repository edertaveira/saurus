/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

test("renders Button component with title", () => {
  const title = "Click Me";

  render(<Button title={title} />);

  expect(screen.getByText(title)).toBeInTheDocument();
});

test("button is disabled when the disabled prop is true", () => {
  const title = "Click Me";

  render(<Button title={title} disabled />);

  expect(screen.getByText(title)).toBeDisabled();
});

test("button is not disabled when the disabled prop is false", () => {
  const title = "Click Me";

  render(<Button title={title} />);

  expect(screen.getByText(title)).not.toBeDisabled();
});

test("calls onClick when button is clicked", () => {
  const title = "Click Me";
  const onClick = jest.fn();

  render(<Button title={title} onClick={onClick} />);

  fireEvent.click(screen.getByText(title));

  expect(onClick).toHaveBeenCalledTimes(1);
});

test("button has the correct classes based on props", () => {
  const title = "Click Me";
  const customClassName = "custom-class";

  render(<Button title={title} className={customClassName} />);

  const button = screen.getByText(title);
  expect(button).toHaveClass(
    "w-full",
    "text-white",
    "rounded-lg",
    "p-2",
    "bg-red-800",
    customClassName
  );
});

test("button has the correct classes when disabled", () => {
  const title = "Click Me";

  render(<Button title={title} disabled />);

  const button = screen.getByText(title);
  expect(button).toHaveClass("bg-gray-400");
});
