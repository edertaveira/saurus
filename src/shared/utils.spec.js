/**
 * @jest-environment jsdom
 */
import {
  objectToQueryString,
  toReal,
  formatCpfCnpj,
  getRandomString,
} from "./utils";

describe("objectToQueryString", () => {
  test("converts object to query string", () => {
    const params = { name: "John", age: 30 };
    const queryString = objectToQueryString(params);
    expect(queryString).toBe("name=John&age=30");
  });

  test("handles empty object", () => {
    const params = {};
    const queryString = objectToQueryString(params);
    expect(queryString).toBe("");
  });

  test("handles special characters", () => {
    const params = { name: "John Doe", city: "São Paulo" };
    const queryString = objectToQueryString(params);
    expect(queryString).toBe("name=John+Doe&city=S%C3%A3o+Paulo");
  });
});

describe("toReal", () => {
  test("formats number to Brazilian Real currency", () => {
    const value = 1234.56;
    const formattedValue = toReal(value);
    expect(formattedValue).toBe("R$ 1.234,56");
  });

  test("formats integer number to Brazilian Real currency", () => {
    const value = 1000;
    const formattedValue = toReal(value);
    expect(formattedValue).toBe("R$ 1.000,00");
  });
});

describe("formatCpfCnpj", () => {
  test("formats CPF correctly", () => {
    const cpf = "12345678901";
    const formattedCpf = formatCpfCnpj(cpf);
    expect(formattedCpf).toBe("123.456.789-01");
  });

  test("formats CNPJ correctly", () => {
    const cnpj = "12345678000195";
    const formattedCnpj = formatCpfCnpj(cnpj);
    expect(formattedCnpj).toBe("12.345.678/0001-95");
  });

  test("returns original value if not CPF or CNPJ", () => {
    const value = "12345";
    const formattedValue = formatCpfCnpj(value);
    expect(formattedValue).toBe("12345");
  });
});

describe("getRandomString", () => {
  test("returns a string of the specified length", () => {
    const length = 10;
    const randomString = getRandomString(length);
    expect(randomString).toHaveLength(length);
  });

  test("returns a different string each time", () => {
    const length = 10;
    const randomString1 = getRandomString(length);
    const randomString2 = getRandomString(length);
    expect(randomString1).not.toBe(randomString2);
  });

  test("returns a string containing only valid characters", () => {
    const length = 10;
    const randomString = getRandomString(length);
    const validCharacters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let char of randomString) {
      expect(validCharacters).toContain(char);
    }
  });
});
