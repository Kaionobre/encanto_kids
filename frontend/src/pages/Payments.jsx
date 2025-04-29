import React from 'react';
import '../styles/Payments.css';
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaBarcode,
  FaQrcode,
  FaCheckCircle,
  FaTimesCircle,
  FaFileDownload,
} from 'react-icons/fa';
import Navbar from '../components/Navbar';

// Dados fictícios para status e histórico
const paymentStatus = {
  month: 'Outubro/2025',
  status: 'Pendente',
  amount: 'R$ 1.500,00',
  dueDate: '05/11/2025',
};

const paymentHistory = [
  { id: 1, month: 'Setembro/2025', amount: 'R$ 1.500,00', status: 'Pago', date: '05/10/2025' },
  { id: 2, month: 'Agosto/2025', amount: 'R$ 1.500,00', status: 'Pago', date: '05/09/2025' },
  { id: 3, month: 'Julho/2025', amount: 'R$ 1.500,00', status: 'Pendente', date: '05/08/2025' },
];

function Payments() {
  const handlePayment = (method) => {
    console.log(`Iniciando pagamento via ${method}`);
    // Adicionar lógica de integração com gateway de pagamento
  };

  const handleDownloadBoleto = () => {
    console.log('Baixando boleto');
    // Adicionar lógica para download do boleto
  };

  return (
    <div className="payments-page">
      <Navbar />
      <main className="payments-container">
        <h1 className="payments-title">Gerenciamento de Pagamentos</h1>

        {/* Status Atual */}
        <section className="status-section">
          <h2>Status Atual - {paymentStatus.month}</h2>
          <div className="status-widget">
            <div className="status-info">
              <FaMoneyBillWave className="status-icon" />
              <div>
                <h3>Valor: {paymentStatus.amount}</h3>
                <p>Vencimento: {paymentStatus.dueDate}</p>
                <p>
                  Status:{' '}
                  <span className={paymentStatus.status === 'Pago' ? 'status-paid' : 'status-pending'}>
                    {paymentStatus.status === 'Pago' ? (
                      <FaCheckCircle className="status-indicator" />
                    ) : (
                      <FaTimesCircle className="status-indicator" />
                    )}
                    {paymentStatus.status}
                  </span>
                </p>
              </div>
            </div>
            {paymentStatus.status === 'Pendente' && (
              <div className="payment-actions">
                <button
                  className="action-btn pix"
                  onClick={() => handlePayment('PIX')}
                  aria-label="Pagar com PIX"
                >
                  <FaQrcode /> Pagar com PIX
                </button>
                <button
                  className="action-btn boleto"
                  onClick={() => handlePayment('Boleto')}
                  aria-label="Pagar com Boleto"
                >
                  <FaBarcode /> Pagar com Boleto
                </button>
                <button
                  className="action-btn card"
                  onClick={() => handlePayment('Cartão')}
                  aria-label="Pagar com Cartão"
                >
                  <FaCreditCard /> Pagar com Cartão
                </button>
                <a
                  href="#"
                  className="boleto-link"
                  onClick={handleDownloadBoleto}
                  aria-label="Baixar boleto"
                >
                  <FaFileDownload /> Baixar Boleto
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Histórico de Pagamentos */}
        <section className="history-section">
          <h2>Histórico de Pagamentos</h2>
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.month}</td>
                    <td>{payment.amount}</td>
                    <td>
                      <span className={payment.status === 'Pago' ? 'status-paid' : 'status-pending'}>
                        {payment.status === 'Pago' ? (
                          <FaCheckCircle className="status-indicator" />
                        ) : (
                          <FaTimesCircle className="status-indicator" />
                        )}
                        {payment.status}
                      </span>
                    </td>
                    <td>{payment.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Payments;
