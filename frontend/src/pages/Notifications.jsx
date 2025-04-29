import React, { useState, useEffect } from 'react';
import '../styles/Notifications.css';
import { FaBell, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaWhatsapp } from 'react-icons/fa';
import Navbar from '../components/Navbar';

function Notifications() {
  const [isLoading, setIsLoading] = useState(true);

  const handleContactTeam = () => {
    window.open('https://wa.me/5511999999999', '_blank');
  };

  // Dados fictícios para notificações
  const notifications = [
    {
      type: 'general',
      message: 'Dia de brinquedo amanhã! Traga um brinquedo favorito.',
      date: '2024-10-24',
    },
    {
      type: 'payment-reminder',
      message: 'Lembrete: Pagamento de outubro vence em 2 dias.',
      date: '2024-10-23',
      link: '#',
      linkText: 'Pagar via PIX/Boleto',
    },
    {
      type: 'payment-status',
      message: 'Pagamento de setembro: Pago',
      date: '2024-10-01',
      status: 'paid',
    },
    {
      type: 'payment-status',
      message: 'Pagamento de outubro: Pendente',
      date: '2024-10-15',
      status: 'pending',
    },
    {
      type: 'general',
      message: 'Reunião de pais no dia 30/10 às 18h.',
      date: '2024-10-20',
    },
  ];

  // Função para formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Ordenar notificações por data (mais recente primeiro)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <div className="notifications-page">
      <Navbar />
      <main className="notifications-container">
        <h1 className="notifications-title">
          <FaBell className="title-icon" /> Notificações e Avisos
        </h1>

        {isLoading ? (
          <div className="loading-state">Carregando notificações...</div>
        ) : sortedNotifications.length === 0 ? (
          <div className="empty-state">Nenhuma notificação disponível</div>
        ) : (
          <section className="notifications-list">
            {sortedNotifications.map((notification, index) => (
              <div
                key={index}
                className={`notification-item ${notification.type} ${
                  notification.type === 'payment-status' ? notification.status : ''
                }`}
                role="alert"
              >
                <div className="notification-header">
                  <div className="notification-icon-wrapper">
                    {notification.type === 'payment-reminder' && (
                      <FaMoneyBillWave className="notification-icon" />
                    )}
                    {notification.type === 'payment-status' && (
                      <span className={`status-icon ${notification.status}`}>
                        {notification.status === 'paid' ? (
                          <FaCheckCircle />
                        ) : (
                          <FaTimesCircle />
                        )}
                      </span>
                    )}
                    {notification.type === 'general' && (
                      <FaBell className="notification-icon" />
                    )}
                  </div>
                  <span className="notification-date">{formatDate(notification.date)}</span>
                </div>
                <p className="notification-message">{notification.message}</p>
                {notification.type === 'payment-reminder' && (
                  <a
                    href={notification.link}
                    className="payment-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {notification.linkText}
                  </a>
                )}
              </div>
            ))}
          </section>
        )}

        <button
          className="btn-contact-team"
          onClick={handleContactTeam}
          aria-label="Falar com a equipe via WhatsApp"
        >
          <FaWhatsapp /> Falar com a Equipe
        </button>
      </main>
    </div>
  );
}

export default Notifications;