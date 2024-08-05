import { objectToQueryString } from "../shared/utils";

const BASE_URL = "https://api-pedido-erp-gateway-prod.saurus.net.br/api";
const headers = {
  Accept: "*/*",
  "Content-Type": "application/json-patch+json",
};
const api = {
  getApplications: async () => {
    try {
      const response = await fetch(`${BASE_URL}/v2/aplicacoes`, {
        method: "GET",
        headers,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${BASE_URL}/v2/auth`, {
        method: "POST",
        headers,
        body: JSON.stringify(credentials),
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.title ?? "Falha no Login");
      }
      return json?.credenciais?.[0];
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  getOrders: async (params = {}) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      let query = "";
      if (Object.keys(params).length > 0) {
        query = "?" + objectToQueryString(params);
      }

      const response = await fetch(
        `${BASE_URL}/v2/financeiro/faturas${query}`,
        {
          method: "GET",
          headers: {
            ...headers,
            Aplicacaoid: token.aplicacaoid,
            username: token.username,
          },
        }
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Erro ao recuperar faturas");
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao recuperar faturas:", error);
      throw error;
    }
  },

  getReturn: async (values) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await fetch(`${BASE_URL}/v2/financeiro/retorno`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          ...headers,
          Aplicacaoid: token.aplicacaoid,
          username: token.username,
        },
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.title ?? "Falha na requisição");
      }
      return json?.credenciais?.[0];
    } catch (error) {
      console.error("Erro durante a requisição:", error);
      throw error;
    }
  },
};

export default api;
