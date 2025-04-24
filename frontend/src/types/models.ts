export interface Pacote {
    id: number;
    nome: string;
    tipo: 'avulso' | 'meio' | 'integral';
    status: 'ativo' | 'inativo';
  }
  
  export interface Responsavel {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
  }
  
  export interface Crianca {
    id: number;
    nome: string;
    idade: number;
    turno: 'manha' | 'tarde' | 'integral';
    tipo_de_pacote: number | Pacote;
    status: boolean;
    responsavel: number | Responsavel;
  }
  
  export interface Contrato {
    id: number;
    crianca: number | Crianca;
    data_assinatura: string;
    data_validade: string;
    observacoes?: string;
  }
  