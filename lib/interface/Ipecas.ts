export interface IPecas {
  ID: number;
  ItemID: number;
  Carcaca: string;
  Visor: string;
  NumeroItem: number;
  Quantidade: number;
  Descricao: string;
  Codigo: string;
  Observacao: string;
  DataCadastro: string; // Timestamp como string (ISO format)
  valorPeca: string;
  nSerieSensor: string;
  faixaSensor: string;
  dataFabricacao: string; // Date como string (ISO format)
  protocolo: string;
}
