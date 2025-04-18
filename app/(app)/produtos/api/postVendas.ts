/* eslint-disable @typescript-eslint/no-explicit-any */
export async function postVendas(body: any) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/novaVenda`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.log('Erro ao cadastrar a venda');
  }

  return response.json();
}
