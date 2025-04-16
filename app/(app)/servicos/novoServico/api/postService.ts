export interface IServicePost {
  modelo: string;
  categoria: string;
  equipamentoId: string;
  itemIdEquip: string | null;
  equipamentoDescricao: string;
  codService: string;
  idCliente: string;
}

export interface IServPeca {
  codService: string;
  equipamentoId: string;
  peca_id: number;
  quantidade_peca: number;
  idCliente: string;
  insVisual: string;
  manuPreventiva: boolean;
  manuPrevTomada: boolean;
  itemService: string;
}

export async function getEquipamentoId(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/equipamentos/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.json();
}

export async function getServicesId(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/servicos/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.json();
}

export async function postService(data: IServicePost) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function postPecaServico(data: IServPeca) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pecaServico`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  return response.json();
}
