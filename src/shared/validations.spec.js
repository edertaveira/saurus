/**
 * @jest-environment jsdom
 */
import { isEmpty, validateLogin } from "./validations";

describe("isEmpty", () => {
  test("returns true for empty string", () => {
    expect(isEmpty("")).toBe(true);
  });

  test("returns true for undefined", () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  test("returns true for null", () => {
    expect(isEmpty(null)).toBe(true);
  });

  test("returns false for non-empty string", () => {
    expect(isEmpty("value")).toBe(false);
  });

  test("returns false for number zero", () => {
    expect(isEmpty(0)).toBe(false);
  });

  test("returns false for boolean false", () => {
    expect(isEmpty(false)).toBe(false);
  });
});

describe("validateLogin", () => {
  test("returns error for empty username and password", () => {
    const errors = validateLogin("", "");
    expect(errors).toEqual({
      username: "Preencha o usuário",
      password: "Preencha a senha",
    });
  });

  test("returns error for empty username", () => {
    const errors = validateLogin("", "password");
    expect(errors).toEqual({
      username: "Preencha o usuário",
    });
  });

  test("returns error for empty password", () => {
    const errors = validateLogin("username", "");
    expect(errors).toEqual({
      password: "Preencha a senha",
    });
  });

  test("returns no error for valid username and password", () => {
    const errors = validateLogin("username", "password");
    expect(errors).toEqual({});
  });

  test("returns error for undefined username and password", () => {
    const errors = validateLogin(undefined, undefined);
    expect(errors).toEqual({
      username: "Preencha o usuário",
      password: "Preencha a senha",
    });
  });

  test("returns error for null username and password", () => {
    const errors = validateLogin(null, null);
    expect(errors).toEqual({
      username: "Preencha o usuário",
      password: "Preencha a senha",
    });
  });
});
