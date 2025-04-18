export interface IAllProducts {
  id: number;
  descricaoProduto: string;
  nSerieEquipamento: string;
  protocolo: string;
  preco: number;
  modelo: string;
  tipoProduto: string;
  quantidade: number;

  // Specific to Posicionador
  nSerieBase?: string;
  nSeriePlaca1?: string;
  nSeriePlaca2?: string;
  modeloPlaca?: string;

  // Specific to Transmissor
  sensor?: number;
  nSerieSensor?: string;
  faixa?: string;
  dataFabric?: string; // date as string
}
