import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChildProfile.css';
import ChildPhoto from '../assets/images/lunamartins.png';
import Navbar from '../components/Navbar';

function ChildProfile() {
  return (
    <div className="profile-page">
      <Navbar />
      <main className="container">
        <section className="card">
          <div className="photo-section">
            <img src={ChildPhoto} alt="Foto de Luna Martins Silva" />
          </div>
          <div className="info-section">
            <h2>Luna Martins Silva</h2>
            <div className="info-grid">
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
                <strong>Pacote Contratado:</strong> Mensal
              </p>
              <p>
                <strong>Saldo de Horas:</strong> 20 horas restantes
              </p>
              <p>
                <strong>Status do Pagamento:</strong>{' '}
                <span className="status status-ativo">🟢 Ativo</span>
              </p>
            </div>
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