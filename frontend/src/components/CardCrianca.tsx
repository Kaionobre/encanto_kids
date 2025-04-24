import React from 'react';
import { Crianca, Responsavel } from '../types/models';
import '../css/CardCrianca.css';

interface Props {
  crianca: Crianca;
  responsavel?: Responsavel;
}

export const CardCrianca: React.FC<Props> = ({ crianca, responsavel }) => (
  <div className="card-crianca">
    <img
      src="../../public/download.jpg"
      alt={crianca.nome}
    />
    <div className="info">
      <p className="nome">{crianca.nome}</p>
      <p><strong>Turno:</strong> {crianca.turno}</p>
      <p><strong>Responsável:</strong> {responsavel?.nome || 'Desconhecido'}</p>
    </div>
  </div>
);
