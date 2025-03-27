export async function putPrdTrm(id: string, body: any) {
  const response = await fetch(`http://localhost:3001/novaVenda/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Failed to update service with id ${id}`)
  }

  return response.json()
}
