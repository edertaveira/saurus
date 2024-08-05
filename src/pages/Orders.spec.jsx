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
import { MemoryRouter, useNavigate } from "react-router-dom";
import Orders from "./Orders";
import api from "../services/api";
import { useNotification } from "../NotificationContext";

jest.mock("../services/api");
jest.mock("../NotificationContext", () => ({
  useNotification: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const ordersData = [
  {
    numeroFatura: "001",
    historico: "Compra Online",
    valorFatura: 120.5,
    pagamentoParcial: false,
    pessoa: {
      cpfCnpj: "12345678900",
      codigo: "1",
      nome: "João Silva",
    },
    pagamento: [
      {
        nome: "Cartão de Crédito",
        tipoPagamento: 3,
        numeroParcelas: 1,
      },
    ],
    origem: [
      {
        origem: "Nota Fiscal",
        numero: "A123",
        infAdic: "Compra de eletrônicos",
      },
    ],
  },
  {
    numeroFatura: "002",
    historico: "Pagamento Mensalidade",
    valorFatura: 1,
    pagamentoParcial: false,
    pessoa: {
      cpfCnpj: "98765432100",
      codigo: "2",
      nome: "Maria Oliveira",
    },
    pagamento: [
      {
        nome: "Cartão de Debito",
        tipoPagamento: 4,
        numeroParcelas: 1,
      },
    ],
    origem: [
      {
        origem: "Boleto Bancário",
        numero: "B456",
        infAdic: "Mensalidade do serviço",
      },
    ],
  },
];

describe("Orders", () => {
  let mockNavigate;
  let mockShowNotification;

  beforeEach(() => {
    mockNavigate = jest.fn();
    mockShowNotification = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    useNotification.mockReturnValue({ showNotification: mockShowNotification });
    api.getOrders.mockResolvedValue({ list: ordersData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Orders component and fetches orders", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Orders />
        </MemoryRouter>
      );
    });

    expect(
      screen.getByRole("heading", { name: /pedidos/i })
    ).toBeInTheDocument();
    await waitFor(() => expect(api.getOrders).toHaveBeenCalled());
    expect(screen.getByText("Compra Online")).toBeInTheDocument();
    expect(screen.getByText("Pagamento Mensalidade")).toBeInTheDocument();
  });

  test("filters orders based on input fields", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Orders />
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByPlaceholderText("CPJ / CNPJ"), {
      target: { value: "12345678900" },
    });

    setTimeout(async () => {
      await waitFor(() => {
        expect(screen.queryByText("Compra Online")).toBeInTheDocument();
        expect(
          screen.queryByText("Pagamento Mensalidade")
        ).not.toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText("Nome"), {
        target: { value: "Maria" },
      });
      await waitFor(() => {
        expect(screen.getByDisplayValue("Maria")).toBeInTheDocument();
        expect(screen.queryByText("Compra Online")).not.toBeInTheDocument();
        expect(screen.queryByText("Pagamento Mensalidade")).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText("Código"), {
        target: { value: "1" },
      });
      await waitFor(() => {
        expect(screen.getByDisplayValue("1")).toBeInTheDocument();
        expect(screen.queryByText("Compra Online")).toBeInTheDocument();
        expect(
          screen.queryByText("Pagamento Mensalidade")
        ).not.toBeInTheDocument();
      });
    }, 1000);
  });

  test("navigates to payment page with selected orders", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Orders />
        </MemoryRouter>
      );
    });

    await waitFor(() => expect(api.getOrders).toHaveBeenCalled());

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);

    fireEvent.click(screen.getByRole("button", { name: /receber/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/payment", {
        state: {
          selectedOrders: [ordersData[0]],
          totalValue: ordersData[0].valorFatura,
        },
      });
    });
  });
});
