export interface ICliente {
  id: number;
  nome: string;
  cnpj: string;
  nome_responsavel: string;
  email: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  data_criacao: Date;
}
