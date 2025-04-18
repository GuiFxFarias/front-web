export async function getAllPrdTransmissor() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/produtosTransmissor`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Garante que o retorno seja sempre um array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar pecas:', error);
    return [];
  }
}
