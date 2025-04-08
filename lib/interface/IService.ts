export interface IService {
  id: number;
  modelo: string;
  categoria: string;
  equipamentoID: string;
  equipamentoDescricao: string;
  codService: string;
  DataCadastro: string;
  idCliente: string;
  descCliente: string;
  status: 'Não iniciado' | 'Em desenvolvimento' | 'Em progresso' | 'Concluído';
  itemService: string;
}
