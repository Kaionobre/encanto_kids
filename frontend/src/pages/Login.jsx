import React from 'react'
import '../styles/Login.css'
import Logo from '../assets/images/LOGO - ENCANTO KIDS 3.png'

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault() // Impede o recarregamento da página

    const form = new FormData(e.target)
    const cpf = form.get('cpf')
    const senha = form.get('senha')

    console.log('CPF:', cpf)
    console.log('Senha:', senha)
    // Aqui você pode fazer a autenticação ou redirecionamento
  }

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
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-form-group">
                <label htmlFor="cpf">CPF:</label>
                <input type="text" id="cpf" name="cpf" placeholder="Digite seu CPF" />
              </div>

              <div className="login-form-group">
                <label htmlFor="senha">Senha:</label>
                <input type="password" id="senha" name="senha" placeholder="Digite sua senha" />
                <a href="#" className="forgot-password-link">Esqueceu sua senha?</a>
              </div>

              <button type="submit" className="login-button">ENTRAR</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login
