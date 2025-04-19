export interface IVenda {
  id: number;
  idCliente: string;
  idVenda: string;
  tipoProduto: string;
  itemVenda: string;
  idProduto: string;
  dataProposta: string; // formato datetime (usar string)
  dataVenda: string | null; // pode ser nulo
  status: string;
  marca: string;
  quantidade: number;
}
