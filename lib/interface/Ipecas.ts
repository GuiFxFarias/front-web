export interface Item {
  ID: number;
  ItemID: number;
  Carcaca: string;
  sensorPlaca: string;
  Visor: string;
  NumeroItem: number;
  Quantidade: number;
  Descricao: string;
  Codigo: string;
  Observacao: string | null;
  DataCadastro: string;
  valorPeca: string;
  nSeriePlaca: string | null;
  protocolo: string | null;
  nSerieSensor: string | null;
  faixaSensor: string | null;
  dataFabricacao: string | null;
  modeloPlaca: string | null;
}
