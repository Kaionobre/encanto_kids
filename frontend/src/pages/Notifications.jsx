import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Notifications.css';
import { 
  FaBell, 
  FaMoneyBillWave, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaWhatsapp,
  FaRegCheckCircle, // Ícone para marcar como lida
  FaRegListAlt // Ícone para marcar todas como lidas
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { 
  getNotificacoes, 
  marcarNotificacaoComoLida, 
  marcarTodasNotificacoesComoLidas 
} from '../services/api';

function Notifications() {
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingId, setMarkingId] = useState(null); // Para feedback ao marcar individualmente
  const [markingAll, setMarkingAll] = useState(false); // Para feedback ao marcar todas

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotificacoes();
      // Ordena por data de criação (mais recente primeiro) e depois por não lida/urgente
      const sortedData = data.sort((a, b) => {
        if (a.lida !== b.lida) return a.lida ? 1 : -1; // Não lidas primeiro
        if (a.urgente !== b.urgente) return b.urgente ? 1 : -1; // Urgentes não lidas primeiro
        return new Date(b.data_criacao) - new Date(a.data_criacao);
      });
      setNotificationsList(sortedData);
    } catch (err) {
      console.error("Erro ao buscar notificações:", err);
      setError("Não foi possível carregar as notificações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    setMarkingId(id);
    try {
      await marcarNotificacaoComoLida(id);
      // Atualiza a lista localmente ou busca novamente
      setNotificationsList(prev => 
        prev.map(n => n.id === id ? { ...n, lida: true } : n)
          .sort((a, b) => { // Reordena após marcar como lida
            if (a.lida !== b.lida) return a.lida ? 1 : -1;
            if (a.urgente !== b.urgente) return b.urgente ? 1 : -1;
            return new Date(b.data_criacao) - new Date(a.data_criacao);
          })
      );
    } catch (err) {
      console.error(`Erro ao marcar notificação ${id} como lida:`, err);
      alert("Falha ao marcar notificação como lida.");
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await marcarTodasNotificacoesComoLidas();
      // Atualiza a lista localmente ou busca novamente
      setNotificationsList(prev => 
        prev.map(n => ({ ...n, lida: true }))
          .sort((a, b) => { // Reordena
            if (a.lida !== b.lida) return a.lida ? 1 : -1;
            if (a.urgente !== b.urgente) return b.urgente ? 1 : -1;
            return new Date(b.data_criacao) - new Date(a.data_criacao);
          })
      );
    } catch (err) {
      console.error("Erro ao marcar todas as notificações como lidas:", err);
      alert("Falha ao marcar todas as notificações como lidas.");
    } finally {
      setMarkingAll(false);
    }
  };

  const handleContactTeam = () => {
    // Substitua pelo número de WhatsApp correto
    window.open('https://wa.me/55SEUNUMEROAQUI?text=Olá!%20Gostaria%20de%20falar%20com%20a%20equipe%20Encanto%20Kids.', '_blank');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getNotificationIcon = (type, status = null) => {
    // O status aqui seria para 'status_pagamento', como 'pago' ou 'pendente'
    // que viria do objeto da notificação se o tipo for 'status_pagamento'
    if (type === 'lembrete_pagamento') return <FaMoneyBillWave className="notification-icon payment-reminder-icon" />;
    if (type === 'status_pagamento') {
      // Supondo que o objeto notificação tenha um campo 'status_cobranca' ou similar
      // Para este exemplo, vamos usar o 'status' que você tinha no mock
      if (status === 'pago') return <FaCheckCircle className="notification-icon status-icon paid" />;
      if (status === 'pendente') return <FaTimesCircle className="notification-icon status-icon pending" />;
    }
    if (type === 'aviso_evento' || type === 'geral' || type === 'novo_anexo_agenda') return <FaBell className="notification-icon general-icon" />;
    return <FaBell className="notification-icon" />; // Ícone padrão
  };

  // Determina a classe da borda com base no tipo e urgência
  const getNotificationItemClasses = (notification) => {
    let classes = `notification-item ${notification.tipo}`;
    if (notification.urgente && !notification.lida) {
      classes += ' urgente';
    }
    if (notification.lida) {
      classes += ' lida';
    }
    // Para status de pagamento, você pode ter um campo específico na notificação
    // Ex: if (notification.tipo === 'status_pagamento' && notification.dados_pagamento.status === 'pendente')
    // Para o exemplo, vamos usar o 'status' que você tinha no mock, se o tipo for 'status_pagamento'
    if (notification.tipo === 'status_pagamento' && notification.status_cobranca) { // Supondo que 'status_cobranca' venha da API
        classes += ` ${notification.status_cobranca}`; // ex: 'pago' ou 'pendente'
    }

    return classes;
  };


  if (loading) {
    return (
      <div className="notifications-page">
        <Navbar />
        <main className="notifications-container">
          <h1 className="notifications-title"><FaBell className="title-icon" /> Notificações e Avisos</h1>
          <div className="loading-state">Carregando notificações...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-page">
        <Navbar />
        <main className="notifications-container">
          <h1 className="notifications-title"><FaBell className="title-icon" /> Notificações e Avisos</h1>
          <div className="error-state">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <Navbar />
      <main className="notifications-container">
        <h1 className="notifications-title">
          <FaBell className="title-icon" /> Notificações e Avisos
        </h1>

        {notificationsList.length > 0 && (
            <button 
                onClick={handleMarkAllAsRead} 
                className="btn-mark-all-read"
                disabled={markingAll || notificationsList.every(n => n.lida)}
            >
                {markingAll ? 'Marcando...' : <><FaRegListAlt /> Marcar todas como lidas</>}
            </button>
        )}

        {notificationsList.length === 0 ? (
          <div className="empty-state">Nenhuma notificação disponível no momento.</div>
        ) : (
          <section className="notifications-list">
            {notificationsList.map((notification) => (
              <div
                key={notification.id}
                className={getNotificationItemClasses(notification)}
                role="alert"
                aria-live={notification.urgente && !notification.lida ? "assertive" : "polite"}
              >
                <div className="notification-header">
                  <div className="notification-icon-wrapper">
                    {/* Ajustar 'notification.status_cobranca' se o nome do campo for diferente */}
                    {getNotificationIcon(notification.tipo, notification.status_cobranca)} 
                    {notification.titulo && <strong className="notification-title-text">{notification.titulo}</strong>}
                  </div>
                  <span className="notification-date">{formatDate(notification.data_criacao)}</span>
                </div>
                <p className="notification-message">{notification.message}</p>
                {notification.link_acao && notification.texto_link_acao && (
                  <a
                    href={notification.link_acao} // Idealmente, usar react-router Link se for rota interna
                    className="payment-link" // Reutilizando a classe, pode precisar de ajustes
                    target={notification.link_acao.startsWith('http') ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                  >
                    {notification.texto_link_acao}
                  </a>
                )}
                {!notification.lida && (
                  <button 
                    onClick={() => handleMarkAsRead(notification.id)} 
                    className="btn-mark-read"
                    disabled={markingId === notification.id}
                    aria-label={`Marcar notificação "${notification.titulo || notification.message.substring(0,20)}" como lida`}
                  >
                    {markingId === notification.id ? 'Marcando...' : <FaRegCheckCircle />}
                  </button>
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
