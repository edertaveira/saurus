import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../shared/ui/Button";
import InputText from "../shared/ui/InputText";
import FormItem from "../shared/ui/FormItem";
import { validateLogin } from "../shared/validations";
import { MdError } from "react-icons/md";
import Select from "../shared/ui/Select";
import Form from "../shared/ui/Form";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [inputErrors, setInputErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await api.getApplications();
        setApplications(data);
        if (data?.length > 0) {
          setApplicationId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch applications", error);
      }
    };

    fetchApplications();
  }, []);

  const handleLogin = async () => {
    const inputerrors = validateLogin(username, password);
    if (inputerrors && Object.keys(inputerrors).length > 0) {
      setError("");
      setInputErrors(inputerrors);
      return;
    }
    setInputErrors({});

    try {
      const data = await api.login({
        aplicacaoId: applicationId,
        usuario: username,
        senha: password,
      });
      localStorage.setItem("token", JSON.stringify(data));
      navigate("/orders");
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    <div>
      <h2 className="bg-red-800 text-white px-2 py-3">Login</h2>
      <Form onSubmit={handleLogin} className="p-2">
        <FormItem label="Aplicação" className="mt-2" htmlFor="application">
          <Select
            name="application"
            id="application"
            value={applicationId}
            onChange={(value) => setApplicationId(value)}
            options={applications?.map((app) => ({
              key: app.id,
              value: app.id,
              label: app.nomeReferencia,
            }))}
          />
        </FormItem>

        <FormItem
          label="Login"
          className="mt-2"
          error={inputErrors?.["username"]}
          htmlFor="login"
        >
          <InputText
            isError={!!inputErrors?.["username"]}
            value={username}
            onChange={(value) => setUsername(value)}
            id="login"
            name="login"
          />
        </FormItem>

        <FormItem
          label="Senha"
          className="mt-2"
          error={inputErrors?.["password"]}
          htmlFor="password"
        >
          <InputText
            isError={!!inputErrors?.["password"]}
            type="password"
            value={password}
            onChange={(value) => setPassword(value)}
            id="password"
            name="password"
          />
        </FormItem>

        {error && (
          <p className="flex flex-row gap-2 items-center text-red-500 text-xs border border-red-300 bg-red-200 rounded-lg p-2 mt-2">
            <MdError size={15} />
            {error}
          </p>
        )}
        <Button title="Login" className="mt-4" />
      </Form>
    </div>
  );
};

export default Login;
