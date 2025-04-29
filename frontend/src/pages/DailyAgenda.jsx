import React from 'react';
import '../styles/DailyAgenda.css';
import { FaCheckCircle, FaUtensils, FaSmile, FaMusic, FaEnvelope, FaPaperclip, FaExclamationTriangle } from 'react-icons/fa';
import Navbar from '../components/Navbar';

function DailyAgenda() {
  const handleReportAbsence = () => {
    console.log('Notificar ausência');
    // Adicionar lógica para informar falta aqui
  };

  return (
    <div className="agenda-page">
      <Navbar />
      <main className="agenda-container">
        <h1 className="agenda-title">Agenda Diária - 25/10/2024</h1>

        <section className="agenda-sections">
          {/* Seção Presença */}
          <div className="agenda-section presence">
            <h2>
              <FaCheckCircle className="icon presence-confirmed" aria-hidden="true" /> Presença
            </h2>
            <p>✔️ Confirmada</p>
          </div>

          {/* Seção Alimentação */}
          <div className="agenda-section">
            <h2>
              <FaUtensils className="icon" aria-hidden="true" /> Alimentação
            </h2>
            <p>Sopa de legumes e suco de laranja</p>
          </div>

          {/* Seção Comportamento */}
          <div className="agenda-section">
            <h2>
              <FaSmile className="icon" aria-hidden="true" /> Comportamento
            </h2>
            <p>Brincou bastante e interagiu com os colegas</p>
          </div>

          {/* Seção Atividades */}
          <div className="agenda-section">
            <h2>
              <FaMusic className="icon" aria-hidden="true" /> Atividades
            </h2>
            <p>Aula de música e pintura</p>
          </div>

          {/* Seção Recado */}
          <div className="agenda-section">
            <h2>
              <FaEnvelope className="icon" aria-hidden="true" /> Recado
            </h2>
            <p>Lembre-se de trazer o material para a aula de artes amanhã</p>
          </div>

          {/* Seção Anexos */}
          <div className="agenda-section attachments-section">
            <h2>
              <FaPaperclip className="icon" aria-hidden="true" /> Anexos
            </h2>
            <div className="attachments">
              <img
                src="src/assets/images/lunamartins.png"
                alt="Foto 1 da criança"
                className="attachment"
              />
              <img
                src="src/assets/images/LOGO - ENCANTO KIDS 1.png"
                alt="Foto 2 da criança"
                className="attachment"
              />
              <video
                src="src/assets/videos/EK - VIDEO.mp4"
                className="attachment"
                controls
                aria-label="Vídeo da atividade"
              />
            </div>
          </div>

          {/* Seção Observações dos Pais */}
          <div className="agenda-section observations">
            <h2>Observações dos Pais</h2>
            <textarea
              placeholder="Adicione observações (ex: Está com febre)"
              rows="4"
              aria-label="Campo para observações dos pais"
            ></textarea>
          </div>

          {/* Botão Informar Falta */}
          <button
            className="btn-report-absence"
            onClick={handleReportAbsence}
            aria-label="Informar ausência"
          >
            <FaExclamationTriangle aria-hidden="true" /> Informar Falta
          </button>
        </section>
      </main>
    </div>
  );
}

export default DailyAgenda;