export interface IServicePost {
  modelo: string;
  categoria: string;
  equipamentoID: string;
  equipamentoDescricao: string;
  codService: string;
  idCliente: string;
}

export interface IServPeca {
  codService: string;
  peca_id: number;
  quantidade_peca: number;
  idCliente: string;
  insVisual: string;
  manuPreventiva: boolean;
  itemService: string;
}

export async function getEquipamentoId(id: string) {
  const response = await fetch(`http://localhost:3001/equipamentos/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function getServicesId(id: string) {
  const response = await fetch(`http://localhost:3001/servicos/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function postService(data: IServicePost) {
  const response = await fetch("http://localhost:3001/servicos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function postPecaServico(data: IServPeca) {
  const response = await fetch("http://localhost:3001/pecaServico", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
