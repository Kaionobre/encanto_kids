import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/FormCrianca.css";
import { Crianca, Pacote, Responsavel } from "../types/models";

export function FormCrianca() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Crianca>>({
    nome: "",
    idade: undefined,
    turno: "manha",
    tipo_de_pacote: undefined,
    responsavel: undefined,
    status: true,
  });

  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/pacote/")
      .then((res) => setPacotes(res.data))
      .catch((err) => console.error("Erro ao carregar pacotes:", err));

    axios
      .get("http://localhost:8000/api/responsavel/")
      .then((res) => setResponsaveis(res.data))
      .catch((err) => console.error("Erro ao carregar responsáveis:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "idade"
          ? value === "" ? undefined : Number(value)
          : name === "status"
          ? value === "true"
          : name === "tipo_de_pacote" || name === "responsavel"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/crianca/", formData)
      .then(() => {
        alert("Criança cadastrada com sucesso!");
        navigate("/painel-administrativo");
      })
      .catch((err) => {
        console.error("Erro ao cadastrar criança:", err);
        alert("Erro ao cadastrar criança.");
      });
  };

  return (
    <div className="form-crianca-page">
      <div className="form-container">
        <div className="form-header">
          <h2>Cadastro de Criança</h2>
          <button
            className="close-button"
            onClick={() => navigate("/painel-administrativo")}
            title="Voltar"
          >
            ❌
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome || ""}
            onChange={handleChange}
            required
          />

          <label>Idade:</label>
          <input
            type="number"
            name="idade"
            value={formData.idade !== undefined ? formData.idade : ""}
            onChange={handleChange}
            required
          />

          <label>Turno:</label>
          <select
            name="turno"
            value={formData.turno || ""}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option value="manha">Manhã</option>
            <option value="tarde">Tarde</option>
            <option value="integral">Integral</option>
          </select>

          <label>Pacote:</label>
          <select
            name="tipo_de_pacote"
            value={
              typeof formData.tipo_de_pacote === "number"
                ? formData.tipo_de_pacote
                : ""
            }
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            {pacotes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>

          <label>Responsável:</label>
          <select
            name="responsavel"
            value={
              typeof formData.responsavel === "number"
                ? formData.responsavel
                : ""
            }
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            {responsaveis.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome}
              </option>
            ))}
          </select>

          <label>Status:</label>
          <select
            name="status"
            value={formData.status ? "true" : "false"}
            onChange={handleChange}
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export default FormCrianca;
