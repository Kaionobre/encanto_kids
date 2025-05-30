import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api'; // Importa a função de logout correta
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); // Chama a função que remove accessToken, refreshToken e limpa o header do Axios
    // O console.log já está dentro da função logoutUser
    navigate('/login'); // Redireciona para a página de login
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
