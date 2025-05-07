import React from "react";

interface LembreteCardProps {
  nome: string;
  turno: string;
  pacote: string;
  imagemUrl: string;
}

const LembreteCard: React.FC<LembreteCardProps> = ({ nome, turno, pacote, imagemUrl }) => {
  return (
    <div className="card-item">
      <img src={imagemUrl} alt={nome} className="profile-pic" />
      <div className="info">
        <strong>{nome}</strong>
        <p><b>Turno:</b> {turno}</p>
        <p><b>Pacote Contratado:</b> {pacote}</p>
        <button className="orange-button">Documento pendente</button>
      </div>
    </div>
  );
};

export default LembreteCard;
