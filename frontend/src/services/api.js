import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Criança
export const getCriancas = async () => {
  const { data } = await api.get('/crianca/');
  return data;
};

export const getCriancaById = async (id) => {
  const { data } = await api.get(`/crianca/${id}/`);
  return data;
};

// Pacote
export const getPacotes = async () => {
  const { data } = await api.get('/pacote/');
  return data;
};

export const getPacoteById = async (id) => {
  const { data } = await api.get(`/pacote/${id}/`);
  return data;
};

// Responsável
export const getResponsaveis = async () => {
  const { data } = await api.get('/responsavel/');
  return data;
};

export const getResponsavelById = async (id) => {
  const { data } = await api.get(`/responsavel/${id}/`);
  return data;
};

// Contrato
export const getContratos = async () => {
  const { data } = await api.get('/contrato/');
  return data;
};
