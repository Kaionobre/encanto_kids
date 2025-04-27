import React from 'react';
import '../styles/DailyAgenda.css';
import { FaCheckCircle, FaTimesCircle, FaUtensils, FaSmile, FaMusic, FaEnvelope, FaPaperclip, FaExclamationTriangle } from 'react-icons/fa';

function DailyAgenda() {
  const handleLogout = () => {
    console.log('Usuário desconectado');
    // Adicionar lógica de logout aqui
  };

  const handleReportAbsence = () => {
    console.log('Notificar ausência');
    // Adicionar lógica para informar falta aqui
  };

  return (
    <div className="agenda-page">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-brand">Encanto Kids</div>
        <button className="btn-logout" onClick={handleLogout} aria-label="Sair da conta">
          Sair
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main className="agenda-container">
        <h1 className="agenda-title">Agenda Diária - 25/10/2024</h1>

        <section className="agenda-sections">
          {/* Seção Presença */}
          <div className="agenda-section presence">
            <h2><FaCheckCircle className="icon presence-confirmed" /> Presença</h2>
            <p>✔️ Confirmada</p>
          </div>

          {/* Seção Alimentação */}
          <div className="agenda-section">
            <h2><FaUtensils className="icon" /> Alimentação</h2>
            <p>Sopa de legumes e suco de laranja</p>
          </div>

          {/* Seção Comportamento */}
          <div className="agenda-section">
            <h2><FaSmile className="icon" /> Comportamento</h2>
            <p>Brincou bastante e interagiu com os colegas</p>
          </div>

          {/* Seção Atividades */}
          <div className="agenda-section">
            <h2><FaMusic className="icon" /> Atividades</h2>
            <p>Aula de música e pintura</p>
          </div>

          {/* Seção Recado */}
          <div className="agenda-section">
            <h2><FaEnvelope className="icon" /> Recado</h2>
            <p>Lembre-se de trazer o material para a aula de artes amanhã</p>
          </div>

          {/* Seção Anexos */}
          <div className="agenda-section attachments-section">
            <h2><FaPaperclip className="icon" /> Anexos</h2>
            <div className="attachments">
              <img src="src/assets/images/lunamartins.png" alt="Foto 1 da criança" className="attachment" />
              <img src="src/assets/images/LOGO - ENCANTO KIDS 1.png" alt="Foto 2 da criança" className="attachment" />
              <video src="src/assets/videos/EK - VIDEO.mp4" className="attachment" controls aria-label="Vídeo da atividade" />
            </div>
          </div>

          {/* Observações dos Pais */}
          <div className="agenda-section observations">
            <h2>Observações dos Pais</h2>
            <textarea
              placeholder="Adicione observações (ex: Está com febre)"
              rows="4"
              aria-label="Campo para observações dos pais"
            ></textarea>
          </div>

          {/* Botão Informar Falta */}
          <button className="btn-report-absence" onClick={handleReportAbsence}>
            <FaExclamationTriangle /> Informar Falta
          </button>
        </section>
      </main>
    </div>
  );
}

export default DailyAgenda;