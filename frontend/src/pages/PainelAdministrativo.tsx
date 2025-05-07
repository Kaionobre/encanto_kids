import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../css/PainelAdministrativo.css";
import { Crianca, Pacote } from "../types/models";

export function PainelAdministrativo() {
  const navigate = useNavigate();
  const [criancas, setCriancas] = useState<Crianca[]>([]);
  const [pacotes, setPacotes] = useState<Pacote[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/crianca/")
      .then((res) => setCriancas(res.data))
      .catch((err) => console.error("Erro ao buscar crianças:", err));

    axios.get("http://localhost:8000/api/pacote/")
      .then((res) => setPacotes(res.data))
      .catch((err) => console.error("Erro ao buscar pacotes:", err));
  }, []);

  const handleCadastrarCrianca = () => {
    navigate("/cadastrar-crianca");
  };

  const getNomePacote = (pacoteRef: number | Pacote): string => {
    if (typeof pacoteRef === "object") {
      return pacoteRef.nome;
    }
    const pacote = pacotes.find(p => p.id === pacoteRef);
    return pacote ? pacote.nome : "Desconhecido";
  };

  return (
    <div className="painel-administrativo">
      <div className="topbar">
        <h1>Encanto Kids</h1>
        <button className="sair-button">Sair</button>
      </div>

      <div className="cards-container">
        {/* Lembretes */}
        <div className="section">
          <h2>Lembretes</h2>
          <div className="card">
            <img 
              src="https://randomuser.me/api/portraits/women/44.jpg" 
              alt="Criança" 
              className="child-photo" 
            />
            <div className="card-info">
              <strong>Luna Martins Silva</strong>
              <p><b>Turno:</b> Manhã</p>
              <p><b>Pacote Contratado:</b> Mensal</p>
              <button className="action-button">Documento pendente</button>
            </div>
          </div>
        </div>

        {/* Tarefas administrativas */}
        <div className="section">
          <h2>Tarefas administrativas</h2>
          {criancas.map((crianca) => (
            <div className="card" key={crianca.id}>
              <img 
                src="https://randomuser.me/api/portraits/lego/1.jpg" 
                alt="Criança" 
                className="child-photo" 
              />
              <div className="card-info">
                <strong>{crianca.nome}</strong>
                <p><b>Turno:</b> {crianca.turno}</p>
                <p><b>Pacote Contratado:</b> {getNomePacote(crianca.tipo_de_pacote)}</p>
                <div className="button-group">
                  <button className="action-button">Enviar boleto</button>
                  <button className="action-button">Confirmar presença</button>
                  <button className="action-button">Atualizar contrato</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ações Rápidas */}
        <div className="section">
          <h2 style={{ textAlign: "center" }}>Ações Rápidas</h2>
          <div className="quick-actions">
            <button className="quick-action-button" onClick={handleCadastrarCrianca}>Cadastrar nova criança</button>
            <button className="quick-action-button">Ver relatórios financeiros</button>
            <button className="quick-action-button">Ver agenda do dia</button>
            <button className="quick-action-button">Enviar lembrete de pagamento</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PainelAdministrativo;
