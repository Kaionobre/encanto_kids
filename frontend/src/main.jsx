import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import ChildProfile from './pages/ChildProfile.jsx'
import DailyAgenda from './pages/DailyAgenda.jsx'
import Notifications from './pages/Notifications.jsx'
import Dashboard from './pages/Dashboard.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/childprofile" element={<ChildProfile />} />
        <Route path="/dailyagenda" element={<DailyAgenda />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
