import React, { useState, useEffect, useCallback } from 'react';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";
import { FaCheckCircle, FaTimesCircle, FaUtensils, FaSmile, FaMusic, FaEnvelope, FaPaperclip, FaExclamationTriangle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { 
  getLoggedInResponsavel, 
  getCriancasByResponsavelId, 
  getAgendaDiaria,
  saveAgendaDiaria,
  reportAbsenceForAgenda,
  saveParentObservationForAgenda
  // uploadAnexoAgenda não será mais usado aqui pelos pais
} from '../services/api';
import '../styles/DailyAgenda.css';

registerLocale('pt-BR', ptBR);
setDefaultLocale('pt-BR');

const formatDateForAPI = (date) => {
  if (!date) return '';
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

// Componente Modal Simples
const JustificationModal = ({ isOpen, onClose, onSubmit, justification, setJustification, saving }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(justification);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Informar Justificativa da Falta</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Digite a justificativa (opcional)"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows="4"
            className="modal-textarea"
            disabled={saving}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-modal btn-cancel" disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal btn-confirm" disabled={saving}>
              {saving ? 'Enviando...' : 'Confirmar Falta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


function DailyAgenda() {
  const [currentUser, setCurrentUser] = useState(null);
  const [criancas, setCriancas] = useState([]);
  const [selectedCrianca, setSelectedCrianca] = useState(null);
  const [datePickerSelectedDate, setDatePickerSelectedDate] = useState(new Date()); 
  const [apiFormattedDate, setApiFormattedDate] = useState(formatDateForAPI(new Date()));
  const [agendaData, setAgendaData] = useState(null);
  const [observacaoInput, setObservacaoInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Estados para o modal de justificativa de falta
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [absenceJustificationInput, setAbsenceJustificationInput] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const responsavel = await getLoggedInResponsavel();
        setCurrentUser(responsavel);
        if (responsavel && responsavel.id) {
          const suasCriancas = await getCriancasByResponsavelId(responsavel.id);
          setCriancas(suasCriancas);
          if (suasCriancas.length > 0) {
            setSelectedCrianca(suasCriancas[0]);
          } else {
            setError("Nenhuma criança encontrada para este responsável.");
            setLoading(false);
          }
        } else {
           setError("Não foi possível identificar o responsável.");
           setLoading(false);
        }
      } catch (err) {
        setError("Erro ao carregar dados iniciais.");
        console.error(err);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchAgendaData = useCallback(async () => {
    if (!selectedCrianca || !apiFormattedDate) {
      setAgendaData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getAgendaDiaria(selectedCrianca.id, apiFormattedDate);
      setAgendaData(data);
      setObservacaoInput(data?.observacao_pais || '');
    } catch (err) {
      setError("Erro ao carregar dados da agenda.");
      console.error(err);
      setAgendaData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedCrianca, apiFormattedDate]);

  useEffect(() => {
    if (selectedCrianca) {
      fetchAgendaData();
    }
  }, [fetchAgendaData, selectedCrianca]);


  const handleDatePickerChange = (date) => {
    setDatePickerSelectedDate(date);
    setApiFormattedDate(formatDateForAPI(date));
  };

  const handleCriancaChange = (event) => {
    const criancaId = parseInt(event.target.value, 10);
    const crianca = criancas.find(c => c.id === criancaId);
    setSelectedCrianca(crianca);
  };

  const handleSaveObservacao = async () => {
    if (!selectedCrianca) {
      setError("Selecione uma criança.");
      return;
    }
    
    setSaving(true);
    setError(null);
    try {
      let currentAgenda = agendaData;
      if (!currentAgenda) {
        currentAgenda = await saveAgendaDiaria({
          crianca: selectedCrianca.id,
          data: apiFormattedDate,
          observacao_pais: observacaoInput,
          presente: true, 
        });
      } else {
        currentAgenda = await saveParentObservationForAgenda(currentAgenda.id, observacaoInput);
      }
      setAgendaData(currentAgenda);
      // Substituir alert por uma notificação mais elegante no futuro
      alert("Observação salva com sucesso!"); 
    } catch (err) {
      setError("Erro ao salvar observação.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  
  const openAbsenceModal = () => {
    if (!selectedCrianca) {
      setError("Selecione uma criança.");
      return;
    }
    setAbsenceJustificationInput(agendaData?.justificativa_falta || ''); // Preenche com justificativa existente
    setShowAbsenceModal(true);
  };

  const handleConfirmAbsence = async (justificativa) => {
    setSaving(true);
    setError(null);
    try {
      let currentAgenda = agendaData;
      if (!currentAgenda) {
         currentAgenda = await saveAgendaDiaria({
          crianca: selectedCrianca.id,
          data: apiFormattedDate,
          presente: false,
          justificativa_falta: justificativa || '',
          // Outros campos serão limpos pelo backend
        });
      } else {
        currentAgenda = await reportAbsenceForAgenda(currentAgenda.id, justificativa || '');
      }
      setAgendaData(currentAgenda); // Atualiza com os dados do backend (que devem estar limpos)
      setShowAbsenceModal(false);
      // Substituir alert por uma notificação mais elegante no futuro
      alert("Falta informada com sucesso! Os detalhes da agenda foram atualizados.");
    } catch (err) {
      setError("Erro ao informar falta.");
      console.error(err);
      // Não fecha o modal em caso de erro para o usuário tentar novamente
    } finally {
      setSaving(false);
    }
  };

  const displayDate = apiFormattedDate 
    ? new Date(apiFormattedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      })
    : 'Selecione uma data';

  if (loading && !selectedCrianca) return (
    <div className="agenda-page">
      <Navbar />
      <main className="agenda-container"><p className="text-center text-xl py-10">Carregando dados iniciais...</p></main>
    </div>
  );

  if (!selectedCrianca && !loading && criancas.length === 0 && currentUser) return (
     <div className="agenda-page">
      <Navbar />
      <main className="agenda-container"><p className="text-center text-xl py-10">Nenhuma criança cadastrada para este responsável.</p></main>
    </div>
  );
  
  if (!selectedCrianca && !loading && criancas.length > 0) return (
     <div className="agenda-page">
      <Navbar />
      <main className="agenda-container">
        <p className="text-center text-xl py-10">Por favor, selecione uma criança para ver a agenda.</p>
        {criancas.length > 0 && (
            <div className="agenda-section selector-section">
                <label htmlFor="crianca-selector" className="selector-label">Selecione a Criança:</label>
                <select id="crianca-selector" value={selectedCrianca?.id || ''} onChange={handleCriancaChange} className="selector-input">
                <option value="" disabled>-- Escolha uma criança --</option>
                {criancas.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
                </select>
            </div>
        )}
      </main>
    </div>
  );

  return (
    <div className="agenda-page">
      <Navbar />
      <main className="agenda-container">
        <h1 className="agenda-title">
          Agenda Diária {selectedCrianca ? `- ${selectedCrianca.nome}` : ''}
        </h1>

        <div className="agenda-selectors">
          {criancas.length > 1 && (
            <div className="selector-group">
              <label htmlFor="crianca-selector">Criança:</label>
              <select id="crianca-selector" value={selectedCrianca?.id || ''} onChange={handleCriancaChange}>
                {criancas.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
          )}
          <div className="selector-group">
            <label htmlFor="data-selector">Data:</label>
            <DatePicker
              selected={datePickerSelectedDate}
              onChange={handleDatePickerChange}
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              id="data-selector"
              className="datepicker-input"
            />
          </div>
        </div>
        
        {error && <p className="error-message text-center text-red-500 py-2">{error}</p>}
        {loading && <p className="text-center text-lg py-5">Carregando agenda do dia...</p>}

        {!loading && !agendaData && selectedCrianca && (
          <div className="agenda-section">
            <p>Nenhum registro de agenda para {selectedCrianca?.nome} em {displayDate}.</p>
          </div>
        )}

        {agendaData && !loading && (
          <section className="agenda-sections">
            <div className="agenda-section presence">
              <h2>
                {agendaData.presente ? (
                  <FaCheckCircle className="icon presence-confirmed" />
                ) : (
                  <FaTimesCircle className="icon presence-absent" />
                )} Presença
              </h2>
              {agendaData.presente ? (
                <p>✔️ Confirmada</p>
              ) : (
                <p className="text-absent">
                  Ausente {agendaData.justificativa_falta ? `- Justificativa: ${agendaData.justificativa_falta}` : ''}
                </p>
              )}
            </div>
            {/* Seção Alimentação (mostra apenas se presente) */}
            {agendaData.presente && (
              <div className="agenda-section">
                <h2><FaUtensils className="icon" /> Alimentação</h2>
                <p>{agendaData.alimentacao_detalhes || 'Nenhum detalhe de alimentação registrado.'}</p>
              </div>
            )}

            {/* Seção Comportamento (mostra apenas se presente) */}
            {agendaData.presente && (
              <div className="agenda-section">
                <h2><FaSmile className="icon" /> Comportamento</h2>
                <p>{agendaData.comportamento_notas || 'Nenhuma nota de comportamento registrada.'}</p>
              </div>
            )}

            {/* Seção Atividades (mostra apenas se presente) */}
            {agendaData.presente && (
              <div className="agenda-section">
                <h2><FaMusic className="icon" /> Atividades</h2>
                <p>{agendaData.atividades_descricao || 'Nenhuma atividade registrada.'}</p>
              </div>
            )}
            
            {/* Seção Recado (mostra apenas se presente) */}
            {agendaData.presente && (
                <div className="agenda-section">
                    <h2><FaEnvelope className="icon" /> Recado da Equipe</h2>
                    <p>{agendaData.recado_equipe || 'Nenhum recado da equipe.'}</p>
                </div>
            )}


            <div className="agenda-section attachments-section">
              <h2><FaPaperclip className="icon" /> Anexos (Visualização)</h2>
              {agendaData.anexos && agendaData.anexos.length > 0 ? (
                <div className="attachments">
                  {agendaData.anexos.map(anexo => (
                    <div key={anexo.id} className="attachment-item">
                      {anexo.arquivo_url && (anexo.arquivo_url.endsWith('.mp4') || anexo.arquivo_url.endsWith('.webm')) ? (
                        <video src={anexo.arquivo_url} className="attachment" controls aria-label={anexo.descricao || 'Vídeo da atividade'} />
                      ) : anexo.arquivo_url ? (
                        <img src={anexo.arquivo_url} alt={anexo.descricao || 'Anexo da agenda'} className="attachment" />
                      ) : (
                        <p>Link do anexo indisponível</p>
                      )}
                      {anexo.descricao && <p className="attachment-description">{anexo.descricao}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nenhum anexo para este dia.</p>
              )}
              {/* REMOVIDO: Input de upload de anexo pelos pais */}
            </div>

            <div className="agenda-section observations">
              <h2>Observações dos Pais</h2>
              <textarea
                placeholder="Adicione suas observações aqui..."
                rows="4"
                value={observacaoInput}
                onChange={(e) => setObservacaoInput(e.target.value)}
                aria-label="Campo para observações dos pais"
                disabled={saving || (agendaData && !agendaData.presente)} // Desabilita se ausente
              ></textarea>
              <button 
                onClick={handleSaveObservacao} 
                className="btn-save-observation" 
                disabled={saving || (agendaData && !agendaData.presente)} // Desabilita se ausente
              >
                {saving ? 'Salvando...' : 'Salvar Observação'}
              </button>
            </div>

            <button 
              className="btn-report-absence" 
              onClick={openAbsenceModal} // Abre o modal
              disabled={saving || (agendaData && !agendaData.presente)}
            >
              <FaExclamationTriangle /> {agendaData && !agendaData.presente ? 'Falta Já Informada' : 'Informar Falta'}
            </button>
          </section>
        )}
      </main>
      <JustificationModal
        isOpen={showAbsenceModal}
        onClose={() => setShowAbsenceModal(false)}
        onSubmit={handleConfirmAbsence}
        justification={absenceJustificationInput}
        setJustification={setAbsenceJustificationInput}
        saving={saving}
      />
    </div>
  );
}

export default DailyAgenda;
