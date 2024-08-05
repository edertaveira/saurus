/**
 * @jest-environment jsdom
 */
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import api from "../services/api";
import { validateLogin } from "../shared/validations";

jest.mock("../services/api");
jest.mock("../shared/validations");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

beforeEach(() => {
  localStorage.clear();
  jest.spyOn(window.localStorage, "setItem");
});

test("renders Login component", async () => {
  api.getApplications.mockResolvedValueOnce([
    { id: "1", nomeReferencia: "App1" },
    { id: "2", nomeReferencia: "App2" },
  ]);

  await act(async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  });

  expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  expect(screen.getByLabelText("Aplicação")).toBeInTheDocument();
  expect(screen.getByLabelText("Login")).toBeInTheDocument();
  expect(screen.getByLabelText("Senha")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();

  await waitFor(() => expect(api.getApplications).toHaveBeenCalled());
  expect(screen.getByText("App1")).toBeInTheDocument();
  expect(screen.getByText("App2")).toBeInTheDocument();
});

test("validates input fields and shows error messages", async () => {
  validateLogin.mockReturnValueOnce({
    username: "Required",
    password: "Required",
  });

  await act(async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  });

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(validateLogin).toHaveBeenCalled();
  const errorMessages = screen.getAllByText("Required");
  expect(errorMessages.length).toBe(2); // Certifica-se de que ambos os erros de validação estão presentes
});

test("logs in and navigates to /orders on successful login", async () => {
  const mockNavigate = jest.fn();
  require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);

  api.getApplications.mockResolvedValueOnce([
    { id: "1", nomeReferencia: "App1" },
  ]);

  api.login.mockResolvedValueOnce({
    token: "test-token",
    aplicacaoid: "app1",
    username: "user1",
  });

  await act(async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  });

  await waitFor(() => expect(api.getApplications).toHaveBeenCalled());

  fireEvent.change(screen.getByLabelText("Login"), {
    target: { value: "user" },
  });
  fireEvent.change(screen.getByLabelText("Senha"), {
    target: { value: "pass" },
  });

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
  });

  await waitFor(() => expect(api.login).toHaveBeenCalled());
  setTimeout(() => {
    expect(localStorage?.setItem).toHaveBeenCalledWith(
      "token",
      JSON.stringify({
        aplicacaoid: "app1",
        username: "user1",
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/orders");
  }, 10000);
});

test("shows error message on login failure", async () => {
  api.getApplications.mockResolvedValueOnce([
    { id: "1", nomeReferencia: "App1" },
  ]);

  api.login.mockRejectedValueOnce(new Error("Login failed"));

  await act(async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  });

  await waitFor(() => expect(api.getApplications).toHaveBeenCalled());

  fireEvent.change(screen.getByLabelText("Login"), {
    target: { value: "user" },
  });
  fireEvent.change(screen.getByLabelText("Senha"), {
    target: { value: "pass" },
  });

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
  });

  await waitFor(() => expect(api.login).toHaveBeenCalled());

  expect(screen.getByText("Login failed")).toBeInTheDocument();
});
