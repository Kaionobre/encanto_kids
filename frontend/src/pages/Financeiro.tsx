import React from 'react';
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaBell,
} from 'react-icons/fa';
import '../css/Financeiro.css'; // Estilo unificado

const Financeiro: React.FC = () => {
  const handleLogout = (): void => {
    console.log('Usuário desconectado');
    // Adicione aqui a lógica real de logout, como limpar tokens ou redirecionar
  };

  return (
    <div className="financeiro-page">
      {/* Header adaptado */}
      <div className="topbar">
          <h1>Encanto Kids</h1>
          <button className="sair-button" onClick={handleLogout}>Sair</button>
        </div>

      <main className="dashboard-container">
        <h1 className="dashboard-title">Painel Financeiro</h1>

        {/* Seção Financeira */}
        <section className="financial-section">
          <h2>Financeiro</h2>
          <div className="financial-grid">
            <div className="financial-widget">
              <FaMoneyBillWave className="financial-icon" />
              <h3>Receita Prevista</h3>
              <p>R$ 15.000,00</p>
            </div>
            <div className="financial-widget">
              <FaCheckCircle className="financial-icon" />
              <h3>Pagamentos Recebidos</h3>
              <p>R$ 12.500,00</p>
            </div>
            <div className="financial-widget">
              <FaTimesCircle className="financial-icon" />
              <h3>Pagamentos Pendentes</h3>
              <p>R$ 2.500,00</p>
            </div>
            <div className="financial-widget">
              <FaExclamationTriangle className="financial-icon" />
              <h3>Inadimplência</h3>
              <p>4 casos (R$ 1.200,00)</p>
            </div>
            <div className="financial-widget">
              <FaBell className="financial-icon" />
              <h3>Pacotes Vencendo</h3>
              <p>6 nos próximos 7 dias</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Financeiro;
