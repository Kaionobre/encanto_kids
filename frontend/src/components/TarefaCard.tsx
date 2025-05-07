import React from "react";

interface TarefaCardProps {
  nome: string;
  turno: string;
  pacote: string;
  imagemUrl: string;
}

const TarefaCard: React.FC<TarefaCardProps> = ({ nome, turno, pacote, imagemUrl }) => {
  return (
    <div className="card-item">
      <img src={imagemUrl} alt={nome} className="profile-pic" />
      <div className="info">
        <strong>{nome}</strong>
        <p><b>Turno:</b> {turno}</p>
        <p><b>Pacote Contratado:</b> {pacote}</p>
        <div className="task-buttons">
          <button className="orange-button">Enviar boleto</button>
          <button className="orange-button">Confirmar presença</button>
          <button className="orange-button">Atualizar contrato</button>
        </div>
      </div>
    </div>
  );
};

export default TarefaCard;
