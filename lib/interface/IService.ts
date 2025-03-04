export interface IService {
  id: number;
  modelo: string;
  categoria: string;
  equipamentoID: string;
  equipamentoDescricao: string;
  codService: string;
  DataCadastro: Date;
  idCliente: string;
  descCliente: string;
  status: "Não iniciado" | "Em desenvolvimento" | "Concluído";
}
