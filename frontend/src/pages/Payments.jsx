import React, { useState, useEffect } from 'react';
import '../styles/Payments.css';
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaBarcode,
  FaQrcode,
  FaCheckCircle,
  FaTimesCircle,
  FaFileDownload,
  FaSpinner, // Ícone para loading
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { 
  getCurrentPaymentStatus, 
  getPaymentHistory,
  requestPixPayment, // Placeholder
  getBoletoLink,      // Placeholder
  processCardPayment // Placeholder
} from '../services/api';

// Função para formatar data para DD/MM/YYYY
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  // Adiciona 'T00:00:00' para evitar problemas de fuso ao converter
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Função para formatar valores monetários
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};


function Payments() {
  const [currentStatus, setCurrentStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [errorHistory, setErrorHistory] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(null); // Para feedback de qual pagamento está processando

  useEffect(() => {
    const fetchStatus = async () => {
      setLoadingStatus(true);
      setErrorStatus(null);
      try {
        const statusData = await getCurrentPaymentStatus();
        setCurrentStatus(statusData);
      } catch (err) {
        console.error("Erro ao buscar status atual:", err);
        setErrorStatus("Não foi possível carregar o status atual.");
      } finally {
        setLoadingStatus(false);
      }
    };

    const fetchHistory = async () => {
      setLoadingHistory(true);
      setErrorHistory(null);
      try {
        const historyData = await getPaymentHistory();
        setHistory(historyData || []); // Garante que seja um array
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
        setErrorHistory("Não foi possível carregar o histórico de pagamentos.");
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchStatus();
    fetchHistory();
  }, []);

  const handlePayment = async (method, cobrancaId) => {
    if (!cobrancaId) {
        alert("Informação da cobrança não encontrada para iniciar o pagamento.");
        return;
    }
    setPaymentProcessing(method); // Indica qual método está sendo processado
    console.log(`Iniciando pagamento via ${method} para cobrança ID: ${cobrancaId}`);
    try {
      let result;
      if (method === 'PIX') {
        result = await requestPixPayment(cobrancaId);
        // Aqui você exibiria o QR Code ou o código Copia e Cola retornado em 'result'
        alert(`PIX Solicitado: ${result.qr_code_data || result.detail}`);
      } else if (method === 'Boleto') {
        result = await getBoletoLink(cobrancaId);
         // Se o backend retornar o link direto, você pode abrir em nova aba
        if(result.link_boleto) {
            window.open(result.link_boleto, '_blank');
        } else {
            alert(`Boleto: ${result.detail}`);
        }
      } else if (method === 'Cartão') {
        // Para cartão, você precisaria de um formulário para coletar os dados do cartão
        // e enviar para 'processCardPayment'. Por enquanto, é simulado.
        result = await processCardPayment(cobrancaId, { cardNumber: 'xxxx', expiry: 'xx/xx', cvv: 'xxx'});
        alert(`Cartão: ${result.detail} - Status: ${result.status}`);
      }
      // Idealmente, após uma tentativa de pagamento, você re-validaria o status da cobrança
      // const statusData = await getCurrentPaymentStatus();
      // setCurrentStatus(statusData);
    } catch (paymentError) {
      console.error(`Erro ao processar pagamento via ${method}:`, paymentError);
      alert(`Falha ao processar pagamento via ${method}. Tente novamente.`);
    } finally {
      setPaymentProcessing(null);
    }
  };

  const handleDownloadBoleto = async () => {
    if (currentStatus && currentStatus.link_boleto) {
      window.open(currentStatus.link_boleto, '_blank');
    } else if (currentStatus && currentStatus.id) {
        setPaymentProcessing('DownloadBoleto');
        try {
            const result = await getBoletoLink(currentStatus.id);
            if(result.link_boleto) {
                window.open(result.link_boleto, '_blank');
            } else {
                alert("Link do boleto não disponível no momento.");
            }
        } catch (error) {
            alert("Erro ao tentar obter o link do boleto.");
        } finally {
            setPaymentProcessing(null);
        }
    } else {
      alert('Nenhum boleto disponível para download no status atual.');
    }
  };

  const renderStatusWidget = () => {
    if (loadingStatus) return <div className="status-widget-loading"><FaSpinner className="spinner-icon" /> Carregando status...</div>;
    if (errorStatus) return <div className="status-widget-error">{errorStatus}</div>;
    if (!currentStatus) return <div className="status-widget-empty">Nenhuma cobrança atual encontrada.</div>;

    const isPendente = currentStatus.status === 'pendente' || currentStatus.status === 'atrasado';

    return (
      <div className="status-widget">
        <div className="status-info">
          <FaMoneyBillWave className="status-icon" />
          <div>
            <h3>Valor: {formatCurrency(currentStatus.valor)}</h3>
            <p>Referência: {currentStatus.mes_referencia_formatado || formatDate(currentStatus.mes_referencia)}</p>
            <p>Vencimento: {formatDate(currentStatus.data_vencimento)}</p>
            <p>
              Status:{' '}
              <span className={currentStatus.status === 'pago' ? 'status-paid' : 'status-pending'}>
                {currentStatus.status === 'pago' ? (
                  <FaCheckCircle className="status-indicator" />
                ) : (
                  <FaTimesCircle className="status-indicator" />
                )}
                {currentStatus.status.charAt(0).toUpperCase() + currentStatus.status.slice(1)}
              </span>
            </p>
          </div>
        </div>
        {isPendente && (
          <div className="payment-actions">
            <button
              className="action-btn pix"
              onClick={() => handlePayment('PIX', currentStatus.id)}
              disabled={paymentProcessing === 'PIX'}
              aria-label="Pagar com PIX"
            >
              {paymentProcessing === 'PIX' ? <FaSpinner className="spinner-icon-btn" /> : <FaQrcode />} Pagar com PIX
            </button>
            <button
              className="action-btn boleto"
              onClick={() => handlePayment('Boleto', currentStatus.id)}
              disabled={paymentProcessing === 'Boleto'}
              aria-label="Gerar Boleto"
            >
              {paymentProcessing === 'Boleto' ? <FaSpinner className="spinner-icon-btn" /> : <FaBarcode />} Gerar Boleto
            </button>
            {/* <button
              className="action-btn card"
              onClick={() => handlePayment('Cartão', currentStatus.id)}
              disabled={paymentProcessing === 'Cartão'}
              aria-label="Pagar com Cartão"
            >
              {paymentProcessing === 'Cartão' ? <FaSpinner className="spinner-icon-btn" /> : <FaCreditCard />} Pagar com Cartão
            </button> */}
            {currentStatus.link_boleto && (
                 <a
                    href="#"
                    className="boleto-link"
                    onClick={(e) => {e.preventDefault(); handleDownloadBoleto();}}
                    aria-label="Baixar boleto"
                    disabled={paymentProcessing === 'DownloadBoleto'}
                >
                    {paymentProcessing === 'DownloadBoleto' ? <FaSpinner className="spinner-icon-btn" /> : <FaFileDownload />} Baixar Boleto
                </a>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderHistoryTable = () => {
    if (loadingHistory) return <div className="history-loading"><FaSpinner className="spinner-icon" /> Carregando histórico...</div>;
    if (errorHistory) return <div className="history-error">{errorHistory}</div>;
    if (history.length === 0) return <div className="history-empty">Nenhum pagamento no histórico.</div>;

    return (
      <div className="history-table">
        <table>
          <thead>
            <tr>
              <th>Mês Ref.</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Data Venc.</th>
              <th>Data Pag.</th>
            </tr>
          </thead>
          <tbody>
            {history.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.mes_referencia_formatado || formatDate(payment.mes_referencia)}</td>
                <td>{formatCurrency(payment.valor)}</td>
                <td>
                  <span className={payment.status === 'pago' ? 'status-paid' : 'status-pending'}>
                    {payment.status === 'pago' ? (
                      <FaCheckCircle className="status-indicator" />
                    ) : (
                      <FaTimesCircle className="status-indicator" />
                    )}
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </td>
                <td>{formatDate(payment.data_vencimento)}</td>
                <td>{payment.data_pagamento ? formatDate(payment.data_pagamento) : '---'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  return (
    <div className="payments-page">
      <Navbar />
      <main className="payments-container">
        <h1 className="payments-title">Gerenciamento de Pagamentos</h1>

        <section className="status-section">
          <h2>Status Atual</h2>
          {renderStatusWidget()}
        </section>

        <section className="history-section">
          <h2>Histórico de Pagamentos</h2>
          {renderHistoryTable()}
        </section>
      </main>
    </div>
  );
}

export default Payments;
