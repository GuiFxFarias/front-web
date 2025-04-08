/* eslint-disable @typescript-eslint/no-explicit-any */
export async function putAttProdutoVenda(id: string, body: any) {
  try {
    const response = await fetch(
      `http://localhost:3001/qtdProdutosTransmissor/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao atualizar:', error);
    return [];
  }
}
