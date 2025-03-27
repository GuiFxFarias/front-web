export interface IPrdTrm {
  id: number
  descricaoProduto: string
  nSerieEquipamento: string
  protocolo: string
  sensor: number
  nSerieSensor: string
  faixa: string
  dataFabric: string // You can change this to Date if you parse it
  preco: string // Consider using number if it's a numeric value
  modelo: string | null
}
