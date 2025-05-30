import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Base da API

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Autenticação ---
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/token/', { username, password });
    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    }
    return response.data;
  } catch (error) {
    console.error('Erro no login:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  delete api.defaults.headers.common['Authorization'];
  console.log('Usuário deslogado, tokens removidos.');
};

// --- Responsável ---
export const getLoggedInResponsavel = async () => {
  try {
    const response = await api.get('/responsavel/me/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do responsável logado:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
        logoutUser(); 
    }
    throw error;
  }
};

// --- Criança ---
export const getCriancasByResponsavelId = async (responsavelId) => {
  if (!responsavelId) return [];
  try {
    const response = await api.get(`/crianca/?responsavel_id=${responsavelId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar crianças para o responsável ID ${responsavelId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getCriancaById = async (id) => {
  try {
    const { data } = await api.get(`/crianca/${id}/`); 
    return data;
  } catch (error) {
    console.error(`Erro ao buscar criança com ID ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateCriancaProfilePicture = async (criancaId, fotoFile) => {
  const formData = new FormData();
  formData.append('foto', fotoFile);
  try {
    const response = await api.patch(`/crianca/${criancaId}/`, formData, { 
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar foto da criança ${criancaId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// --- Pacote ---
export const getPacoteById = async (id) => {
   if (!id) return null;
  try {
    const { data } = await api.get(`/pacote/${id}/`); 
    return data;
  } catch (error)
{
    console.error(`Erro ao buscar pacote com ID ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};


// --- Agenda Diária ---
export const getAgendaDiaria = async (criancaId, data) => {
  if (!criancaId || !data) return null;
  try {
    const response = await api.get(`/registros/?crianca__id=${criancaId}&data=${data}`);
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; 
    }
    console.error(`Erro ao buscar agenda para criança ${criancaId} na data ${data}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const saveAgendaDiaria = async (dadosAgenda, agendaId = null) => {
  try {
    if (agendaId) {
      const response = await api.patch(`/registros/${agendaId}/`, dadosAgenda);
      return response.data;
    } else {
      if (!dadosAgenda.crianca || !dadosAgenda.data) {
        throw new Error("ID da criança e data são obrigatórios para criar agenda.");
      }
      const response = await api.post(`/registros/`, dadosAgenda);
      return response.data;
    }
  } catch (error) {
    console.error(`Erro ao salvar agenda (ID: ${agendaId}):`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const reportAbsenceForAgenda = async (agendaId, justificativa = '') => {
  if (!agendaId) throw new Error("ID da agenda é obrigatório para informar falta.");
  try {
    const response = await api.patch(`/registros/${agendaId}/informar-falta/`, {
      justificativa_falta: justificativa,
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao informar falta para agenda ID ${agendaId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const saveParentObservationForAgenda = async (agendaId, observacao) => {
   if (!agendaId) throw new Error("ID da agenda é obrigatório para salvar observação.");
  try {
     const response = await api.patch(`/registros/${agendaId}/observacao-pais/`, {
       observacao_pais: observacao,
     });
    return response.data;
  } catch (error) {
    console.error(`Erro ao salvar observação para agenda ID ${agendaId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const uploadAnexoAgenda = async (agendaDiariaId, arquivoFile, descricao = '') => {
  if (!agendaDiariaId || !arquivoFile) throw new Error("ID da agenda e arquivo são obrigatórios.");
  
  const formData = new FormData();
  formData.append('agenda_diaria', agendaDiariaId);
  formData.append('arquivo', arquivoFile);
  if (descricao) {
    formData.append('descricao', descricao);
  }

  try {
    const response = await api.post(`/anexos/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao fazer upload de anexo para agenda ID ${agendaDiariaId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// --- Pagamentos ---
export const getCurrentPaymentStatus = async () => {
  try {
    const response = await api.get('/cobrancas/status-atual/');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; 
    }
    console.error('Erro ao buscar status atual do pagamento:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getPaymentHistory = async () => {
  try {
    const response = await api.get('/cobrancas/');
    return response.data.results || response.data; 
  } catch (error) {
    console.error('Erro ao buscar histórico de pagamentos:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Funções de pagamento (placeholders, mas exportadas)
export const requestPixPayment = async (cobrancaId) => {
  console.log(`API: Solicitando PIX para cobrança ID: ${cobrancaId}`);
  // return api.post(`/cobrancas/${cobrancaId}/pagar_pix/`); // Ou pagar-pix/ se url_path for usado
  return Promise.resolve({ detail: "PIX solicitado (simulado)", qr_code_data: "simulated_qr_code_123" });
};

export const getBoletoLink = async (cobrancaId) => {
  console.log(`API: Solicitando link do boleto para cobrança ID: ${cobrancaId}`);
  // return api.get(`/cobrancas/${cobrancaId}/gerar_boleto/`); // Ou gerar-boleto/
  return Promise.resolve({ detail: "Link do boleto (simulado)", link_boleto: "https://simulado.com/boleto/123" });
};

export const processCardPayment = async (cobrancaId, cardDetails) => {
  console.log(`API: Processando cartão para cobrança ID: ${cobrancaId}`, cardDetails);
  // return api.post(`/cobrancas/${cobrancaId}/pagar_cartao/`, cardDetails); // Ou pagar-cartao/
  return Promise.resolve({ detail: "Pagamento com cartão processado (simulado)", status: "aprovado" });
};


// --- Notificações ---
export const getNotificacoes = async () => {
  try {
    // CORREÇÃO: URL base para notificações é /notificacoes/
    const response = await api.get('/notificacoes/'); 
    return response.data.results || response.data; 
  } catch (error) {
    console.error('Erro ao buscar notificações:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const marcarNotificacaoComoLida = async (notificacaoId) => {
  if (!notificacaoId) throw new Error("ID da notificação é obrigatório.");
  try {
    // CORREÇÃO: URL para action marcar-lida (ou marcar_lida se url_path não for usado no backend)
    const response = await api.patch(`/notificacoes/${notificacaoId}/marcar-lida/`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao marcar notificação ${notificacaoId} como lida:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const marcarTodasNotificacoesComoLidas = async () => {
  try {
    // CORREÇÃO: URL para action marcar-todas-lidas (ou marcar_todas_lidas)
    const response = await api.post('/notificacoes/marcar-todas-lidas/');
    return response.data;
  } catch (error) {
    console.error('Erro ao marcar todas as notificações como lidas:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default api;
