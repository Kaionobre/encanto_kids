import React, { useState, useEffect, useRef } from 'react';
import { 
  getLoggedInResponsavel, 
  getCriancasByResponsavelId, 
  getPacoteById,
  updateCriancaProfilePicture
} from '../services/api.js';
import Navbar from '../components/Navbar';
import '../styles/ChildProfile.css';

// Ícone de câmera para overlay de upload
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 0h24v24H0z" fill="none"/>
    <circle cx="12" cy="12" r="3.2"/>
    <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
);

function ChildProfile() {
  const [crianca, setCrianca] = useState(null);
  const [pacoteNome, setPacoteNome] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const responsavelLogado = await getLoggedInResponsavel();
        if (!responsavelLogado?.id) {
          setError('Não foi possível identificar o responsável. Faça login novamente.');
          setLoading(false);
          return;
        }

        const criancasDoResponsavel = await getCriancasByResponsavelId(responsavelLogado.id);
        if (criancasDoResponsavel?.length > 0) {
          const primeiraCrianca = criancasDoResponsavel[0];
          setCrianca(primeiraCrianca);
          setImagePreview(primeiraCrianca.foto || null);

          if (primeiraCrianca.tipo_de_pacote_detalhes?.nome) {
            setPacoteNome(primeiraCrianca.tipo_de_pacote_detalhes.nome);
          } else if (primeiraCrianca.tipo_de_pacote) {
            const pacote = await getPacoteById(primeiraCrianca.tipo_de_pacote);
            setPacoteNome(pacote?.nome || 'Pacote não encontrado');
          } else {
            setPacoteNome('Nenhum pacote associado');
          }
        } else {
          setError('Nenhuma criança encontrada para este responsável.');
          setCrianca(null);
        }
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setError(err.response?.status === 401
          ? 'Sessão expirada ou inválida. Faça login novamente.'
          : 'Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem('accessToken')) {
      loadProfileData();
    } else {
      setError('Você não está logado. Faça login.');
      setLoading(false);
    }
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && crianca) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);

      setUploading(true);
      setError(null);
      try {
        const updatedCrianca = await updateCriancaProfilePicture(crianca.id, file);
        setCrianca(updatedCrianca);
        setImagePreview(updatedCrianca.foto);
      } catch (uploadError) {
        console.error('Erro no upload:', uploadError);
        setError('Falha ao enviar a foto. Tente novamente.');
        setImagePreview(crianca.foto || null);
      } finally {
        setUploading(false);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading) return (
    <div className="profile-page">
      <Navbar />
      <main className="container">
        <div className="loading-message">Carregando...</div>
      </main>
    </div>
  );

  if (error && !uploading) return (
    <div className="profile-page">
      <Navbar />
      <main className="container">
        <div className="error-message">{error}</div>
      </main>
    </div>
  );

  if (!crianca) return (
    <div className="profile-page">
      <Navbar />
      <main className="container">
        <p className="info-message">Nenhuma criança para exibir.</p>
      </main>
    </div>
  );

  return (
    <div className="profile-page">
      <Navbar />
      <main className="container"> 
        <section className="card-profile">
          <div className="child-identification-section">
            {/* Upload da foto */}
            <div
              className="profile-image-container"
              onClick={triggerFileInput}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && triggerFileInput()}
            >
              <img 
                src={imagePreview || "https://placehold.co/128x128/E8D8EA/606060?text=Sem+Foto"} 
                alt={crianca.nome} 
                className="profile-image-small"
              />
              <div className="profile-image-overlay">
                <CameraIcon />
                <span>Mudar foto</span>
              </div>
              {uploading && <div className="profile-image-uploading-indicator">Enviando...</div>}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              style={{ display: 'none' }} 
              disabled={uploading}
            />
            <h2 className="child-name-header">{crianca.nome}</h2>
          </div>

          {error && uploading && (
            <p className="upload-error-message">{error}</p>
          )}

          <hr className="divider-line" />

          {/* Informações do perfil */}
          <div className="info-details-section">
            <div className="info-grid-profile">
              <p><span className="info-label">Idade:</span> {crianca.idade} anos</p>
              <p><span className="info-label">Turno:</span> {crianca.turno?.charAt(0).toUpperCase() + crianca.turno?.slice(1)}</p>
              <p><span className="info-label">Entrada:</span> {
                crianca.turno === 'manha' ? '07h30' :
                crianca.turno === 'tarde' ? '13h00' :
                crianca.turno === 'integral' ? '07h30' : 'N/A'
              }</p>
              <p><span className="info-label">Saída:</span> {
                crianca.turno === 'manha' ? '12h00' :
                crianca.turno === 'tarde' ? '18h00' :
                crianca.turno === 'integral' ? '18h00' : 'N/A'
              }</p>
              <p><span className="info-label">Pacote:</span> {pacoteNome}</p>
              <p>
                <span className="info-label">Status Matrícula:</span>
                <span className={`status-tag-profile ${crianca.status ? 'status-ativo-profile' : 'status-inativo-profile'}`}>
                  {crianca.status ? '🟢 Ativo' : '🔴 Inativo'}
                </span>
              </p>
              <p>
                <span className="info-label">Status Pagamento:</span>
                <span className="status-tag-profile status-ok-profile">
                  🟢 OK
                </span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ChildProfile;
