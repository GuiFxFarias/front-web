export async function getPecasItemId(id: string) {
  const response = await fetch(`http://localhost:3001/pecas/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
