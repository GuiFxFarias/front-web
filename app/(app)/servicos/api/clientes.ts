export async function getClientes() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Garante que o retorno seja sempre um array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return [];
  }
}

export async function getClientesId(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clientes/${id}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
