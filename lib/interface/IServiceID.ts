export interface IServiceID {
  servico_peca_id: number;
  codService: string;
  quantidade_peca: number;
  servico_id: number | null;
  idCliente: string;
  insVisual: string;
  manuPreventiva: number;
  manuPrevTomada: number;
  itemService: string;

  // Equipamento
  equipamento_id: number;
  equipamento_ItemID: number;
  equipamento_Descricao: string;
  Categoria: string;
  equipamento_DataCadastro: string; // ISO date string
  equipamento_Modelo: string;

  // Peça
  peca_id: number;
  peca_ItemID: number;
  Carcaca: string;
  Visor: string;
  NumeroItem: number;
  peca_Quantidade: number;
  peca_Descricao: string;
  Codigo: string;
  Observacao: string;
  peca_DataCadastro: string | null;
  valorPeca: string;
  nSeriePlaca: string;
  protocolo: string;
  nSerieSensor: string;
  faixaSensor: string;
  dataFabricacao: string | null;
  modeloPlaca: string;
}
