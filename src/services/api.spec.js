/**
 * @jest-environment jsdom
 */
import api from "./api";

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe("API", () => {
  describe("getApplications", () => {
    it("fetches applications successfully", async () => {
      const mockApplications = [{ id: 1, name: "App1" }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApplications,
      });

      const result = await api.getApplications();
      expect(result).toEqual(mockApplications);
      expect(fetch).toHaveBeenCalledWith(
        "https://api-pedido-erp-gateway-prod.saurus.net.br/api/v2/aplicacoes",
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json-patch+json",
          },
        }
      );
    });

    it("throws an error when fetching applications fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.getApplications()).rejects.toThrow(
        "Failed to fetch applications"
      );
      expect(fetch).toHaveBeenCalledWith(
        "https://api-pedido-erp-gateway-prod.saurus.net.br/api/v2/aplicacoes",
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json-patch+json",
          },
        }
      );
    });
  });

  describe("login", () => {
    it("logs in successfully", async () => {
      const mockCredentials = { username: "test", password: "test" };
      const mockResponse = { credenciais: [{ token: "test-token" }] };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.login(mockCredentials);
      expect(result).toEqual(mockResponse.credenciais[0]);
      expect(fetch).toHaveBeenCalledWith(
        "https://api-pedido-erp-gateway-prod.saurus.net.br/api/v2/auth",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify(mockCredentials),
        }
      );
    });

    it("throws an error when login fails", async () => {
      const mockCredentials = { username: "test", password: "test" };
      const mockError = { title: "Login Error" };
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(api.login(mockCredentials)).rejects.toThrow("Login Error");
      expect(fetch).toHaveBeenCalledWith(
        "https://api-pedido-erp-gateway-prod.saurus.net.br/api/v2/auth",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify(mockCredentials),
        }
      );
    });
  });

  describe("getOrders", () => {
    it("fetches orders successfully", async () => {
      const mockOrders = [{ id: 1, name: "Order1" }];
      const token = { aplicacaoid: "app1", username: "user1" };
      localStorage.setItem("token", JSON.stringify(token));
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrders,
      });

      const result = await api.getOrders();
      expect(result).toEqual(mockOrders);
      expect(fetch).toHaveBeenCalledWith(
        "https://api-pedido-erp-gateway-prod.saurus.net.br/api/v2/financeiro/faturas",
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json-patch+json",
            Aplicacaoid: "app1",
            username: "user1",
          },
        }
      );

      localStorage.removeItem("token");
    });

    it("throws an error when fetching orders fails", async () => {
      const mockError = { message: "Order Error" };
      const token = { aplicacaoid: "app1", username: "user1" };
      localStorage.setItem("token", JSON.stringify(token));
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(api.getOrders()).rejects.toThrow("Order Error");
      expect(fetch).toHaveBeenCalledWith(
        "https://api-pedido-erp-gateway-prod.saurus.net.br/api/v2/financeiro/faturas",
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json-patch+json",
            Aplicacaoid: "app1",
            username: "user1",
          },
        }
      );

      localStorage.removeItem("token");
    });
  });

  describe("getReturn", () => {
    it("fetches return successfully", async () => {
      const mockValues = { value: "test" };
      const mockResponse = { credenciais: [{ token: "test-token" }] };
      const token = { aplicacaoid: "app1", username: "user1" };
      localStorage.setItem("token", JSON.stringify(token));
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.getReturn(mockValues);
      expect(result).toEqual(mockResponse.credenciais[0]);
      expect(fetch).toHaveBeenCalledWith(
        "https://api-pedido-erp-gateway-prod.saurus.net.br/api/v2/financeiro/retorno",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json-patch+json",
            Aplicacaoid: "app1",
            username: "user1",
          },
          body: JSON.stringify(mockValues),
        }
      );

      localStorage.removeItem("token");
    });

    it("throws an error when fetching return fails", async () => {
      const mockValues = { value: "test" };
      const mockError = { title: "Return Error" };
      const token = { aplicacaoid: "app1", username: "user1" };
      localStorage.setItem("token", JSON.stringify(token));
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(api.getReturn(mockValues)).rejects.toThrow("Return Error");
      expect(fetch).toHaveBeenCalledWith(
        "https://api-pedido-erp-gateway-prod.saurus.net.br/api/v2/financeiro/retorno",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json-patch+json",
            Aplicacaoid: "app1",
            username: "user1",
          },
          body: JSON.stringify(mockValues),
        }
      );

      localStorage.removeItem("token");
    });
  });
});
