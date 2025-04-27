import React from 'react';
import '../styles/Dashboard.css';
import { FaChild, FaExclamationTriangle, FaUserPlus, FaChartPie, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaBell, FaCalendar, FaFileAlt, FaSearch } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar elementos do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const handleLogout = () => {
    console.log('Usuário desconectado');
    // Adicionar lógica de logout
  };

  // Dados fictícios para o gráfico de pizza
  const pieData = {
    labels: ['Mensal', 'Semanal', 'Diário'],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: ['var(--roxo)', 'var(--azul-claro)', 'var(--amarelo)'],
        borderColor: ['var(--branco)'],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="dashboard-page">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-brand">Encanto Kids</div>
        <button className="btn-logout" onClick={handleLogout} aria-label="Sair da conta">
          Sair
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main className="dashboard-container">
        <h1 className="dashboard-title">Visão Geral - Painel Gerencial</h1>

        {/* Ações Rápidas */}
        <section className="quick-actions">
          <button className="action-btn" aria-label="Cadastrar nova criança">
            <FaUserPlus /> Cadastrar Criança
          </button>
          <button className="action-btn" aria-label="Enviar lembrete">
            <FaBell /> Enviar Lembrete
          </button>
          <button className="action-btn" aria-label="Ver agenda diária">
            <FaCalendar /> Ver Agenda
          </button>
          <button className="action-btn" aria-label="Gerar relatórios">
            <FaFileAlt /> Relatórios
          </button>
          <button className="action-btn" aria-label="Buscar informações">
            <FaSearch /> Buscar
          </button>
        </section>

        {/* Estatísticas */}
        <section className="stats-section">
          <h2>Estatísticas</h2>
          <div className="stats-grid">
            <div className="stat-widget">
              <FaChild className="stat-icon" />
              <h3>Crianças Ativas</h3>
              <p>45</p>
            </div>
            <div className="stat-widget">
              <FaExclamationTriangle className="stat-icon" />
              <h3>Faltas do Dia</h3>
              <p>3 (2 com justificativa)</p>
            </div>
            <div className="stat-widget">
              <FaUserPlus className="stat-icon" />
              <h3>Novos Cadastros</h3>
              <p>5 no mês</p>
            </div>
            <div className="stat-widget pie-chart">
              <h3>Distribuição de Pacotes</h3>
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </section>

        {/* Financeiro */}
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
}

export default Dashboard;