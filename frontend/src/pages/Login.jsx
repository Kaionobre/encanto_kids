import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import Logo from '../assets/images/LOGO - ENCANTO KIDS 3.png';
import { loginUser } from '../services/api'; // Importa a função de login

function Login() {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState(''); // Este será enviado como 'username'
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Máscara para CPF
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!cpf || !senha) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const cpfSemMascara = cpf.replace(/\D/g, '');
      await loginUser(cpfSemMascara, senha);

      console.log('Login bem-sucedido!');
      navigate('/childprofile');

      } catch (err) {
      console.error('Falha no login:', err);
      if (err.response && err.response.data) {
        const apiError = err.response.data.detail || err.response.data.non_field_errors;
        if (apiError) {
          setError(Array.isArray(apiError) ? apiError.join(', ') : apiError);
        } else {
          setError('CPF ou senha inválidos. Verifique seus dados.');
        }
      } else {
        setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="logo-wrapper">
            <img src={Logo} alt="Logo Encanto Kids" />
          </div>
          <p>
            Acesse sua conta e acompanhe tudo sobre o hotelzinho do seu pequeno.
          </p>
        </div>
      </aside>

      <main className="login-main">
        <div className="login-content">
          <h1 className="welcome-message">Bem-vindo(a) de volta!</h1>

          <div className="login-container">
            <h2 className="login-header">Acesse sua conta</h2>
            {error && <p className="error-message">{error}</p>}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-form-group">
                <label htmlFor="cpf">CPF:</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  maxLength={14}
                  disabled={loading}
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="senha">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={loading}
                />
                <a href="/forgot-password" className="forgot-password-link">
                  Esqueceu sua senha?
                </a>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'ENTRANDO...' : 'ENTRAR'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
