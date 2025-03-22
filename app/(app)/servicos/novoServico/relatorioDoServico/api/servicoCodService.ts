export async function getServicoCodService(id: string) {
  const response = await fetch(`http://localhost:3001/servicosCodService/${id}`)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}
