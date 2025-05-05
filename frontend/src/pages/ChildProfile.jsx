import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCriancaById, getPacoteById, getResponsavelById } from '../services/api.js';
import Navbar from '../components/Navbar';
import '../styles/ChildProfile.css';

function ChildProfile() {
  const [crianca, setCrianca] = useState(null);
  const [pacoteNome, setPacoteNome] = useState('');
  const [responsavelNome, setResponsavelNome] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const c = await getCriancaById(3);
        setCrianca(c);
        if (c.tipo_de_pacote) {
          const p = await getPacoteById(c.tipo_de_pacote);
          setPacoteNome(p.nome);
        }
        if (c.responsavel) {
          const r = await getResponsavelById(c.responsavel);
          setResponsavelNome(r.nome);
        }
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados. Veja console.');
        setLoading(false);
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center text-xl py-10">Carregando...</div>;
  if (error)   return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="profile-page">
      <Navbar />
      <main className="container mx-auto p-4">
        <section className="card bg-white shadow-md rounded-lg flex flex-col md:flex-row">
          <div className="photo-section p-4">
            <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="Sem foto" className="rounded-full w-48 h-48 object-cover"/>
          </div>
          <div className="info-section p-4 flex-1">
            <h2 className="text-2xl font-bold mb-4">{crianca.nome}</h2>
            <div className="info-grid grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Idade:</strong> {crianca.idade} anos</p>
              <p><strong>Turno:</strong> {crianca.turno.charAt(0).toUpperCase() + crianca.turno.slice(1)}</p>
              <p><strong>Entrada:</strong> {crianca.turno === 'manha' ? '07h30' : '13h00'}</p>
              <p><strong>Saída:</strong>  {crianca.turno === 'manha' ? '12h00' : '18h00'}</p>
              <p><strong>Pacote:</strong> {pacoteNome || 'Nenhum'}</p>
              <p><strong>Responsável:</strong> {responsavelNome || 'Nenhum'}</p>
              <p><strong>Saldo de Horas:</strong> 20h restantes</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status ${crianca.status ? 'status-ativo' : 'status-inativo'}`}>
                  {crianca.status ? '🟢 Ativo' : '🔴 Inativo'}
                </span>
              </p>
            </div>
            <a href="#" className="contract-link text-blue-500 hover:underline mt-4 inline-block">
              Visualizar Contrato (PDF)
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ChildProfile;
