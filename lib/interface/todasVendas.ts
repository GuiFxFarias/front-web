export interface IVendaComProdutoCliente {
  id: number;
  idVenda: string;
  itemVenda: string;
  tipoProduto: 'Transmissor' | 'Posicionador' | string;
  dataProposta: string;
  dataVenda: string | null;
  status: string;
  marca: string;
  idProduto: string;
  quantidade: number;

  // Cliente
  idCliente: number;
  nomeCliente: string;
  cnpj: string;
  nome_responsavel: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  data_criacao: string;

  // Produto
  descricaoProduto: string;
  nSerieEquipamento: string | null;
  nSerieSensor: string | null;
  preco: string | null;
}
