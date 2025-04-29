import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Usuário desconectado');
    // Limpa autenticação
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">Encanto Kids</div>
      <div className="nav-links">
        <button
          className="nav-btn"
          onClick={() => navigate('/childprofile')}
          aria-label="Ir para Perfil da Criança"
        >
          Perfil
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate('/dailyagenda')}
          aria-label="Ir para Agenda Diária"
        >
          Agenda
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate('/payments')}
          aria-label="Ir para Pagamentos"
        >
          Pagamentos
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate('/notifications')}
          aria-label="Ir para Notificações"
        >
          Notificações
        </button>
        <button
          className="btn-logout"
          onClick={handleLogout}
          aria-label="Sair da conta"
        >
          Sair
        </button>
      </div>
    </header>
  );
}

export default Navbar;
