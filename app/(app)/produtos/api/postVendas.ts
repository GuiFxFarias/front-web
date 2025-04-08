/* eslint-disable @typescript-eslint/no-explicit-any */
export async function postVendas(body: any) {
  const response = await fetch(`http://localhost:3001/novaVenda`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Erro ao cadastrar a venda');
  }

  return response.json();
}
