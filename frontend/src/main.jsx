import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ChildProfile from './pages/ChildProfile.jsx';
import DailyAgenda from './pages/DailyAgenda.jsx';
import Notifications from './pages/Notifications.jsx';
import Payments from './pages/Payments.jsx';
import './index.css';

// Componente para proteger rotas
const ProtectedRoute = ({ children }) => {
  // CORREÇÃO AQUI: Verificar a existência do 'accessToken'
  const isAuthenticated = !!localStorage.getItem('accessToken'); // !! converte para booleano

  if (!isAuthenticated) {
    // Redireciona para login se não estiver autenticado
    // Adiciona o estado para redirecionar de volta após o login, se desejado
    return <Navigate to="/login" replace />;
    // Se quiser redirecionar para a página que tentou acessar após o login:
    // return <Navigate to="/login" state={{ from: location }} replace />;
    // (Para usar 'location', você precisaria importar 'useLocation' de 'react-router-dom' aqui)
  }

  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Redireciona raiz para login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rotas protegidas - agora devem funcionar após o login */}
        <Route
          path="/childprofile"
          element={
            <ProtectedRoute>
              <ChildProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dailyagenda"
          element={
            <ProtectedRoute>
              <DailyAgenda />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);