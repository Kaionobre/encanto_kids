import React from 'react';
import '../styles/ChildProfile.css';
import ChildPhoto from '../assets/images/lunamartins.png';

function ChildProfile() {
  const handleLogout = () => {
    console.log('Usuário desconectado');
    // Adicione aqui a lógica de logout (ex.: limpar token, redirecionar)
  };

  return (
    <div className="profile-page">
      <header className="navbar">
        <div className="navbar-brand">Encanto Kids</div>
        <button className="btn-logout" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <main className="container">
        <section className="card">
          <div className="photo-section">
            <img src={ChildPhoto} alt="Foto de Luna Martins Silva" />
          </div>
          <div className="info-section">
            <h2>Luna Martins Silva</h2>
            <p>
              <strong>Turno:</strong> Manhã
            </p>
            <p>
              <strong>Horário de Entrada:</strong> 07h30
            </p>
            <p>
              <strong>Horário de Saída:</strong> 12h00
            </p>
            <p>
              <strong>Pacote Contratado:</strong> Mensal - Acesso completo das
              07h30 às 12h00
            </p>
            <p>
              <strong>Saldo de Horas:</strong> 20 horas restantes
            </p>
            <p>
              <strong>Status do Pagamento:</strong>{' '}
              <span className="status status-ativo">🟢 Ativo</span>
            </p>
            <a href="#" className="contract-link">
              Visualizar Contrato (PDF)
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ChildProfile;