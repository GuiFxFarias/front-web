export interface IService {
  id: number;
  modelo: string;
  categoria: string;
  itemIdEquip: string;
  equipamentoDescricao: string;
  equipamentoId: string;
  codService: string;
  DataCadastro: string;
  idCliente: string;
  descCliente: string;
  status: 'Não iniciado' | 'Em desenvolvimento' | 'Em progresso' | 'Concluído';
  itemService: string;
}
