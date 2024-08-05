/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Form from "./Form";
import FormItem from "./FormItem";
import InputText from "./InputText";

test("renders Form component with children", () => {
  render(
    <Form onSubmit={() => {}}>
      <FormItem>
        <InputText name="test" />
      </FormItem>
    </Form>
  );

  expect(screen.getByRole("textbox")).toBeInTheDocument();
});

test("updates formData state when input value changes", () => {
  render(
    <Form onSubmit={() => {}}>
      <FormItem>
        <InputText name="test" id="test" onChange={() => {}} />
      </FormItem>
    </Form>
  );

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "new value" },
  });

  expect(screen.getByRole("textbox")).toHaveValue("new value");
});

test("calls onSubmit with formData when form is submitted", () => {
  const handleSubmit = jest.fn();

  render(
    <Form onSubmit={handleSubmit}>
      <FormItem>
        <InputText name="test" />
      </FormItem>
    </Form>
  );

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "submit value" },
  });

  fireEvent.submit(screen.getByTestId("form"));

  expect(handleSubmit).toHaveBeenCalledWith({ test: "submit value" });
});

test("applies custom className to the form", () => {
  const className = "custom-class";

  render(
    <Form onSubmit={() => {}} className={className}>
      <FormItem>
        <InputText name="test" />
      </FormItem>
    </Form>
  );

  expect(screen.getByTestId("form")).toHaveClass(className);
});
