export interface IAllVendas {
  id: number
  idVenda: string
  nomeCliente: string
  itemVenda: string
  tipoProduto: string
  dataProposta: string
  dataVenda: string | null
  status: string
  descricaoProduto: string
  nSerieEquipamento: string
  nSerieSensor: string
  preco: string
}
