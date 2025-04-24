import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Crianca, Contrato, Responsavel, Pacote } from '../types/models';
import { CardCrianca } from '../components/CardCrianca';
import { GraficoPacotes } from '../components/GraficoPacotes';
import '../css/VisaoGeral.css';

export const VisaoGeral: React.FC = () => {
  const [criancas, setCriancas] = useState<Crianca[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const hoje = new Date();

  useEffect(() => {
    api.get('/crianca').then(r => setCriancas(r.data));
    api.get('/contrato').then(r => setContratos(r.data));
    api.get('/responsavel').then(r => setResponsaveis(r.data));
    api.get('/pacote').then(r => setPacotes(r.data));
  }, []);

  const ativos = contratos
    .filter(c => new Date(c.data_validade) >= hoje)
    .map(c => {
      if (typeof c.crianca === 'number') {
        return criancas.find(cr => cr.id === c.crianca);
      }
      return c.crianca;
    })
    .filter(Boolean);

  const novos = [...criancas]
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);


  const contagem = ativos.reduce<Record<string, number>>((acc, crianca) => {
    if (!crianca) return acc;

    let nomePacote = 'Desconhecido';

    const pacote = crianca.tipo_de_pacote;

    if (typeof pacote === 'object' && pacote !== null && 'tipo' in pacote) {
      nomePacote = pacote.tipo.trim();
    } else if (typeof pacote === 'number') {
      const pacoteObj = pacotes.find(p => p.id === pacote);
      if (pacoteObj) {
        nomePacote = pacoteObj.tipo.trim();
      }
    }

    if (nomePacote !== '') {
      acc[nomePacote] = (acc[nomePacote] || 0) + 1;
    }

    return acc;
  }, {});

  const total = Object.values(contagem).reduce((sum, val) => sum + val, 0);
  const graficoData = Object.entries(contagem).map(([nome, value]) => ({
    nome: `${nome.charAt(0).toUpperCase() + nome.slice(1)} - ${Math.round((value / total) * 100)}%`,
    value,
  }));

  return (
    <div className="visao-geral">
      <div className="topbar">
        <h1>Encanto Kids</h1>
        <button>Sair</button>
      </div>

      <div className="cards-container">
        <section className="section">
          <h2>Novos cadastros</h2>
          {novos.map(c => (
            <CardCrianca
              key={c.id}
              crianca={c}
              responsavel={responsaveis.find(r => r.id === c.responsavel)}
            />
          ))}
        </section>

        <section className="section">
          <h2>Faltas do dia</h2>
          <div>——</div>
        </section>

        <aside className="stats">
          <div className="ativo-count">
            {ativos.length} Crianças com contrato ativo / {criancas.length} cadastradas
          </div>
          <h3>Pacotes Ativos</h3>
          <GraficoPacotes data={graficoData} />
        </aside>
      </div>
    </div>
  );
};
