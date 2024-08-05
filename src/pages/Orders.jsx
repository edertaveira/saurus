import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../shared/ui/Button";
import Table from "../shared/ui/Table";
import { toReal } from "../shared/utils";
import Form from "../shared/ui/Form";
import InputText from "../shared/ui/InputText";
import FormItem from "../shared/ui/FormItem";
import { useNotification } from "../NotificationContext";
import { BiLogOut } from "react-icons/bi";

const Orders = () => {
  const [selected, setSelected] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState({
    codigo: "",
    cpfCnpj: "",
    nome: "",
  });
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const fetchOrders = async () => {
    try {
      const data = await api.getOrders();
      setOrders(data.list);
      setFilteredOrders(data.list);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      return (
        order?.pessoa?.codigo.includes(filter.codigo) &&
        order?.pessoa?.cpfCnpj.includes(filter.cpfCnpj) &&
        order?.pessoa?.nome.toLowerCase().includes(filter.nome.toLowerCase())
      );
    });
    setFilteredOrders(filtered);
  }, [filter, orders]);

  const handleFilterChange = (name, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const handleReceive = () => {
    if (selected.length > 0) {
      const selectedOrders = orders.filter((item) =>
        selected.includes(item.numeroFatura)
      );
      const totalValue = selectedOrders.reduce((prev, curr) => {
        return prev + curr?.valorFatura;
      }, 0);

      navigate("/payment", {
        state: {
          selectedOrders,
          totalValue,
        },
      });
    } else {
      showNotification("Selecione pelo menos um pedido", "top");
    }
  };

  return (
    <>
      <h2 className="bg-red-800 text-white px-2 py-3 flex flex-row justify-between items-center">
        Pedidos
        <BiLogOut
          size={18}
          className="cursor-pointer"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/")
          }}
        />
      </h2>
      <div className="p-2">
        <Form className="py-2 flex flex-wrap flex-row gap-2">
          <FormItem>
            <InputText
              placeholder="CPJ / CNPJ"
              name="cpfCnpj"
              id="cpfCnpj"
              value={filter.cpfCnpj}
              onChange={(value) => handleFilterChange("cpfCnpj", value)}
            />
          </FormItem>
          <FormItem>
            <InputText
              placeholder="Nome"
              name="nome"
              id="nome"
              value={filter.nome}
              onChange={(value) => handleFilterChange("nome", value)}
            />
          </FormItem>
          <FormItem>
            <InputText
              placeholder="Código"
              name="codigo"
              id="codigo"
              value={filter.codigo}
              onChange={(value) => handleFilterChange("codigo", value)}
            />
          </FormItem>
        </Form>

        <Table
          isChecked
          data={filteredOrders}
          columns={[
            { key: "historico", label: "Nome do Pedido" },
            {
              key: "valorFatura",
              label: "Valor",
              render: (value) => {
                return toReal(value);
              },
            },
            {
              key: "status",
              label: "Status",
              render: (_, row) => {
                if (!row.pagamento) {
                  return "Pendente";
                }
                return "Pago";
              },
            },
          ]}
          keyName="numeroFatura"
          onSelect={setSelected}
        />

        <Button
          disabled={selected.length === 0}
          title="Receber"
          onClick={handleReceive}
          className="mt-4"
        />
      </div>
    </>
  );
};

export default Orders;
