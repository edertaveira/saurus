import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCreditCard,
  FaRegArrowAltCircleRight,
  FaRegCreditCard,
} from "react-icons/fa";
import { FaArrowsSpin, FaPix } from "react-icons/fa6";

import { formatCpfCnpj, toReal } from "../shared/utils";
import { useState } from "react";
import Form from "../shared/ui/Form";
import FormItem from "../shared/ui/FormItem";
import InputText from "../shared/ui/InputText";
import Button from "../shared/ui/Button";
import api from "../services/api";
import { useNotification } from "../NotificationContext";

const Payment = () => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const location = useLocation();
  const { selectedOrders, totalValue } = location.state;

  const renderBackButton = () => {
    return (
      <a
        onClick={() => {
          setStep(1);
          setType(null);
        }}
        className="text-sm flex flex-row justify-center items-center gap-1 cursor-pointer hover:underline"
      >
        <FaArrowLeft />
        Voltar
      </a>
    );
  };

  const pay = async (values) => {
    setLoading(true);
    try {
      await api.getReturn(values);
      showNotification("Pagamento Realizado com sucesso!", "top");
      navigate("/orders");
    } catch (error) {
      console.log(error?.message);
      showNotification("Erro no pagamento. Tente Novamente.", "top");
    }
    setLoading(false);
  };

  return (
    <>
      <h2 className="bg-red-800 text-white px-2 py-3">Pagamento</h2>
      {!loading && (
        <div className="m-2">
          <div className=" bg-gray-200 py-3 px-4 rounded-lg">
            <b>Detalhes do Pedido:</b>
            <ul>
              {selectedOrders.map((order) => (
                <li className="text-xs flex flex-col" key={order.numeroFatura}>
                  <span className="flex flex-row items-center gap-2">
                    <FaRegArrowAltCircleRight /> {order.numeroFatura} |{" "}
                    {order.historico}
                    <b className="text-green-700">
                      {toReal(order.valorFatura)}
                    </b>
                  </span>
                  <small className="text-gray-500">
                    {order?.origem?.map((origem) => {
                      return `${origem?.numero} - ${origem?.infAdic} (${origem?.origem})`;
                    })}
                  </small>
                  <small className="text-gray-500">
                    #{order?.pessoa?.codigo} -{" "}
                    {formatCpfCnpj(order?.pessoa?.cpfCnpj)} (
                    {order?.pessoa?.nome})
                  </small>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-row justify-between bg-gray-200 py-3 px-4 my-2 rounded-lg">
            <b>Valor Total:</b>
            <b className="text-green-700">{toReal(totalValue)}</b>
          </div>
          <div className="flex flex-row bg-gray-200 py-3 px-4 rounded-lg flex-wrap gap-2">
            {step === 1 && (
              <>
                <a
                  onClick={() => {
                    setStep(2);
                    setType("credit");
                  }}
                  className="bg-gray-100 p-2 py-4 px-2 justify-center flex flex-col items-center min-w-[130px] rounded-lg cursor-pointer hover:bg-green-100"
                >
                  <FaCreditCard size={50} />
                  <b className="text-xs">Cartão de Crédito</b>
                </a>
                <a
                  onClick={() => {
                    setStep(2);
                    setType("debit");
                  }}
                  className="bg-gray-100 p-2 py-4 px-2 justify-center flex flex-col items-center min-w-[130px] rounded-lg cursor-pointer hover:bg-green-100"
                >
                  <FaRegCreditCard size={50} />
                  <b className="text-xs">Cartão de Débito</b>
                </a>
                <a
                  onClick={() => {
                    setStep(2);
                    setType("pix");
                  }}
                  className="bg-gray-100 p-2 py-4 px-2 justify-center flex flex-col items-center min-w-[130px] rounded-lg cursor-pointer hover:bg-green-100"
                >
                  <FaPix size={50} />
                  <b className="text-xs">Pix</b>
                </a>
              </>
            )}

            {step === 2 && type !== "pix" && (
              <Form onSubmit={pay} className="flex flex-row gap-2 flex-wrap">
                {renderBackButton()}
                <b className="w-11/12">Dados do Cartão:</b>
                <FormItem className="w-1/4">
                  <InputText name="credit" placeholder="Número do Cartão" />
                </FormItem>
                <FormItem className="w-1/4">
                  <InputText name="validDate" placeholder="Validade" />
                </FormItem>
                <FormItem name="code" className="w-1/5">
                  <InputText name="code" placeholder="Código" />
                </FormItem>
                <Button title="Pagar" className="w-1/5 py-1 text-sm" />
              </Form>
            )}

            {step === 2 && type === "pix" && (
              <Form onSubmit={pay} className="flex flex-row gap-2 flex-wrap">
                {renderBackButton()}
                <b className="w-11/12">Dados Pix:</b>
                <FormItem className="w-3/4">
                  <InputText name="chavePix" placeholder="Chave Pix" />
                </FormItem>
                <Button title="Pagar" className="w-1/5 py-1 text-sm" />
              </Form>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="m-2 flex justify-center items-center h-[100vh]">
          <FaArrowsSpin className="animate-spin" color="gray" size={90} />
        </div>
      )}
    </>
  );
};

export default Payment;
