import React from "react";

const AcoesRapidasCard: React.FC = () => {
  return (
    <div className="quick-actions">
      <button className="orange-button">Cadastrar nova criança</button>
      <button className="orange-button">Ver relatórios financeiros</button>
      <button className="orange-button">Ver agenda do dia</button>
      <button className="orange-button">Enviar lembrete de pagamento</button>
    </div>
  );
};

export default AcoesRapidasCard;
