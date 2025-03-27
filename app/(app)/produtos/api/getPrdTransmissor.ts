export async function getAllPrdTransmissor() {
  try {
    const response = await fetch(`http://localhost:3001/produtosTransmissor`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    // Garante que o retorno seja sempre um array
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Erro ao buscar pecas:', error)
    return []
  }
}
