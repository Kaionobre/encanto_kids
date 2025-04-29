import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPassword.css';
import Logo from '../assets/images/LOGO - ENCANTO KIDS 3.png';

function ForgotPassword() {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formatCpf = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
    if (match) {
      return [match[1], match[2] && '.', match[2], match[3] && '.', match[3], match[4] && '-', match[4]]
        .filter(Boolean)
        .join('');
    }
    return value;
  };

  const handleCpfChange = (e) => {
    const formatted = formatCpf(e.target.value);
    setCpf(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!cpf) {
      setError('Por favor, insira o CPF');
      return;
    }

    console.log('Solicitando recuperação de senha para CPF:', cpf);
    setSuccess('Um e-mail com instruções para redefinir sua senha foi enviado.');
    setCpf('');
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="forgot-password-page">
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="logo-wrapper">
            <img src={Logo} alt="Logo Encanto Kids" />
          </div>
          <p>
            Recupere sua senha para continuar acompanhando o dia a dia do seu pequeno no Encanto Kids.
          </p>
        </div>
      </aside>

      <main className="forgot-password-main">
        <div className="forgot-password-content">
          <div className="forgot-password-container">
            <h2 className="forgot-password-header">Redefinir sua senha</h2>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <form className="forgot-password-form" onSubmit={handleSubmit}>
              <div className="forgot-password-form-group">
                <label htmlFor="cpf">CPF:</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  maxLength={14}
                />
              </div>
              <button type="submit" className="forgot-password-button">ENVIAR</button>
            </form>

            <button
              className="back-to-login-button"
              onClick={handleBackToLogin}
              aria-label="Voltar para o login"
            >
              Voltar ao Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
